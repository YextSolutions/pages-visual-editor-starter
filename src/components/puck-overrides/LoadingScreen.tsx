import { Progress } from "../ui/Progress";

export interface LoadingScreenProps {
  message: string;
  progress: number;
}

export function LoadingScreen({ message, progress }: LoadingScreenProps) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Progress className="w-1/3" value={progress}></Progress>
      <div>{message}</div>
    </div>
  );
}
