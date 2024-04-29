import { Center, Flex, Progress, VStack } from "@chakra-ui/react";

export interface LoadingScreenProps {
  message: string;
  progress: number;
}

export function LoadingScreen({ message, progress }: LoadingScreenProps) {
  return (
    <div className="loading-screen">
      <Flex className={"wrapper"}>
        <Center className={"wrapper"}>
          <VStack className={"wrapper"}>
            <Progress
              className="progress"
              value={progress}
            ></Progress>
            <div>{message}</div>
          </VStack>
        </Center>
      </Flex>
    </div>
  );
}
