import React, { useState, useEffect } from "react";
import { NavBar } from "../../component";
import "./index.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
// import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
// import Typography from "@mui/material/Typography";
import { CircularProgressWithLabel } from "../../component";
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, getFirestore, updateDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [uid, setUid] = useState("");
  const storage = getStorage();
  const [uploadStart, setUplaodStart] = useState(false);
  const [profileProgress, setProfileProgress] = useState(0);
  const [profileURL, setProfileURL] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // const uid = user.uid;
        console.log("User------", user.email);
        if (user.emailVerified) {
          const userData = onSnapshot(doc(db, "users", user.uid), (userRes) => {
            console.log("Current data: ", userRes.data());
            setName(userRes.data().name);
            setEmail(userRes.data().email);
            setPhone(userRes.data().phone);
            setProfileURL(userRes.data().profileURL);
            setUid(user.uid);
          });
          console.log("userData", userData);
        } else {
          navigate("/email-verification");
        }
      } else {
        navigate("/");
      }
    });
  }, []);

  // updateHandler
  const updateHandler = async () => {
    if (name === "") {
      toast.error("Name Required...!!!", {
        position: "top-right",
      });
    } else {
      setLoading(true);
      const updateUserData = doc(db, "users", uid);
      await updateDoc(updateUserData, {
        name: name,
        phone: phone,
      });
      toast.success("Updated Successfully...!!!", {
        position: "top-right",
      });
      setLoading(false);
    }
  };

  // uploadProfileHandler
  const uploadProfileHandler = (e) => {
    console.log("uploadProfileHandler", e);
    setUplaodStart(true);
    const file = e.target.files[0];
    const storageRef = ref(storage, `dk-profile-images/${uid}`);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProfileProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          setProfileURL(downloadURL);
          const userRef = doc(db, "users", uid);
          await updateDoc(userRef, {
            profileURL: downloadURL,
          });
          setUplaodStart(false);
        });
      }
    );
  };
  return (
    <div>
      <NavBar />
      <h1 className="profileHeading">Welcome, {name} to your profile!</h1>
      <p id="paragraph">Here your can update your profile.</p>
      <Box
        className="box"
        component="form"
        sx={{ "& > :not(style)": { width: "100%" } }}
        noValidate
        autoComplete="off"
        style={{ padding: "20px" }}
      >
        <Grid style={{ marginBottom: "20px" }} container spacing={2}>
          <Grid className="grid" size={{ xl: 2, lg: 2, md: 2, sm: 3, xs: 12 }}>
            <Avatar
              className="profileTwo"
              alt={name}
              src={profileURL}
              sx={{ width: 100, height: 100 }}
            />
          </Grid>
          <Grid className="grid" size={{ xl: 8, lg: 8, md: 8, sm: 6, xs: 12 }}>
            <TextField
              // style={{ width: "100%",padding:"0px 10px" }}
              className="fileUplaod"
              id="outlined-basic"
              label=""
              variant="outlined"
              type="file"
              onChange={(e) => uploadProfileHandler(e)}
            />
          </Grid>
          <Grid className="grid" size={{ xl: 2, lg: 2, md: 2, sm: 3, xs: 12 }}>
            <div className="circularProgress">
              <CircularProgressWithLabel
                show={uploadStart}
                progress={profileProgress}
              />
            </div>
          </Grid>
        </Grid>
        <TextField
          style={{ marginTop: "10px" }}
          id="outlined-basic"
          label="Full Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          style={{ marginTop: "10px" }}
          id="outlined-basic"
          // label="Email Address"
          variant="outlined"
          type="email"
          value={email}
          disabled
        />
        <TextField
          style={{ marginTop: "10px" }}
          id="outlined-basic"
          label="Phone Number"
          variant="outlined"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="number"
        />
        <Button
          onClick={updateHandler}
          style={{ marginTop: "20px" }}
          variant="contained"
        >
          {loading ? (
            <CircularProgress style={{ color: "white" }} size={20} />
          ) : (
            "Update"
          )}
        </Button>
      </Box>
    </div>
  );
};
export default Profile;
