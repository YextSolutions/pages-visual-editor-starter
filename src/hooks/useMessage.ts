// Inspired by https://github.com/rottitime/react-hook-window-message-event

import { RefObject, useState, useRef, useCallback, useEffect } from "react";

export type Payload = Record<string, unknown>;

export type PostMessage = {
  payload: Payload;
};

type PostMessageInternal = {
  type: string;
  payload: Payload;
};

export type ReceivePayload = {
  status: "success" | "error";
  payload: Payload;
};

export type ReceivePayloadInternal = {
  type: string;
  status: "success" | "error";
};

export type MessageStatus = "pending" | "error" | "success";

export type EventHandler = (
  callback: (data: ReceivePayload) => unknown,
  payload: Payload
) => unknown;

const postMessage = (
  data: PostMessageInternal,
  target: MessageEvent["source"],
  origin = "*"
) => target?.postMessage(data, { targetOrigin: origin });

/**
 * Listens for a specific message type, and when it receives it, it calls the event handler with the
 * message payload and a function to send a message back to the sender.
 * @param messageName - The message name to listen on
 * @param targetOrigins - The origin urls the message can be posted to and received from
 * @param iframeRef - A MutableRefObject to send postMessages to - usually an iFrame
 */
export const useSendMessageToIFrame = (
  messageName: string,
  targetOrigins: string[],
  iframeRef?: RefObject<HTMLIFrameElement>
) => {
  const [origin, setOrigin] = useState<string>("");
  const [source, setSource] = useState<MessageEvent["source"] | null>(null);
  const [status, setStatus] = useState<MessageStatus>("pending");

  const originRef = useRef<string>("");
  const sourceRef = useRef<MessageEvent["source"]>(null);

  originRef.current = origin;
  sourceRef.current = source as MessageEvent["source"];

  const sendToIFrame = (data: PostMessage) => {
    if (!iframeRef) {
      throw new Error("IFrame ref not set");
    }

    if (iframeRef.current) {
      setStatus("pending");
      for (const targetOrigin of targetOrigins) {
        postMessage(
          { ...data, type: messageName },
          iframeRef.current.contentWindow,
          targetOrigin
        );
      }
    }
  };

  const onWatchEventHandler = useCallback(
    ({ origin, source, data }: MessageEvent) => {
      // Ignore React Dev Tools messages
      if (data.source === "react-devtools-content-script") {
        return;
      }

      if (!targetOrigins.includes(origin)) {
        throw new Error("Unrecognized origin");
      }

      const { type, status }: ReceivePayloadInternal = data;
      if (type === messageName) {
        setSource(source);
        setOrigin(origin);
        if (status === "success") {
          setStatus("success");
        } else if (status === "error") {
          setStatus("error");
        }
      }
    },
    [messageName, targetOrigins, iframeRef, setSource, setOrigin, setStatus]
  );

  useEffect(() => {
    window.addEventListener("message", onWatchEventHandler);
    return () => window.removeEventListener("message", onWatchEventHandler);
  }, [messageName, source, origin, onWatchEventHandler]);

  return { sendToIFrame, status };
};

/**
 * Listens for a specific message type, and when it receives it, it calls the event handler with the
 * message payload and a function to send a message back to the sender.
 * @param messageName - The message name to listen on
 * @param targetOrigins - The origin urls the message can be posted to and received from
 */
export const useSendMessageToParent = (
  messageName: string,
  targetOrigins: string[]
) => {
  const [origin, setOrigin] = useState<string>("");
  const [source, setSource] = useState<MessageEvent["source"] | null>(null);
  const [status, setStatus] = useState<MessageStatus>("pending");

  const originRef = useRef<string>("");
  const sourceRef = useRef<MessageEvent["source"]>(null);

  originRef.current = origin;
  sourceRef.current = source as MessageEvent["source"];

  const sendToParent = (data: PostMessage) => {
    if (!window.parent) {
      throw new Error("Parent window has closed");
    }
    setStatus("pending");
    for (const targetOrigin of targetOrigins) {
      postMessage({ ...data, type: messageName }, window.parent, targetOrigin);
    }
  };

  const onWatchEventHandler = useCallback(
    ({ origin, source, data }: MessageEvent) => {
      // Ignore React Dev Tools messages
      if (data.source === "react-devtools-content-script") {
        return;
      }
      if (!targetOrigins.includes(origin)) {
        throw new Error("Unrecognized origin");
      }

      const { type, status }: ReceivePayloadInternal = data;
      if (type === messageName) {
        setSource(source);
        setOrigin(origin);
        if (status === "success") {
          setStatus("success");
        } else if (status === "error") {
          setStatus("error");
        }
      }
    },
    [messageName, targetOrigins, setSource, setOrigin, setStatus]
  );

  useEffect(() => {
    window.addEventListener("message", onWatchEventHandler);
    return () => window.removeEventListener("message", onWatchEventHandler);
  }, [messageName, source, origin, onWatchEventHandler]);

  return { sendToParent, status };
};

/**
 * Listens for a specific message type, and when it receives it, it calls the event handler with the
 * message payload and a function to send a message back to the sender.
 * @param messageName - The message name to listen on
 * @param targetOrigins - The origin urls the message can be posted to and received from
 * @param eventHandler - The function that will be called when the event is triggered
 */
export const useReceiveMessage = (
  messageName: string,
  targetOrigins: string[],
  eventHandler: EventHandler
) => {
  const [origin, setOrigin] = useState<string>("");
  const [source, setSource] = useState<MessageEvent["source"] | null>(null);

  const originRef = useRef<string>("");
  const sourceRef = useRef<MessageEvent["source"]>(null);

  originRef.current = origin;
  sourceRef.current = source as MessageEvent["source"];

  const onWatchEventHandler = useCallback(
    ({ origin, source, data }: MessageEvent) => {
      // Ignore React Dev Tools messages
      if (data.source === "react-devtools-content-script") {
        return;
      }
      if (!targetOrigins.includes(origin)) {
        throw new Error("Unrecognized origin");
      }

      const { type, payload }: { type: string; payload: Payload } = data;
      if (type === messageName) {
        setSource(source);
        setOrigin(origin);
        if (typeof eventHandler === "function") {
          eventHandler(
            (data) =>
              postMessage({ ...data, type: messageName }, source, origin),
            payload
          );
        }
      }
    },
    [messageName, targetOrigins, eventHandler, setSource, setOrigin]
  );

  useEffect(() => {
    window.addEventListener("message", onWatchEventHandler);
    return () => window.removeEventListener("message", onWatchEventHandler);
  }, [messageName, source, origin, onWatchEventHandler]);
};
