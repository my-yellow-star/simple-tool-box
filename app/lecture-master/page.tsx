"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import type {
  TextItem,
  TextMarkedContent,
} from "pdfjs-dist/types/src/display/api";
import "pdfjs-dist/web/pdf_viewer.css";

// PDF 관련 컴포넌트들을 동적으로 임포트
const PDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  ),
});

export default function LectureMaster() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<{ [key: number]: string }>(
    {}
  );
  const [totalPages, setTotalPages] = useState(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const extractText = async () => {
    if (!confirm("텍스트를 추출하시겠습니까?")) return;
    if (!pdfFile) {
      console.warn("pdf file not exists");
      return;
    }

    setIsLoading(true);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      const pdf = await pdfjs.getDocument(URL.createObjectURL(pdfFile)).promise;
      setTotalPages(pdf.numPages);
      const pageTexts: { [key: number]: string } = {};

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: TextItem | TextMarkedContent) => {
            if ("str" in item) {
              return item.str.replace(/\n/g, " ");
            }
            return "";
          })
          .join("\n");
        pageTexts[i] = pageText;
      }

      setExtractedText(pageTexts);
    } catch (error) {
      console.error("텍스트 추출 중 오류가 발생했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container p-4">
      <div className="fixed left-0 right-0 top-0 bottom-0 bg-white z-10">
        <div className="container mx-auto p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">강의 자료 텍스트 추출기</h1>
            <div className="flex items-center gap-4">
              <div className="w-64">
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
              <button
                onClick={extractText}
                disabled={!pdfFile || isLoading}
                className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300 flex items-center gap-2"
              >
                텍스트 추출하기
              </button>
            </div>
          </div>
          {pdfUrl && (
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              }
            >
              <PDFViewer
                pdfUrl={pdfUrl}
                currentPage={currentPage}
                numPages={numPages}
                totalPages={totalPages}
                extractedText={extractedText}
                onDocumentLoadSuccess={({ numPages }) => {
                  setNumPages(numPages);
                  setTotalPages(numPages);
                }}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
