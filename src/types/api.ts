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

interface ApiErrorOptions extends ErrorOptions {
  status?: number;
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.status = options?.status || 500;
  }
}
