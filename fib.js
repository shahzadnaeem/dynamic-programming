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
  const MEMO = {};

  return function coinChange(coins, target, how = []) {
    // console.log(`coinChange(${target}, ${how})`);

    // const key = coins.join(",") + target;
    // if (MEMO[key]) {
    //   return {
    //     minCoins: MEMO[key].minCoins,
    //     how: `${MEMO[key].how} + [${how}]`,
    //   };
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

    // MEMO[key] = result;

    // console.log(`  coinChange(${target}, ${how}) = ${JSON.stringify(result)}`);

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

const coins = [1, 2, 5]; //, 10, 25, 50];

const targets = [8, 1, 3, 7, 12, 25, 27, 29]; // 78, 300];

targets.forEach((target) => {
  console.log(`Make ${target}:`);
  console.log(
    `Min coins to make ${target} = ${JSON.stringify(coinChange(coins, target))}`
  );
});
