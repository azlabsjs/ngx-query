import {
  APP_INITIALIZER,
  Injector,
  ModuleWithProviders,
  NgModule,
  Provider,
} from '@angular/core';
import { DefaultQueryClient } from './query-client';
import { ServiceLocator } from './service-locator';
import { HTTP_CLIENT, HTTP_HOST, HTTP_QUERY_CLIENT } from './token';
import {
  HostProviderParamType,
  HostStringParamType,
  ModuleParamType,
} from './types';

@NgModule({
  imports: [],
})
export class QueryModule {
  static forRoot(value: ModuleParamType): ModuleWithProviders<QueryModule> {
    // let hostProvider!: Provider;
    // if ((value as HostStringParamType).host) {
    //   hostProvider = {
    //     provide: HTTP_HOST,
    //     useValue: (value as HostStringParamType).host as string,
    //   };
    // }
    // if ((value as HostProviderParamType).hostProvider) {
    //   hostProvider = (value as HostProviderParamType).hostProvider as Provider;
    // }
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
              ServiceLocator.setInstance(injector);
            };
          },
          deps: [Injector],
          multi: true,
        },
      ],
    };
  }
}
