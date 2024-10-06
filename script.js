// script.js
// Scene and Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

// Add an asteroid (for simplicity, just a sphere for now)
const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
const asteroid = new THREE.Mesh(geometry, material);
scene.add(asteroid);

// Set camera position
camera.position.z = 5;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    asteroid.rotation.x += 0.01;
    asteroid.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();

// Add OrbitControls for interactivity
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;

// Fetching NASA API Data
const apiKey = 'YezH76CMoPbGM34ZdTkRDxWPH0ATHaNp1oemechdd'; // Replace this with your NASA API key

function fetchAsteroidData() {
    fetch(`https://api.nasa.gov/neo/rest/v1/feed?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const asteroids = data.near_earth_objects;
            displayAsteroids(asteroids);
        })
        .catch(error => console.error('Error fetching asteroid data:', error));
}

function displayAsteroids(asteroids) {
    // Loop through the data and display it on the UI
    let infoDiv = document.getElementById('info');
    infoDiv.innerHTML = '';
    Object.keys(asteroids).forEach(date => {
        asteroids[date].forEach(asteroid => {
            let element = document.createElement('div');
            element.innerHTML = `<b>${asteroid.name}</b>: ${asteroid.close_approach_data[0].close_approach_date}`;
            infoDiv.appendChild(element);

            // Optional: You can also create asteroid objects in the scene here
            createAsteroid(asteroid);
        });
    });
}

// Create Asteroids in the 3D Scene
function createAsteroid(data) {
    const size = data.estimated_diameter.kilometers.estimated_diameter_max * 0.1;  // Scale down size
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
    const asteroid = new THREE.Mesh(geometry, material);

    // Randomize position for now (in reality, you'd calculate based on data)
    asteroid.position.x = Math.random() * 10 - 5;
    asteroid.position.y = Math.random() * 10 - 5;
    asteroid.position.z = Math.random() * 10 - 5;

    scene.add(asteroid);
}
