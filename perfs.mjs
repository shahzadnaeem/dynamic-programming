import { fib } from "./modules/fib.mjs";
import { coinChange, coinChange2 } from "./modules/coinChange.mjs";
import { knapsack } from "./modules/knapsack.mjs";

// Fibonacci

function testFib(to = 10) {
  const fibPerf = "Fibonacci";

  performance.mark(fibPerf);

  const list = Array(to)
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

function logPerfDelta() {
  const entries = performance.getEntriesByType("measure");

  const name = `${entries[0].name} vs ${entries[1].name}`;
  const initial = entries[0].duration;
  const cached = entries[1].duration;
  const delta = initial - cached;
  const speedup = delta / initial;

  return `${name}: ${Number(initial).toPrecision(5)} => ${Number(
    cached
  ).toPrecision(5)}: ${Number(delta).toPrecision(5)} - ${Number(
    speedup * 100
  ).toPrecision(5)}%`;
}

function testCoinChangeFn(targets, fn, tag = "") {
  const coins = [1, 2, 5, 25, 50];

  const totalPerf = `Coin change: ${fn.name}` + (tag !== "" ? ` [${tag}]` : "");

  performance.mark(totalPerf);

  targets.forEach((target) => {
    const perf1 = "Initial-coinChange";

    performance.mark(perf1);

    const result = fn(coins, target);

    performance.measure(perf1, perf1);

    const perf2 = "Cached-coinChange";

    performance.mark(perf2);

    const result2 = fn(coins, target);

    performance.measure(perf2, perf2);

    console.log(`${logPerfDelta()}`);

    performance.clearMarks(perf1);
    performance.clearMeasures(perf1);
    performance.clearMarks(perf2);
    performance.clearMeasures(perf2);
  });

  performance.measure(totalPerf, totalPerf);
  console.log(performance.getEntriesByType("measure"));
  performance.clearMarks(totalPerf);
  performance.clearMeasures(totalPerf);
}

function fullTestCoinChange(to) {
  const targets = Array(to + 1)
    .fill(0)
    .map((v, i) => i);

  testCoinChangeFn(targets, coinChange, "run");
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
  console.log(performance.getEntriesByType("measure"));
  performance.clearMarks(totalPerf);
  performance.clearMeasures(totalPerf);
}

function fullFastTestCoinChange(to) {
  const targets = Array(to + 1)
    .fill(0)
    .map((v, i) => i);

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

// ----------------------------------------------------------------------------

testFib(20);

// fullTestCoinChange(1000);
fullFastTestCoinChange(20);

// testKnapsack();
