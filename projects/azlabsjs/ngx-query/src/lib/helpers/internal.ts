import { QueryParameter, QueryType } from '@azlabsjs/rx-query';
import { HTTPRequestMethods } from '../http';
import { ServiceLocator } from '../service-locator';
import { HTTP_QUERY_CLIENT } from '../token';
import { ObserveKeyType } from '../types';
import { CacheQueryProviderType, QueryStateLeastParameters } from './types';

/**
 * @internal
 *
 */
export const createQueryCreator = () => {
  const service = ServiceLocator.get(HTTP_QUERY_CLIENT);
  // We Bind the invoke query to the resolved service for references to this to point to the service itself
  return service.invoke.bind(service);
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
    _query = _params as any as T;
    _arguments = _args;
  }
  return [_query, _arguments, observe] as [
    QueryType | T,
    [...QueryStateLeastParameters<T>],
    ObserveKeyType
  ];
}
