  
 function animations (angler) {
    const animate = document.getElementById('canvas');
    const ctx = animate.getContext('2d');
    const direction = (angler * Math.PI / 180)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.translate(150, 150);
    ctx.rotate(-direction);
    ctx.translate(-150, -150)
    ctx.fillRect(140, 20, 20, 260);
    ctx.resetTransform();
 }
  
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function(event) {
        document.getElementById("test").innerText = 'supported!'
        // // alpha: rotation around z-axis
        // var rotateDegrees = Math.round(event.alpha);
        // // gamma: left to right
        // var leftToRight = Math.round(event.gamma);
        // // beta: front back motion
        // var frontToBack = Math.round(event.beta);
        // document.getElementById("alpha").innerText = `${rotateDegrees}`;
        // document.getElementById('gamma').innerText = `${leftToRight}`;
        // document.getElementById('beta').innerText = `${frontToBack}`;

        var compassHeading = Math.round(event.webkitCompassHeading);

        document.getElementById('compass').innerText = `${compassHeading}`;

        const dog = 5;

        animations(compassHeading);
        
        // handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
    }, true);
}

// animations(5)