"use client";

import { useState } from "react";
import DragAndDropUploader from "./components/uploader";
import {
  convertImageFilesToFormat,
  ImageExtension,
  imageExtensions,
} from "@/utils/image";
import { ListImage, UploadedImage } from "./components/image-list";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [convertFormat, setConvertFormat] = useState<ImageExtension>("webp");
  const [converted, setConverted] = useState<UploadedImage[]>([]);
  const [inputKey, setInputKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const resetFiles = () => {
    setFiles([]);
    setInputKey((prev) => prev + 1);
  };

  async function handleConvert() {
    setLoading(true);
    const converted = await convertImageFilesToFormat(files, convertFormat);
    setConverted(converted);
    setLoading(false);
  }

  const handleDownload = (image: UploadedImage) => {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.name;
    link.click();
  };

  const handleDownloadAll = () => {
    converted.forEach((image) => handleDownload(image));
  };

  return (
    <main className="py-4">
      <h1 className="font-bold text-xl mb-4">Simplest Image Converter</h1>
      <h1>
        Easily convert images online in the simplest way. Supports conversion to{" "}
        <strong>JPEG</strong>, <strong>PNG</strong>, and <strong>WEBP</strong>{" "}
        formats.
      </h1>
      <h2 className="mt-8 font-bold mb-2">Choose Images ({files.length})</h2>
      <DragAndDropUploader
        key={inputKey}
        onChangeFiles={(files) => setFiles((prev) => [...prev, ...files])}
      />
      {files.length > 0 && (
        <div className="flex justify-between mt-2">
          <button
            className="border-red-500 border text-red-500 font-semibold px-8 py-2 hover:bg-red-500 hover:text-white"
            onClick={resetFiles}
          >
            Reset
          </button>
          <div className="flex gap-2">
            <select
              id="format-selector"
              value={convertFormat}
              onChange={(e) =>
                setConvertFormat(e.target.value as ImageExtension)
              }
              className="bg-orange-400 text-white font-semibold px-3 py-2 focus:outline-none cursor-pointer hover:bg-orange-500"
            >
              {imageExtensions.map((ext) => (
                <option key={ext} value={ext}>
                  {ext.toUpperCase()}
                </option>
              ))}
            </select>
            <button
              className="bg-blue-500 text-white font-semibold px-8 py-2 hover:bg-blue-600"
              onClick={handleConvert}
            >
              Convert
            </button>
          </div>
        </div>
      )}
      <div className="mt-8">
        <h2 className="font-bold mb-2">Result</h2>
        <div className="border-2 p-4 w-full h-48 flex justify-center rounded">
          {loading ? (
            <div className="w-full h-full grid place-items-center animate-pulse">
              <p className="text-xl text-blue-500">Loading...</p>
            </div>
          ) : (
            <div className="w-full h-full overflow-y-auto flex flex-col gap-1">
              {converted.map((image, index) => (
                <div
                  key={`converted-${index}`}
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => handleDownload(image)}
                >
                  <ListImage image={image} />
                  <p className="text-sm text-blue-500">download</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          disabled={converted.length < 1}
          className="bg-blue-500 mt-2 text-white font-semibold px-8 py-2 disabled:bg-gray-300 hover:bg-blue-600"
          onClick={handleDownloadAll}
        >
          Download All
        </button>
      </div>
    </main>
  );
}
