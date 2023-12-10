from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import RandomForestClassifier
import pickle
import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from Bio import SeqIO
from io import StringIO
from Bio.Align import PairwiseAligner

# load the count vectorizer. 
# the count vectorizer is used to vectorize the kmer sequences to obtain the features
with open("count_vectorizer_state_ut.pkl", "rb") as f:
    cv = pickle.load(f)

# load the random forest classifier
# the random forest classifier is used to predict the location of the sequence using the count vectorizer features as input
with open("random_forest_classifier_state.pkl", "rb") as f:
    rf = pickle.load(f)

# convert the sequence into kmers of size 3 to tokenize the sequence
def getKmers(sequence: str, size: int = 3) -> str:

    '''
    The function converts the sequence into kmers of size 3 to tokenize the sequence.
    By default, the size of the kmers is 3 and the model was trained on kmers of size 3.

    Parameters:
    sequence (str): the sequence to be tokenized
    size (int): the size of the kmers

    Returns:
    seq (str): the tokenized sequence
    '''
    # convert the sequence to lowercase and tokenize it into kmers
    seq = [sequence[x:x + size].lower() for x in range(len(sequence) - size + 1)]

    # if there are undetermined nucleotides in the sequence (represented by n), remove the kmers containing n
    # because they do not provide any additional information
    n_str = "n"*size
    seq = [x if n_str not in x else "" for x in seq]
    seq = " ".join(seq)

    # return the tokenized sequence
    return seq

# initialize the FastAPI app
app = FastAPI()

# allow CORS so that cross-origin requests can be made
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/send_seq")
async def read_seq(file: UploadFile = File(...)) -> dict:
    
    '''
    The function receives a file from the frontend from a POST request containing the sequence, either in a text file or a fasta file.
    The function then reads the file and converts it into a string. The string is then tokenized into kmers of size 3.
    The kmers are then vectorized using the count vectorizer and the random forest classifier is used to predict the location of the sequence.
    The top 10 locations with non-zero probabilities are returned.

    Parameters:
    file (UploadFile): the file containing the sequence

    Returns:
    top_locs (dict): a dictionary containing the top locations and their probabilities (if the probability is 0, it is not returned)
    '''
    # if the file is a text file, read it as a string
    if file.filename.endswith(".txt"):
        seq = file.file.read()
        seq = seq.decode("utf-8")

    # if the file is a fasta file, read it as a string and then treat it as a fasta file
    elif file.filename.endswith(".fasta"):
        i = 0
        fasta = file.file.read()
        fasta = fasta.decode("utf-8")

        # parse the fasta file using StringIO to facilitate reading
        fasta = StringIO(fasta)
        for record in SeqIO.parse(fasta, "fasta"):
            if i == 0:
                seq = str(record.seq)
                i += 1
            else:
                break
    
    # run the model on the sequence and return the top states with non-zero probabilities
    seq_kmer = getKmers(seq)

    # vectorize the kmers
    seq_kmer = cv.transform([seq_kmer]).toarray()

    # predict the probabilities of the sequence for each location present in the dataset
    pred_top10 = rf.predict_proba(seq_kmer)[0]

    # get the top 10 locations and their probabilities
    top10 = sorted(zip(rf.classes_, pred_top10), key=lambda x: x[1], reverse=True)[:10]

    # if the top locations have a probability of 0, discard them
    top_locs = [x for x in top10 if x[1] > 0]

    # convert the list of tuples to a dictionary
    top_locs = dict(top_locs)
    return top_locs

@app.post("/align_seq")
async def align_seq(file1: UploadFile = File(...), file2: UploadFile = File(...)) -> dict:

    '''
    The function receives two files from the frontend from a POST request containing the sequences, either in a text file or a fasta file.
    The function then reads the files and converts them into strings. The strings are then aligned using the default parameters of the 
    pairwise aligner. The score of the alignment is returned. Typically, the higher the score, the better the alignment, 
    which means that the sequences are more probable to be from the same location.

    Parameters:
    file1 (UploadFile): the first file containing the sequence
    file2 (UploadFile): the second file containing the sequence

    Returns:
    score (dict): a dictionary containing the score of the alignment
    '''

    # if the file is a text file, read it as a string
    if file1.filename.endswith(".txt"):
        seq1 = file1.file.read()
        seq1 = seq1.decode("utf-8")
    elif file1.filename.endswith(".fasta"):
        i = 0
        fasta = file1.file.read()
        fasta = fasta.decode("utf-8")

        # parse the fasta file using StringIO to facilitate reading
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

    # The gap scores are set to high values due to the fact that the sequences are long and the default gap scores are too low.
    aligner.open_gap_score = -200
    aligner.extend_gap_score = -50

    # align the sequences
    alignments = aligner.align(seq1, seq2)

    # get the best alignment that maximizes the score
    best_alignment = alignments[0]
    
    # return the score of the alignment
    return {"score": best_alignment.score}

# run the app    
if __name__ == "__main__":
    app.run(debug=True)