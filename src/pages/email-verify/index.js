import React, { useEffect, useState } from "react";
import "./index.css";
import { NavBar } from "../../component";
import Button from "@mui/material/Button";
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const EmailVerification = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [resendLoader, setResedLoader] = useState(false);

  //   use effect function used to get data on reload
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("user..........!", user);
        if (user.emailVerified) {
          navigate("/");
        } else {
          setLoading(false);
          setEmail(user.email);
        }
      } else {
        console.log("user not found..........!");
        navigate("/Login");
      }
    });
  }, []);

  //   resendhandler.........
  const resendHandler = () => {
    setResedLoader(true);
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setResedLoader(false);
        toast.success("Email Verification sent successfully...!!!", {
          position: "top-right",
        });
      })
      .catch((error) => {
        setResedLoader(false);
        const errorMessage = error.message;
        toast.error(errorMessage, {
          position: "top-right",
        });
      });
  };

  return (
    <div className="main-Cont">
      <NavBar />
      <h1 className="head">Email EmailVerification Page</h1>
      <p className="paragraph">
        Please check your email, we have sent email verificaton link on your
        email{loading ? "Loading..." : email}
      </p>
      <div className="buttons">
        <Button
          variant="contained"
          disabled={resendLoader}
          onClick={resendHandler}
          className="emailVerifyButton"
        >
          {resendLoader ? (
            <CircularProgress style={{ color: "white" }} size={20} />
          ) : (
            "Resend"
          )}
        </Button>
        <Button
          className="emailVerifyButton"
          variant="contained"
          onClick={() => window.location.reload()}
        >
          Home
        </Button>
      </div>
    </div>
  );
};
export default EmailVerification;
