var container, test;
var camera, scene, renderer, controls;
var mouse;
var PI2 = Math.PI * 2;
var programFill = function(context) {
    context.beginPath();
    // Attributes x-coordinate,y-coordinate,radius,beginning of angle and end of the angle,clockwise:true,aticlockwise:false
    context.arc(0, 0, 0.5, 0, PI2, true);
    context.fill();
};
var programStroke = function(context) {
    context.lineWidth = 0.025;
    context.beginPath();
    // Attributes x-coordinate,y-coordinate,radius,beginning of angle and end of the angle,clockwise:true,aticlockwise:false
    context.arc(0, 0, 0, 0.5, 0, true);
    context.stroke();
};
var namesData;

loadJSON('https://s3-us-west-2.amazonaws.com/s.cdpn.io/60012/names.json', function(response) {
    namesData = JSON.parse(response);
    init();
    animate();
});

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);
    container.style.position = 'absolute';
    container.style.top = '0px';
    container.style.left = '0px';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.overflow = 'hidden';

    test = document.createElement('div');
    document.body.appendChild(test);
    test.style.position = 'absolute';
    test.style.top = '0px';
    test.style.left = '0px';
    test.style.fontSize = '20px';
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 300, 500);
    camera.position.set(0, 0, 500);


    scene = new THREE.Scene();

    for (var i = 0; i < namesData.length; i++) {
        var pos = {};
        var node = {};
        pos.x = Math.random() * 500 - 250;
        pos.y = Math.random() * 500 - 250;
        pos.z = Math.random() * 500 - 250;
        var dotColor = Math.random() * 0x808080 + 0x808080;
        dotColor = 0xFFFFFFF;
        var nameStr = namesData[i];
        var particle = new THREE.Sprite(new THREE.SpriteCanvasMaterial({
            color: dotColor,
            program: programFill
        }));
        particle.position.x = pos.x;
        particle.position.y = pos.y;
        particle.position.z = pos.z;
        particle.scale.x = particle.scale.y = 3.8 * nameStr.length;
        particle.material.opacity = 0.8;
        scene.add(particle);


        var name = makeTextSprite(nameStr);
        name.position.set(pos.x, pos.y, pos.z);
        scene.add(name);
    }
    mouse = new THREE.Vector2();
    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor(0x00000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
}
// For Resize of Windows
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
// Mouse clicke event listener
function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
// For animation of words
function animate() {
    requestAnimationFrame(animate);
    render();
}
// Radius and 3D rotation initialising
var radius = 400;
var rotX = 0,
    rotY = 0,
    rotZ = 0,
    rotYnorm = 0,
    maxY = 80;

function render() {
    // rotate camera
    rotX += mouse.x;
    rotY += mouse.y;
    if (rotY >= maxY) rotY = maxY;
    if (rotY <= -maxY) rotY = -maxY;

    //rotZ = (Math.abs(rotX) > Math.abs(rotY)) ? rotX : rotY;

    //test.innerHTML = rotY + '  ' + rotYnorm;
    camera.position.x = radius * Math.sin(THREE.Math.degToRad(rotX));
    camera.position.y = radius * Math.sin(THREE.Math.degToRad(rotY));
    camera.position.z = radius * Math.cos(THREE.Math.degToRad(rotX));
    camera.lookAt(scene.position);
    camera.updateMatrixWorld();

    renderer.render(scene, camera);
}

function makeTextSprite(message) {
    var fontSize = 18;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    // Text Aligning
    context.textAlign = "center";
    // Fonts
    context.font = "Bold " + fontSize + "px Roboto, Arial";
    // Text Color
    context.fillStyle = "rgba(0,132,234, 2.5)";
    // Adding the words
    context.fillText(message, canvas.width / 2, canvas.height / 2 + fontSize / 4);

    var texture = new THREE.Texture(canvas);
    // Adds the context and updating the words everytime
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    var sprite = new THREE.Sprite(spriteMaterial);

    sprite.scale.set(100, 50, 500);
    //sprite.material.opacity = 0;
    return sprite;
}
// For loading words from the cloud or website
function loadJSON(url, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}