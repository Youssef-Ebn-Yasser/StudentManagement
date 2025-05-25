from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import cv2
import numpy as np
import os

app = FastAPI()

# Load the face detector model
cascade_path = os.path.join("models", "haarcascade_frontalface_default.xml")
face_cascade = cv2.CascadeClassifier(cascade_path)

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    num_faces = len(faces)

    return JSONResponse(content={
        "cheating": num_faces > 1,
        "reason": f"{num_faces} face(s) detected"
    })
