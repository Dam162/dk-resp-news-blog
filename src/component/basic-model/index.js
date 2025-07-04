import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function BasicModal({ open, handleClose }) {
  const navigate = useNavigate();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Please, Login in first!
          </Typography>
          <Button
            onClick={() => {
              handleClose();
              navigate("/sign-in");
            }}
            variant="contained"
            className="login-btn"
          >
            Login
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
