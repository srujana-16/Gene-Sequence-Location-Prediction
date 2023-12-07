from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import RandomForestClassifier
import pandas as pd
import pickle
import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles

MODEL_PATH = os.path.join(os.getcwd(), "../Testing and Research/Model files")
FRONTEND_PATH = os.path.join(os.getcwd(), "../Frontend/build")

# load the model and vectorizer
#with open(os.path.join(MODEL_PATH, "count_vectorizer_state_ut.pkl"), "rb") as f:
#    cv = pickle.load(f)

# load the model and vectorizer
with open(os.path.join(MODEL_PATH, "count_vectorizer.pkl"), "rb") as f:
    cv = pickle.load(f)

#with open(os.path.join(MODEL_PATH, "random_forest_classifier_state.pkl"), "rb") as f:
#    rf = pickle.load(f)

with open(os.path.join(MODEL_PATH, "random_forest_classifier.pkl"), "rb") as f:
    rf = pickle.load(f)

def getKmers(sequence, size=3):
    seq = [sequence[x:x + size].lower() for x in range(len(sequence) - size + 1)]
    n_str = "n"*size
    seq = [x if n_str not in x else "" for x in seq]
    seq = " ".join(seq)
    return seq

app = FastAPI()
app.mount("/static", StaticFiles(directory=FRONTEND_PATH), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def home_page():
    return open(os.path.join(FRONTEND_PATH, "index.html")).read()

@app.post("/send_seq")
async def read_seq(file: UploadFile = File(...)):
    seq = file.file.read()
    # save the file
    #with open("seq.txt", "wb") as f:
    #    f.write(seq)
    seq = seq.decode("utf-8")
    seq_kmer = getKmers(seq)
    seq_kmer = cv.transform([seq_kmer]).toarray()
    pred_top10 = rf.predict_proba(seq_kmer)[0]
    # get the top 10 states and their probabilities
    top10 = sorted(zip(rf.classes_, pred_top10), key=lambda x: x[1], reverse=True)[:10]
    # if the top 10 states have a probability of 0, discard them
    top_states = [x for x in top10 if x[1] > 0]
    top_states = dict(top_states)
    return top_states
    
if __name__ == "__main__":
    app.run(debug=True)