import { isPlatformBrowser } from '@angular/common';
import {
  Inject,
  Injectable,
  Optional,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
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
  implements
    CommandInterface<unknown>,
    QueryManager<Observable<QueryState>>,
    OnDestroy
{
  // Creates an instance of { @see QueryProvider }
  constructor(
    @Inject(PLATFORM_ID) @Optional() private platformId: ObjectConstructor,
    @Inject(QUERY_MANAGER) private readonly query: QueryManagerType
  ) {}

  /**
   * @deprecated Prefer use of `invoke` method  instead which return
   * an observable of the query being handled
   *
   * **Note** Implementation will be removed in future release
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch<T extends (...args: any) => void>(
    action: T,
    ...args: [...QueryArguments<typeof action>]
  ): unknown {
    return this.query.dispatch(action, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
