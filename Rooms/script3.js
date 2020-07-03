var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;

var keyboard = {};
var player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
var USE_WIREFRAME = false;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);


    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 2),
        new THREE.MeshBasicMaterial({
            // color: 0xff4444,
            // wireframe: USE_WIREFRAME,
            color: 0xffffff,
            wireframe: USE_WIREFRAME,
            map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/water/Water_2_M_Normal.jpg'),
            bumpMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/water.jpg'),
        }), );
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
    // mesh.position.z -= 0.1;
    mesh.position.y += 0.1; // Move the mesh up 1 meter
    scene.add(mesh);

    // scene.add(mesh);
    mesh1back = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2.2),
        new THREE.MeshBasicMaterial({
            color: 0xff31f,
            wireframe: false,
            color: 0xff271,
            wireframe: false,
            shininess: 500,
            map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/water/Water_2_M_Normal.jpg'),
            bumpMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/water.jpg'),
            // wireframe: true,
            specular: 0x636e72,
            flatShading: false,
        })
    );
    mesh1back.position.z = 2;
    mesh1back.position.y = 0.1; // Move the mesh up 1 meter
    mesh1back.position.x = 0;
    scene.add(mesh1back);

    mesh1left = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 1.2, 1.1),
        new THREE.MeshBasicMaterial({
            color: 0x0f1212,
            wireframe: false,
            // map: new THREE.TextureLoader().load('https://github.com/mrdoob/three.js/blob/dev/examples/textures/carbon/Carbon_Normal.png'),
            // bumpMap: new THREE.TextureLoader().load('https://github.com/mrdoob/three.js/blob/dev/examples/textures/carbon/Carbon_Normal.png'),
        }));
    mesh1left.position.z = 2;
    mesh1left.position.y = .1; // Move the mesh up 1 meter
    mesh1left.position.x = 2;
    mesh1left.rotation.x = Math.PI / 2;
    mesh1left.rotation.y = Math.PI / 2;
    scene.add(mesh1left);
    mesh2left = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 10, 10),
        new THREE.MeshBasicMaterial({
            color: 0xff271,
            wireframe: false,
            shininess: 500,
            map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/water/Water_2_M_Normal.jpg'),
            bumpMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/water.jpg'),
            wireframe: true,
            specular: 0x636e72,
            flatShading: false,
            // color: 0x0
        })
    );
    mesh2left.position.z = 2;
    mesh2left.position.y = 1; // Move the mesh up 1 meter
    mesh2left.position.x = 2;
    mesh2left.rotation.x = Math.PI / 2;
    mesh2left.rotation.y = Math.PI / 2;
    scene.add(mesh2left);
    // SpotLight
    spotlight = new THREE.SpotLight(0x0dfe6e9, .3);
    spotlight.castShadow = true;
    spotlight.position.set(100, 100, 20);
    scene.add(spotlight);
    // News SpotLight
    const NewSpotlight = new THREE.SpotLight(0x0dfe6e9, .2);
    NewSpotlight.castShadow = true;
    NewSpotlight.position.set(-50, -100, 50);
    scene.add(NewSpotlight);

    // FloorGeometry
    const floorGeometry = new THREE.PlaneGeometry(200, 200, 25, 25);
    const floorMesh = new THREE.MeshStandardMaterial({ color: 0x2d3440 });
    floor = new THREE.Mesh(floorGeometry, floorMesh);
    floor.rotation.x = Math.PI / 180 * -90;
    floor.position.y = -15;
    floor.receiveShadow = true;
    scene.add(floor);
    //Wall Geometry
    const wallGeometry = new THREE.PlaneGeometry(200, 200, 25, 25);
    const wallMesh = new THREE.MeshStandardMaterial({ color: 0x123456 });
    wall = new THREE.Mesh(wallGeometry, wallMesh);
    wall.position.z = -20;
    wall.position.y = 0;
    wall.receiveShadow = true;
    scene.add(wall);

    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 10, 10),
        // MeshBasicMaterial does not react to lighting, so we replace with MeshPhongMaterial
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            wireframe: USE_WIREFRAME,
            map: new THREE.TextureLoader().load('https://github.com/mrdoob/three.js/tree/dev/examples/textures/floors'),
            bumpMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/water.jpg'),
        })
        // See threejs.org/examples/ for other material types
    );
    meshFloor.rotation.x -= Math.PI / 2;
    // Floor can have shadows cast onto it
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);

    // LIGHTS
    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xffffff, 0.8, 18);
    light.position.set(-3, 6, -3);
    light.castShadow = true;
    // Will not light anything closer than 0.1 units or further than 25 units
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);


    camera.position.set(0, player.height, -5);
    camera.lookAt(new THREE.Vector3(0, player.height, 0));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1280, 720);

    // Enable Shadows in the Renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    document.body.appendChild(renderer.domElement);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
window.onload = init;