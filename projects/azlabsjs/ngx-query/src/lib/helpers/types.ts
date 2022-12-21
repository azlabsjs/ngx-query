import {
    CacheQueryConfig,
    FnActionArgumentLeastType,
    ObservableInputFunction,
    QueryParameter,
    QueryProviderType,
    QueryType,
} from '@azlabsjs/rx-query';
import { HTTPRequestMethods } from '../http';
import { ObserveKeyType } from '../types';

type QueryProviderProvidesParamType<
  TParam extends [...unknown[]],
  T extends QueryProviderType<TParam>
> = Parameters<T['query']>;

export type QueryTypeLeastArgumentType<F> = F extends QueryType
  ? [CacheQueryConfig | boolean] | []
  : never;

export type QueryStateLeastParameters<F> = F extends (
  ...args: infer A
) => any
  ? [...A, FnActionArgumentLeastType] | [...A]
  : F extends QueryProviderType
  ? [...QueryProviderProvidesParamType<Parameters<F['query']>, F>]
  : F extends Partial<QueryType>
  ? [CacheQueryConfig | boolean] | []
  : F extends Partial<
      QueryParameter<ObservableInputFunction, HTTPRequestMethods>
    >
  ? [CacheQueryConfig | boolean] | []
  : never;

type QueryProviderQuerConfigType = {
  name: string;
  observe?: ObserveKeyType;
};
export type CacheQueryProviderType = QueryProviderType & {
  cacheConfig: CacheQueryConfig & QueryProviderQuerConfigType;
};
