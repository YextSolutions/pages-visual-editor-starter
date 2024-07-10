// Inspired by https://github.com/rottitime/react-hook-window-message-event

import {
  RefObject,
  useState,
  useRef,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

export type Payload = Record<string, unknown>;
export type Status = "success" | "error";

export type PostMessage = {
  payload: Payload;
};

type PostMessageInternal = {
  type: string;
  payload: Payload;
};

export type ReceivePayload = {
  status: Status;
  payload: Payload;
};

type ReceivePayloadInternal = {
  type: string;
  status: Status;
};

export type MessageStatus = Status | "pending";

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
  iframeRef: RefObject<HTMLIFrameElement>
) => {
  const [status, setStatus] = useState<MessageStatus>("pending");

  useSendMessage(messageName, targetOrigins, statusSetter(setStatus));

  const sendToIFrame = (data: PostMessage) => {
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
  const [status, setStatus] = useState<MessageStatus>("pending");

  useSendMessage(messageName, targetOrigins, statusSetter(setStatus));

  const sendToParent = (data: PostMessage) => {
    if (!window.parent) {
      throw new Error("Parent window has closed");
    }
    setStatus("pending");
    for (const targetOrigin of targetOrigins) {
      postMessage({ ...data, type: messageName }, window.parent, targetOrigin);
    }
  };

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
  const handleMessageAndSendResponse = (
    data: any,
    source: MessageEvent["source"]
  ) => {
    const { type, payload }: { type: string; payload: Payload } = data;

    if (type === messageName) {
      if (typeof eventHandler === "function") {
        eventHandler(
          (data) => postMessage({ ...data, type: messageName }, source, origin),
          payload
        );
      }
    }
  };

  useSendMessage(messageName, targetOrigins, handleMessageAndSendResponse);
};

/**
 * An internal hook which listens for a specific message type, and when it receives it,
 * it calls the event handler with the message payload and a function to send a message back
 * to the sender.
 * @param messageName - The message name to listen on
 * @param targetOrigins - The origin urls the message can be posted to and received from
 * @param callback - Callback function to handle the response data and message source
 */
const useSendMessage = (
  messageName: string,
  targetOrigins: string[],
  callback: (data: any, source: MessageEvent["source"]) => void
) => {
  const [origin, setOrigin] = useState<string>();
  const [source, setSource] = useState<MessageEvent["source"]>();

  const originRef = useRef<string>();
  const sourceRef = useRef<MessageEvent["source"]>();

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

      const { type }: ReceivePayloadInternal = data;
      if (type === messageName) {
        setSource(source);
        setOrigin(origin);

        callback(data, source);
      }
    },
    [messageName, targetOrigins, setSource, setOrigin, callback]
  );

  useEffect(() => {
    window.addEventListener("message", onWatchEventHandler);
    return () => window.removeEventListener("message", onWatchEventHandler);
  }, [messageName, source, origin, onWatchEventHandler]);
};

const statusSetter = (setStatus: Dispatch<SetStateAction<MessageStatus>>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (data: any, source: MessageEvent["source"]) => {
    const { status }: { status: Status } = data;
    if (status === "success") {
      setStatus("success");
    } else if (status === "error") {
      setStatus("error");
    }
  };
};
