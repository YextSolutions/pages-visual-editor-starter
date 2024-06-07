import { Progress } from "../ui/Progress";

export interface LoadingScreenProps {
  message: string;
  progress: number;
}

export function LoadingScreen({ message, progress }: LoadingScreenProps) {
  return (
    <div className="flex justify-center items-center flex-col h-full w-full">
      <Progress className="progress" value={progress}></Progress>
      <div>{message}</div>
    </div>
  );
}
