module.exports = {
  /**
   * Retry to execute an action a specified number of times.
   *
   * @param action
   * @param numOfTries
   * @return {PromiseLike<T>|Promise<T>}
   */
  retryIfNeeded: function (action, numOfTries) {
    let times = 0;
    let retry = function (error) {
      if (times < numOfTries) {
        times++;
        console.log(`Retrying action, that have failed with ${error.name} ${error.message}`);
        return action().then(null, retry);
      } else {
        throw new Error(`Still failing after ${numOfTries} times of retry due to ${error.name} ${error.message}`);
      }
    };
    return action().then(null, retry);
  }
};