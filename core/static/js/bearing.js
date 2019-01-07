function calcAngle(opposite, adjacent) {
    return Math.atan2(opposite, adjacent);
  }

function toDegrees (angle) {
    return angle * (180 / Math.PI);
  }
  
const myhouse = [35.986058, -78.963867]
const destination = [36.007000, -78.937879]

// let lat = destination[0] - myhouse[0]
// let long = destination[1] - myhouse[1]
// console.log(lat)
// console.log(long)

// const radian = calcAngle(lat, long);
// console.log(radian);

// let degrees = (radian) * (180/Math.PI)
// console.log(degrees)

function getBearing(lat1, long1, lat2, long2) {
    var y = Math.sin(long2-long1) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(long2-long1);
    var brng = Math.atan2(y, x).toDegrees();
    return brng;
}

console.log(getBearing(myhouse[0], myhouse[1], destination[0], destination[1]))

var y = Math.sin(λ2-λ1) * Math.cos(φ2);
var x = Math.cos(φ1)*Math.sin(φ2) -
        Math.sin(φ1)*Math.cos(φ2)*Math.cos(λ2-λ1);
var brng = Math.atan2(y, x).toDegrees();