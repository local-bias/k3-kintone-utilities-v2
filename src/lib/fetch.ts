export type Fetch = typeof fetch;

export type CompatibleFetchRequest = Parameters<Fetch>;

export type CompatibleFetchResponse<T = any> = Pick<
  Response,
  'ok' | 'status' | 'headers'
> & {
  json: () => Promise<T>;
};

export type CompatibleFetch = <T = any>(
  ...params: Parameters<Fetch>
) => Promise<CompatibleFetchResponse<T>>;
