import { NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { QueryModule } from '@azlabsjs/ngx-query';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    QueryModule.forRoot({
      host: '',
      httpClient: HttpClient as Type<any>,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
