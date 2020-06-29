$(function() {
    var scene = new THREE.Scene();
    var aspect = window.innerWidth / window.innerHeight;
    var d = 2;
    // It helps to convert 3D Model to 2D View
    camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    // var camera = new THREE.PerspectiveCamera(50, aspect, 1, 1000);
    camera.position.set(4, 3, 3); //All Components are equal
    camera.lookAt(scene.position);

    var renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x141A35);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;

    var loader = new THREE.JSONLoader();
    loader.load('https://aperesso.github.io/low_poly_room/room.json', handle_load);

    function handle_load(geometry, materials) {
        var obj = new THREE.Mesh(geometry, materials);
        obj.receiveShadow = true; //Material gets baked in shadow recieving
        obj.castShadow = true; //Get render in shadpw map
        scene.add(obj);
    }
    // Create a Screen which is functioning
    var screen = new THREE.Mesh(
        new THREE.PlaneGeometry(.31, .25, .85),
        new THREE.MeshStandardMaterial({ emissive: 0x141A35 }),
    );
    screen.position.set(1.8, .84, 1.32);
    scene.add(screen);
    var snow = [];
    var nb = 35;
    for (var i = 0; i < nb; i++) {
        var particle = new Snow(); //Helps to create snow balls
        particle.init();
        particle.modelize();
        snow.push(particle);
    }
    light();

    function light() {
        var spotlight = new THREE.SpotLight(0xF5FC5A);
        spotlight.position.set(1.75, 4, -3);
        // spotlight.castShadow = true;
        spotlight.intensity = .2;
        scene.add(spotlight);


        var dirlight = new THREE.DirectionalLight(0xfdd8ff);
        dirlight.position.set(-.96, 3, -.75);
        // dirlight.castShadow = true;
        dirlight.intensity = .2;
        scene.add(dirlight);

        var ambi = new THREE.AmbientLight(0x0e1642);
        scene.add(ambi);

        var pointlight = new THREE.PointLight();
        pointlight.position.set(.63, .72, .71);
        // pointlight.castShadow = true;
        pointlight.intensity = .2;
        scene.add(pointlight);
    }

    function update() {
        for (var i = 0; i < nb; i++) {
            //IT appends and updates the snow balls to makesure there's comtinuous flow
            snow[i].update();
        }

        renderer.render(scene, camera);
        requestAnimationFrame(update);
    }

    function Snow() {
        this.position = new THREE.Vector3();
        this.vel = new THREE.Vector3(-1 * (0.0005 + Math.random() * 0.001), -1 * (0.005 + Math.random() * 0.01), -.1 * (0.005 + Math.random() * 0.01));

        this.init = function() {
            this.position.x = Math.random() * 2.85;
            this.position.y = 2.6;
            this.position.z = -2.47 + Math.random() * 2;

        }
        this.modelize = function() {
            this.mesh = new THREE.Mesh(
                new THREE.DodecahedronGeometry(1),
                new THREE.MeshPhongMaterial({
                    color: 0xfafafa
                })
            );
            this.mesh.position.copy(this.position);
            this.mesh.scale.set(0.02, 0.02, 0.02);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            scene.add(this.mesh);
        }

        this.update = function() {
            if (this.position.y < 0)
                this.position.y = 2.6;
            if (this.position.x < 0 || this.position.x > 2.85)
                this.vel.x *= -1;
            if (this.position.z < -2.47 || this.position.z > -.47)
                this.vel.z *= -1;
            this.position.add(this.vel);
            this.mesh.position.copy(this.position);

        }
    }
    $('#webGL-container').append(renderer.domElement);
    renderer.render(scene, camera);

    update();
})