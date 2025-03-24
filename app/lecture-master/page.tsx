"use client";

import { useState } from "react";
import type {
  TextItem,
  TextMarkedContent,
} from "pdfjs-dist/types/src/display/api";
import "pdfjs-dist/web/pdf_viewer.css";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function LectureMaster() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<{ [key: number]: string }>(
    {}
  );
  const [totalPages, setTotalPages] = useState(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setExtractedText({});
      setCurrentPage(1);
      setTotalPages(0);
      setNumPages(null);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setTotalPages(numPages);
  };

  const extractText = async () => {
    if (!confirm("텍스트를 추출하시겠습니까?")) return;
    if (!pdfFile) {
      console.warn("pdf file not exists");
      return;
    }

    const pdf = await pdfjs.getDocument(URL.createObjectURL(pdfFile)).promise;
    setTotalPages(pdf.numPages);
    const pageTexts: { [key: number]: string } = {};

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: TextItem | TextMarkedContent) => {
          if ("str" in item) {
            return item.str;
          }
          return "";
        })
        .join(" ");
      pageTexts[i] = pageText;
    }

    setExtractedText(pageTexts);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">강의 자료 텍스트 추출기</h1>
      <div className="flex items-center gap-6 w-full mb-4 mt-4">
        <div>
          <input
            type="file"
            accept=".pdf"
            onChange={onFileChange}
            className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          />
        </div>
        {!fullScreen && (
          <button
            onClick={() => setFullScreen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            전체화면
          </button>
        )}
        <button
          onClick={extractText}
          disabled={!pdfFile}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
        >
          텍스트 추출하기
        </button>
      </div>

      {pdfUrl && (
        <div
          className={`${
            fullScreen
              ? "fixed left-0 right-0 top-0 bottom-0 bg-white z-10"
              : ""
          }`}
        >
          <div className="container mx-auto p-4 h-full flex flex-col">
            {fullScreen && (
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">강의 자료 텍스트 추출기</h1>
                <button
                  onClick={() => setFullScreen(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  전체화면 종료
                </button>
              </div>
            )}
            <div className="flex-1 flex gap-4">
              <div className="w-48 shrink-0 border rounded-lg p-2 overflow-y-auto h-[calc(100vh-8rem)]">
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="flex flex-col gap-2"
                >
                  {Array.from(new Array(numPages || totalPages), (_, index) => (
                    <div
                      key={`page_${index + 1}`}
                      className={`cursor-pointer border rounded p-1 ${
                        currentPage === index + 1
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      <Page
                        pageNumber={index + 1}
                        width={160}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </div>
                  ))}
                </Document>
              </div>
              <div className="flex-1 border rounded-lg p-4">
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="flex justify-center"
                  loading={
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  }
                >
                  <Page
                    pageNumber={currentPage}
                    width={800}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </Document>
              </div>
              {extractedText && Object.keys(extractedText).length > 0 && (
                <div className="w-96 shrink-0 border rounded-lg p-4 overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4">추출된 텍스트</h2>
                  <div className="mb-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="mr-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                      이전
                    </button>
                    <span className="mx-2">
                      페이지{" "}
                      <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={currentPage}
                        onChange={(e) => {
                          const newPage = parseInt(e.target.value);
                          if (newPage >= 1 && newPage <= totalPages) {
                            handlePageChange(newPage);
                          }
                        }}
                        className="w-16 px-2 py-1 border rounded text-center"
                      />
                      / {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="ml-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                      다음
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                    {extractedText[currentPage]}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
