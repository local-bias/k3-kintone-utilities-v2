import {
  CompatibleFetchResponse,
  CompatibleFetchRequest,
  CompatibleFetch,
} from '../../lib/fetch';

export const clientFetch: CompatibleFetch = async <T = any>(
  url: CompatibleFetchRequest[0],
  options?: CompatibleFetchRequest[1]
): Promise<CompatibleFetchResponse<T>> => {
  const urlStr = typeof url === 'string' ? url : url.toString();
  const {
    method = 'GET',
    headers: reqHeaders = {},
    body: reqBody = {},
  } = options || {};
  const [resBody, status, resHeaders] = await kintone.proxy(
    urlStr,
    method,
    reqHeaders,
    reqBody
  );

  return {
    json: async () => JSON.parse(resBody),
    headers: resHeaders,
    status,
    ok: status >= 200 && status < 300,
  };
};
