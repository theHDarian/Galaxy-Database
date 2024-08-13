# CPSC304 Project: Astronomy Simulator

## Code Reference
Referencing code in Tutorial2 for js/Node.js.
## Overview

This project focuses on tracking data of celestial bodies like stars, planets, and moons. It models star and planetary systems with real-world statistics and provides simple visualizations for educational purposes.
# Project Setup Guide

Follow these steps to set up and run the project.

## Prerequisites

- Ensure you have access to the UBC server with your CWL ID and password.
- Make sure you have the project files and the `project.sql` file.

## Steps to Run the Project

### 0. Update the `.env` File

- Open the `.env` file in the project directory.
- Change the database name and password to match your credentials. The password format should be `aStudentID` (e.g., `a12345678`).

### 1. Load `project.sql` File to Server

- Use SCP to transfer the `project.sql` file to the server:
  ```sh
  scp project.sql cwl@remote.students.cs.ubc.ca
  ```

### 2. Log in to the Server

- Use SSH to log in to the server:
  ```sh
  ssh cwl_ID@remote.students.cs.ubc.ca
  ```

### 3. Log in to Oracle

- Access Oracle using SQL*Plus:
  ```sh
  sqlplus ora_cwl_ID@stu
  ```

### 4. Run the SQL File

- Execute the SQL script:
  ```sh
  start project.sql
  ```

### 5. Enter the Project Directory on the Server

- Navigate to the project directory:
  ```sh
  cd ./project_f0q8k_g6d6m_q1p2n
  ```

### 6. Start the Server

- Run the server start script:
  ```sh
  sh remote-start.sh
  ```
  - Note the port number displayed in the message. For example:
    ```
    Updated ./.env with PORT=50016.
    Server running at http://localhost:60000/
    Connection pool started
    ```
    - Remember the port number (e.g., `60000`). If the message indicates that the port is already in use, edit `server.js` at line 10 to change the port number (e.g., `50000`).

### 7. Open a Local Terminal and Enter the Project Directory

- Navigate to the project directory on your local machine:
  ```sh
  cd ./project_f0q8k_g6d6m_q1p2n
  ```

### 8. Run the Server Tunnel Script

- Start the server tunnel:
  ```sh
  sh ./scripts/mac/server-tunnel.sh
  ```

### 9. Enter the Port Number

- When prompted, enter the port number you remembered from step 6.

  ```
  Enter your CWL name: 
  hfan05@remote.students.cs.ubc.ca's password: 
  ```

### 10. Access the Application

- Open your browser and navigate to:
  ```
  http://localhost:PORTNUM/
  ```

### 11. Interact with the Application

- After clicking the black hole, copy the black hole name and click the search button.
- Yellow stars will appear. Click on a yellow star to display additional information on the information board.


## Contributors


- **Muzhi Li**

- **Haocheng Fan**

- **Sky Huang**
