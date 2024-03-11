import { isPlatformBrowser } from '@angular/common';
import {
  Inject,
  Injectable,
  Optional,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import {
  QueryClientType,
  QueryType,
  useQueryManager,
} from '@azlabsjs/rx-query';
import { HTTPRequestMethods, HTTP_HOST, HTTPClientType } from './http';
import { createQueryFunc, resolveQueryArguments } from './internal';
import { HTTP_CLIENT, QUERY_MANAGER } from './token';
import { ObserveKeyType, QueryArguments, QueryManagerType } from './types';

@Injectable({
  providedIn: 'root',
})
export class DefaultQueryClient
  implements QueryClientType<HTTPRequestMethods>, OnDestroy
{
  private readonly query!: QueryManagerType;
  // Creates an instance of { @see DefaultQueryClient }
  constructor(
    @Inject(QUERY_MANAGER)
    @Optional()
    query?: QueryManagerType,
    @Inject(HTTP_CLIENT) @Optional() private client?: HTTPClientType,
    @Inject(PLATFORM_ID) @Optional() private platformId?: ObjectConstructor,
    @Inject(HTTP_HOST) @Optional() private host?: string
  ) {
    this.query = query ?? (useQueryManager() as unknown as QueryManagerType);
  }

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
