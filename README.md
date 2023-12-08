# AI-Model-Training-Deployment-Genome-Sequencing_Girlgenius

## Aim
To develop and deploy an AI/ML model/web app that is capable of accurately predicting from which location a particular sequence originated or spread from.​

## Getting Started
### Prerequisites

Make sure you have the following software installed on your local machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/) (only if you want to run the application locally without Docker)

### Running the Application with Docker

These instructions will help you run the application using Docker. If you prefer to run it locally, please skip to the "Local Development" section.

- Clone this directory and move to its root using `cd AI-Model-Training-Deployment-Genome-Sequencing_Girlgenius/`
- Run `cd Frontend/`
- Build the Docker images for the frontend and backend by running `docker-compose build`
- After the images are successfully built, you can run the application using `docker-compose up`
- Docker Compose will start the frontend and backend containers, and the application will be accessible at the following URL: [http://localhost:3000](http://localhost:3000)
- To stop the application and shut down the containers, press `Ctrl + C` in the terminal where Docker Compose is running.

Note - Running Docker with `sudo` can be necessary if your user doesn't have the necessary permissions to interact with Docker.

## Local Development 

If you want to run the application locally without Docker for development purposes:

- Clone this directory and move to its root using `cd AI-Model-Training-Deployment-Genome-Sequencing_Girlgenius/` 
- Run `cd Frontend/`
- Run `npm install` to install all the dependencies to run the application.
- Then run `npm start` to run the app in the development mode.
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory `cd AI-Model-Training-Deployment-Genome-Sequencing_Girlgenius/Frontend/`, you can run:

#### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

