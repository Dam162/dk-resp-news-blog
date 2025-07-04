import React, { useState } from "react";
import "./index.css";
// import googleIcon from "./../../images/logo_16509564.png";
import googleIcon from "./../../images/google.png";
import facebookIcon from "./../../images/facebook (1).png";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

export default function SlotsSignIn() {
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const providerfb = new FacebookAuthProvider();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const db = getFirestore();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  // signInHandler
  const signInHandler = () => {
    if (email === "") {
      toast.error("Email required...!!!", {
        position: "top-right",
      });
    } else if (password === "") {
      toast.error("Password required...!!!", {
        position: "top-right",
      });
    } else {
      setLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setLoading(false);
          toast.success("Success...!!!", {
            position: "top-right",
          });
          const user = userCredential.user;
          if (user.emailVerified) {
            navigate("/");
          } else {
            navigate("/email-verification");
          }
        })
        .catch((error) => {
          const errorMessage = error.message;
          setLoading(false);
          toast.error(errorMessage, {
            position: "top-right",
          });
        });
      const userData = {
        email: email,
      };
      console.log("userData", userData);
      setEmail("");
      setPassword("");
    }
  };
  //signInWithGoogleHandler
  const signInWithGoogleHandler = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Signed in with google", user);
        const userData = onSnapshot(
          doc(db, "users", user.uid),
          async (userRes) => {
            console.log("Current data: ", userRes.data());
            if (!userRes.data()) {
              await setDoc(doc(db, "users", user.uid), {
                name: user.displayName,
                email: user.email,
              });
            }
            toast.success("Success...!!!", {
              position: "top-right",
            });
            navigate("/");
          }
        );
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage, {
          position: "top-right",
        });
        // console.log("couldn't Signed in with google");
      });
  };

  //signInWithFacebookHandler
  const signInWithFacebookHandler = () => {
    console.log("Facebook login");
    signInWithPopup(auth, providerfb)
      .then((result) => {
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorMessage = error.message;
        toast.error(errorMessage, {
          position: "top-right",
        });
      });
  };

  return (
    <Box className="signIn-box">
      <Grid container className="signIn-container">
        <Grid item xs={12} sm={8} md={6} lg={4} className="signIn-card">
          <h1 className="signIn-title">SIGN IN WITH</h1>

          <div className="social-login">
            <button className="social-button" onClick={signInWithGoogleHandler}>
              <img className="social-icon" src={googleIcon} alt="Google" />
              Sign in with Google
            </button>
            <button
              className="social-button"
              onClick={signInWithFacebookHandler}
            >
              <img className="social-icon" src={facebookIcon} alt="Facebook" />
              Sign in with Facebook
            </button>
          </div>

          <p className="separator">
            <span>or</span>
          </p>

          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signIn-input"
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

          <FormControl
            style={{ marginTop: "15px" }}
            fullWidth
            variant="outlined"
            className="signIn-input"
          >
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <a className="forgot-pass" href="#">
            Forgot Password?
          </a>

          <Button
            onClick={signInHandler}
            variant="contained"
            fullWidth
            className="login-button"
          >
            {loading ? (
              <CircularProgress style={{ color: "white" }} size={20} />
            ) : (
              "Sign In"
            )}
          </Button>
          <span className="no-Account">
            Don't have account?{" "}
            <a onClick={() => navigate("/sign-up")}>Sign Up</a>
          </span>
        </Grid>
      </Grid>
    </Box>
  );
}
