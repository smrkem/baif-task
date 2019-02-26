const randomFromInterval = (min, max, step=1) => {
  const range = (max - min) / step
  return min + Math.floor(Math.random() * range) * step
}

const getMeanForLast = (arr, n) => {
  if (arr.length < n) {
    n = arr.length;
  }
  var data = arr.slice(-n);
  var sum = 0;
  for (var i = 0; i < data.length; i++) {
    sum += data[i];
  }
  return Math.round(100 * sum / n)/100;
}


export {
  randomFromInterval,
  getMeanForLast
}
