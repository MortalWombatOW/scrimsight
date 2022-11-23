function memoize(
  method,
): (method: (...args: any[]) => any) => (...args: any[]) => any {
  let cache = {};

  return function () {
    let args = arguments;
    let key = JSON.stringify(args);
    cache[key] = cache[key] || method.apply(this, args);
    return cache[key];
  };
}

export default memoize;
