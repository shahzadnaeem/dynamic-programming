// Knapsack

export const knapsack = (function () {
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
