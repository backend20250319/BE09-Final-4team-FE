import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ fileUrl, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">✕</button>
        <div className="mb-4 font-semibold text-lg">PDF 미리보기</div>
        <div className="overflow-auto flex justify-center">
          <Document file={fileUrl} loading={<div className="text-center py-8">로딩 중...</div>}>
            <Page pageNumber={1} width={500} />
          </Document>
        </div>
      </div>
    </div>
  );
}
