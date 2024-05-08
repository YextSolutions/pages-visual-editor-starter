import { Progress } from "../ui/Progress";

export interface LoadingScreenProps {
  message: string;
  progress: number;
}

export function LoadingScreen({ message, progress }: LoadingScreenProps) {
  return (
    <div className="loading-screen">
      <Progress
        className="progress"
        value={progress}
      ></Progress>
      <div>{message}</div>
    </div>
  );
}
