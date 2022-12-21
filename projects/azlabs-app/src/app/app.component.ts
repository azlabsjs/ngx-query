import { Component } from '@angular/core';
import { useQuery } from '@azlabsjs/ngx-query';
import { from, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  state$ = useQuery(
    (name: string, lastname: string) => {
      return from(
        new Promise((resolve) => {
          const timeout = setTimeout(() => {
            resolve({ name, lastname });
            clearTimeout(timeout);
          }, 3000);
        })
      );
    },
    'Azandrew',
    'Sidoine',
    {
      name: 'test_query_cached_key',
      cacheQuery: true,
    }
  ).pipe(
    tap((value) => {
      console.log('AppComponent', value);
    })
  );
}
