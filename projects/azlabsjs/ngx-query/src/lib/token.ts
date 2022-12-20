import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';
import { QueryClientType, createQueryManager } from '@azlabsjs/rx-query';
import { HTTPRequestMethods, RequestsConfig } from './http';
import { QueryManagerType } from './types';

export const HTTP_HOST = new InjectionToken<string>(
  'URI to the backend http host'
);

export const REQUEST_ACTIONS = new InjectionToken<RequestsConfig>(
  'Request actions map definitions'
);

export const HTTP_QUERY_CLIENT = new InjectionToken<
  QueryClientType<HTTPRequestMethods>
>('HTTP Query client injected type');

export const WINDOW = new InjectionToken<Window>('Platform View Object', {
  providedIn: 'root',
  factory: () => {
    const { defaultView } = inject(DOCUMENT);

    if (!defaultView) {
      throw new Error('window$ object is not available in the global context');
    }

    return defaultView;
  },
});

export const QUERY_MANAGER = new InjectionToken<QueryManagerType>(
  'Query manager singleton for Angular application',
  {
    providedIn: 'root',
    factory: () => {
      return createQueryManager();
    },
  }
);
