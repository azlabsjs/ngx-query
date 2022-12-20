import { Provider } from '@angular/core';
import {
  CacheQueryConfig,
  CommandInterface,
  Disposable,
  FnActionArgumentLeastType,
  QueryManager,
  QueryState,
} from '@azlabsjs/rx-query';
import { Observable, ObservableInput } from 'rxjs';
import { RequestInterface } from './http';

/**
 * @internal
 */
export type ObserveKeyType = 'request' | 'response' | 'body' | undefined;

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
  host?: string;
};

/**
 * @internal
 */
export type HostProviderParamType = {
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
export type QueryManagerType = CommandInterface<unknown> &
  QueryManager<Observable<QueryState>> &
  Disposable;
