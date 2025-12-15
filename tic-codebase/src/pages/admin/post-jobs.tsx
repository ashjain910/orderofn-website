import React from "react";
// import { useNavigate } from "react-router-dom";
import PostJobModal from "../../components/admin/PostJobModal";

const AdminPostJob: React.FC = () => {
  // const navigate = useNavigate();
  const [show, setShow] = React.useState(true);

  const handleClose = () => {
    setShow(false);
    // Do not navigate away; just close the modal
  };

  return <PostJobModal show={show} onClose={handleClose} />;
};

export default AdminPostJob;
