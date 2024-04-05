import { ComponentConfig } from "@measured/puck";

export interface CardProps {
  title: string;
  url: string;
}

export const Card = ({ title, url }: CardProps) => {
  return (
    <>
      <div className="centered-container">
        <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div className="p-5">
            <a href="#">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                External Asset Fetched at Build Time
              </h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {title}
            </p>
          </div>
          <div>
            <img className="rounded-t-lg" src={url} alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export const PuckCard: ComponentConfig<CardProps> = {
  fields: {
    title: { type: "text" },
    url: { type: "text" }
  },
  render: ({ title, url }) => (
    <Card title={title} url={url}/>
  )
};
