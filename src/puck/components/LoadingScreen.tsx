import { Progress } from "../../components/ui/Progress";

export interface LoadingScreenProps {
  message: string;
  progress: number;
}

export function LoadingScreen({ message, progress }: LoadingScreenProps) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center puck-css">
      <Progress className="w-1/3" value={progress} />
      <div>{message}</div>
    </div>
  );
}
