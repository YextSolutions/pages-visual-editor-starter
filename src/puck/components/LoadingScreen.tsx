import { Progress } from "../ui/Progress";

export type LoadingScreenProps = {
  progress: number;
};

export function LoadingScreen({ progress }: LoadingScreenProps) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center puck-css">
      <Progress className="w-1/3" value={progress} />
      <div>Loading Visual Editor...</div>
    </div>
  );
}
