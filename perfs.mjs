import { fib } from "./modules/fib.mjs";
import { coinChange, coinChange2 } from "./modules/coinChange.mjs";
import { knapsack } from "./knapsack.mjs";

// Fibonacci

function testFib() {
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
}

// Coins

function testCoinChange() {
  const coins = [1, 2, 5, 25, 50];

  const targets = [1, 8, 1, 3, 7, 12, 13, 25, 27, 29, 32, 36, 39];

  const perf1 = "Change-with-how";
  const perf2 = "Change-simple";

  performance.mark(perf1);

  targets.forEach((target) => {
    console.log(`Make ${target}:`);
    console.log(
      `Min coins to make ${target} = ${JSON.stringify(
        coinChange(coins, target)
      )}`
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
}

function logPerfDelta() {
  const entries = performance.getEntriesByType("measure");

  const name = `${entries[1].name} vs ${entries[0].name}`;
  const initial = entries[0].duration;
  const cached = entries[1].duration;
  const delta = initial - cached;
  const speedup = 1.0 - delta / initial;

  return `${name}: ${Number(initial).toPrecision(5)} => ${Number(
    cached
  ).toPrecision(5)}: ${Number(delta).toPrecision(5)} - ${Number(
    speedup * 100
  ).toPrecision(5)}`;
}

function testCoinChangeFn(targets, fn, tag = "") {
  const coins = [1, 2, 5, 25, 50];

  const log = [];

  const totalPerf = `Coin change: ${fn.name}` + (tag !== "" ? ` [${tag}]` : "");

  performance.mark(totalPerf);

  targets.forEach((target) => {
    const perf1 = "Initial-coinChange";

    performance.mark(perf1);

    const initialResult = fn(coins, target);

    // console.log(
    //   `Min coins to make ${target} = ${JSON.stringify(initialResult)}`
    // );

    performance.measure(perf1, perf1);

    log.push(
      `CACHED: Min coins to make ${target} = ${JSON.stringify(
        coinChange(coins, target)
      )}`
    );

    performance.clearMarks(perf1);
    performance.clearMeasures(perf1);
  });

  performance.measure(totalPerf, totalPerf);
  console.log(
    `${JSON.stringify(performance.getEntriesByType("measure"), 0, 2)}`
  );
  performance.clearMarks(totalPerf);
  performance.clearMeasures(totalPerf);

  return log;
}

function fastTestCoinChangeFn(targets, fn, tag = "", logFn = false) {
  const coins = [1, 2, 5, 25, 50];

  const totalPerf = `Coin change: ${fn.name}` + (tag !== "" ? ` [${tag}]` : "");

  performance.mark(totalPerf);

  targets.forEach((target) => {
    const result = fn(coins, target);
    if (logFn) {
      logFn(target, result);
    }
  });

  performance.measure(totalPerf, totalPerf);
  console.log(
    `${JSON.stringify(performance.getEntriesByType("measure"), 0, 2)}`
  );
  performance.clearMarks(totalPerf);
  performance.clearMeasures(totalPerf);
}

// Knapsack

function testKnapsack() {
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
}

// Coin change test

const NUM_TARGETS = 100;

const targets = Array(NUM_TARGETS + 1)
  .fill(0)
  .map((v, i) => i);

// testCoinChangeFn(targets, coinChange, "prime");
// testCoinChangeFn(targets, coinChange, "run");
// testCoinChangeFn(targets.reverse(), coinChange, "run reverse");

// targets.reverse();

// testCoinChangeFn(targets, coinChange2, "prime");
// testCoinChangeFn(targets, coinChange2, "run");
// testCoinChangeFn(targets.reverse(), coinChange2, "run reverse");

// Fast test - just overall times

fastTestCoinChangeFn(targets, coinChange, "prime");

fastTestCoinChangeFn(targets, coinChange, "run");
fastTestCoinChangeFn(targets, coinChange, "run log", (target, result) =>
  console.log(`Make ${target} => ${JSON.stringify(result)}`)
);

fastTestCoinChangeFn(targets.reverse(), coinChange, "run reverse");

targets.reverse();

fastTestCoinChangeFn(targets, coinChange2, "prime");

fastTestCoinChangeFn(targets, coinChange2, "run");
fastTestCoinChangeFn(targets, coinChange2, "run log", (target, result) =>
  console.log(`Make ${target} => ${result} coins`)
);

fastTestCoinChangeFn(targets.reverse(), coinChange2, "run reverse");
