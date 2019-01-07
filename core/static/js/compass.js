var updatebearing;

function getMySpot () {
    navigator.geolocation.getCurrentPosition(function(position) {
        const location = document.getElementById('location');
        const location2 = document.getElementById('location2');
        location.innerText = `My coordinates are: ${position.coords.latitude}, ${position.coords.longitude}`
        loNg = position.coords.longitude
        laT = position.coords.latitude
        location2.innerText = `tracker says: ${updatebearing}`
        localStorage.setItem('latitude', position.coords.latitude);
        localStorage.setItem('longitude', position.coords.longitude);
        whichWaytoGo()
    })
}

getMySpot()

function whichWaytoGo () { 
    mySpot = getBearing(toRadian(laT), toRadian(loNg), toRadian(destination[0]), toRadian(destination[1]))
    localStorage.setItem('Compass', mySpot);
    compasser = document.getElementById('alpha');
    compasser.innerText = `My heading is: ${mySpot} degrees`;
    updatebearing = mySpot
}

var tracker = localStorage.getItem('Compass');
var latest = localStorage.latitude
var longest = localStorage.longitude


function calcAngle(opposite, adjacent) {
    return Math.atan2(opposite, adjacent);
  }

function toDegrees (angle) {
    return angle * (180 / Math.PI);
  }

function toRadian (degree) {
    return degree * Math.PI / 180;
}
  
// const myhouse = [35.984638, -78.965814]
const destination = [35.984641, -78.965719]

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
    // locale = 90;
    const animate = document.getElementById('canvas');
    const arrow = document.getElementById('source');
    const ctx = animate.getContext('2d');
    const direction = ((angler * Math.PI / 180) + Math.PI);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(150, 150);
    ctx.rotate(-direction + (toRadian(updatebearing)));
    ctx.translate(-150, -150)
    ctx.drawImage(arrow, 50, 50)
    ctx.resetTransform();
 }

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function(event) {
        document.getElementById("test").innerText = 'supported!'
        
        var compassHeading = Math.round(event.webkitCompassHeading);

        document.getElementById('compass').innerText = `${compassHeading}`;

        // setInterval(getMySpot, 3000);
        compassAnimation(compassHeading);
    }, true);
}

setInterval(getMySpot, 1000);

// function thisFunc () {
//     compasser = document.getElementById('alpha');
//     compasser.innerText = `My heading is: ${tracker} degrees`;
// }

// setInterval(thisFunc, 3000)







// function locationInfo () {
//     if ("geolocation" in navigator) {
//         navigator.geolocation.getCurrentPosition(function(position) {
//             const location = document.getElementById('location');
//             location.innerText = `My coordinates are: ${position.coords.latitude}, ${position.coords.longitude}`
//             // lat = position.coords.latitude
//             // long = position.coords.longitude
//             // latAndLong(lat, long)
//             // // console.log(position.coords.latitude)
//         });
//     } else {
//         console.log('failed')
//         const location = document.getElementById('location');
//         location.innerText = 'geolocation not allowed'
//     }
// }


// locationInfo();


// let ourHeading = getBearing(toRadian(), toRadian(), toRadian(destination[0]), toRadian(destination[1]), )