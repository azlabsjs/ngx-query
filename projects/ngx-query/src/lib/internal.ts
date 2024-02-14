import {
  Action,
  CacheQueryConfig,
  QueryType,
  useDefaultCacheConfig,
} from '@azlabsjs/rx-query';
import { Observable, ObservableInput } from 'rxjs';
import {
  HTTPRequestMethods,
  RESTQueryFunc,
  RequestInterface,
  ResponseType,
  getHttpHost,
  isValidHttpUrl,
  useHTTPActionQuery,
  HTTPClientType,
} from './http';
import { ObserveKeyType, QueryArguments } from './types';

/**
 * @Internal
 */
function hasCacheProperties(arg: Record<string, unknown>): boolean {
  return (
    arg !== null &&
    arg['cacheTime'] !== null &&
    typeof arg['cacheTime'] !== 'undefined'
  );
}

/**
 * @internal
 *
 * Creates a query function using an HTTP client for sending query
 * using HTTP verb and interfaces
 */
export function useHTTPRequestHandler<T = unknown>(
  client: HTTPClientType,
  host?: string
) {
  return (
    path: string,
    method: string,
    body: unknown,
    options?:
      | {
          headers?: [string, string][] | Record<string, string> | undefined;
          responseType?: Exclude<ResponseType, 'document'> | undefined;
          params?:
            | Record<string, unknown>
            | { [header: string]: string | string[] };
          withCredentials?: boolean;
        }
      | undefined
  ): ObservableInput<T> => {
    //#region Prepare request URL
    const url = isValidHttpUrl(path)
      ? path
      : `${host ? getHttpHost(host) : host}/${path ?? ''}`;
    //#endregion Prepare request URL

    const { headers, responseType, params, withCredentials } = options || {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      responseType: 'json',
    };
    //#region Prepare request headers
    const _headers = Array.isArray(headers)
      ? headers.reduce((carry, current) => {
          const [key, value] = current;
          carry[key] = value;
          return carry;
        }, {} as Record<string, unknown | string>)
      : headers;
    //#endregion Prepare request headers
    return client.request(method, url, {
      body,
      responseType: responseType ?? 'json', // By default Json is used as response type
      headers: _headers as { [header: string]: string | string[] },
      params: params,
      withCredentials,
      observe: 'response',
    }) as Observable<T>;
  };
}

/**
 * @internal
 *
 * Creates a query cache key that might uniquely identify the query
 * provided by the developper
 */
export function createQueryCacheName(query: {
  params?: Record<string, unknown> | undefined;
  body?: unknown;
  method?: string;
}) {
  const queryParam: Record<string, unknown> = {
    ...(query.params ?? {}),
    ...{
      ...(typeof query.body === 'object' &&
      query.body !== null &&
      query?.method?.toUpperCase() === 'GET'
        ? query.body
        : {}),
    },
  };
  let outputString = '';
  for (const key in queryParam) {
    if (Object.prototype.hasOwnProperty.call(queryParam, key)) {
      outputString += `,${key} -> ${queryParam[key]}`;
    }
  }
  return outputString[0] === ', ' ? outputString.slice(1) : outputString;
}

/**
 * @internal
 * Creates the query function that is invoked by the query manager class
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createQueryFunc<TFunc extends (...args: any) => any>(
  query: QueryType<HTTPRequestMethods, ObserveKeyType> | TFunc,
  client?: HTTPClientType,
  host?: string
) {
  return typeof query !== 'function' &&
    typeof client !== 'undefined' &&
    client !== null
    ? (useHTTPActionQuery(
        useHTTPRequestHandler(client, host) as RESTQueryFunc<unknown>,
        {
          name: `${query.method ?? ''}_${query.path ?? ''}`,
          payload: {
            ...query,
            options: {
              params:
                query.method?.toUpperCase() === 'GET' &&
                typeof query.body === 'object' &&
                query.body !== null
                  ? { ...(query.params ?? {}), ...query.body }
                  : query.params,
            },
          },
        } as Action<RequestInterface>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as (...args: any) => any)
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (query as (...args: any) => any);
}

/**
 * @internal
 * Resolves the query argument list based on query provided type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveQueryArguments<TFunc extends (...args: any) => unknown>(
  query: QueryType<HTTPRequestMethods, ObserveKeyType> | TFunc,
  ...args: [...QueryArguments<TFunc>]
) {
  if (
    typeof query !== 'function' &&
    Array.isArray(args) &&
    (typeof args[0] === 'boolean' ||
      (typeof args[0] === 'object' &&
        hasCacheProperties(args[0] as Record<string, unknown>)))
  ) {
    // Here we expect the first item of arguments list to be cache config
    args[0] =
      typeof args[0] === 'boolean'
        ? ({
            ...useDefaultCacheConfig(),
            name: `useHTTPActionQuery::${query.method ?? ''}_${
              query.path ?? ''
            }[${createQueryCacheName(query)}]`,
          } as CacheQueryConfig)
        : ({
            ...args[0],
            name: `useHTTPActionQuery::${query.method ?? ''}_${
              query.path ?? ''
            }[${createQueryCacheName(query)}]`,
          } as CacheQueryConfig);
    // useHTTPActionQuery
  }
  return args;
}
