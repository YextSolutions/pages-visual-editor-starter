import { Coordinate } from "@yext/pages-components";

export const format_date = (date: string) => {
  return new Date(date).toLocaleString("en-us", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
};
export const format_phone = (phone: string) => {
  return phone
    ? phone
        .replace("+1", "")
        .replace(/\D+/g, "")
        .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
    : `(610) 363-8020`;
};

export function concatClassNames(
  ...args: Array<string | boolean | null | undefined>
): string {
  return args.filter((item) => !!item).join(" ");
}

export const getGoogleMapsLink = (coordinate: Coordinate): string => {
  if (!coordinate?.latitude || !coordinate?.longitude) return "#";
  return `https://www.google.com/maps/dir/?api=1&destination=${coordinate.latitude},${coordinate.longitude}`;
};

export const setQueryParams = (query?: string, vertical?: string) => {
  const queryParams = new URLSearchParams(window.location.search);
  if (vertical) {
    queryParams.set("vertical", vertical);
  } else {
    queryParams.delete("vertical");
  }

  if (query) {
    queryParams.set("query", query);
  } else {
    queryParams.delete("query");
  }
  history.pushState(null, "", "?" + queryParams.toString());
};

export const getRandomObjects = (blogs: any) => {
  const shuffled = blogs.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
};
