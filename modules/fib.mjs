export const fib = (function () {
  const MEMO = {};

  return function fib(n) {
    if (n === 0) {
      return 0;
    } else if (n === 1) {
      return 1;
    }

    if (MEMO[n]) {
      return MEMO[n];
    }

    const fib1 = fib(n - 1);
    const fib2 = fib(n - 2);

    MEMO[n] = fib1 + fib2;

    return fib1 + fib2;
  };
})();
