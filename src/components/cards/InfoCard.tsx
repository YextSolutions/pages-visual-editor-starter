import { CardHeader, CardTitle, CardContent, Card } from "../atoms/card";

import { ComponentConfig } from "@measured/puck";

export type InfoCardProps = {
  title: string;
  description: string;
};

export const InfoCard: ComponentConfig<InfoCardProps> = {
  label: "Info Card",
  fields: {
    title: {
      type: "text",
      label: "Title",
    },
    description: {
      type: "text",
      label: "Description",
    },
  },
  defaultProps: {
    title: "Title Goes Here",
    description: "Description Goes Here",
  },
  render: ({ title, description }) => {
    return (
      <Card className="h-full gap-y-4">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-950 text-center">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center line-clamp-4">{description}</p>
        </CardContent>
        {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
      </Card>
    );
  },
};
