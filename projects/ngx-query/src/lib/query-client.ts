import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
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
  implements QueryClientType<HTTPRequestMethods>
{
  // Creates an instance of { @see DefaultQueryClient }
  constructor(
    @Inject(QUERY_MANAGER) private readonly query: QueryManagerType,
    @Inject(HTTP_CLIENT) private client: HTTPClientType,
    @Inject(PLATFORM_ID) @Optional() private platformId?: Object,
    @Inject(HTTP_HOST) @Optional() private host?: string
  ) {}

  // Handles HTTP requests
  invoke<TFunc extends (...args: any) => any>(
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
