import os
from PIL import Image

PDF_FOLDER = "pdfs"
os.makedirs(PDF_FOLDER, exist_ok=True)

def convert_images_to_pdf(image_paths, output_filename):
    images = [Image.open(img).convert("RGB") for img in image_paths]
    pdf_path = os.path.join(PDF_FOLDER, output_filename)
    images[0].save(pdf_path, save_all=True, append_images=images[1:])
    return pdf_path

