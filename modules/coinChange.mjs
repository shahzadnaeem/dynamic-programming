// Coin change function - tried to be smart and keeping track of the coins not working correctly

export const coinChange = (function () {
  let MEMO = {};

  // NOTE: IMPORTANT!
  // This function MUST have its cache primed by running it for all targets
  // up to the likely max target in increasing order. Otherwise the first one that is
  // above the target will result in a massive computational explosion :(

  // NOTE: This could be smarted by simply keeping track of the highest number cached
  //       and filling in the cache on demand :)

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

    if (target === 0) {
      return { target, minCoins: 0, how: [] };
    }

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

    const result = { target, minCoins, how: smallest.how };

    if (result.minCoins === result.how.length) {
      MEMO[key] = result;
      //   console.log(` >MEMO[${key}] = ${JSON.stringify(result)}`);
    } else {
      //   console.log(`NOT CACHING: ${JSON.stringify(result)}`);
    }

    return result;
  };
})();

// Simple minimum number of coins only version - no cache priming required

export const coinChange2 = (function () {
  let MEMO = {};

  return function coinChange2(coins, target) {
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
      const res = coinChange2(coins, target - coin);
      results.push(res);
    });

    const minCoins = 1 + Math.min(...results);

    const result = minCoins;

    MEMO[key] = result;

    return result;
  };
})();
