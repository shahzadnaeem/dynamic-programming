// Create a fib function with its own MEMO

const fib = (function () {
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

const coinChange = (function () {
  let MEMO = {};

  return function coinChange(coins, target, how = []) {
    const key = coins.join(",") + `/${target}`;

    // console.log(`key=${key}, how=${JSON.stringify(how)}`);

    if (MEMO[key]) {
      // NOTE: FFS! Not doing this took me all day to find!
      const memo = { ...MEMO[key] };
      //   console.log(` +MEMO[${key}] = ${JSON.stringify(memo)}, how=${how}`);
      memo.how = [...how, ...memo.how];
      return memo;
    }

    if (target === 0) {
      return { minCoins: 0, how };
    } else if (target < 0) {
      return { minCoins: Number.MAX_SAFE_INTEGER, how: ["X"] };
    }

    const results = [];

    coins.forEach((coin) => {
      const res = coinChange(coins, target - coin, [...how, coin]);
      results.push(res);
    });

    const smallest = results.reduce((smallest, curr) =>
      curr.minCoins < smallest.minCoins ? curr : smallest
    );

    const minCoins = 1 + smallest.minCoins;

    const result = { minCoins, how: smallest.how };

    if (result.minCoins === result.how.length) {
      MEMO[key] = result;
      //   console.log(` >MEMO[${key}] = ${JSON.stringify(result)}`);
    }

    return result;
  };
})();

const coinChange2 = (function () {
  let MEMO = {};

  return function coinChange(coins, target) {
    const key = coins.join(",") + `/${target}`;

    if (MEMO[key]) {
      return MEMO[key];
    }

    if (target === 0) {
      return 0;
    } else if (target < 0) {
      return Number.MAX_SAFE_INTEGER;
    }

    const results = [];

    coins.forEach((coin) => {
      const res = coinChange(coins, target - coin);
      results.push(res);
    });

    const minCoins = 1 + Math.min(...results);

    const result = minCoins;

    MEMO[key] = result;

    return result;
  };
})();

// Fibonacci

const list = Array(10)
  .fill(0)
  .map((v, i) => i);

list.forEach((n) => {
  console.log(`fib(${n}) = ${fib(n)}`);
});

// Coins

const coins = [1, 2, 5, 25, 50];

const targets = [1, 8, 1, 3, 7, 12, 13, 25, 27, 29, 32, 36, 39];

const perf1 = "Change-with-how";
const perf2 = "Change-simple";

performance.mark(perf1);

targets.forEach((target) => {
  console.log(`Make ${target}:`);
  console.log(
    `Min coins to make ${target} = ${JSON.stringify(coinChange(coins, target))}`
  );
});

performance.measure(perf1, perf1);

performance.mark(perf2);

targets.forEach((target) => {
  console.log(`Make ${target}:`);
  console.log(
    `Min coins to make ${target} = ${JSON.stringify(
      coinChange2(coins, target)
    )}`
  );
});

performance.measure(perf2, perf2);

console.log(performance.getEntriesByType("measure"));

performance.clearMarks();
performance.clearMeasures();
