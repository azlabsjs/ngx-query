type FunctionType<T = void> = () => T;
type InjectorType = {
  get<T>(token: unknown, notFoundValue: unknown): T;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPureFunction<T>(obj: any): obj is FunctionType<T> {
  return !!(obj.constructor && obj.call && obj.apply);
}

export class ServiceLocator {
  // injector instance
  private static instance: () => InjectorType;

  /**
   * Set the global angular inject
   *
   * @param injector
   */
  static setInstance(injector: InjectorType | FunctionType<InjectorType>) {
    ServiceLocator.instance = isPureFunction<InjectorType>(injector)
      ? injector
      : () => injector;
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
  static get<T>(token: unknown, _default?: T) {
    const instance = ServiceLocator.getInstance();
    if (typeof instance === 'undefined' || instance === null) {
      return _default;
    }
    return instance.get<T>(token, _default);
  }
}
