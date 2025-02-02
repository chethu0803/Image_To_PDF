from fastapi import FastAPI
import os
import shutil
from fastapi import File, UploadFile
from fastapi.exceptions import HTTPException
from utils import convert_images_to_pdf
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi import HTTPException
from utils import PDF_FOLDER
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
import uuid

app = FastAPI()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)


@app.post("/convert")
async def convert_to_pdf(files: list[UploadFile] = File(...)):
    image_paths = []
    for file in files:
        if file.content_type not in ["image/jpeg", "image/png"]:
            return {"error": "Only JPG/PNG files allowed"}

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        image_paths.append(file_path)
    
    if not image_paths:
        raise HTTPException(status_code=400, detail="No images uploaded")

    pdf_filename = f"{uuid.uuid4()}.pdf"
    pdf_path = convert_images_to_pdf(image_paths, pdf_filename)

    c = canvas.Canvas(pdf_path, pagesize=A4)
    width, height = A4
    margin = 20  # Space between pages

    for image in image_paths:
        img = ImageReader(image)
        img_width, img_height = img.getSize()

        # Scale image while maintaining aspect ratio
        scale = min((width - 2 * margin) / img_width, (height - 2 * margin) / img_height)
        new_width = img_width * scale
        new_height = img_height * scale

        # Calculate centered position
        x = (width - new_width) / 2
        y = (height - new_height) / 2

        c.drawImage(img, x, y, new_width, new_height)
        c.showPage()  # Create a new page for each image

    c.save()
    # conn = sqlite3.connect("database.db")
    # cursor = conn.cursor()
    # cursor.execute("INSERT INTO pdfs (filename, file_path) VALUES (?, ?)", (pdf_filename, pdf_path))
    # conn.commit()
    # conn.close()

    return {"pdf_url": f"http://127.0.0.1:8000/pdfs/view/{pdf_filename}"}



@app.get("/pdfs/view/{filename}")
async def get_pdf(filename: str):
    file_path = os.path.join(PDF_FOLDER, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="PDF not found")
    headers = {"Content-Disposition": f"inline; filename={filename}" }
    return FileResponse(file_path, headers=headers) 

@app.get("/pdfs/download/{filename}")
async def get_pdf(filename: str):
    file_path = os.path.join(PDF_FOLDER, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="PDF not found")
    headers = {
        "Content-Disposition": f"attachment; filename={filename}"  # This prompts download
    }
    return FileResponse(file_path, headers=headers) 
