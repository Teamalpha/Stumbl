var updatebearing;

function getMySpot () {
    navigator.geolocation.getCurrentPosition(function(position) {
        const location = document.getElementById('location');
        // const location2 = document.getElementById('location2');
        location.innerText = `My coordinates are: ${position.coords.latitude}, ${position.coords.longitude}`
        loNg = position.coords.longitude
        laT = position.coords.latitude
        if (placeCoords) {
            updatebearing = whichWaytoGo()
        }
        // location2.innerText = `tracker says: ${updatebearing}`
    })
}

getMySpot()

function whichWaytoGo () { 
    var mySpot = Math.round(getBearing(toRadian(laT), toRadian(loNg), toRadian(placeCoords.lat), toRadian(placeCoords.lng)))
    compasser = document.getElementById('alpha');
    compasser.innerText = `My heading is: ${mySpot} degrees`;
    return mySpot
}


function calcAngle(opposite, adjacent) {
    return Math.atan2(opposite, adjacent);
  }

function toDegrees (angle) {
    return angle * (180 / Math.PI);
  }

function toRadian (degree) {
    return degree * Math.PI / 180;
}

function getBearing(lat1, long1, lat2, long2) {
    var y = Math.sin(long2-long1) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(long2-long1);
    var brng = Math.atan2(y, x);
    var brngInDegs = toDegrees(brng);
    if (brngInDegs < 0) {
        brngInDegs += 360;
    }
    return brngInDegs;
}

function compassAnimation (angler) {
    const animate = document.getElementById('canvas');
    const arrow = document.getElementById('source');
    const ctx = animate.getContext('2d');
    const direction = (angler * Math.PI / 180);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(150, 150);
    // ctx.rotate(-(direction + Math.round(updatebearing)));
    // ctx.rotate(toRadian(-(angler + Math.round(updatebearing))));
    ctx.rotate(-(direction + toRadian(updatebearing)))
    ctx.translate(-150, -150)
    ctx.drawImage(arrow, 50, 50)
    ctx.resetTransform();
 }

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function(event) {
        document.getElementById("test").innerText = 'supported!'
        
        var compassHeading = Math.round(event.webkitCompassHeading);

        document.getElementById('compass').innerText = `the input is ${compassHeading}`;

        // setInterval(getMySpot, 3000);
        compassAnimation(compassHeading);
    }, true);
}

setInterval(getMySpot, 1000);