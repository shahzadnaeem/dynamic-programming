import { fib } from "./modules/fib.mjs";

// Create a fib function with its own MEMO

// Coin change function - tried to be smart and keeping track of the coins not working correctly

const coinChange = (function () {
  let MEMO = {};

  return function coinChange(coins, target, how = []) {
    const key = coins.join(",") + `/${target}`;

    // console.log(`key=${key}, how=${JSON.stringify(how)}`);

    if (MEMO[key]) {
      // NOTE: FFS! Not doing this took me all day to find! DO NOT MODIFY a cached value!
      const memo = { ...MEMO[key] };
      //   console.log(` +MEMO[${key}] = ${JSON.stringify(memo)}, how=${how}`);
      memo.how = [...how, ...memo.how];
      return memo;
    }

    // if (target === 0) {
    //   return { minCoins: 0, how };
    // } else if (target < 0) {
    //   return { minCoins: Number.MAX_SAFE_INTEGER, how: ["X"] };
    // }

    const results = [];

    coins.forEach((coin) => {
      if (target === coin) {
        results.push({ minCoins: 0, how: [...how, coin] });
      } else if (target < coin) {
        results.push({ minCoins: Number.MAX_SAFE_INTEGER, how: ["X"] });
      } else {
        const res = coinChange(coins, target - coin, [...how, coin]);
        results.push(res);
      }
    });

    const smallest = results.reduce((smallest, curr) =>
      curr.minCoins < smallest.minCoins ? curr : smallest
    );

    const minCoins = 1 + smallest.minCoins;

    const result = { minCoins, how: smallest.how };

    // TODO: This makes the output `how` correct, but not enough is being cached and run times are slow
    // TODO: Always caching gives the wrong `how` - DOH!
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

// Knapsack

const knapsack = (function () {
  let MEMO = {};

  return function knapsack(items, capacity, i = 0, contents = []) {
    const key = `${capacity}.${i}`;

    if (MEMO[key]) {
      // console.log(`MEMO: ${JSON.stringify(contents)}`);
      return MEMO[key];
    }

    // Do the work, memoize and return

    // Termination cases
    if (capacity === 0) {
      // console.log(`FULL: ${JSON.stringify(contents)}`);
      return 0;
    } else if (capacity < 0) {
      return Number.MIN_SAFE_INTEGER;
    } else if (i === items.length) {
      // console.log(`END: ${JSON.stringify(contents)}`);
      return 0;
    }

    const result = Math.max(
      knapsack(items, capacity, i + 1, contents), // Nothing added case
      knapsack(items, capacity - items[i].weight, i + 1, [
        ...contents,
        items[i],
      ]) + items[i].value
    );

    MEMO[key] = result;

    return result;
  };
})();

// Template

const template = (function () {
  let MEMO = {};

  return function template(arg1, arg2, arg3) {
    const key = `${arg1}.${arg2}`;

    if (MEMO[key]) {
      return MEMO[key];
    }

    // Do the work, memoize and return

    MEMO[key] = result;

    return result;
  };
})();

// Fibonacci

const fibPerf = "Fibonacci";

performance.mark(fibPerf);

const list = Array(10)
  .fill(0)
  .map((v, i) => i);

list.forEach((n) => {
  console.log(`fib(${n}) = ${fib(n)}`);
});

performance.measure(fibPerf, fibPerf);

console.log(performance.getEntriesByType("measure"));

performance.clearMarks();
performance.clearMeasures();

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

// Knapsack

const items = [
  { weight: 10, value: 20 },
  { weight: 4, value: 30 },
  { weight: 20, value: 10 },
  { weight: 40, value: 5 },
  { weight: 1, value: 2 },
];

const knapsacks = [20, 12, 14, 15, 30];

knapsacks.forEach((capacity) => {
  console.log(`knapsack: ${capacity} => ${knapsack(items, capacity, 0)}`);
});

const best = knapsack(items, 20, 0);
