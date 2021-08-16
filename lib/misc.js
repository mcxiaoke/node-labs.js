function setUnion(setA, setB) {
  let _union = new Set(setA);
  for (let elem of setB) {
    _union.add(elem);
  }
  return _union;
}

function setInter(setA, setB) {
  let _intersection = new Set();
  for (let elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

function setDiff(setA, setB) {
  let _difference = new Set(setA);
  for (let elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

function isIterable(obj) {
  return obj && typeof obj[Symbol.iterator] === "function";
}

function showFor(iter, limit = 10) {
  for (const v of iter) {
    isIterable(v) ? console.log(...v) : console.log(v);
    if (--limit === 0) {
      break;
    }
  }
}

function range(start, stop, step) {
  // python like range function
  if (!stop) {
    stop = start;
    start = 0;
  }
  step = step || 1;
  let a = [start],
    b = start;
  while (b < stop - step) {
    a.push((b += step));
  }
  return a;
}

module.exports = {
  setUnion,
  setInter,
  setDiff,
  isIterable,
  showFor,
  range,
};
