const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerBlackHoleX = canvas.width / 2;
const centerBlackHoleY = canvas.height / 2;

const stars = [];
const numStars = 1000;
const blackholeRadius = 40;
var solarSystems = [];
const numSolarSystems = 7;
var currentBlackHole = "";
var animationId;
// Generate a random number from min to max
function random(min, max) {
    return Math.random() * (max - min) + min;
}



// Create star given random angle and radius between blackhole and window
// return position, size, color, angle, radius, speed information
function createStar(centerX, centerY, maxRadius, size, speed) {
    const angle = random(0, 2 * Math.PI);
    const radius = random(blackholeRadius, maxRadius);
    return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        size: size,
        color: `rgba(255, 255, 255, ${random(0.1, 1)})`,
        angle: angle,
        radius: radius,
        speed: speed
    };
}

// Create solar system that orbits around the black hole
function createSolarSystem(num) {
    const angle = random(0, 2 * Math.PI);
    const radius = random(blackholeRadius + 50, canvas.width / 2);
    const solarSystemX = centerBlackHoleX + radius * Math.cos(angle);
    const solarSystemY = centerBlackHoleY + radius * Math.sin(angle);

    const stars = [];
    for (let i = 0; i < num; i++) {
        stars.push(createStar(solarSystemX, solarSystemY, 30, random(3,5), random(0.001, 0.01)));
    }

    return {
        x: solarSystemX,
        y: solarSystemY,
        size: random(10, 20),
        color: 'yellow',
        angle: angle,
        radius: radius,
        speed: random(0.0003, 0.0015),
        stars: stars
    };
}

// Create a lots of stars and solarSystem and put it into array
for (let i = 0; i < numStars; i++) {
     stars.push(createStar(centerBlackHoleX, centerBlackHoleY, canvas.width / 2,random(0.5,2), random(0.00015, 0.0015)));
}


function pushNumOfSolarSystem(num) {
    for (let i = 0; i < num; i++) {
        solarSystems.push(createSolarSystem(random(5,10)));
    }
}




// Simulate a blackhole and rendering it
function drawBlackHole() {
    ctx.beginPath();
    ctx.arc(centerBlackHoleX, centerBlackHoleY, blackholeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

// Rendering a star on the canvas board
function drawStar(star) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
    ctx.fillStyle = star.color;
    ctx.fill();
}
// Rendering the solar system
function drawSolarSystem(system) {
    ctx.beginPath();
    ctx.arc(system.x, system.y, system.size, 0, 2 * Math.PI);
    ctx.fillStyle = system.color;
    ctx.fill();
    system.stars.forEach(star => drawStar(star));
}

// Update star position information so that they will move
function updateStar(star, centerX, centerY) {
    star.angle += star.speed;
    star.x = centerX + star.radius * Math.cos(star.angle);
    star.y = centerY + star.radius * Math.sin(star.angle);
}

// Update the coordinates of solar system
function updateSolarSystem(system) {
    system.angle += system.speed;
    system.x = centerBlackHoleX + system.radius * Math.cos(system.angle);
    system.y = centerBlackHoleY + system.radius * Math.sin(system.angle);
    system.stars.forEach(star => updateStar(star, system.x, system.y));
}

// Function to start the animation loop
function startAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    animate();
}

// Drawing the final board for blackhole and stars
// Drawing the final board for blackhole and stars
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBlackHole();
    stars.forEach(star => {
        updateStar(star, centerBlackHoleX, centerBlackHoleY);
        drawStar(star);
    });
    solarSystems.forEach(system => {
        updateSolarSystem(system);
        drawSolarSystem(system);
    });
    animationId = requestAnimationFrame(animate);
}


// Request for API to get names of blackholes and turn it into lists in html
async function fetchAndDisplayBlackHoles() {
    const blackholeList = document.getElementById('blackholeList');

    try {
        const response = await fetch('blackholes', {
            method: 'GET'
        });

        const responseData = await response.json();
        const blackholes = responseData.blackholes;

        // Clear previous list
        blackholeList.innerHTML = '';

        // Create lists of names of blackhole
        blackholes.forEach(blackhole => {
            const li = document.createElement('li');
            li.textContent = blackhole[0]; // Assuming result.rows is an array of arrays
            blackholeList.appendChild(li);
        });

        document.getElementById('infoBoard').style.display = 'block';
    } catch (error) {
        console.error('Error fetching black hole data:', error);
    }
}

// Request for API to get names of stars and turn it into lists in html
// Here I pass the blackhole name into the function, to find the stars that related to the blackhole
async function fetchAndDisplayStars(name) {
    const starList = document.getElementById('starList');
    try {
        const response = await fetch(('stars/' + name), {
            method: 'GET'
        });

        const responseData = await response.json();
        const stars = responseData.stars;

        // Log stars to check the structure
        console.log('Fetched stars:', stars);

        // Clear previous list
        starList.innerHTML = '';

        // Create lists of names of stars
        stars.forEach(star => {
            const li = document.createElement('li');
            li.textContent = star[0]; // Assuming each item in stars is an array with the star name
            starList.appendChild(li);
        });
        document.getElementById('infoBoard2').style.display = 'block';
    } catch (error) {
        console.error('Error fetching star data:', error);
    }
}

// Functions that make sure we have the star in our talbe
async function ifHaveStar(name, starName) {
    try {
        const response = await fetch('stars/' + name, {
            method: 'GET'
        });

        const responseData = await response.json();
        const stars = responseData.stars;

        // Log stars to check the structure
        console.log('Fetched stars:', stars);

        const found = stars.some(star => {
            console.log('Checking star:', star[0], starName);
            return star[0] === starName;
        });

        console.log('Found:', found);
        return found;
    } catch (error) {
        console.error('Error fetching star data:', error);
        return false;
    }
}


// Search black holes attributes by name
async function searchBlackHole(name) {
    const detailsElement = document.getElementById('blackholeDetails');

    try {
        const response = await fetch(('blackholes/' + name), {
            method: 'GET'
        });

        // I met a bug, this is for testing
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const responseData = await response.json();
        const blackhole = responseData.blackhole;

        // If blackhole has the content then put the content into the detailsElement
        if (blackhole) {
            detailsElement.innerHTML = `
                <h2>${blackhole.black_hole_name}</h2>
                <p><strong>Mass:</strong> ${blackhole.mass}</p>
                <p><strong>Rotation Period:</strong> ${blackhole.rotation_period}</p>
            `;
        } else {
            detailsElement.innerHTML = '<p>No data found.</p>';
        }
    } catch (error) {
        console.error('Error fetching black hole details:', error);
        detailsElement.innerHTML = '<p>Error fetching details.</p>';
    }
}

// Search black holes attributes by name
async function searchStar(name) {
    const detailsElement = document.getElementById('starDetails');

    try {
        const response = await fetch(('searchStars/'+ name), {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const responseData = await response.json();
        const star = responseData.star;

        if (star) {
            detailsElement.innerHTML = `
                <h2>${star.star_name}</h2>
                <p><strong>R2_star_name:</strong> ${star.R2_star_name}</p>
                <p><strong>Luminosity:</strong> ${star.luminosity}</p>
                <p><strong>Rotation Period:</strong> ${star.rotation_period}</p>
                <p><strong>Diameter:</strong> ${star.diameter}</p>
                <p><strong>Mass:</strong> ${star.mass}</p>
                <p><strong>Orbital Eccentricity:</strong> ${star.orbital_eccentricity}</p>
                <p><strong>Orbital Period:</strong> ${star.orbital_period}</p>
                <p><strong>Distance to Companion:</strong> ${star.distance_to_companion}</p>
                <p><strong>Black Hole Name:</strong> ${star.black_hole_name}</p>
            `;
        } else {
            detailsElement.innerHTML = '<p>No data found.</p>';
        }
    } catch (error) {
        console.error('Error fetching star details in galaxy.js:', error);
        detailsElement.innerHTML = '<p>Error fetching details in galaxy.js.</p>';
    }
}


async function getStarWithPlanets(starName) {
    try {
        const response = await fetch(`/getStarWithPlanets?star_name=${starName}`, {
            method: 'GET'
        });

        const responseData = await response.json();

        // Use the general function to generate and display the table
        generateTable('starDetails', responseData, [
        'Star Name', 'Star Diameter', 'Star Mass', 'Planet Name', 'Orbital Period', 'R2 Star Name'
        ]);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// function used to call router to add planet into a star
async function addOrbitingPlanet(planetData) {
    try {
        const response = await fetch('/insert_StarOrbitingPlanet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(planetData)
        });

        if (response.ok) {
            alert("Planet added successfully!");
        } else {
            alert("Failed to add planet.");
        }
    } catch (error) {
        console.error('Error adding planet:', error);
        alert("Error adding planet.");
    }
}


// Used to insert Star to certain black hole
async function insertBHStar(star_name, luminosity, rotation_period, diameter, mass, orbital_eccentricity, orbital_period, black_hole_name) {
    try {
        const response = await fetch('insert_Star', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ star_name: star_name, R2_star_name: null, luminosity: luminosity, rotation_period: rotation_period, diameter: diameter, mass: mass, orbital_eccentricity: orbital_eccentricity, orbital_period: orbital_period, distance_to_companion: null, black_hole_name: black_hole_name })
        });

        if (!response.ok) {
            throw new Error(`Error adding star: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error adding star:', error);
    }
}

// Delete star in a certain black hole
async function deleteBHStar(star_name, black_hole_name) {
    try {
        const response = await fetch('delete_Star', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ star_name: star_name, black_hole_name: black_hole_name })
        });

        if (!response.ok) {
            throw new Error(`Error adding star: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error adding star:', error);
    }
}

// Update star information
async function updateBHStar(star_name, R2_star_name, luminosity, rotation_period, diameter, mass,
orbital_eccentricity, orbital_period, distance_to_companion, black_hole_name) {
    try {
        const response = await fetch('updateStar', {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    star_name,
                    R2_star_name,
                    luminosity,
                    rotation_period,
                    diameter,
                    mass,
                    orbital_eccentricity,
                    orbital_period,
                    distance_to_companion,
                    black_hole_name
                })
            });

        if (!response.ok) {
            throw new Error(`Error adding star: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error update star:', error);
    }
}

// generalSearch this is used to develop selection and projection
// according to the table, columns, query, params that user enter to get info for users
async function generalSearch(table, columns, query, params) {
    try {

        let selectedColumns = Array.from(document.querySelectorAll('#columns input:checked'))
            .map(checkbox => checkbox.value).join(', ');
        console.log(selectedColumns.length);
        if(selectedColumns.length == 0) {
            selectedColumns = '*';
        }
        const selectedQuery = Array.from(document.querySelectorAll('#query input:checked'))
            .map(checkbox => checkbox.value)
            .join(', ');

        const targetParams = params ? JSON.stringify(params.split(',')) : '[]';

        const response = await fetch(`/selectFromDB?table=${table}&columns=${selectedColumns}&query=${selectedQuery}&params=${encodeURIComponent(targetParams)}`, {
            method: 'GET'
        });

        const responseData = await response.json();

        const starDetailsElement = document.getElementById('starDetails');
        starDetailsElement.innerHTML = ''; // Clear previous content

        // Enter the Content to left information board
        if (responseData && responseData.length > 0) {
            const tableElement = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            // Create table headers
            const headers = selectedColumns.split(', ');
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header.trim();
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            // Create table rows
            responseData.forEach(row => {
                const tr = document.createElement('tr');
                row.forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });

            tableElement.appendChild(thead);
            tableElement.appendChild(tbody);
            starDetailsElement.appendChild(tableElement);
        } else {
            starDetailsElement.innerHTML = '<p>No data found.</p>';
        }

        document.getElementById('left-infoBoard').style.display = 'block';
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


// Used to count the number of star of black hole
async function countBHStars(black_hole_name) {
    try {
        const response = await fetch('countBHstars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ black_hole_name: black_hole_name })
        });

        if (!response.ok) {
            throw new Error(`Error counting stars: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData.count;
    } catch (error) {
        console.error('Error counting stars:', error);
    }
}

// used to find planet info according to planetName
async function getPlanetInfo(planetName) {
    try {
        const response = await fetch(`/getPlanet?planet_name=${planetName}`, {
            method: 'GET'
        });

        const responseData = await response.json();

        // Use the general function to generate and display the table
        generateTable('starDetails', responseData, [
            'Planet Name', 'Equatorial Diameter', 'Mass', 'ESI', 'Discovery Method', 'Rotation Period', 'Star Name', 'White Dwarf Name', 'Neutron Star Name', 'Moon Name'
        ]);

        document.getElementById('left-infoBoard').style.display = 'block';
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Used to find stars that the number of planet of the star greater than minPlanets
async function getListStarsAboveMin(minPlanets) {
    try {
        const response = await fetch(`/starPlanetCount?min=${minPlanets}`, {
            method: 'GET'
        });

        const responseData = await response.json();

        // Use the general function to generate and display the table
        generateTable('starDetails', responseData, [
            'Star Name', 'Number of Planets'
        ]);

        document.getElementById('left-infoBoard').style.display = 'block';
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// used to get the average diameter for blackHoles over minMass
async function blackHoleAvgDiameter(minMass) {
    try {
        const response = await fetch(`/blackholeAvgDiameter?minMass=${minMass}`, {
            method: 'GET'
        });

        const responseData = await response.json();

        // Use the general function to generate and display the table
        generateTable('starDetails', responseData, [
            'Mass', 'Average Diameter'
        ]);

        document.getElementById('left-infoBoard').style.display = 'block';
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Used to find star that have all asteroids
async function findAsteroidStar() {
    try {
        const response = await fetch('/findAsteroidStar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const responseData = await response.json();

        // Use the general function to generate and display the table
        generateTable('starDetails', responseData.star, [
            'Star Name'
        ]);

        document.getElementById('left-infoBoard').style.display = 'block';
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}



// Add a listener to the click to black hole
// calculate the coordinates of the cursor to check if it's in the black hole
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const distance = Math.sqrt((x - centerBlackHoleX) ** 2 + (y - centerBlackHoleY) ** 2);

     if (distance <= blackholeRadius) {
        document.getElementById('infoBoard2').style.display = 'none';
        fetchAndDisplayBlackHoles();
     }

     // Check if the solar system are clicked. If it's clicked then jump to solar system
     solarSystems.forEach(system => {
         const distanceToSystem = Math.sqrt((x - system.x) ** 2 + (y - system.y) ** 2);
         if (distanceToSystem <= system.size) {
            document.getElementById('infoBoard').style.display = 'none';
            fetchAndDisplayStars(currentBlackHole);
//          window.location.href = 'solar.html';

         }
     });
});


// add event listener to "X" so that user can shut down the board
document.querySelector('.close-button').addEventListener('click', function() {
    document.getElementById('infoBoard').style.display = 'none';
});
document.querySelector('.close-button2').addEventListener('click', function() {
    document.getElementById('infoBoard2').style.display = 'none';
});
document.querySelector('.left-close-button').addEventListener('click', function() {
    document.getElementById('left-infoBoard').style.display = 'none';
});

document.querySelector('.bottom-close-button').addEventListener('click', function() {
    document.getElementById('bottom-infoBoard').style.display = 'none';
});

// Add a listener to searchButton
document.getElementById('searchButton').addEventListener('click', async function() {
    const searchValue = document.getElementById('blackholeSearch').value;
    currentBlackHole = document.getElementById('blackholeSearch').value;
    const numOfSolar = await countBHStars(searchValue);
    solarSystems = [];
    pushNumOfSolarSystem(numOfSolar);
    if (searchValue) {
        searchBlackHole(searchValue);
    }
});

// Add a listener to addStarButton and ask information from user
document.getElementById('addStarButton').addEventListener('click', async function() {
    const searchValue = document.getElementById('starSearch').value;
    const luminosity = convertString(prompt("Enter a number for Luminosity:"));
    const rotation_period = convertString(prompt("Enter a number for rotation_period:"));
    const diameter = convertString(prompt("Enter a number for diameter:"));
    const mass = convertString(prompt("Enter a number for mass:"));
    const orbital_eccentricity = convertString(prompt("Enter a number for orbital_eccentricity:"));
    const orbital_period = convertString(prompt("Enter a number for orbital_period:"));
    const black_hole_name = currentBlackHole;
    await insertBHStar(searchValue, luminosity, rotation_period, diameter, mass, orbital_eccentricity, orbital_period, black_hole_name);
    fetchAndDisplayStars(black_hole_name);
    pushNumOfSolarSystem(1);
    startAnimation();
});

// Add a listener to deleteStarButton
document.getElementById('deleteStarButton').addEventListener('click', async function() {
    const searchValue = document.getElementById('starSearch').value;
    const black_hole_name = currentBlackHole;
    await deleteBHStar(searchValue, black_hole_name);
    fetchAndDisplayStars(black_hole_name);
    // Remove the last solar system from the array
    if (solarSystems.length > 0) {
        solarSystems.pop();
    }

    startAnimation();
});

// Add a listener to updateStarButton and ask user to enter the content that user want to change
document.getElementById('updateStarButton').addEventListener('click', async function() {
    const searchValue = document.getElementById('starSearch').value;
    const result = await ifHaveStar(currentBlackHole, searchValue);

    if (result){
        const R2_star_name = prompt("Enter the name for companion star to update:", null);
        const luminosity = convertString(prompt("Enter a number for Luminosity to update:", null));
        const rotation_period = convertString(prompt("Enter a number for rotation_period to update:", null));
        const diameter = convertString(prompt("Enter a number for diameter to update:", null));
        const mass = convertString(prompt("Enter a number for mass to update:", null));
        const orbital_eccentricity = convertString(prompt("Enter a number for orbital_eccentricity to update:", null));
        const orbital_period = convertString(prompt("Enter a number for orbital_period to update:", null));
        const distance_to_companion = convertString(prompt("Enter a number for distance_to_companion to update:", null));
        const black_hole_name = currentBlackHole;
        await  updateBHStar(searchValue, R2_star_name, luminosity, rotation_period, diameter, mass,
              orbital_eccentricity, orbital_period, distance_to_companion, black_hole_name);
        fetchAndDisplayStars(black_hole_name);
    } else {
        window.alert("No such star found in current black hole system!");
    }

});

// Add a listener to searchButton2
document.getElementById('searchButton2').addEventListener('click', async function() {
    const searchValue = document.getElementById('starSearch').value;
    document.getElementById('left-infoBoard').style.display = 'block';
    if (searchValue) {
        searchStar(searchValue);
    }
});
// Add a listener to generalSearch
document.getElementById('generalSearch').addEventListener('click', async function() {
    const searchValue = document.getElementById('starSearch').value;
    document.getElementById('bottom-infoBoard').style.display = 'block';

});
// Event listener for the general search button
document.getElementById('generalSearch-button').addEventListener('click', async () => {
    const table = document.getElementById('table').value;
    let columns = document.getElementById('columns').value;
    const query = document.getElementById('query').value;
    const params = document.getElementById('params').value;
    console.log(columns);
    if (!columns) {
        columns = '*';
    }
    console.log(columns);
    await generalSearch(table, columns, query, params);
});

// Add a listener to starPlanetSearch button
document.getElementById('starSearch-button').addEventListener('click', async () => {
    const starName = document.getElementById('starName').value;
    await getStarWithPlanets(starName);
    document.getElementById('left-infoBoard').style.display = 'block';

});

// Add a listener to addPlanetButton button, to add planet
document.getElementById('addPlanetButton').addEventListener('click', async () => {
    const star_name = document.getElementById('starSearch').value;
    const result = await ifHaveStar(currentBlackHole,star_name);
    if(result) {
        const planet_name = prompt("Enter the planet name:");
        const orbital_period = convertString(prompt("Enter the number for orbital period:"));
        const distance_to_centre = convertString(prompt("Enter the number for distance to centre:"));
        const SP_eccentricity = convertString(prompt("Enter the number for SP eccentricity:"));
        const ed = convertString(prompt("Enter the number for equatorial diameter:"));
        const mass = convertString(prompt("Enter the number for mass:"));
        const ESI = convertString(prompt("Enter the number for ESI:"));
        const method = prompt("Enter the string for discovery method:");
        const period = convertString(prompt("Enter the number for rotation period:"));
        const density = convertString(prompt("Enter the number for density:"));

        const planetData = { planet_name, orbital_period, distance_to_centre, star_name, SP_eccentricity, ed, mass, ESI, method, period, density};
        await addOrbitingPlanet(planetData);
    } else {
        window.alert("No such a star!");
    }


});
// Add a listener to getPlanetInfoButton
document.getElementById('getPlanetInfoButton').addEventListener('click', async () => {
    const planetName = document.getElementById('planetName').value;
    await getPlanetInfo(planetName);
});
// Add a listener to getBHStarCountButton
document.getElementById('getBHStarCountButton').addEventListener('click', async () => {
    const blackHoleName = document.getElementById('blackHoleName').value;
    const result = await countBHStars(blackHoleName);
    if(result) {
        window.alert("There's " + result + " stars for " + blackHoleName);
    } else {
        window.alert("There's no such black hole!");
    }

});
// Add a listener to starPlanetCountButton
document.getElementById('starPlanetCountButton').addEventListener('click', async () => {
    const minPlanets = document.getElementById('minPlanets').value;
    await getListStarsAboveMin(minPlanets);
});
// Add a listener to blackholeAvgDiameterButton
document.getElementById('blackholeAvgDiameterButton').addEventListener('click', async () => {
    const minMass = parseFloat(document.getElementById('minMass').value);
    await blackHoleAvgDiameter(minMass);

});
// Add a listener to findAsteroidStarButton
document.getElementById('findAsteroidStarButton').addEventListener('click', async () => {
    await findAsteroidStar();
});


// Create a function that generally generate the table
function generateTable(elementId, responseData, headers = []) {
    const element = document.getElementById(elementId);
    element.innerHTML = ''; // Clear previous content

    if (responseData && responseData.length > 0) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Create table headers
        if (headers.length === 0) {
            headers = Object.keys(responseData[0]);
        }
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.trim();
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Create table rows
        responseData.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        element.appendChild(table);
    } else {
        element.innerHTML = '<p>No data found.</p>';
    }
}

// Convert the input into number
function convertString(input) {
    if (input == null || input.trim() === "") {
        return null;  // Handle empty or null input
    }
    let floatNumber = parseFloat(input);

    if (isNaN(floatNumber)) {
        console.log("Invalid input. Please enter a valid number.");
        return null;  // Return null for invalid input
    }
    console.log("The float number is:", floatNumber);
    return floatNumber;
}

//
document.addEventListener('DOMContentLoaded', () => {
    populateTableNames();
});

// locally store table names and table attributes
const tableNames = [
    'ASTEROID',
    'BLACKHOLE',
    'BLACKHOLE_DIAMETER',
    'FREEFLOATINGPLANET',
    'MAINSEQUENCESTAR',
    'MOON',
    'NEUTRONSTAR',
    'NEUTRONSTAR_DENSITY_ESCAPEVELOCITY',
    'ORBITINGPLANET',
    'PLANET',
    'PLANET_DENSITIES',
    'REDGIANT',
    'STAR',
    'WHITEDWARF'
];

const tableColumns = {
    ASTEROID: ['asteroid_name', 'mass', 'star_name'],
    BLACKHOLE: ['black_hole_name', 'mass', 'rotation_period'],
    BLACKHOLE_DIAMETER: ['mass', 'rotation_period', 'diameter'],
    FREEFLOATINGPLANET: ['planet_name', 'mass', 'diameter'],
    MAINSEQUENCESTAR: ['star_name', 'luminosity', 'temperature'],
    MOON: ['moon_name', 'planet_name', 'diameter', 'mass'],
    NEUTRONSTAR: ['neutron_star_name', 'rotation_period', 'magnetic_field'],
    NEUTRONSTAR_DENSITY_ESCAPEVELOCITY: ['rotation_period', 'density', 'escape_velocity'],
    ORBITINGPLANET: ['planet_name', 'orbital_period', 'distance_to_centre', 'star_name', 'SP_eccentricity'],
    PLANET: ['planet_name', 'equatorial_diameter', 'mass', 'ESI', 'discovery_method', 'rotation_period'],
    PLANET_DENSITIES: ['equatorial_diameter', 'mass', 'density'],
    REDGIANT: ['star_name', 'luminosity', 'mass'],
    STAR: ['star_name', 'R2_star_name', 'luminosity', 'rotation_period', 'diameter', 'mass', 'orbital_eccentricity', 'orbital_period', 'distance_to_companion', 'black_hole_name'],
    WHITEDWARF: ['white_dwarf_name', 'rotation_period', 'luminosity', 'mass', 'diameter', 'density', 'metallicity', 'star_name']
};

// used to show table names drop down menu
function populateTableNames() {
    const tableSelect = document.getElementById('table');
    tableNames.forEach(table => {
        const option = document.createElement('option');
        option.value = table;
        option.textContent = table;
        tableSelect.appendChild(option);
    });
}

// function used to generate corresponding checkbox for columns and query
function updateColumnsAndAttributes() {
    const tableName = document.getElementById('table').value;
    const columns = tableColumns[tableName] || [];
    const columnsContainer = document.getElementById('columns');
    const queryContainer = document.getElementById('query');

    columnsContainer.innerHTML = '';
    queryContainer.innerHTML = '';

    columns.forEach(column => {
        const columnCheckbox = document.createElement('input');
        columnCheckbox.type = 'checkbox';
        columnCheckbox.value = column;
        columnCheckbox.id = `column_${column}`;

        const columnLabel = document.createElement('label');
        columnLabel.htmlFor = `column_${column}`;
        columnLabel.textContent = column;

        const queryCheckbox = columnCheckbox.cloneNode(true);
        queryCheckbox.id = `query_${column}`;

        const queryLabel = document.createElement('label');
        queryLabel.htmlFor = `query_${column}`;
        queryLabel.textContent = column;

        columnsContainer.appendChild(columnCheckbox);
        columnsContainer.appendChild(columnLabel);
        columnsContainer.appendChild(document.createElement('br'));

        queryContainer.appendChild(queryCheckbox);
        queryContainer.appendChild(queryLabel);
        queryContainer.appendChild(document.createElement('br'));
    });
}



startAnimation();




