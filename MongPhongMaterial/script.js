let scene, camera, renderer, sphere, ambientLight, spotlight, floor, wall;
const width = window.innerWidth;
const height = window.innerHeight;
const aspectRatio = width / height;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    camera.position.z = 50;
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("#1e272e", 1.0);
    renderer.setSize(width, height);

    const geometry = new THREE.SphereGeometry(10, 50, 50);
    const material = new THREE.MeshPhongMaterial({
        shininess: 500,
        map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/water/Water_2_M_Normal.jpg'),
        bumpMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/water.jpg'),
        wireframe: false,
        specular: 0x636e72,
        flatShading: false,
        color: 0x0
    });
    sphere = new THREE.Mesh(geometry, material);
    sphere.name = "Sphere";
    sphere.castShadow = true;
    scene.add(sphere);

    // Lights
    ambientLight = new THREE.AmbientLight(0xdfe6e9, .2);
    ambientLight.castShadow = true;
    //  scene.add(ambientLight);
    // Helps to Show the upper part of the 
    spotlight = new THREE.SpotLight(0x0dfe6e9, .3);
    spotlight.castShadow = true;
    spotlight.position.set(100, 100, 20);
    scene.add(spotlight);

    const NewSpotlight = new THREE.SpotLight(0x0dfe6e9, .2);
    NewSpotlight.castShadow = true;
    NewSpotlight.position.set(-50, -100, 50);
    scene.add(NewSpotlight);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(200, 200, 25, 25);
    const floorMesh = new THREE.MeshStandardMaterial({ color: 0x2d3440 });
    floor = new THREE.Mesh(floorGeometry, floorMesh);
    floor.rotation.x = Math.PI / 180 * -90;
    floor.position.y = -15;
    floor.receiveShadow = true;
    scene.add(floor);

    // Wall
    const wallGeometry = new THREE.PlaneGeometry(200, 200, 25, 25);
    const wallMesh = new THREE.MeshStandardMaterial({ color: 0x2d3436 });
    wall = new THREE.Mesh(wallGeometry, wallMesh);
    wall.position.z = -20;
    wall.position.y = 0;
    wall.receiveShadow = true;
    scene.add(wall);

    // Rendering
    document.body.appendChild(renderer.domElement);
    window.onresize = function() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        let aspectRatio = window.innerWidth / window.innerHeight;
        camera.aspect = aspectRatio;
        camera.updateProjectionMatrix();
    }

    const render = function() {
        renderer.render(scene, camera);
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.005;
        requestAnimationFrame(render);
    }
    render();
}

window.onload = init();