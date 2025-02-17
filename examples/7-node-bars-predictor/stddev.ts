function stdDevElement(InArr: number[]) {
  //Calculate Mean
  var l = InArr.length;
  var sum = InArr.reduce(function (a, b) {
    return a + b;
  }, 0);
  var mean = sum / l;
  //find difs and square
  var sqdifs = [];
  for (var i = 0; i < InArr.length; i++) { //loop through array
    sqdifs.push(Math.pow(Math.abs(InArr[i] - mean), 2)); //square of absolute difference for each item in array
  }
  var SD = Math.sqrt((sqdifs.reduce(function (a, b) {
    return a + b;
  }, 0)) / sqdifs.length); //square root of the Mean of sqdifs (SD)
  return SD;
}

export const stddev = (arr: number[], window = 14) => {
  let stdArr: number[] = [];
  const result = [];

  for(let curr of arr) {
    if (stdArr.length === window) {
      stdArr.shift();
    }
    stdArr.push(curr);

    if (stdArr.length < window) {
      result.push(0);
    } else {
      result.push(
        stdDevElement(stdArr)
      )
    }
  }

  return result;
};
