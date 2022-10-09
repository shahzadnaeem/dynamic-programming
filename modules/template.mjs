// Template

export const template = (function () {
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
