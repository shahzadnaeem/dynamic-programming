// Template

export const stepWays = (function () {
  let MEMO = {};

  return function stepWays(stairs, maxSteps = 2) {
    const key = `${stairs},${maxSteps}`;

    if (MEMO[key]) {
      return MEMO[key];
    }

    // Termination cases
    if (stairs === 0) {
      return 1; // This gives us a Fibonacci sequence (was 0 previously)
    }
    if (stairs < 0) {
      return 0;
    }

    // NOTE: This is an N Fibonacci sequence for `maxSteps`
    //       ie add the last `maxSteps` numbers to get the next one
    let result = 0;
    for (let i = 0; i < maxSteps; i++) {
      const step = maxSteps - i;
      if (stairs - step === 0) {
        result += 1;
      } else if (stairs - step > 0) {
        result += stepWays(stairs - step, maxSteps);
      }
    }

    MEMO[key] = result;

    return result;
  };
})();
