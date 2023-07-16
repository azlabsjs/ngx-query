import { QueryState, queryResult } from '@azlabsjs/rx-query';
import { Observable, OperatorFunction } from 'rxjs';

/**
 * Query [body] stream of the query response if any or returns the
 * entire response if none
 *
 */
export function queryResultBody<TResult = unknown>(
  key?: string
): OperatorFunction<QueryState, TResult> {
  return (observable$: Observable<QueryState>) =>
    observable$.pipe(
      queryResult((query) => {
        key = key ?? 'body';
        const response = query.response as Record<string, unknown>;
        return response && typeof response === 'object' && key in response
          ? response[key]
          : response;
      })
    ) as Observable<TResult>;
}
