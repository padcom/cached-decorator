# `@Cached` decorator for TypeScript

This library provides a mechanism to selectively cache (memoize) method calls.

## Installing

To install the library issue the following command:

```
$ npm install --save cached-decorator
```

Types are provided with the package

## Using the library

To use the library, in its simplest form, you add the `@Cached()` decorator to a method in classes like this:

```
class Calculator {
  @Cached()
  sum(x: number, y: number): number {
    console.log('Calculating sum')
    return x + y
  }
}

const calc = new Calculator()
calc.sum(1, 2)
calc.sum(1, 2)
calc.sum(1, 2)
```

Upon running you will notice that the log "Calculating sum" is called only once.

## Specifying timeout for cached values

It is possible that sometimes you'll want to have a time-constrained version of the cache. You can specify how long will it take for a certain result of method call is cached by specifying the timeout in milliseconds as the first parameter of the decorator:

```
class Calculator {
  @Cached(1000)
  sum(x: number, y: number): number {
    ...
```

The above change will cache the result of the call to `sum` for 1 second.

## Specifying a different implementation for caching

It is possible to tweak how the library works by specifying cache implementation and its parameters. There are two main implementations:

`MemoryCache` - this cache is implemented using a nested Map construct. It has a `destroy()` method that will release all the allocated resources

`ObjectCache` - this cache implementation hooks up to the instance of the class, creates the `__cache__` key and stores the values there.

Both implementations expect the following optional parameters:

`timeout` - after the specified time the cached entry will be invalidated and removed from cache (default: `Number.POSITIVE_INFINITY`)

`updateOnGet` - refresh key's time when fetching (default: `false`)

Here's an example of how to use `ObjectCache` implementation with 1 second timeout and refreshing the key's age on every call to the function:

```
class Calculator {
  @Cached(, new ObjectCache(1000, true))
  sum(x: number, y: number): number {
    ...
```

The `timeout` parameter is by default just passed on to the constructor of `MemoryCache` (default cache implementation) - hence it needs to be skipped when using this decorator.
