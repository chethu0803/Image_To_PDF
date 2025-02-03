import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState, useEffect } from "react";

const DraggableImage = ({ file, index, moveImage }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (file) {
            if (file instanceof File) {
                const objectUrl = URL.createObjectURL(file);
                setImageUrl(objectUrl);

                return () => {
                    URL.revokeObjectURL(objectUrl);
                };
            } else {
                console.error("Invalid file passed to DraggableImage");
            }
        }
    }, [file]);
    const [{ isDragging }, drag] = useDrag({
        type: "IMAGE",
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: "IMAGE",
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveImage(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div
            ref={(node) => drag(drop(node))}
            className="border-2 border-dashed border-gray-300 p-2 rounded-lg w-32 h-32 flex items-center justify-center"
            style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab" }}
        >
            { imageUrl && <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-full object-cover rounded-md"
            />}
        </div>
    );
};

const Upload = ({ setPdfUrl, setSelectedImages, selectedImages }) => {
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages((prevImages) => [...prevImages, ...files]);
    };

    const moveImage = (fromIndex, toIndex) => {
        const updatedImages = [...selectedImages];
        const [movedImage] = updatedImages.splice(fromIndex, 1);
        updatedImages.splice(toIndex, 0, movedImage);
        setSelectedImages([...updatedImages]);
    };


    

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col items-center justify-center">
                {/* Hidden file input */}
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="fileInput"
                    onChange={handleFileChange}
                />

                {/* Custom upload button */}
                <label
                    htmlFor="fileInput"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                    Select Images
                </label>

           
                <div className="grid grid-cols-6 gap-30 mt-4 w-full max-w-3xl mx-auto gap-y-2">
                    {selectedImages.map((file, index) => (
                        <DraggableImage
                            key={index}
                            file={file}
                            index={index}
                            moveImage={moveImage}
                        />
                    ))}
                </div>

               
                
            </div>
        </DndProvider>
    );
};

export default Upload;
