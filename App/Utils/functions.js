/* @flow */
exports.dynamicSort = function(property: string) : Function {
  // 支持按照某个属性的升序，或降序("-"+属性名)排序
  var sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  // 返回一个Comparator
  return function(a, b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  };
};

exports.removeObjectfromArray = function(array: Array<Object>, key: string, value: string | number) : Array<Object> {
  return array.filter(function(el) {
    return el[key] !== value;
  });
};

exports.changeObjectinArray = function(array: Array<Object>, key: string, oldValue: string | number, newValue: string | number) : Array<Object> {
  array.forEach(function(item) {
    if (item[key] === oldValue) {
      item[key] = newValue;
    }
  });
  return array;
};
