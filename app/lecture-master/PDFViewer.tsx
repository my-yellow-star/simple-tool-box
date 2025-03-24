"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdfUrl: string;
  currentPage: number;
  numPages: number | null;
  totalPages: number;
  extractedText: { [key: number]: string };
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onPageChange: (newPage: number) => void;
  isLoading: boolean;
}

export default function PDFViewer({
  pdfUrl,
  currentPage,
  numPages,
  totalPages,
  extractedText,
  onDocumentLoadSuccess,
  onPageChange,
  isLoading,
}: PDFViewerProps) {
  return (
    <div className="flex-1 flex gap-4 h-[calc(100vh-8rem)]">
      <div className="w-48 shrink-0 border rounded-lg p-2 overflow-y-auto">
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
              onClick={() => onPageChange(index + 1)}
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
        <div className="w-96 shrink-0 border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">추출된 텍스트</h2>
          <div className="mb-4">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
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
                    onPageChange(newPage);
                  }
                }}
                disabled={isLoading}
                className="w-16 px-2 py-1 border rounded text-center disabled:bg-gray-100"
              />
              / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              다음
            </button>
          </div>
          <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg overflow-y-auto h-[calc(100vh-16rem)]">
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/6"></div>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap">
                {extractedText[currentPage]}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
