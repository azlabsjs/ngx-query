import {
  BaseQueryType,
  QueryState,
  QueryType,
  queryResult,
  useQueryManager,
} from '@azlabsjs/rx-query';
import {
  Observable,
  OperatorFunction,
  first,
  from,
  isObservable,
  map,
  of,
} from 'rxjs';
import { HTTPRequestMethods } from '../http';
import { queryResultBody } from '../rx';
import { ObserveKeyType } from '../types';
import {
  createDefaultInvokeFunc,
  createQueryClientInvokeFunc,
  createQueryCreator,
  parseQueryArguments,
} from './internal';
import { CacheQueryProviderType, QueryStateLeastParameters } from './types';

/**
 * Create query instance that caches (if required by user) it arguments
 * and replay / refetch it based on the interval defined by the library user
 *
 */
export const useQuery = <T>(
  params: T,
  ...args: [...QueryStateLeastParameters<T>]
) => {
  const [_query, _arguments, observe] = parseQueryArguments(params, args);
  let _observe = observe;

  // In case the createQueryCreator() call return an undefined instance, we fallback to global
  // instance of the query manager
  const queryClient = createQueryCreator();
  const queryFunc =
    typeof queryClient === 'undefined' || queryClient === null
      ? createDefaultInvokeFunc(useQueryManager())
      : createQueryClientInvokeFunc(queryClient);
  // The we invoke the provided query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = queryFunc(_query as any, ..._arguments);
  const _params = params as unknown;
  if (typeof (_params as CacheQueryProviderType).query === 'function') {
    _observe =
      observe ?? (_params as CacheQueryProviderType).cacheConfig.observe;
  }
  return (
    (!isObservable(result)
      ? of(result)
      : from(result)) as Observable<QueryState>
  ).pipe(
    _observe === 'response'
      ? queryResult()
      : ((_observe === 'body'
          ? queryResultBody()
          : map((state) => state)) as OperatorFunction<QueryState, unknown>)
  ) as Observable<unknown>;
};

/**
 * Functional interface for sending HTTP Query using POST verb.
 * Unlike {@see createQuery } functional interface, it does not
 * reexecute the query on an interval basics, but will retry
 * 3 times the query if it fails.
 *
 * @param query
 */
export function useHTTPPostQuery<TResponse>(
  query: Omit<BaseQueryType<HTTPRequestMethods, ObserveKeyType>, 'method'>
) {
  return useQuery<QueryType<string>>(
    {
      ...query,
      method: 'POST',
    } as QueryType,
    { retries: 3, refetchInterval: undefined }
  ).pipe(first()) as Observable<TResponse>;
}

/**
 * Functional interface for sending HTTP Query using PUT verb.
 * Unlike {@see useQuery } functional interface, it does not
 * reexecute the query on an interval basics, but will retry
 * 3 times the query if it fails.
 *
 * @param query
 */
export function useHTTPPutQuery<TResponse>(
  query: Omit<BaseQueryType<HTTPRequestMethods, ObserveKeyType>, 'method'>
) {
  return useQuery<QueryType<string>>(
    {
      ...query,
      method: 'PUT',
    } as QueryType,
    { retries: 3, refetchInterval: undefined }
  ).pipe(first()) as Observable<TResponse>;
}

/**
 * Functional interface for sending HTTP Query using DELETE verb.
 * Unlike {@see useQuery } functional interface, it does not
 * reexecute the query on an interval basics, but will retry
 * 3 times the query if it fails.
 *
 * @param query
 */
export function useHTTPDeleteQuery<TResponse>(
  query: Omit<BaseQueryType<HTTPRequestMethods, ObserveKeyType>, 'method'>
) {
  return useQuery<QueryType<string>>(
    {
      ...query,
      method: 'DELETE',
    } as QueryType,
    { retries: 3, refetchInterval: undefined }
  ).pipe(first()) as Observable<TResponse>;
}

/**
 * @description Provides developpers with a function for
 * type interence as typescript `as` operator
 *
 * ```ts
 * // Suppose the given value
 * let value = 1;
 *
 * // Using typescript  `as` operator
 * value = value as String;
 *
 * // Using the as global function
 * value = as<String>(value);
 * ```
 */
export function as<T>(value: unknown) {
  return value as T;
}

/**
 * @description Provides developpers with a function for
 * observables type interence
 * 
 * @param value 
 * @returns 
 */
export function observableReturnType<T>(value: unknown) {
  return value as Observable<T>;
}

/**
 * @description Provides developpers with a function for
 * type interence as typescript `as` operator
 *
 * ```ts
 * // Suppose the given value
 * let value = 1;
 *
 * // Using typescript  `as` operator
 * value = value as String;
 *
 * // Using the returnType global function
 * value = returnType<String>(value);
 * ```
 */
export const returnType = as;
