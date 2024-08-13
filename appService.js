const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};



// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function getBlackHoleNames() {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(`SELECT black_hole_name FROM BlackHole`);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function getStarNames(name) {
    let connection;

    try {
        console.log(`getStarNames: ${name}`);
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(`SELECT s.star_name FROM Star s WHERE s.black_hole_name = :name`,{ name : name});
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

// API functions that help user to find the attributes of black hole with a given name
async function getBlackHoleDetails(name) {
    let connection;

    try {
//        console.log(`Fetching details for black hole: ${name}`);  // Log the parameter, for test
        connection = await oracledb.getConnection(dbConfig);
        // Run the SQL statement
        const result = await connection.execute(
            `SELECT black_hole_name, mass, rotation_period
             FROM BlackHole
             WHERE black_hole_name = :name`,
            { name: name }  // Correctly binding the parameter
        );

        // Log the full result set for debugging, for testing
//        console.log('Query result:', result);

        // Check if result.rows is not empty, for testing
//        if (result.rows.length === 0) {
//            console.log(`No black hole found with the name: ${name}`);
//            return null;
//        }

        // Assuming result.rows is an array of arrays where each array represents a row
        const blackholeData = result.rows[0];

        // Construct an object with meaningful keys from the row data
        const blackhole = {
            black_hole_name: blackholeData[0],
            mass: blackholeData[1],
            rotation_period: blackholeData[2]
        };

        return blackhole;

    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

// API functions that help user to find the attributes of black hole with a given name
async function getStarDetails(name) {
    let connection;

    try {
        console.log(`Fetching details for star: ${name}`);  // Log the parameter for debugging
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT *
             FROM Star
             WHERE star_name = :name`,
            { name: name }  // Correctly binding the parameter
        );

        console.log('Query result:', result);  // Log the full result set for debugging

        if (result.rows.length === 0) {
            console.log(`No star found with the name: ${name}`);  // Log if no star is found
            return null;
        }

        const starData = result.rows[0];
        const star = {
            star_name: starData[0],
            R2_star_name: starData[1],
            luminosity: starData[2],
            rotation_period: starData[3],
            diameter: starData[4],
            mass: starData[5],
            orbital_eccentricity: starData[6],
            orbital_period: starData[7],
            distance_to_companion: starData[8],
            black_hole_name: starData[9]
        };

        return star;

    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}


async function insertTuple(table, values) {
    // values must have the same length and order as the table attributes
    // insertTuple('BlackHole', 'Cygnus X-1, 10.0, 0.5')
    return await withOracleDB(async (connection) => {
        try {
            const placeholders = [];
            const valueArr = values.split(",");
            const convertedValues = [];

            for (let i = 0; i < valueArr.length; i++) {
                placeholders.push(`:${i + 1}`);

                const trimmedValue = valueArr[i].trim();
                const floatValue = parseFloat(trimmedValue);

                // Check if the value is 'NULL'
                if (trimmedValue === 'NULL' || trimmedValue === 'null') {
                    convertedValues.push(null);
                } else if (!isNaN(floatValue)) {
                    // Check if the value is a valid float
                    convertedValues.push(floatValue);
                } else {
                    convertedValues.push(trimmedValue);
                }
            }

            const sql = `INSERT INTO ${table} VALUES (${placeholders.join(', ')})`;
            console.log("SQL Query:", sql);
            console.log("Values:", convertedValues);

            const result = await connection.execute(sql, convertedValues, { autoCommit: true });
            console.log("Insert Result:", result);

            return result.rowsAffected > 0;
        } catch (err) {
            console.error('Error inserting tuple:', err);
            return false;
        }
    }).catch((err) => {
        console.error('Error with OracleDB connection:', err);
        return false;
    });
}



async function insert_Star(star_name, R2_star_name, luminosity, rotation_period, diameter, mass,
    orbital_eccentricity, orbital_period, distance_to_companion, black_hole_name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Star (star_name, R2_star_name, luminosity, rotation_period, diameter, mass, orbital_eccentricity, orbital_period, distance_to_companion, black_hole_name)
                VALUES (:star_name, :R2_star_name, :luminosity, :rotation_period, :diameter, :mass, :orbital_eccentricity, :orbital_period, :distance_to_companion, :black_hole_name)`,
            {
                star_name: star_name,
                R2_star_name: R2_star_name,
                luminosity: luminosity,
                rotation_period: rotation_period,
                diameter: diameter,
                mass: mass,
                orbital_eccentricity: orbital_eccentricity,
                orbital_period: orbital_period,
                distance_to_companion: distance_to_companion,
                black_hole_name: black_hole_name
            },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    });
}

async function delete_Star(star_name, black_hole_name) {
    return await withOracleDB(async (connection) => {
        if (black_hole_name != null) {
            const result = await connection.execute(
                `DELETE FROM Star WHERE star_name = :star_name AND black_hole_name = :black_hole_name`,
                {
                    star_name: star_name,
                    black_hole_name: black_hole_name
                },
                { autoCommit: true }
            );

            return result.rowsAffected && result.rowsAffected > 0;
        }
        const result = await connection.execute(
            `DELETE FROM Star WHERE star_name = :star_name`,
            {
                star_name: star_name,
            },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    });
}



async function aggregate_db(table, aggregate, key, columns, group, have) {
    return await withOracleDB(async (connection) => {
        if (columns != null && columns.trim() !=  ""){
            columns = ", " + columns;
        }
        else if (have == null && group == null) {
            const result = await connection.execute(`SELECT ${aggregate}(${key}) ${columns} FROM ${table}`);
            return result.rows;
        }
        else if (have == null) {
            const result = await connection.execute(`SELECT ${aggregate}(${key}) ${columns} FROM ${table} GROUP BY ${group}`);
            return result.rows;
        }
        else if (group == null) {
            const result = await connection.execute(`SELECT ${aggregate}(${key}) ${columns} FROM ${table} WHERE ${have}`);
            return result.rows;
        } else {
        const result = await connection.execute(`SELECT ${aggregate}(${key}) ${columns} FROM ${table} GROUP BY ${group} HAVING ${have}`);
        return result.rows;
        }
    });
}
// this functions perfroms an singular aggregation function in sql. table = comma seperated list of tables you want to join
//aggregate = one of the sql aggregate functions like count, max, avg etc
//colmuns = columns you want returned alongside the aggregate value
//group = column for group by
//have = conditions, need to word carefully for sql

 async function countBHStars(BHname) {
     const result = await connection.execute(`SELECT count(${key}) FROM ${table} WHERE ${have}`);
 }

async function getStarWithPlanets(star_name) {
    // given a star system, return star diameter and mass with its planets
    return await withOracleDB(async (connection) => {
        try {
            const sql = `
                SELECT s.star_name, s.diameter, s.mass, p.planet_name, p.orbital_period, s.R2_star_name
                FROM Star s
                LEFT OUTER JOIN OrbitingPlanet p
                ON s.star_name = p.star_name
                WHERE s.star_name = :star_name
            `;

            const result = await connection.execute(sql, [star_name]);
            return result.rows;
        } catch (err) {
            console.log(err);
            return false;
        }
    }).catch((err) => {
        console.log(err);
        return false;
    });
}

async function getPlanet(planet_name) {
    // given a planet name, return all its data and the star, white dwarf, or neutron star it orbits, and its moons
    return await withOracleDB(async (connection) => {
        try {
            const sql = `
                SELECT p.planet_name, p.equatorial_diameter, p.mass, p.ESI, p.discovery_method, p.rotation_period,
                       op.star_name, op.white_dwarf_name, op.neutron_star_name, m.moon_name
                FROM Planet p
                LEFT OUTER JOIN OrbitingPlanet op ON p.planet_name = op.planet_name
                LEFT OUTER JOIN Moon m ON p.planet_name = m.planet_name
                WHERE p.planet_name = :planet_name
            `;

            const result = await connection.execute(sql, [planet_name]);
            return result.rows;
        } catch (err) {
            console.log('Error retrieving planet data:', err);
            return false;
        }
    }).catch((err) => {
        console.log('Error connecting to the database:', err);
        return false;
    });
}


async function starPlanetCount(min) {
    // Given a minimum number of planets, return stars with more planets than the given minimum
    return await withOracleDB(async (connection) => {
        try {
            const sql = `
                SELECT s.star_name, COUNT(p.planet_name) AS planet_count
                FROM Star s
                JOIN OrbitingPlanet p ON s.star_name = p.star_name
                GROUP BY s.star_name
                HAVING COUNT(p.planet_name) > :min
            `;

            const result = await connection.execute(sql, [min]);
            return result.rows;
        } catch (err) {
            console.log('Error retrieving star and planet count:', err);
            return false;
        }
    }).catch((err) => {
        console.log('Error connecting to the database:', err);
        return false;
    });
}

async function select_From_db(table, columns, query = null, params = []) {
    // ('Asteroid', 'asteroid_name, mass', 'star_name, mass', ['Proxima Centauri', 1e20])
    return await withOracleDB(async (connection) => {
        let sql = `SELECT ${columns != null ? columns : '*'} FROM ${table}`;
        let binds = [];

        if (query) {
            // Build the WHERE clause
            const qarr = query.split(",");
            // qarr = ['star_name', 'mass']
            const placeholders = [];
            for (let index = 0; index < qarr.length; index++) {
                placeholders.push(`${qarr[index]} = :${index + 1}`);
            }
            // placeholders = ['star_name = :1', 'mass = :2']
            sql += ` WHERE ${placeholders.join(' AND ')}`;
            binds = params;
        }
        // sql = `SELECT asteroid_name, mass FROM Asteroid WHERE star_name = :1 AND mass = :2`
        // binds = ['Proxima Centauri', 1e20]
        const result = await connection.execute(sql, binds);
        return result.rows;
    }).catch((err) => {
        console.error('Error during query execution:', err);
        return false;
    });
}

async function divide_db(numerator, denominator, ncolumns, dcolumns, projection = null) {
    return await withOracleDB(async (connection) => {
        const query = `
            SELECT ${projection == null ? '*' : projection} 
            FROM ${numerator} sx
            WHERE NOT EXISTS (
                SELECT p.${dcolumns} 
                FROM ${denominator} p
                MINUS
                SELECT sp.${dcolumns} 
                FROM ${numerator} sp 
                WHERE sp.${ncolumns} = sx.${ncolumns}
            )
        `;
        const result = await connection.execute(query);
        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function blackhole_AVG_diameter(minMass) {
    // return the average diameter, only for those mass are greater than the given mass
    return await withOracleDB(async (connection) => {
        try {
            const sql = `
                SELECT mass, AVG(diameter) AS avg_diameter
                FROM (
                    SELECT bh.mass, bhd.diameter
                    FROM BlackHole bh
                    INNER JOIN BlackHole_Diameter bhd
                    ON bh.mass = bhd.mass AND bh.rotation_period = bhd.rotation_period
                    WHERE bh.mass > :minMass
                )
                GROUP BY mass
            `;
            const result = await connection.execute(sql, [minMass]);
            return result.rows;
        } catch (err) {
            console.error('Error executing query:', err);
            return false;
        }
    }).catch((err) => {
        console.error('Error connecting to the database:', err);
        return false;
    });
}

async function update_Star(star_name, R2_star_name, luminosity, rotation_period, diameter, mass, orbital_eccentricity, orbital_period, distance_to_companion, black_hole_name) {
    return await withOracleDB(async (connection) => {
        try {
            // Clear the R2_star_name field for any existing records that could cause conflict
            const clearSql = `UPDATE Star SET R2_star_name = NULL WHERE R2_star_name = :R2_star_name`;
            const clearResult = await connection.execute(clearSql, { R2_star_name: R2_star_name }, { autoCommit: true });
            console.log("Clear Result:", clearResult);

            // Update the chosen star and its companion
            const result = await connection.execute(
                `UPDATE Star SET R2_star_name = :R2_star_name, luminosity = :luminosity, rotation_period = :rotation_period, diameter = :diameter, mass = :mass, orbital_eccentricity = :orbital_eccentricity, orbital_period = :orbital_period, distance_to_companion = :distance_to_companion, black_hole_name = :black_hole_name 
                WHERE star_name = :star_name`,
                {
                    star_name: star_name,
                    R2_star_name: R2_star_name,
                    luminosity: luminosity,
                    rotation_period: rotation_period,
                    diameter: diameter,
                    mass: mass,
                    orbital_eccentricity: orbital_eccentricity,
                    orbital_period: orbital_period,
                    distance_to_companion: distance_to_companion,
                    black_hole_name: black_hole_name
                },
                { autoCommit: true }
            );

            const result2 = await connection.execute(
                `UPDATE Star SET R2_star_name = :star_name, distance_to_companion = :distance_to_companion  WHERE star_name = :R2_star_name`,
                {
                    star_name: star_name,
                    distance_to_companion: distance_to_companion,
                    R2_star_name: R2_star_name
                },
                { autoCommit: true }
            );

            console.log("Update Result:", result);
            console.log("Update Result for R2_star_name counterpart:", result2);

            return result.rowsAffected && result.rowsAffected > 0 && result2.rowsAffected && result2.rowsAffected > 0;
        } catch (err) {
            console.error('Error updating star:', err);
            return false;
        }
    });
}






module.exports = {
    getBlackHoleNames,
    getStarNames,
    getBlackHoleDetails,
    getStarDetails,
    insertTuple,
    insert_Star,
    aggregate_db,
    getStarWithPlanets,
    getPlanet,
    starPlanetCount,
    delete_Star,
    select_From_db,
    divide_db,
    blackhole_AVG_diameter,
    update_Star,
    countBHStars,
};