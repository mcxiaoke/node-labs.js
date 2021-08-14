function setUnion(setA, setB) {
  let _union = new Set(setA);
  for (let elem of setB) {
    _union.add(elem);
  }
  return _union;
}

function setIntersection(setA, setB) {
  let _intersection = new Set();
  for (let elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

function setDifference(setA, setB) {
  let _difference = new Set(setA);
  for (let elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

module.exports = { setUnion, setIntersection, setDifference };
