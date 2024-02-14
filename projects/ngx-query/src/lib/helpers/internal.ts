import {
  QueryArguments,
  QueryClientType,
  QueryParameter,
  QueryType,
  useQueryManager,
} from '@azlabsjs/rx-query';
import { HTTPRequestMethods } from '../http';
import {
  createQueryFunc,
  resolveQueryArguments,
} from '../internal';
import { ServiceLocator } from '../service-locator';
import { HTTP_QUERY_CLIENT } from '../token';
import { ObserveKeyType } from '../types';
import { CacheQueryProviderType, QueryStateLeastParameters } from './types';

/**
 * @internal
 *
 */
export const createQueryCreator = () => {
  const service =
    ServiceLocator.get<QueryClientType<HTTPRequestMethods>>(HTTP_QUERY_CLIENT);
  // We Bind the invoke query to the resolved service
  // for references to this to point to the service itself
  return service?.invoke.bind(service);
};

/**
 * @internal
 *
 * @param params
 * @param _args
 */
export function parseQueryArguments<T>(
  params: T,
  _args: [...QueryStateLeastParameters<T>]
) {
  const _params = params as unknown;
  let _arguments!: [...QueryStateLeastParameters<T>];
  let _query!: QueryType | T;
  let observe!: ObserveKeyType;
  if (
    (_params as QueryParameter<T, HTTPRequestMethods>).methodOrConfig &&
    (_params as QueryParameter<T, HTTPRequestMethods>).arguments
  ) {
    const { methodOrConfig, arguments: args } = _params as QueryParameter<
      T,
      HTTPRequestMethods
    >;
    _query = methodOrConfig;
    _arguments = (args ?? []) as [...QueryStateLeastParameters<T>];
    observe = (
      typeof methodOrConfig === 'object' &&
      methodOrConfig !== null &&
      (methodOrConfig as QueryType).observe
        ? (methodOrConfig as QueryType).observe
        : 'request'
    ) as ObserveKeyType;
  } else if (
    (_params as CacheQueryProviderType).query &&
    typeof (_params as CacheQueryProviderType).query === 'function'
  ) {
    const queryFunction = (...args: unknown[]) => {
      return (_params as CacheQueryProviderType).query(...args);
    };
    _query = queryFunction.bind(_params) as unknown as T;
    const cacheConfig = (_params as CacheQueryProviderType).cacheConfig;
    _arguments = (
      typeof cacheConfig !== 'undefined' && cacheConfig !== null
        ? [...(_args ?? []), cacheConfig]
        : _args ?? []
    ) as [...QueryStateLeastParameters<T>];
  } else if ((_params as QueryType).path) {
    _query = _params as QueryType;
    _arguments = _args;
    observe = (
      typeof _query === 'object' &&
      _query !== null &&
      (_query as QueryType).observe
        ? (_query as QueryType).observe
        : 'request'
    ) as ObserveKeyType;
  } else if (typeof params === 'function') {
    _query = _params as T;
    _arguments = _args;
  }
  return [_query, _arguments, observe] as [
    QueryType | T,
    [...QueryStateLeastParameters<T>],
    ObserveKeyType
  ];
}

/**
 * @internal
 * Lift the query client invoke method to a higher function that can be invoked
 * on query parameters
 */
export function createQueryClientInvokeFunc(
  instance: ReturnType<typeof createQueryCreator>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <TFunc extends (...args: any) => any>(
    query: QueryType<HTTPRequestMethods, ObserveKeyType> | TFunc,
    ...args: [...QueryArguments<TFunc>]
  ) => {
    if (typeof instance === 'undefined' || instance === null) {
      throw new Error('Query client must not be null');
    }
    return instance(query, ...args);
  };
}

/**
 *
 * @internal
 * Lift the query manager method to a higher function that can be invoked
 * on query parameters
 */
export function createDefaultInvokeFunc(
  instance: ReturnType<typeof useQueryManager>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <TFunc extends (...args: any) => any>(
    query: QueryType<HTTPRequestMethods, ObserveKeyType> | TFunc,
    ...args: [...QueryArguments<TFunc>]
  ) => {
    console.warn(
      'Using fallback query client instead of angular query client service. Please configure your angular to use the query client service by importing HTTPQueryModule.forRoot(...) or provideInitializers() for project running angular >=15  at the root of your application'
    );
    return instance(
      createQueryFunc<TFunc>(query),
      ...resolveQueryArguments(query, ...args)
    );
  };
}
