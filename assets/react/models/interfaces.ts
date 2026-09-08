export type ApiPlatformContext<T = unknown> = {
  '@context': string;
  '@id': string;
  '@type': string;
  member?: T[];
  totalItems?: number;
};

export type ApiPlatformEntityContext = {
  '@id'?: string;
  '@type'?: string;
};

export type IUser = ApiPlatformEntityContext & {
  id: number;
  email: string;
  roles: string[];
};

export type ITransportType = ApiPlatformEntityContext & {
  id: number;
  label: string;
};

export type ILine = ApiPlatformEntityContext & {
  id: number;
  label: string;
  LineId: string;
};

export type IStation = ApiPlatformEntityContext & {
  id: number;
  label: string;
  stopId: string;
};

/*
export type IScheldule = {
  [station: string]: { status: string; time: string }[];
};*/

export type IScheldule = Record<string, { status: string; time: string }[]>;
