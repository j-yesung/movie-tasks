// 배열 메서드
const exampleArray = ['hello world', 'nick', 'james', 'bread', 'hashBrown'];
console.time('default');
// forEach
exampleArray.forEach(item => {
  console.log('forEach => ', item);
});

// map
let resultMap = exampleArray.map(item => {
  return `I'm ${item}`;
});
console.log('map => ', resultMap);

// filter
let resultFilter = exampleArray.filter(item => {
  return item.startsWith('h');
});
console.log('filter => ', resultFilter);

// some
let resultSome = exampleArray.some(item => {
  return item.startsWith('h');
});
console.log('some => ', resultSome);

// every
let resultEvery = exampleArray.every(item => {
  return item.startsWith('h');
});
console.log('every => ', resultEvery);

// find
let resultFind = exampleArray.find(item => {
  return item.startsWith('h');
});
console.log('find => ', resultFind);
console.timeLog();
