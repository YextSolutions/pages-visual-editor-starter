// Inspired by https://github.com/rottitime/react-hook-window-message-event

import { useCallback, useEffect, useRef, useState } from "react";

export type IPostMessage = { type: string; payload: Record<string, unknown> };
export type EventHandler = (
  callback: (data: IPostMessage) => unknown,
  payload: IPostMessage["payload"]
) => unknown;

const postMessage = (
  data: IPostMessage,
  target: MessageEvent["source"],
  origin = "*"
) => target?.postMessage(data, { targetOrigin: origin });

export type UseMessageProps = {
  /** The message name to listen on */
  messageName: string;
  /** The origin urls the message can be posted to and received from */
  targetOrigins: string[];
  /** The function that will be called when the event is triggered */
  eventHandler?: EventHandler;
};

/**
 * Listens for a specific message type, and when it receives it, it calls the event handler with the
 * message payload and a function to send a message back to the sender.
 * @param messageName - The message name to listen on
 * @param targetOrigins - The origin urls the message can be posted to and received from
 * @param eventHandler - The function that will be called when the event is triggered
 */
export const useMessage = (
  messageName: string,
  targetOrigins: string[],
  eventHandler: EventHandler
) => {
  const [history, setHistory] = useState<IPostMessage[]>([]);
  const [origin, setOrigin] = useState<string>("");
  const [source, setSource] = useState<MessageEvent["source"] | null>(null);

  const originRef = useRef<string>("");
  const sourceRef = useRef<MessageEvent["source"]>(null);

  originRef.current = origin;
  sourceRef.current = source as MessageEvent["source"];

  const sendToSender = (data: IPostMessage) =>
    postMessage(data, sourceRef.current, originRef.current);

  const sendToParent = (data: IPostMessage) => {
    // const { opener } = window.parent;
    if (!window.parent) {
      throw new Error("Parent window has closed");
    }
    for (const targetOrigin of targetOrigins) {
      window.parent.postMessage(data, targetOrigin);
    }
  };

  const onWatchEventHandler = useCallback(
    ({ origin, source, data }: MessageEvent) => {
      console.log("repo origin", origin);
      console.log("repo source", source);
      console.log("repo data", data);
      console.log("repo targetOrigins", targetOrigins);

      if (!targetOrigins.includes(origin)) {
        throw new Error("Unrecognized origin");
      }

      const { type, payload } = data;
      if (type === messageName) {
        setSource(source);
        setOrigin(origin);
        setHistory((old) => [...old, payload]);
        if (typeof eventHandler === "function") {
          eventHandler(sendToSender, payload);
        }
      }
    },
    [messageName, targetOrigins, eventHandler, setSource, setOrigin]
  );

  useEffect(() => {
    window.addEventListener("message", onWatchEventHandler);
    return () => window.removeEventListener("message", onWatchEventHandler);
  }, [messageName, source, origin, onWatchEventHandler]);

  return { history, sendToParent };
};
