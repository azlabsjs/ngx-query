import { Provider, Type } from '@angular/core';
import {
  CacheQueryConfig,
  Disposable,
  FnActionArgumentLeastType,
  QueryManager,
  QueryState,
} from '@azlabsjs/rx-query';
import { Observable, ObservableInput } from 'rxjs';
import { HTTPClientType, RequestInterface } from './http';

/**
 * @internal
 */
export type ObserveKeyType = 'query' | 'response' | 'body';

/**
 * @internal
 */
export type QueryArguments<F> = F extends (
  ...args: infer A
) => ObservableInput<unknown>
  ? [...A, FnActionArgumentLeastType] | [...A]
  : F extends RequestInterface
  ? [CacheQueryConfig | boolean] | []
  : never;

/**
 * @internal
 */
export type HostStringParamType = {
  httpClient: Type<HTTPClientType>;
  host?: string;
};

/**
 * @internal
 */
export type HostProviderParamType = {
  httpClient: Type<HTTPClientType>;
  hostProvider?: Provider;
};

/**
 * @internal
 */
export type ModuleParamType = HostStringParamType | HostProviderParamType;

/**
 * Composed query manager type definition
 *
 * @internal
 */
export type QueryManagerType = QueryManager<Observable<QueryState>> &
  Disposable;
