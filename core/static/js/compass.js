var updatebearing;

function getMySpot() {
    navigator.geolocation.getCurrentPosition(function (position) {
        loNg = position.coords.longitude
        laT = position.coords.latitude
        if (placeCoords) {
            updatebearing = whichWaytoGo()
            updatedistance = getDistance(laT, loNg, placeCoords.lat, placeCoords.lng)
            let distanceAway = parseFloat((updatedistance * 0.621371))
            if (distanceAway < 0.5) {
                vm.distance = `: ${(distanceAway * 5280).toFixed(0)} ft`
            }
            else {
                vm.distance = `: ${distanceAway.toFixed(2)} mi`
            }
        }
    })
}

getMySpot()

function whichWaytoGo() {
    var mySpot = Math.round(getBearing(toRadian(laT), toRadian(loNg), toRadian(placeCoords.lat), toRadian(placeCoords.lng)))
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

function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = toRadian(lat2 - lat1);  // toRadian below
    var dLon = toRadian(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}