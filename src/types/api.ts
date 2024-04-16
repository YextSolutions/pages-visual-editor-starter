import { LocationStream as LocationsType } from "./autogen";

export interface YextResponse<T = any> {
  meta: {
    uuid: string;
    errors?: any[];
  };
  response: T;
}

export type EntityContent = {
  document: LocationsType;
};