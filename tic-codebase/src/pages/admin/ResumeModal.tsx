import { Modal } from "react-bootstrap";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const ResumeModal = ({ modal, onClose }: any) => {
  return (
    <Modal show={modal.show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{modal.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ height: "80vh", overflow: "auto" }}>
        {modal.url ? (
          <Document
            file={modal.url}
            loading="Loading resume..."
            error="Failed to load resume"
          >
            <Page pageNumber={1} />
          </Document>
        ) : (
          <p>No resume available</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ResumeModal;
