var currentId = 1
function getNewId() {
	return currentId++;
}

function stringToId (str) {
	return str.replace(/\W/g,'_');
}

/* time parse methods from 
   https://github.com/nescalante/timeparse/
*/
var units = {
  μs : 1,
  ms : 1000,
  s  : 1000 * 1000,
  m  : 1000 * 1000 * 60,
  h  : 1000 * 1000 * 60 * 60,
  d  : 1000 * 1000 * 60 * 60 * 24,
  w  : 1000 * 1000 * 60 * 60 * 24 * 7
};



function parse(string, returnUnit) {
  returnUnit = returnUnit || 'ms';

  var totalMicroseconds = 0;

  var groups = string
    .toLowerCase()
    .match(/[-+]?[0-9\.]+[a-z]+/g);


  if (groups !== null) {
    groups.forEach(function (g) {
      var value = g.match(/[0-9\.]+/g)[0];
      var unit = g.match(/[a-z]+/g)[0];

      totalMicroseconds += getMicroseconds(value, unit);
    });
  }

  return totalMicroseconds / units[returnUnit];
}

function getMicroseconds(value, unit) {
  var result = units[unit];

  if (result) {
    return value * result;
  }

  throw new Error('The unit "' + unit + '" could not be recognized');
}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

// Production steps of ECMA-262, Edition 5, 15.4.4.21
// Reference: http://es5.github.io/#x15.4.4.21
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(callback /*, initialValue*/) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.reduce called on null or undefined');
    }
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    var t = Object(this), len = t.length >>> 0, k = 0, value;
    if (arguments.length == 2) {
      value = arguments[1];
    } else {
      while (k < len && !(k in t)) {
        k++; 
      }
      if (k >= len) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      value = t[k++];
    }
    for (; k < len; k++) {
      if (k in t) {
        value = callback(value, t[k], k, t);
      }
    }
    return value;
  };
}