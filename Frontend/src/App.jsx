import { useState, useEffect } from "react";
import Upload from "./components/Upload";
import PDFPreview from "./components/PDFPreview";

const App = () => {
    const [pdfUrl, setPdfUrl] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);  // State for loading

    useEffect(() => {
        // Check sessionStorage for saved data
        const storedPdfUrl = sessionStorage.getItem("pdfUrl");
        const storedImages = sessionStorage.getItem("selectedImages");

        if (storedPdfUrl) {
            setPdfUrl(storedPdfUrl);
        }

        if (storedImages) {
            setSelectedImages(JSON.parse(storedImages));
        }
    }, []);

    const handlePreview = async () => {
        setLoading(true); // Start loading

        const formData = new FormData();
        selectedImages.forEach((file) => formData.append("files", file));

        try {
            const response = await fetch("http://127.0.0.1:8000/convert", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setPdfUrl(data.pdf_url);
            sessionStorage.setItem("pdfUrl", data.pdf_url);
            sessionStorage.setItem("selectedImages", JSON.stringify(selectedImages));// Set the PDF URL once fetched
        } catch (error) {
            console.error("Error fetching PDF:", error);
        } finally {
            setLoading(false);  // Stop loading
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-gray-700 mb-6">Image to PDF Converter</h1>

            {/* Upload Section */}
            {!selectedImages.length ? (
                <div className="border-2 border-dashed border-gray-400 rounded-xl p-8 bg-white shadow-md w-[80%] text-center h-[80vh]">
                    <Upload setPdfUrl={setPdfUrl} setSelectedImages={setSelectedImages} selectedImages={selectedImages} />
                </div>
            ) : (
                <div className="bg-white p-6 shadow-lg rounded-xl w-[80%] max-w-3xl h-[80vh]">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Selected Images</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <Upload setPdfUrl={setPdfUrl} setSelectedImages={setSelectedImages} selectedImages={selectedImages} />
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="bg-white p-6 shadow-lg rounded-xl mt-6 w-full max-w-3xl flex justify-center items-center">
                    <span className="text-lg font-semibold text-gray-700">Loading...</span>
                </div>
            )}

            {/* PDF Preview or Download Button */}
            {pdfUrl && !loading && (
    <div className="bg-white p-6 shadow-lg rounded-xl mt-6 w-full max-w-3xl">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">PDF Preview</h2>
        <PDFPreview pdfUrl={pdfUrl} />
        <div className="flex justify-center mt-4"> {/* This wraps the button for centering */}
            <a
                href={pdfUrl.replace('/view/', '/download/')}
                target="_blank"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
                Download PDF
            </a>
        </div>
    </div>
)}


            {/* Preview Button */}
            {!loading && !pdfUrl && (
                <button
                    onClick={handlePreview}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Preview PDF
                </button>
            )}
        </div>
    );
};

export default App;
