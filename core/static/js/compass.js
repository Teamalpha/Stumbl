var updatebearing;

function getMySpot() {
    navigator.geolocation.getCurrentPosition(function (position) {
        const location = document.getElementById('location');
        // const location2 = document.getElementById('location2');
        // location.innerText = `My coordinates are: ${position.coords.latitude}, ${position.coords.longitude}`
        loNg = position.coords.longitude
        laT = position.coords.latitude
        if (placeCoords) {
            updatebearing = whichWaytoGo()
        }
        // location2.innerText = `tracker says: ${updatebearing}`
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