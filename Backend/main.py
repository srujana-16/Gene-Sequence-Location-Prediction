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
from Bio import SeqIO
from io import StringIO
from Bio.Align import PairwiseAligner

MODEL_PATH = os.path.join(os.getcwd(), "../Testing and Research/Model files")
FRONTEND_PATH = os.path.join(os.getcwd(), "../Frontend/build")

# load the model and vectorizer
with open(os.path.join(MODEL_PATH, "count_vectorizer_state_ut.pkl"), "rb") as f:
    cv = pickle.load(f)

# load the count vectorizer for tokenizing the sequence
#with open(os.path.join(MODEL_PATH, "count_vectorizer.pkl"), "rb") as f:
#    cv = pickle.load(f)

with open(os.path.join(MODEL_PATH, "random_forest_classifier_state.pkl"), "rb") as f:
    rf = pickle.load(f)

# random forest classifier for predicting the state or union territory
#with open(os.path.join(MODEL_PATH, "random_forest_classifier.pkl"), "rb") as f:
#    rf = pickle.load(f)

# convert the sequence into kmers of size 3 to be used as features
def getKmers(sequence, size=3):
    seq = [sequence[x:x + size].lower() for x in range(len(sequence) - size + 1)]
    n_str = "n"*size
    seq = [x if n_str not in x else "" for x in seq]
    seq = " ".join(seq)
    return seq

# initialize the FastAPI app
app = FastAPI()
app.mount("/static", StaticFiles(directory=FRONTEND_PATH), name="static")

# allow CORS so that cross-origin requests can be made
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# this route is used to serve the React app
@app.get("/")
async def home_page():
    return open(os.path.join(FRONTEND_PATH, "index.html")).read()

# receives a file from the frontend and runs the model on it
@app.post("/send_seq")
async def read_seq(file: UploadFile = File(...)):
    
    # if the file is a text file, read it as a string
    if file.filename.endswith(".txt"):
        seq = file.file.read()
        seq = seq.decode("utf-8")

    # if the file is a fasta file, read it as a string and then treat it as a fasta file
    elif file.filename.endswith(".fasta"):
        i = 0
        fasta = file.file.read()
        fasta = fasta.decode("utf-8")
        fasta = StringIO(fasta)
        for record in SeqIO.parse(fasta, "fasta"):
            if i == 0:
                seq = str(record.seq)
                i += 1
            else:
                break
    
    # run the model on the sequence and return the top states with non-zero probabilities
    seq_kmer = getKmers(seq)
    seq_kmer = cv.transform([seq_kmer]).toarray()
    pred_top10 = rf.predict_proba(seq_kmer)[0]
    # get the top 10 states and their probabilities
    top10 = sorted(zip(rf.classes_, pred_top10), key=lambda x: x[1], reverse=True)[:10]
    # if the top 10 states have a probability of 0, discard them
    top_states = [x for x in top10 if x[1] > 0]
    top_states = dict(top_states)
    return top_states

@app.post("/align_seq")
async def align_seq(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    # if the file is a text file, read it as a string
    if file1.filename.endswith(".txt"):
        seq1 = file1.file.read()
        seq1 = seq1.decode("utf-8")
    elif file1.filename.endswith(".fasta"):
        i = 0
        fasta = file1.file.read()
        fasta = fasta.decode("utf-8")
        fasta = StringIO(fasta)
        for record in SeqIO.parse(fasta, "fasta"):
            if i == 0:
                seq1 = str(record.seq)
                i += 1
            else:
                break

    if file2.filename.endswith(".txt"):
        seq2 = file2.file.read()
        seq2 = seq2.decode("utf-8")
    elif file2.filename.endswith(".fasta"):
        i = 0
        fasta = file2.file.read()
        fasta = fasta.decode("utf-8")
        fasta = StringIO(fasta)
        for record in SeqIO.parse(fasta, "fasta"):
            if i == 0:
                seq2 = str(record.seq)
                i += 1
            else:
                break

    aligner = PairwiseAligner()
    aligner.open_gap_score = -2
    aligner.extend_gap_score = -1
    alignments = aligner.align(seq1, seq2)
    best_alignment = alignments[0]
    return {"score": best_alignment.score}
    
if __name__ == "__main__":
    app.run(debug=True)