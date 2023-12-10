# AI-Model-Training-Deployment-Genome-Sequencing_Girlgenius

## Aim
To develop and deploy an AI/ML model/web app that is capable of accurately predicting from which location a particular sequence originated or spread from.​

## Getting Started
### Prerequisites

Make sure you have the following software installed on your local machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/) (only if you want to run the application locally without Docker)
- [Python](https://www.python.org/downloads/) (only if you want to run the application locally without Docker) 

### Running the Application with Docker

These instructions will help you run the application using Docker. If you prefer to run it locally, please skip to the "Local Development" section. The Docker files for the frontend and backend are already included in the repository and can be found in the `Frontend/` and `Backend/` directories respectively. These files are used by Docker Compose to build the images and run the containers.

- Clone this directory and move to its root using `cd AI-Model-Training-Deployment-Genome-Sequencing_Girlgenius/`
- Download the classifier model from [here](https://iiitaphyd-my.sharepoint.com/:u:/g/personal/jewel_benny_students_iiit_ac_in/Ed6u3YVQ7h9Pjwq-Rb6JwLQB6kSKBD9VpwhktuJX2fliYw?e=cRJYtS) (The model is too large to be uploaded to GitHub) and copy it to the `Backend/` directory. This step is important as the model is required for the backend service to run.
- Build the Docker images for the frontend and backend by running `docker-compose build`
- This will create the Docker images for the frontend and backend services with the names `ai-model-training-deployment-genome-sequencing_girlgenius-frontend` and `ai-model-training-deployment-genome-sequencing_girlgenius-backend` respectively.
- After the images are successfully built, you can run the application using `docker-compose up`
- Docker Compose will start the container, and the application frontend will be accessible at the following URL: [http://localhost:3000](http://localhost:3000)
- The backend service will be running at [http://localhost:8000](http://localhost:8000)
- To stop the application and shut down the containers, press `Ctrl + C` in the terminal where Docker Compose is running.

> Note - Running Docker with `sudo` can be necessary if your user doesn't have the necessary permissions to interact with Docker.

## Local Development 

If you want to run the application locally without Docker for development purposes:
- Clone this directory and move to its root using `cd AI-Model-Training-Deployment-Genome-Sequencing_Girlgenius/`

### Frontend
- Run `cd Frontend/`
- Run `npm install` to install all the dependencies to run the application.
- run `npm start` to run the app in the development mode.
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

> Note - If you want to build the app for production, run `npm run build` and the build will be stored in the `build/` directory. This will correctly bundle React in production mode and optimize the build for the best performance.

### Backend
- Run `cd Backend/`
- Run `pip install -r requirements.txt` to install all the dependencies to run the application.
- Run `python -m uvicorn main:app --host 0.0.0.0 --port 8000` to run the backend service.
- The backend service will be running at [http://localhost:8000](http://localhost:8000)

## Additional Information

### Frontend
- The frontend is built using [React](https://reactjs.org/) and [Bootstrap](https://getbootstrap.com/).
- The console will display useful information such as the request and response data made to the backend service, and any errors that occur.

### Backend
- The backend service is built using [FastAPI](https://fastapi.tiangolo.com/).
- The API has two endpoints:
  - `/send_seq`: This endpoint accepts a POST request with a JSON body containing the sequence file of which the location is to be predicted. The response is a JSON body containing the top predicted locations for the sequence in descending order of probability in the format:
  ```json
  {
    "location1": probability1,
    "location2": probability2,
    ...
  }
  ```
  - `/align_seq`: This endpoint accepts a POST request with a JSON body containing two sequence files. The response is a JSON body containing the alignment of the two sequences in the format:
  ```json
  {
    "score": alignment_score
  }
  ```
### Testing and Research
- The `Testing and Research/` directory contains the Jupyter Notebooks used for testing and research purposes.
- The `Testing and Research/Covid India Dataset/` directory contains some files that can be used to test the application.

> Note - The dataset used was obtained from [RCoV19](https://ngdc.cncb.ac.cn/ncov/?lang=en) and [GISAID EpiCoV](https://www.gisaid.org/). The latter was used with permission (DOI - [10.55876/gis8.231206fs](https://epicov.org/epi3/epi_set/231206fs)).

### Authors
- [Jewel Benny](https://github.com/jewelben)
- [Srujana Vanka](https://github.com/srujana-16)
