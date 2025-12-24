import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import AdminBaseApi from "../services/admin-base";
import { toast } from "react-toastify";

interface SendMessageModalProps {
  show: boolean;
  onClose: () => void;
  teacherId: string | number;
}

const SendMessageModal: React.FC<SendMessageModalProps> = ({
  show,
  onClose,
  teacherId,
}) => {
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    setSending(true);
    try {
      await AdminBaseApi.post("/messages/send", {
        teacherId,
        message: messageText,
      });
      setMessageText("");
      toast.success("Message sent successfully!");
      onClose();
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
      // Optionally show error toast
      console.error("Failed to send message", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop={true}
      style={{ zIndex: 1061 }} // Bootstrap modal default is 1050, so +1 for stacking
      backdropClassName="modal-backdrop-stacked"
    >
      <Modal.Header closeButton>
        <Modal.Title>Send Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message here..."
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSendMessage}
          disabled={!messageText.trim() || sending}
        >
          {sending ? "Sending..." : "Send Message"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SendMessageModal;
