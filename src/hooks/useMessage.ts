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

export type Payload = Record<string, any>;
export type Status = "success" | "error";

export type PostMessage = {
  payload: Payload;
};

type PostMessageInternal = {
  type: string;
  payload?: Payload;
};

export type ReceivePayload = {
  status: Status;
  payload?: Payload;
};

type ReceivePayloadInternal = {
  type: string;
  status: Status;
};

export type MessageStatus = Status | "pending";

export type EventHandler = (
  respond: (data: ReceivePayload) => unknown,
  payload: Payload
) => unknown;

const postMessage = (
  data: PostMessageInternal,
  target: MessageEvent["source"],
  origin = "*"
) => target?.postMessage(data, { targetOrigin: origin });

/**
 * A hook that allows sending a postMessage from a parent window to an iframe. Additionally,
 * it listens for a response from the iframe (two way communication) to update its status.
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

  useListenAndRespondMessage(
    messageName,
    targetOrigins,
    statusSetter(setStatus)
  );

  const sendToIFrame = (data?: PostMessage) => {
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
 * A hook that allows sending a postMessage from an iframe to its parent window. Additionally,
 * it listens for a response from the parent (two way communication) to update its status.
 * @param messageName - The message name to listen on
 * @param targetOrigins - The origin urls the message can be posted to and received from
 */
export const useSendMessageToParent = (
  messageName: string,
  targetOrigins: string[]
) => {
  const [status, setStatus] = useState<MessageStatus>("pending");

  useListenAndRespondMessage(
    messageName,
    targetOrigins,
    statusSetter(setStatus)
  );

  const sendToParent = (data?: PostMessage) => {
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
 * A hook to receive a postMessage request, either in a parent window or an iframe. It is
 * the receiving end for both {@link useSendMessageToIFrame} and {@link useSendMessageToParent}.
 * The eventHandler if fired when a message is received, which contains a payload and callback
 * function. The receiver can choose to do something with the payload as well as send a
 * status and payload back to the publisher.
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
    origin: string,
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

  useListenAndRespondMessage(
    messageName,
    targetOrigins,
    handleMessageAndSendResponse
  );
};

/**
 * An internal hook which listens for a specific message type. When a message is received,
 * the event handler is called with the message payload and a function to send a message back
 * to the sender.
 * @param messageName - The message name to listen on
 * @param targetOrigins - The origin urls the message can be posted to and received from
 * @param callback - Callback function to handle the response data and message source
 */
const useListenAndRespondMessage = (
  messageName: string,
  targetOrigins: string[],
  callback: (data: any, origin: string, source: MessageEvent["source"]) => void
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
      if (data.source?.startsWith("react-devtools")) {
        return;
      }
      if (!targetOrigins.includes(origin)) {
        throw new Error("Unrecognized origin");
      }

      const { type }: ReceivePayloadInternal = data;
      if (type === messageName) {
        setSource(source);
        setOrigin(origin);

        callback(data, origin, source);
      }
    },
    [messageName, targetOrigins, setSource, setOrigin, callback]
  );

  useEffect(() => {
    window.addEventListener("message", onWatchEventHandler);
    return () => window.removeEventListener("message", onWatchEventHandler);
  }, [messageName, source, origin, onWatchEventHandler]);
};

/**
 * Sets a status based on the incoming message's status.
 * @param setStatus - A React useState hook for setting the status of the
 * original postMessage coming from the parent window or iframe.
 */
const statusSetter = (setStatus: Dispatch<SetStateAction<MessageStatus>>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (data: any, origin: string, source: MessageEvent["source"]) => {
    const { status }: { status: Status } = data;
    if (status === "success") {
      setStatus("success");
    } else if (status === "error") {
      setStatus("error");
    }
  };
};
