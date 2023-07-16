import { QueryProviderType } from '@azlabsjs/rx-query';
import { of } from 'rxjs';
import { ProvidesQuery } from '../decorators';

@ProvidesQuery({
  observe: 'response',
  cacheTime: 3000
})
export class TestQueryStateProvider
  implements
    QueryProviderType<[string, Record<string, unknown>]>
{
  query(path: string, params?: Record<string, unknown>) {
    return of({ path, params });
  }
}
