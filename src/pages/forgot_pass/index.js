import React, { useState } from "react";
import "./index.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
export default function ForgotPassword() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const forgotPasswordHandler = async () => {
    if (email === "") {
      toast.error("Email required...!!!", {
        position: "top-right",
      });
    } else {
      setLoading(true);
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          // ..
          toast.success("Password reset email sent!", {
            position: "top-right",
          });
          setLoading(false);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
          toast.error(errorMessage, {
            position: "top-right",
          });
          setLoading(false);
        });

      setEmail("");
    }
  };

  return (
    <Box className="signUp-box">
      <Grid container className="signUp-container">
        <Grid item xs={12} sm={8} md={6} lg={4} className="signUp-card">
          <h1 className="signUp-title">RESET PASSWORD</h1>
          <p className="enterPassword">Enter your email to reset password.</p>
          <p className="passwordParagraph">
            Note: Password reset link will be sent on your given email. Please
            Check your email after reseting password.
          </p>
          <div>
            <TextField
              style={{ marginTop: "15px" }}
              label="Email Address"
              variant="outlined"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="signUp-input"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>

          <Button
            style={{ marginTop: "15px" }}
            variant="contained"
            fullWidth
            className="signUp-button"
            onClick={forgotPasswordHandler}
          >
            {loading ? (
              <CircularProgress style={{ color: "white" }} size={20} />
            ) : (
              "Reset Password"
            )}
          </Button>
          <span className="no-Account">
            <a onClick={() => navigate("/sign-in")}>Sign in</a>
          </span>
        </Grid>
      </Grid>
    </Box>
  );
}
