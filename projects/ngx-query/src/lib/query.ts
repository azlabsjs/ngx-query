import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import {
  CommandInterface,
  QueryArguments,
  QueryManager,
  QueryState,
} from '@azlabsjs/rx-query';
import { Observable } from 'rxjs';
import { QUERY_MANAGER } from './token';
import { QueryManagerType } from './types';

@Injectable({
  providedIn: 'root',
})
export class QueryProvider
  implements CommandInterface<unknown>, QueryManager<Observable<QueryState>>
{
  // Creates an instance of { @see QueryProvider }
  constructor(
    @Inject(PLATFORM_ID) @Optional() private platformId: Object,
    @Inject(QUERY_MANAGER) private readonly query: QueryManagerType
  ) {}

  dispatch<T extends (...args: any) => void>(
    action: T,
    ...args: [...QueryArguments<typeof action>]
  ): unknown {
    return this.query.dispatch(action, ...args);
  }

  invoke<T extends (...args: any) => void>(
    action: T,
    ...args_0: QueryArguments<T>
  ) {
    return this.query.invoke(action, ...args_0);
  }

  ngOnDestroy() {
    if (this && this.platformId && isPlatformBrowser(this.platformId)) {
      this.query.destroy();
    }
  }
}
