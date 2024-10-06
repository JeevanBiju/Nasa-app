// app.js

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

// Orbit Controls (camera rotation and zooming)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;

// Add Sun (just a sphere for now)
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Position the camera
camera.position.z = 10;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    sun.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();

// NASA NEO API key
const apiKey = 'ezH76CMoPbGM34ZdTkRDxWPH0ATHaNp1oemechdd';  // Replace this with your API key

function loadAsteroids() {
    fetch(`https://api.nasa.gov/neo/rest/v1/feed?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const asteroids = data.near_earth_objects;
            displayAsteroids(asteroids);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayAsteroids(asteroids) {
    let infoDiv = document.getElementById('info');
    infoDiv.innerHTML = '';  // Clear previous data

    Object.keys(asteroids).forEach(date => {
        asteroids[date].forEach(asteroid => {
            let element = document.createElement('div');
            element.innerHTML = `<b>${asteroid.name}</b>: ${asteroid.close_approach_data[0].close_approach_date}`;
            infoDiv.appendChild(element);

            // Create asteroid in the scene
            createAsteroid(asteroid);
        });
    });
}

function createAsteroid(data) {
    const size = data.estimated_diameter.kilometers.estimated_diameter_max * 0.05;  // Scale down size
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
    const asteroid = new THREE.Mesh(geometry, material);

    // Randomize position for now
    asteroid.position.x = Math.random() * 10 - 5;
    asteroid.position.y = Math.random() * 10 - 5;
    asteroid.position.z = Math.random() * 10 - 5;

    scene.add(asteroid);
}
