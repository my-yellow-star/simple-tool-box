import React, { useState } from "react";
import { ListImage, UploadedImage } from "./image-list";

export default function DragAndDropUploader({
  onChangeFiles,
}: {
  onChangeFiles: (files: File[]) => void;
}) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const newImages: UploadedImage[] = [];

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newImages.push({
            url: reader.result as string,
            name: file.name,
            size: file.size,
          });

          if (newImages.length === files.length) {
            // 모든 파일 처리 후 업데이트
            setImages((prev) => [...prev, ...newImages]);
            onChangeFiles(files);
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert(`${file.name} is not a valid image file.`);
      }
    });
  };

  return (
    <div className="flex flex-col items-center w-full">
      <label htmlFor="uploadImage" className="w-full">
        <div
          className={`border-dashed cursor-pointer border-2 p-4 w-full h-48 flex items-center justify-center rounded ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {images.length === 0 ? (
            <p className="text-gray-500">Drag or Click to upload images.</p>
          ) : (
            <div className="w-full h-full overflow-y-auto flex flex-col gap-1">
              {images.map((image, index) => (
                <ListImage key={`uploaded-${index}`} image={image} />
              ))}
            </div>
          )}
        </div>
        <input
          id="uploadImage"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          multiple
          className="hidden"
        />
      </label>
    </div>
  );
}
