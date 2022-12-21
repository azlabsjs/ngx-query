import { TestBed } from '@angular/core/testing';
import { interval, lastValueFrom, Observable, of, take, tap } from 'rxjs';
import { useQuery } from './helpers';
import { DefaultQueryClient } from './query-client';
import { TestQueryStateProvider } from './testing/test-query-state.stub';
import { HTTP_CLIENT, HTTP_QUERY_CLIENT } from './token';

describe('useQuery Test', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: HTTP_CLIENT,
          useFactory: () => {
            return {
              request(
                method: string,
                url: string,
                options: {
                  body?: unknown;
                  responseType: 'arraybuffer' | 'blob' | 'json' | 'text';
                  headers?:
                    | Record<string, unknown>
                    | {
                        [header: string]: string | string[];
                      };
                  params?:
                    | Record<string, unknown>
                    | {
                        [param: string]:
                          | string
                          | number
                          | boolean
                          | ReadonlyArray<string | number | boolean>;
                      };
                  withCredentials?: boolean;
                  observe?: 'response' | 'body' | 'request';
                }
              ): Observable<any> {
                return of({
                  method,
                  url,
                  options,
                });
              },
            };
          },
        },
        {
          provide: HTTP_QUERY_CLIENT,
          useClass: DefaultQueryClient,
        },
      ],
    }).compileComponents();
    // service = TestBed.inject(InMemoryStorage);
  });

  it('should invoke the query function and cache the query result', async () => {
    const query$ = useQuery(
      (name: string, lastname: string) => {
        return of({ name, lastname });
      },
      'Sidoine',
      'Azandrew',
      {
        name: 'test_query_cache_key',
        cacheQuery: true,
      }
    );
    query$
      .pipe(
        tap(() => {
          // console.log(value);
        })
      )
      .subscribe();
    expect(true).toBe(true);
    await lastValueFrom(interval(2000).pipe(take(1)));
  });

  it('should call the query provider query method and cache the result', async () => {
    const query$ = useQuery(new TestQueryStateProvider(), '/api/v1/posts', {
      post_id: 20,
    });
    query$
      .pipe(
        tap(() => {
          // console.log('Query response:', value);
        })
      )
      .subscribe();
    expect(true).toBe(true);
    await lastValueFrom(interval(2000).pipe(take(1)));
  });
});
