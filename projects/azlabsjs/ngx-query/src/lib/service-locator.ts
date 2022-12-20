import { InjectionToken, Injector } from '@angular/core';

/**
 * { @see https://angular.io/api/core/Type }
 */
export declare interface Type<T> extends Function {
  new (...args: any[]): T;
}

/**
 * { @see https://angular.io/api/core/AbstractType }
 * @description
 *
 * Represents an abstract class `T`, if applied to a concrete class it would stop being
 * instantiable.
 *
 * @publicApi
 */
export declare interface AbstractType<T> extends Function {
  prototype: T;
}

/**
 * @internal
 */
type ProviderToken<T> = Type<T> | AbstractType<T>;

export class ServiceLocator {
  // injector instance
  private static instance: () => Injector;

  /**
   *
   * @param injector
   */
  static setInstance(injector: Injector) {
    ServiceLocator.instance = () => {
      return injector;
    };
  }

  /**
   * Returns the global injector
   */
  static getInstance() {
    return ServiceLocator.instance();
  }

  /**
   * Retrieves an instance from the injector based on the provided token.
   *
   * @param token
   */
  static get<T>(token: ProviderToken<T> | InjectionToken<T>, _default?: T) {
    return ServiceLocator.getInstance().get<T>(token, _default);
  }
}
