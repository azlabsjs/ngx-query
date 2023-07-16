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
   * Set the global angular inject
   *
   * @param injector
   */
  static setInstance(injector: Injector) {
    ServiceLocator.instance = () => {
      return injector;
    };
  }

  /**
   * Returns the angular global injector or undefined when running in testing environment
   * or module not initialized properly using QueryModule.forRoot()
   */
  private static getInstance() {
    return typeof ServiceLocator.instance !== 'undefined' &&
      ServiceLocator.instance !== null
      ? ServiceLocator.instance()
      : undefined;
  }

  /**
   * Retrieves an instance from the injector based on the provided token.
   *
   * @param token
   */
  static get<T>(token: ProviderToken<T> | InjectionToken<T>, _default?: T) {
    const instance = ServiceLocator.getInstance();
    if (typeof instance === 'undefined' || instance === null) {
      return _default;
    }
    return instance.get<T>(token, _default);
  }
}
