import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID, OnDestroy } from '@angular/core';
import { QueryClientType, QueryType } from '@azlabsjs/rx-query';
import { HTTPRequestMethods, HTTP_HOST, HTTPClientType } from './http';
import {
  createQueryFunc,
  resolveQueryArguments,
} from './query-client-internal';
import { HTTP_CLIENT, QUERY_MANAGER } from './token';
import { ObserveKeyType, QueryArguments, QueryManagerType } from './types';

@Injectable({
  providedIn: 'root',
})
export class DefaultQueryClient
  implements QueryClientType<HTTPRequestMethods>, OnDestroy
{
  // Creates an instance of { @see DefaultQueryClient }
  constructor(
    @Inject(QUERY_MANAGER) private readonly query: QueryManagerType,
    @Inject(HTTP_CLIENT) private client: HTTPClientType,
    @Inject(PLATFORM_ID) @Optional() private platformId?: ObjectConstructor,
    @Inject(HTTP_HOST) @Optional() private host?: string
  ) {}

  // Handles HTTP requests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoke<TFunc extends (...args: any) => unknown>(
    query: QueryType<HTTPRequestMethods, ObserveKeyType> | TFunc,
    ...args: [...QueryArguments<TFunc>]
  ) {
    args = resolveQueryArguments(query, ...args);
    return this.query.invoke(
      createQueryFunc<TFunc>(query, this.client, this.host),
      ...args
    );
  }

  ngOnDestroy() {
    if (this && this.platformId && isPlatformBrowser(this.platformId)) {
      this.query.destroy();
    }
  }
}
