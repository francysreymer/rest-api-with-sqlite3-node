# RESTful API for min and max award intervals 

An application using Node.js, TypeScript, and SQLite3.

## Introduction

This RESTful API allows you to read the list of nominees and winners in the Worst Picture category of the Golden Raspberry Awards.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

### Prerequisites

- [npm](https://www.npmjs.com/)

### Setup

1. **Clone the repository:**

    ```bash
    git clone git@github.com:francysreymer/rest-api-with-sqlite3-node.git
    cd rest-api-with-sqlite3-node
    ```

2. **Configure the environment variables:**

    Inside the project folder, copy the `.env.example` file and rename it to `.env`. Set the `PORT` variable to the desired port number, or leave it blank to use the default port 3000.

3. **Place a CSV file named `movielist.csv` inside the `/temp` folder.**

4. **Install dependencies and start the server:**

    ```bash
    npm install
    npm start
    ```

5. **Run the tests:**

    ```bash
    npm test
    ```

## Usage

- **API Endpoint:** Accessible at [http://localhost:3000/api/movies/producers/award-intervals](http://localhost:3000/api/movies/producers/award-intervals).