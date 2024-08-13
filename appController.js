const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/blackholes', async (req, res) => {
    try {
        const blackholes = await appService.getBlackHoleNames();
        res.json({ blackholes });
    } catch (err) {
        res.status(500).send('Error fetching data');
    }
});

router.get('/stars/:name', async (req, res) => {
    const blackHoleName = req.params.name;
    console.log(`Received request for stars: ${blackHoleName}`);
    try {
        const stars = await appService.getStarNames(blackHoleName);
        res.json({ stars });
    } catch (err) {
        console.error('Error fetching stars:', err.message); // Log error message
        res.status(500).json({ error: 'Error fetching stars' }); // Return JSON error response
    }
});

router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

// pass the name into router, then request API getBlackHoleDetails to get content of certain black hole
router.get('/blackholes/:name', async (req, res) => {
    const blackHoleName = req.params.name;
//    console.log(`Received request for black hole: ${blackHoleName}`);  // Log the received parameter, this is for testing

    try {
        const blackhole = await appService.getBlackHoleDetails(blackHoleName);
        if (blackhole) {
            res.json({ blackhole });
        } else {
            res.status(404).send('Black hole not found'); // For test, the bug made me thought that I didn't pass the name properly
        }
    } catch (err) {
        console.error('Error fetching black hole details:', err);
        res.status(500).send('Error fetching data');
    }
});

// pass the name into router, then request API getBlackHoleDetails to get content of certain black hole
router.get('/searchStars/:name', async (req, res) => {
    const starName = req.params.name;
    console.log(`Received request for star: ${starName}`);  // Log the received parameter for debugging

    try {
        const star = await appService.getStarDetails(starName);
        if (star) {
            res.json({ star });
        } else {
            res.status(404).send('Star not found');  // Log and send error if the star is not found
        }
    } catch (err) {
        console.error('Error fetching star details:', err);
        res.status(500).send('Error fetching data');
    }
});

router.post('/addblackholes', async (req, res) => {
    const {name, mass, rotation_period, diameter} = req.body;
    const values = name + ',' +  mass + ', ' + rotation_period;
    const otherValues = name + ',' +  mass + ', ' + diameter;
    console.log('Received new black hole:', name);  // Log the received data, for testing

    try {
        await appService.insertTuple('BlackHole_Diameter', otherValues);
        await appService.insertTuple('BlackHole', values);
        res.send('Black hole created');
    } catch (err) {
        console.error('Error creating black hole:', err);
        res.status(500).send('Error creating black hole');
    }
});


router.post("/insert_Planet", async (req, res) => {
    const {name, ed, mass, ESI, method, period, density} = req.body;
    const values = name + ',' + ed + ',' + mass + ',' + ESI + ',' + method + ',' + period;
    const otherValues = ed + ',' +  mass + ',' + density;
    console.log(values, otherValues);
    try {
        await appService.insertTuple('Planet_Densities', otherValues);
        await appService.insertTuple('Planet', values);
        res.send('Planet inserted');
    } catch (err) {
        console.error('Error inserting planet:', err);
        res.status(500).send('Error inserting planet');
    }
});

router.post("/insert_StarOrbitingPlanet", async (req, res) => {
    const {planet_name, orbital_period, distance_to_centre, star_name,
        SP_eccentricity, ed, mass, ESI, method, period, density } = req.body;
        const values = planet_name + ',' + ed + ',' + mass + ',' + ESI + ',' + method + ',' + period;
        const otherValues = ed + ',' +  mass + ',' + density;
        const values2 = planet_name + ',' + orbital_period + ',' + distance_to_centre + ',' + "NULL" + ',' + "NULL" + ',' + star_name + ',' + SP_eccentricity + ',' +"NULL"+ ',' + "NULL";
        console.log(values);
        try {
        await appService.insertTuple('Planet_Densities', otherValues);
        await appService.insertTuple('Planet', values);
        await appService.insertTuple('OrbitingPlanet', values2);
        res.send('Orbiting planet inserted');
    } catch (err) {
        console.error('Error inserting orbiting planet:', err);
        res.status(500).send('Error inserting orbiting planet');
    }
});

router.post("/insert_Star", async (req, res) => {
    const {star_name, R2_star_name, luminosity, rotation_period, diameter, mass,
        orbital_eccentricity, orbital_period, distance_to_companion, black_hole_name} = req.body;
        console.log(star_name, R2_star_name, luminosity, rotation_period, diameter, mass,
            orbital_eccentricity, orbital_period, distance_to_companion, black_hole_name)
        try {
            await appService.insert_Star(star_name, R2_star_name, luminosity, rotation_period, diameter, mass,
                orbital_eccentricity, orbital_period, distance_to_companion, black_hole_name);
            res.send('Star inserted');
        } catch (err) {
            console.error('Error inserting star:', err);
            res.status(500).send('Error inserting star');
    }
});

router.post("/delete_Star", async (req, res) => {
    const {star_name, black_hole_name} = req.body;
    try {
        await appService.delete_Star(star_name, black_hole_name);
        res.send('Star deleted');
    } catch (err) {
        console.error('Error deleting star:', err);
        res.status(500).send('Error deleting star');
    }
});

router.post("/countBHstars", async (req, res) => {
    const {black_hole_name} = req.body;
    try {
        const values = await appService.aggregate_db("BlackHole, Star", "COUNT","DISTINCT star_name","",null,"BlackHole.black_hole_name = '" + black_hole_name + "' AND BlackHole.black_hole_name = Star.black_hole_name");
        const count = values[0][0];
        console.log(count);
        res.json({ count });
    } catch (err) {
        console.error('Error counting stars:', err);
        res.status(500).send('Error counting stars');
    }

});

router.get('/getStarWithPlanets', async (req, res) => {
    // given a star, return that star with its planets using outer join
    /* Example return:
    [
        [
            "Alpha Centauri A",
            1227000000,
            2.187e+30,
            "Earth",
            365.25,
            "Sun"
        ]
    ]
    attributes:
    Star name, star diameter, star mass, planet_name, planet orbital_period, R2_star_name
    */
    const {star_name} = req.query;
    try {
        const starData = await appService.getStarWithPlanets(star_name);
        console.log('Received star data:', starData);
        if (starData && starData.length > 0) {
            res.json(starData);
        } else {
            console.log('No data found for the specified star.');
        }
    } catch (err) {
        console.log('Error retrieving star and planet data');
    }
});

router.get('/getPlanet', async (req, res) => {
    // Given a planet name, return all its data and the celestial body it orbits
    /*
    Example return:
    [
        [
            "Earth",
            12742,
            5.972e+24,
            0.93,
            "Radial Velocity",
            24,
            "Alpha Centauri A",
            null,
            null,
            "Moon"
        ]
    ]
    attributes:
    planet_name, equatorial_diameter, mass, ESI, discovery_method, rotation_period,
    star_name, white_dwarf_name, neutron_star_name, moon_name
    In this example, Earth is orbiting the sun Alpha Centauri A, and has moon named Moon.
    */
    const {planet_name} = req.query;
    try {
        const planetData = await appService.getPlanet(planet_name);
        console.log('Received planet data:', planetData);
        if (planetData && planetData.length > 0) {
            res.json(planetData);
        } else {
            console.log('No data found for the specified planet.');
            res.status(404).send('No data found for the specified planet.');
        }
    } catch (err) {
        console.log('Error retrieving planet data:', err);
        res.status(500).send('An error occurred while retrieving planet data.');
    }
});

router.get('/starPlanetCount', async (req, res) => {
    /*
    Example return:
    [
        ["Alpha Centauri B", 3],
        ["Sun", 7],
    ]
    Attributes:  star_name,  number of planets
    */
    const min = parseInt(req.query.min, 10);
    try {
        const starData = await appService.starPlanetCount(min);
        console.log('Received star data:', starData);
        if (starData && starData.length > 0) {
            res.json(starData);
        } else {
            res.status(404).send('No stars found with more than the specified number of planets.');
        }
    } catch (err) {
        console.error('Error retrieving star and planet count:', err);
        res.status(500).send('An error occurred while retrieving star data.');
    }
});

router.post('/findAsteroidStar', async (req, res) => {
    try {
        const star = await appService.divide_db("Star", "Asteroid", "star_name", "star_name", "star_name")
        return res.json({star});
    }
     catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('An error occurred while retrieving data.');
}
});


router.get('/selectFromDB', async (req, res) => {

    /*
    PROJECTION and SELECTION
    4 inputs:
    table: string  example: "Star"
    colums: string          "star_name, mass"
    query: string, optional "star_name"
    params: array,          ["Sun"]
    */
    const { table, columns, query, params } = req.query;

    try {
        if (!table || !columns) {
            return res.status(400).send('Table and columns parameters are required.');
        }

        const paramsArray = params ? JSON.parse(params) : [];
        const result = await appService.select_From_db(table, columns, query, paramsArray);
        console.log('Query result:', result);
        if (result && result.length > 0) {
            res.json(result);
        } else {
            res.status(404).send('No data found for the specified query.');
        }
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send('An error occurred while retrieving data.');
    }
});


router.get('/blackholeAvgDiameter', async (req, res) => {
    // get average diameter, group by mass, only for those mass are greater than the given mass
    // minMass: string,   minimum mass of blackholes queried
    // example return:
    /*
    [
    [25,35],
    [30,65]
    ]
    Attributes: mass, avg_diameter
    */
    const {minMass} = req.query;
    if (!minMass || isNaN(minMass)) {
        return res.status(400).send('Invalid or missing minMass parameter.');
    }
    try {
        const result = await appService.blackhole_AVG_diameter(parseFloat(minMass));
        if (result && result.length > 0) {
            res.json(result);
        } else {
            res.status(404).send('No data found for the specified mass.');
        }
    } catch (err) {
        console.error('Error retrieving black hole average diameter:', err);
    }
});

router.post('/updateStar', async (req, res) => {  // Change to POST
    const { star_name, R2_star_name, luminosity, rotation_period, diameter, mass,
        orbital_eccentricity, orbital_period, distance_to_companion, black_hole_name } = req.body;  // Use req.body
    try {
        await appService.update_Star(star_name, R2_star_name, luminosity, rotation_period, diameter, mass,
            orbital_eccentricity, orbital_period, distance_to_companion, black_hole_name);
        res.send('Star updated');
    } catch (err) {
        console.error('Error updating star:', err);
        res.status(500).send('An error occurred while updating star.');
    }
});



module.exports = router;