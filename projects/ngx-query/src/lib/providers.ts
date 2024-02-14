import {
  APP_INITIALIZER,
  Injector,
  PLATFORM_ID,
  Provider,
  Type,
} from '@angular/core';
import { HTTPClientType } from './http';
import { HTTP_CLIENT, HTTP_HOST, HTTP_QUERY_CLIENT } from './token';
import { DefaultQueryClient } from './query-client';
import { createQueryManager } from '@azlabsjs/rx-query';
import { ServiceLocator } from './service-locator';

/**
 * Provides an HTTP client for angular framework
 *
 * @param httpClient
 */
export function provideHttpClient(httpClient: Type<HTTPClientType>) {
  return {
    provide: HTTP_CLIENT,
    useClass: httpClient,
  } as Provider;
}

/**
 * Provides query client global instance
 */
export function provideQueryClient(debug = false) {
  return {
    provide: HTTP_QUERY_CLIENT,
    useFactory: (
      client: HTTPClientType,
      platform: ObjectConstructor,
      host: string
    ) => {
      const logger = debug
        ? {
            log: (message: string, ...args: unknown[]) => {
              console.log(message, ...args);
            },
          }
        : {
            log: () => {
              return;
            },
          };
      return new DefaultQueryClient(
        createQueryManager(logger),
        client,
        platform,
        host
      );
    },
    deps: [HTTP_CLIENT, PLATFORM_ID, HTTP_HOST],
  } as Provider;
}


/**
 * Provides Service locator global instance
 */
export function provideInitializers() {
  return {
    provide: APP_INITIALIZER,
    useFactory: (injector: Injector) => {
      return () => {
        ServiceLocator.setInstance(() => injector);
      };
    },
    deps: [Injector],
    multi: true,
  } as Provider;
}
