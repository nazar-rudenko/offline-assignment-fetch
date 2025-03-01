export type SortQueryParam = { field: string; order: "asc" | "desc" };
export type ArrayQueryParam = string[] | number[];
export type QueryParams = Record<
  string,
  string | number | boolean | ArrayQueryParam | SortQueryParam
>;

export type HttpServiceParams = {
  url: string;
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  params?: QueryParams;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

export const serializeParams = (params: QueryParams): string => {
  if (params.sort) {
    const { field: fieldToSort, order } = params.sort as SortQueryParam;
    params.sort = `${fieldToSort}:${order}`;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([field, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(field, item.toString()));
      } else {
        searchParams.append(field, (value as string).toString());
      }
    }
  });

  return searchParams.toString();
};

async function http<R = undefined>({
  url,
  method,
  body,
  params,
  headers,
}: HttpServiceParams): Promise<R> {
  const request: RequestInit = {
    credentials: "include",
    method,
    headers: {
      "Content-Type": "application/json",
      // fixme: in ideal world there must be hmac or something
      "X-Requested-By": "dogs-app",
    },
  };

  if (body) {
    request.body = JSON.stringify(body);
  }

  if (headers) {
    request.headers = { ...request.headers, ...headers };
  }

  const serializedParams = params && serializeParams(params);
  if (serializedParams) {
    url += `?${serializedParams}`;
  }

  const response = await fetch(url, request);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      `Network request failed ${response.status}: ${method} ${url} - ${errorMessage}`,
    );
  }

  if (response.status === 204) return null as R;

  if ((response.headers.get("Content-Type") ?? "").includes("application/json"))
    return (await response.json()) as R;

  return (await response.text()) as R;
}

export default http;
