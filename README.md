# Rx Query State

## Usage

The Query state library provides as most of angular library a module that exposes the API to the end users. Therefore in the root of your angular project add the following:

```ts
// app.module.ts

// Imports the angular library
import { HTTPQueryModule } from "@azlabsjs/ngx-query";
// Import the core library
import { HTTP_HOST } from "@azlabsjs/rx-query";

@NgModule({
  imports: [
    // ... 
    HTTPQueryModule.forRoot({
      //..
    }),
  ]
})
export class AppModule {}
```

### How to perform query

There are various way to perform query. You either use an angular service, a Javascript function or pass a set of predefined query parameters to a functional interface.

* Using query parameters

When using query parameters, a default query provider, based on Angular HTTP client library, is internally used by the module.

```ts
import { useQuery } from "@azlabsjs/ngx-query";
import { QueryType } from '@azlabsjs/rx-query';

export class TestComponent {
  state$ = useQuery<QueryType>(
    {
      path: "api/v1/customers",
      method: "GET",
      observe: "request",
      // provider: this.httpClient
    },
    true
  );
}
```

**Note** Customized query path
  Instead of manually specifying the query method, we must sometimes pass a query  string `METHOD_path[/:param1][/path2/:param2]` along with required parameters as `parameters` to the request object and the query library will internally resolve and build the query path along with the method before sending the request.

```ts
import { useQuery } from "@azlabsjs/ngx-query";
import { QueryType } from '@azlabsjs/rx-query';

@Component({
  // ...
})
export class TestComponent {
  state$ = useQuery<QueryType>(
    {
      // This resolves in an HTTP request:
      // /GET api/v1/posts/1032/users/2
      path: "get_api/v1/posts:post_id/users:user_id",
      observe: "request",
      params: {
        user_id: 2,
        post_id: 1032,
      },
    },
    true
  );
}
```

* Using angular services

Sometimes, to have control on the query developper might like to provides his/her custom query logic. Therefore the library come with support for decoupled service for performing queries:

```ts
// query-state.service.ts
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { QueryProviderType } from "@azlabsjs/rx-query";
import { ProvidesQuery } from "@azlabsjs/ngx-query";
import { getHttpHost, isValidHttpUrl } from "./helpers";

@Injectable()
@ProvidesQuery({
  observe: 'body'
})
export class TestQueryStateProvider
  implements
    QueryProviderType<[string, Record<string, any> | [string, string]]>
{
  constructor(
    private httpClient: HttpClient,
  ) {}

  query(path: string, params?: Record<string, any>) {
    const host = environment.api.host;
    return this.httpClient.get(
      isValidHttpUrl(path)
        ? path
        : `${host ? getHttpHost(host) : host}/${path ?? ""}`,
      { params }
    ) as Observable<Object>;
  }
}

```

**Note** Query State services must implements `QueryProviderType` interface and defines the query method that is internally called by tge library.

```ts
import { Component } from '@angular/core';
import { useQuery } from "@azlabsjs/ngx-query";
import { TestQueryStateProvider } from './query-state.service.ts'

@Component({
  selector: "app-query-state",
  template: ` <pre *ngIf="state$ | async as state">{{ state | json }}</pre> `,
  providers: [TestQueryStateProvider],
})
export class QueryStateComponent {
  state$ = useQuery(this.queryProvider, "api/v1/customers").pipe(
    tap(console.log)
  );

  constructor(private queryProvider: TestQueryStateProvider) {}
}

```
