import {
  APP_INITIALIZER,
  Injector,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import { DefaultQueryClient } from './query-client';
import { ServiceLocator } from './service-locator';
import { HTTP_CLIENT, HTTP_QUERY_CLIENT } from './token';
import { ModuleParamType } from './types';

@NgModule({
  imports: [],
})
export class QueryModule {
  static forRoot(value: ModuleParamType): ModuleWithProviders<QueryModule> {
    return {
      ngModule: QueryModule,
      providers: [
        {
          provide: HTTP_CLIENT,
          useClass: value.httpClient,
        },
        {
          provide: HTTP_QUERY_CLIENT,
          useClass: DefaultQueryClient,
        },
        // hostProvider,
        // We make use of an anti-pattern service locator implementation
        // to allow access to requests service inside decorators
        {
          provide: APP_INITIALIZER,
          useFactory: (injector: Injector) => {
            return () => {
              ServiceLocator.setInstance(() => injector);
            };
          },
          deps: [Injector],
          multi: true,
        },
      ],
    };
  }
}