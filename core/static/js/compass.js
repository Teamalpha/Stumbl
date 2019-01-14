var updatebearing;

function getMySpot() {
    navigator.geolocation.getCurrentPosition(function (position) {
        const distance = document.getElementById('c-distance');
        // const location2 = document.getElementById('location2');
        // location.innerText = `My coordinates are: ${position.coords.latitude}, ${position.coords.longitude}`
        loNg = position.coords.longitude
        laT = position.coords.latitude
        if (placeCoords) {
            updatebearing = whichWaytoGo()
            updatedistance = getDistance(laT, loNg, placeCoords.lat, placeCoords.lng)
            distance.innerText = `Destination Distance: ${updatedistance}`
        }

    })
}

getMySpot()

function whichWaytoGo() {
    var mySpot = Math.round(getBearing(toRadian(laT), toRadian(loNg), toRadian(placeCoords.lat), toRadian(placeCoords.lng)))
    compasser = document.getElementById('alpha');
    // compasser.innerText = `My heading is: ${mySpot} degrees`;
    return mySpot
}


function calcAngle(opposite, adjacent) {
    return Math.atan2(opposite, adjacent);
}

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

function toRadian(degree) {
    return degree * Math.PI / 180;
}

function getBearing(lat1, long1, lat2, long2) {
    var y = Math.sin(long2 - long1) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(long2 - long1);
    var brng = Math.atan2(y, x);
    var brngInDegs = toDegrees(brng);
    if (brngInDegs < 0) {
        brngInDegs += 360;
    }
    return brngInDegs;
}

// function getDistance(lat1, lon1, lat2, lon2) {
//     const R = 6371;
//     let l1 = toRadian(lat1);
//     let l2 = toRadian(lat2);
//     let cl = toRadian(lat2-lat1);
//     let cλ = toRadian(lon2-lon1);

//     let a = Math.sin(cl/2) * Math.sin(cl/2) +
//             Math.cos(l1) * Math.cos(l2) *
//             Math.sin(cλ/2) * Math.sin(cλ/2);
//     let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

//     let d = (R * 100) * c;
//     return d;
// }

function getDistance(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = toRadian(lat2-lat1);  // toRadian below
    var dLon = toRadian(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }