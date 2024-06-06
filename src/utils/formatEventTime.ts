import { format } from "date-fns";

export interface EventTime {
  start?: string;
  end?: string;
}

export const formatEventTime = (eventTime: EventTime): string => {
  if (!eventTime.start || !eventTime.end) {
    throw new Error("Both start and end times are required");
  }

  const startDate = new Date(eventTime.start);
  const endDate = new Date(eventTime.end);

  // Format date part
  const formattedDate = format(startDate, "dd.MM.yyyy");

  // Format time part
  const formattedStartTime = format(startDate, "h a");
  const formattedEndTime = format(endDate, "h a");

  return `${formattedDate}  |  ${formattedStartTime} - ${formattedEndTime}`;
};
