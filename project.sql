drop table ASTEROID cascade constraints;
drop table BLACKHOLE cascade constraints;
drop table BLACKHOLE_DIAMETER cascade constraints;
drop table FREEFLOATINGPLANET cascade constraints;
drop table MAINSEQUENCESTAR cascade constraints;
drop table MOON cascade constraints;
drop table NEUTRONSTAR cascade constraints;
drop table NEUTRONSTAR_DENSITY_ESCAPEVELOCITY cascade constraints;
drop table ORBITINGPLANET cascade constraints;
drop table PLANET cascade constraints;
drop table PLANET_DENSITIES cascade constraints;
drop table REDGIANT cascade constraints;
drop table STAR cascade constraints;
drop table WHITEDWARF cascade constraints;

CREATE TABLE Planet_Densities (
equatorial_diameter FLOAT,
mass FLOAT,
density FLOAT,
PRIMARY KEY (equatorial_diameter, mass)
);

CREATE TABLE Planet (
planet_name VARCHAR(100),
equatorial_diameter FLOAT,
mass FLOAT,
ESI FLOAT,
discovery_method VARCHAR(100),
rotation_period FLOAT,
PRIMARY KEY (planet_name),
FOREIGN KEY (equatorial_diameter, mass) REFERENCES Planet_Densities(equatorial_diameter,
mass)
);

CREATE TABLE BlackHole_Diameter (
mass FLOAT,
rotation_period FLOAT,
diameter FLOAT,
PRIMARY KEY (mass, rotation_period)
);

CREATE TABLE BlackHole (
black_hole_name VARCHAR(100) PRIMARY KEY,
mass FLOAT,
rotation_period FLOAT,
FOREIGN KEY (mass, rotation_period) REFERENCES BlackHole_Diameter(mass, rotation_period)
);

CREATE TABLE Star (
star_name VARCHAR(100) PRIMARY KEY,
R2_star_name VARCHAR(100) UNIQUE,
luminosity FLOAT,
rotation_period FLOAT,
diameter FLOAT,
mass FLOAT,
orbital_eccentricity FLOAT,
orbital_period FLOAT,
distance_to_companion FLOAT,
black_hole_name VARCHAR(100),
FOREIGN KEY (black_hole_name) REFERENCES BlackHole(black_hole_name),
FOREIGN KEY (R2_star_name) REFERENCES Star(star_name)
);

CREATE TABLE WhiteDwarf (
white_dwarf_name VARCHAR(100) PRIMARY KEY,
rotation_period FLOAT,
luminosity FLOAT,
mass FLOAT,
diameter FLOAT,
density FLOAT,
metallicity FLOAT,
star_name VARCHAR(100) UNIQUE,
FOREIGN KEY (star_name) REFERENCES Star(star_name)
);

CREATE TABLE NeutronStar_Density_EscapeVelocity (
mass FLOAT,
diameter FLOAT,
density FLOAT,
escape_velocity FLOAT,
PRIMARY KEY (mass, diameter)
);

CREATE TABLE NeutronStar (
neutron_star_name VARCHAR(100) PRIMARY KEY,
luminosity FLOAT,
rotation_period FLOAT,
mass FLOAT,
diameter FLOAT,
star_name VARCHAR(100),
FOREIGN KEY (mass, diameter) REFERENCES NeutronStar_Density_EscapeVelocity(mass, diameter),
FOREIGN KEY (star_name) REFERENCES Star(star_name)
);


CREATE TABLE Moon (
moon_name VARCHAR(100) PRIMARY KEY,
planet_name VARCHAR(100) NOT NULL,
distance_to_planet FLOAT NOT NULL,
ESI FLOAT,
mass FLOAT,
PM_eccentricity FLOAT,
rotation_period FLOAT,
FOREIGN KEY (planet_name) REFERENCES Planet(planet_name)
);

CREATE TABLE OrbitingPlanet (
planet_name VARCHAR(100) PRIMARY KEY,
orbital_period FLOAT,
distance_to_centre FLOAT,
white_dwarf_name VARCHAR(100),
WDP_eccentricity FLOAT,
star_name VARCHAR(100),
SP_eccentricity FLOAT,
neutron_star_name VARCHAR(100),
NSP_eccentricity FLOAT,
FOREIGN KEY (planet_name) REFERENCES Planet(planet_name),
FOREIGN KEY (white_dwarf_name) REFERENCES WhiteDwarf(white_dwarf_name),
FOREIGN KEY (star_name) REFERENCES Star(star_name),
FOREIGN KEY (neutron_star_name) REFERENCES NeutronStar(neutron_star_name)
);


CREATE TABLE FreeFloatingPlanet (
planet_name VARCHAR(100) PRIMARY KEY,
proper_motion FLOAT,
FOREIGN KEY (planet_name) REFERENCES Planet(planet_name)
);

CREATE TABLE MainSequenceStar (
star_name VARCHAR(100) PRIMARY KEY,
class VARCHAR(100),
FOREIGN KEY (star_name) REFERENCES Star(star_name)
);

CREATE TABLE RedGiant (
star_name VARCHAR(100) PRIMARY KEY,
pulsation_period FLOAT,
FOREIGN KEY (star_name) REFERENCES Star(star_name)
);

CREATE TABLE Asteroid (
asteroid_name VARCHAR(100) PRIMARY KEY,
orbital_period FLOAT,
diameter FLOAT,
mass FLOAT,
star_name VARCHAR(100),
AS_eccentricity FLOAT,
planet_name VARCHAR(100),
FOREIGN KEY (star_name) REFERENCES Star(star_name),
FOREIGN KEY (planet_name) REFERENCES OrbitingPlanet(planet_name)
);



-- Planet_Densities
INSERT INTO Planet_Densities VALUES (12742, 5.972e24, 5514);
INSERT INTO Planet_Densities VALUES (6792, 6.39e23, 3933);
INSERT INTO Planet_Densities VALUES (142984, 1.898e27, 1326);
INSERT INTO Planet_Densities VALUES (120536, 5.683e26, 687);
INSERT INTO Planet_Densities VALUES (51118, 8.681e25, 1271);
INSERT INTO Planet_Densities VALUES (49528, 1.024e26, 1638);
INSERT INTO Planet_Densities VALUES (2370, 1.3e22, 2100);
INSERT INTO Planet_Densities VALUES (3475, 7.35e22, 3340);
INSERT INTO Planet_Densities VALUES (4900, 4.8e22, 3010);
INSERT INTO Planet_Densities VALUES (139822, 1.898e27, 1326);
INSERT INTO Planet_Densities VALUES (4800, 1.08e23, 2900);

-- Planet
INSERT INTO Planet VALUES ('Earth', 12742, 5.972e24, 0.93, 'Radial Velocity', 24.0);
INSERT INTO Planet VALUES ('Mars', 6792, 6.39e23, 0.64, 'Transit', 24.6);
INSERT INTO Planet VALUES ('Jupiter', 142984, 1.898e27, 0.81, 'Direct Imaging', 9.9);
INSERT INTO Planet VALUES ('Saturn', 120536, 5.683e26, 0.73, 'Microlensing', 10.7);
INSERT INTO Planet VALUES ('Uranus', 51118, 8.681e25, 0.61, 'Transit', 17.2);
INSERT INTO Planet VALUES ('Neptune', 49528, 1.024e26, 0.65, 'Astrometry', 16.1);
INSERT INTO Planet VALUES ('Pluto', 2370, 1.3e22, 0.57, 'Occultation', 153.3);
INSERT INTO Planet VALUES ('Moon', 3475, 7.35e22, 0.91, 'Radar', 27.3);
INSERT INTO Planet VALUES ('Europa', 4900, 4.8e22, 0.9, 'Flyby', 3.55);
INSERT INTO Planet VALUES ('Ganymede', 139822, 1.898e27, 0.92, 'Flyby', 7.15);
INSERT INTO Planet VALUES ('Poltergeist', 4800, 1.08e23, 0.89, 'Flyby', 16.69);

-- BlackHole_Diameter
INSERT INTO BlackHole_Diameter VALUES (10.0, 0.5, 60);
INSERT INTO BlackHole_Diameter VALUES (15.0, 0.4, 45);
INSERT INTO BlackHole_Diameter VALUES (12.0, 0.6, 50);
INSERT INTO BlackHole_Diameter VALUES (20.0, 0.3, 40);
INSERT INTO BlackHole_Diameter VALUES (8.0, 0.7, 70);
INSERT INTO BlackHole_Diameter VALUES (25.0, 0.2, 35);
INSERT INTO BlackHole_Diameter VALUES (30.0, 0.8, 65);
INSERT INTO BlackHole_Diameter VALUES (18.0, 0.4, 48);
INSERT INTO BlackHole_Diameter VALUES (22.0, 0.5, 55);
INSERT INTO BlackHole_Diameter VALUES (11.0, 0.6, 52);

-- BlackHole
INSERT INTO BlackHole VALUES ('Cygnus X-1', 10.0, 0.5);
INSERT INTO BlackHole VALUES ('Sagittarius A*', 15.0, 0.4);
INSERT INTO BlackHole VALUES ('V404 Cygni', 12.0, 0.6);
INSERT INTO BlackHole VALUES ('M87*', 20.0, 0.3);
INSERT INTO BlackHole VALUES ('A0620-00', 8.0, 0.7);
INSERT INTO BlackHole VALUES ('GRO J1655-40', 25.0, 0.2);
INSERT INTO BlackHole VALUES ('GS 1124-683', 30.0, 0.8);
INSERT INTO BlackHole VALUES ('GRS 1915+105', 18.0, 0.4);
INSERT INTO BlackHole VALUES ('LMC X-1', 22.0, 0.5);
INSERT INTO BlackHole VALUES ('XTE J1118+480', 11.0, 0.6);

-- Star
INSERT INTO Star VALUES ('Sun', NULL, 3.846e26, 25.05, 1.3914e9, 1.989e30, NULL, NULL, NULL, NULL);
INSERT INTO Star VALUES ('Alpha Centauri A', NULL, 1.519e26, 22, 1.227e9, 2.187e30, 0.0, 79.91, 23.5e6, 'Cygnus X-1');
INSERT INTO Star VALUES ('Alpha Centauri B', NULL, 1.519e26, 22, 1.227e9, 2.187e30, 0.0, 79.91, 23.5e6, 'Sagittarius A*');
INSERT INTO Star VALUES ('Betelgeuse', NULL, 1.26e31, 8.4, 8.6e8, 1.76e31, 0.0, 233.75, 548.7e6, 'V404 Cygni');
INSERT INTO Star VALUES ('Sirius A', NULL, 2.364e27, 5.5, 2.062e9, 3.978e30, 0.0, 365.25, 8.6e6, 'M87*');
INSERT INTO Star VALUES ('Procyon A', NULL, 6.93e26, 23.1, 2.048e9, 3.5e30, 0.0, 365.25, 11.4e6, 'A0620-00');
INSERT INTO Star VALUES ('Rigel', NULL, 2.645e30, 10, 7.8e8, 3.978e30, 0.0, 360, 4.7e8, 'GRO J1655-40');
INSERT INTO Star VALUES ('Vega', NULL, 5.45e27, 12.5, 2.362e9, 2.135e30, 0.0, 200, 7.7e7, 'GS 1124-683');
INSERT INTO Star VALUES ('Altair', NULL, 1.47e27, 9.9, 1.88e9, 2.135e30, 0.0, 150, 9.3e8, 'GRS 1915+105');
INSERT INTO Star VALUES ('Polaris', NULL, 4.2e27, 30, 3.8e9, 4.026e30, 0.0, 400, 3.6e8, 'LMC X-1');
INSERT INTO Star VALUES ('Deneb', NULL, 5.1e28, 18, 2.3e9, 5.026e30, 0.0, 365, 1.8e8, 'XTE J1118+480');
INSERT INTO Star VALUES ('Antares',NULL, 643, 44.2e6, 1.16e31,  0.267, NULL, NULL, NULL, 'Sagittarius A*');
INSERT INTO Star VALUES ('Arcturus',   NULL, 170, 35.3e6, 1.1e30, 0.267, NULL, NULL, NULL, 'Sagittarius A*');
INSERT INTO Star VALUES ('Aldebaran',  NULL, 643, 44.2e6, 1.16e31, 0.267, NULL, NULL, NULL, 'Sagittarius A*');
INSERT INTO Star VALUES ('Pollux',  NULL, 590, 8.8e6, 1.9e30, NULL, 0.267, NULL, NULL, 'Sagittarius A*');
INSERT INTO Star VALUES ('Gamma Cassiopeiae', NULL, 20000, 78.9e6, 18e30, 0.267, NULL, NULL, NULL, 'Sagittarius A*');
INSERT INTO Star VALUES ('Delta Scorpii', NULL, 560, 8e6, 15e30, 0.267, NULL, NULL, NULL, 'Sagittarius A*');
INSERT INTO Star VALUES ('Mu Cephei',    NULL, 850, 1.42e9, 19e30, 0.267, NULL, NULL, NULL, 'Sagittarius A*');
INSERT INTO Star VALUES ('Nu Scorpii',  NULL, 400, 6.6e6, 14e30, 0.267, NULL, NULL, NULL, 'Sagittarius A*');
INSERT INTO Star VALUES ('Rho Cassiopeiae', NULL, 600, 1.37e9, 40e30, 0.267, NULL, NULL, NULL, 'Sagittarius A*');


UPDATE Star
SET R2_STAR_NAME = 'Alpha Centauri A'
WHERE STAR_NAME = 'Alpha Centauri B';

UPDATE Star
SET R2_STAR_NAME = 'Alpha Centauri B'
WHERE STAR_NAME = 'Alpha Centauri A';

UPDATE Star
SET R2_STAR_NAME = 'Betelgeuse'
WHERE STAR_NAME = 'Rigel';

UPDATE Star
SET R2_STAR_NAME = 'Rigel'
WHERE STAR_NAME = 'Betelgeuse';

UPDATE Star
SET R2_STAR_NAME = 'Altair'
WHERE STAR_NAME = 'Vega';
UPDATE Star
SET R2_STAR_NAME = 'Vega'
WHERE STAR_NAME = 'Altair';
UPDATE Star
SET R2_STAR_NAME = 'Deneb'
WHERE STAR_NAME = 'Polaris';
UPDATE Star
SET R2_STAR_NAME = 'Polaris'
WHERE STAR_NAME = 'Deneb';

-- WhiteDwarf
INSERT INTO WhiteDwarf VALUES ('Sirius B', 1.4, 0.056, 1.02e30, 1.22e4, 2.9e9, 0.001, 'Sirius A');
INSERT INTO WhiteDwarf VALUES ('Procyon B', 0.4, 0.0005, 0.6e30, 1.8e4, 8.0e6, 0.002, 'Procyon A');
INSERT INTO WhiteDwarf VALUES ('Altair B', 0.9, 0.001, 1.4e30, 1.7e4, 1.3e9, 0.003, 'Altair');
INSERT INTO WhiteDwarf VALUES ('Vega B', 0.7, 0.002, 0.9e30, 1.6e4, 3.1e9, 0.002, 'Vega');
INSERT INTO WhiteDwarf VALUES ('Epsilon Eridani B', 0.8, 0.004, 1.0e30, 1.6e4, 2.5e9, 0.003, NULL);
INSERT INTO WhiteDwarf VALUES ('Alpha Centauri B', 0.6, 0.003, 0.7e30, 1.5e4, 3.0e9, 0.001, 'Alpha Centauri A');
INSERT INTO WhiteDwarf VALUES ('Beta Cancri B', 1.1, 0.002, 1.2e30, 1.4e4, 3.0e9, 0.002, NULL);
INSERT INTO WhiteDwarf VALUES ('Zeta Reticuli B', 0.7, 0.003, 0.8e30, 1.3e4, 2.8e9, 0.002, NULL);
INSERT INTO WhiteDwarf VALUES ('Tau Ceti B', 1.2, 0.005, 1.3e30, 1.7e4, 3.2e9, 0.003, NULL);

-- NeutronStar_Density_EscapeVelocity
INSERT INTO NeutronStar_Density_EscapeVelocity VALUES (1.4, 20, 4.5e17, 100000);
INSERT INTO NeutronStar_Density_EscapeVelocity VALUES (2.0, 15, 6.0e17, 150000);
INSERT INTO NeutronStar_Density_EscapeVelocity VALUES (1.7, 18, 5.0e17, 120000);
INSERT INTO NeutronStar_Density_EscapeVelocity VALUES (1.9, 16, 5.8e17, 140000);
INSERT INTO NeutronStar_Density_EscapeVelocity VALUES (1.5, 19, 4.7e17, 110000);
INSERT INTO NeutronStar_Density_EscapeVelocity VALUES (1.8, 17, 5.6e17, 130000);
INSERT INTO NeutronStar_Density_EscapeVelocity VALUES (2.2, 14, 6.2e17, 160000);
INSERT INTO NeutronStar_Density_EscapeVelocity VALUES (1.6, 19, 4.9e17, 115000);
INSERT INTO NeutronStar_Density_EscapeVelocity VALUES (2.1, 13, 6.1e17, 155000);
INSERT INTO NeutronStar_Density_EscapeVelocity VALUES (1.3, 21, 4.4e17, 95000);

-- NeutronStar
INSERT INTO NeutronStar VALUES ('Pulsar A', 1.0e27, 0.033, 1.4, 20, 'Alpha Centauri A');
INSERT INTO NeutronStar VALUES ('Pulsar B', 5.0e26, 0.044, 2.0, 15, 'Alpha Centauri B');
INSERT INTO NeutronStar VALUES ('Pulsar C', 3.0e27, 0.025, 1.7, 18, 'Betelgeuse');
INSERT INTO NeutronStar VALUES ('Pulsar D', 2.5e26, 0.048, 1.9, 16, 'Procyon A');
INSERT INTO NeutronStar VALUES ('Pulsar E', 4.0e27, 0.030, 1.5, 19, 'Sirius A');
INSERT INTO NeutronStar VALUES ('Pulsar F', 2.8e27, 0.036, 1.8, 17, 'Rigel');
INSERT INTO NeutronStar VALUES ('Pulsar G', 1.9e27, 0.042, 2.2, 14, 'Vega');
INSERT INTO NeutronStar VALUES ('Pulsar H', 3.5e27, 0.038, 1.6, 19, 'Altair');
INSERT INTO NeutronStar VALUES ('Pulsar I', 2.7e27, 0.034, 2.1, 13, 'Polaris');
INSERT INTO NeutronStar VALUES ('Pulsar J', 1.2e27, 0.040, 1.3, 21, 'Deneb');


-- Moon
INSERT INTO Moon VALUES ('Moon', 'Earth', 384400, 0.56, 7.35e22, 0.0549, 27.3);
INSERT INTO Moon VALUES ('Phobos', 'Mars', 9377, 0.1, 1.08e16, 0.015, 0.32);
INSERT INTO Moon VALUES ('Deimos', 'Mars', 23460, 0.03, 1.48e15, 0.0005, 1.26);
INSERT INTO Moon VALUES ('Io', 'Jupiter', 421800, 0.58, 4.15e22, 0.0041, 1.77);
INSERT INTO Moon VALUES ('Europa', 'Jupiter', 670900, 0.67, 4.80e22, 0.0094, 3.55);
INSERT INTO Moon VALUES ('Ganymede', 'Jupiter', 1070400, 0.62, 1.48e23, 0.0013, 7.15);
INSERT INTO Moon VALUES ('Callisto', 'Jupiter', 1882700, 0.55, 1.08e23, 0.0074, 16.69);
INSERT INTO Moon VALUES ('Titan', 'Saturn', 1221870, 0.62, 1.35e23, 0.028, 15.9);
INSERT INTO Moon VALUES ('Rhea', 'Saturn', 527580, 0.3, 2.31e21, 0.027, 4.5);
INSERT INTO Moon VALUES ('Iapetus', 'Saturn', 3560820, 0.3, 1.81e21, 0.028, 79.3);

-- OrbitingPlanet


INSERT INTO OrbitingPlanet VALUES ('Earth', 365.25, 1.496e11, 'Sirius B', 0.01, 'Alpha Centauri A', 0.015, NULL, NULL);

INSERT INTO OrbitingPlanet VALUES ('Mars', 687.0, 2.279e11, 'Procyon B', 0.02, 'Alpha Centauri B', 0.014, NULL, NULL);

INSERT INTO OrbitingPlanet VALUES ('Jupiter', 4332.59, 7.783e11, 'Altair B', 0.05, 'Sirius A', 0.017, NULL, NULL);

INSERT INTO OrbitingPlanet VALUES ('Saturn', 10759.22, 1.429e12, 'Vega B', 0.03, 'Vega', 0.013, NULL, NULL);

INSERT INTO OrbitingPlanet VALUES ('Uranus', 30687.15, 2.871e12, 'Epsilon Eridani B', 0.02, 'Altair', 0.016, NULL, NULL);

INSERT INTO OrbitingPlanet VALUES ('Neptune', 60190.03, 4.495e12, 'Alpha Centauri B', 0.01, 'Polaris', 0.014, NULL, NULL);

INSERT INTO OrbitingPlanet VALUES ('Pluto', 90560.0, 5.906e12, 'Beta Cancri B', 0.05, 'Deneb', 0.018, NULL, NULL);

INSERT INTO OrbitingPlanet VALUES ('Poltergeist', 27.3, 3.844e8, NULL, NULL,  NULL, NULL, 'Pulsar B', 0.014);



-- Planet_Densities
INSERT INTO Planet_Densities VALUES (10500, 6.2e24, 5700);
INSERT INTO Planet_Densities VALUES (9200, 4.0e23, 4300);
INSERT INTO Planet_Densities VALUES (150000, 2.5e27, 1350);
INSERT INTO Planet_Densities VALUES (88000, 1.1e26, 1250);
INSERT INTO Planet_Densities VALUES (62000, 8.5e25, 1400);


-- Planet
INSERT INTO Planet VALUES ('Gorgona', 10500, 6.2e24, 0.80, 'Transit', 28.5);
INSERT INTO Planet VALUES ('Zircon', 9200, 4.0e23, 0.72, 'Direct Imaging', 30.1);
INSERT INTO Planet VALUES ('Orionis', 150000, 2.5e27, 0.85, 'Microlensing', 12.3);
INSERT INTO Planet VALUES ('Aether', 88000, 1.1e26, 0.78, 'Astrometry', 15.4);
INSERT INTO Planet VALUES ('Novae', 62000, 8.5e25, 0.76, 'Occultation', 20.9);


-- FreeFloatingPlanet
INSERT INTO FreeFloatingPlanet VALUES ('Gorgona', 0.0036);
INSERT INTO FreeFloatingPlanet VALUES ('Zircon', 0.0042);
INSERT INTO FreeFloatingPlanet VALUES ('Orionis', 0.0027);
INSERT INTO FreeFloatingPlanet VALUES ('Aether', 0.0038);
INSERT INTO FreeFloatingPlanet VALUES ('Novae', 0.0031);

-- MainSequenceStar
INSERT INTO MainSequenceStar VALUES ('Alpha Centauri A', 'G2V');
INSERT INTO MainSequenceStar VALUES ('Sirius A', 'A1V');
INSERT INTO MainSequenceStar VALUES ('Procyon A', 'F5IV-V');
INSERT INTO MainSequenceStar VALUES ('Vega', 'A0V');
INSERT INTO MainSequenceStar VALUES ('Altair', 'A7V');

-- RedGiant
INSERT INTO RedGiant VALUES ('Betelgeuse', 400);
INSERT INTO RedGiant VALUES ('Antares', 1730);
INSERT INTO RedGiant VALUES ('Arcturus', 271);
INSERT INTO RedGiant VALUES ('Aldebaran', 645);
INSERT INTO RedGiant VALUES ('Pollux', 590);
INSERT INTO RedGiant VALUES ('Gamma Cassiopeiae', 350);
INSERT INTO RedGiant VALUES ('Delta Scorpii', 560);
INSERT INTO RedGiant VALUES ('Mu Cephei', 850);
INSERT INTO RedGiant VALUES ('Nu Scorpii', 400);
INSERT INTO RedGiant VALUES ('Rho Cassiopeiae', 600);

-- Asteroid
INSERT INTO Asteroid VALUES ('Ceres', 1680, 946, 9.3835e20, 'Sun', 0.075, NULL);
INSERT INTO Asteroid VALUES ('Pallas', 1685, 512, 2.04e20, 'Sun', 0.23, 'Mars');
INSERT INTO Asteroid VALUES ('Vesta', 1325, 525, 2.59e20, 'Sun', 0.089, 'Saturn');
INSERT INTO Asteroid VALUES ('Hygiea', 2035, 431, 8.67e19, 'Sun', 0.117, 'Saturn');
INSERT INTO Asteroid VALUES ('Euphrosyne', 1735, 282, 6.6e19, 'Sun', 0.21, NULL);
INSERT INTO Asteroid VALUES ('Juno', 1730, 258, 5.59e19, 'Sun', 0.097, 'Earth');
INSERT INTO Asteroid VALUES ('Eros', 1.76, 16.8, 6.69e18, 'Sun', 0.22, 'Mars');
INSERT INTO Asteroid VALUES ('Psyche', 1500, 226, 4.1e19, 'Sun', 0.11, 'Saturn');
INSERT INTO Asteroid VALUES ('Hebe', 5.14, 0.4, 8.2e18, 'Sun', 0.08, 'Saturn');

COMMIT;
