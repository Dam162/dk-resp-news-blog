import React, { useEffect, useState } from "react";
import "./index.css";
import { NavBar, DetailsCardCom, BasicModal } from "../../component";
import Box from "@mui/material/Box";
import { useNavigate, useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, onSnapshot, doc, getDoc } from "firebase/firestore";

const Details = () => {
  const navigate = useNavigate();
  const db = getFirestore();
  const detailsLoc = useLocation();
  const path = detailsLoc.pathname.slice(14);
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      console.log("------path------->>", path);
      const unsub = onSnapshot(doc(db, "dk-blogs", path), async (blogRes) => {
        const blogData = blogRes?.data();
        // console.log("Current data: ", blogRes.data());
        if (blogRes.data()) {
          const userRef = doc(db, "users", blogRes?.data()?.userID);
          const UserSnap = await getDoc(userRef);
          const userData = UserSnap?.data();
          setBlog({ ...blogData, ...userData });
          setLoading(false);
        } else {
          setLoading(false);
          navigate("/");
        }
      });
    });
  }, []);

  return (
    <div>
      <NavBar />
      <Box
        component="form"
        sx={{ "& > :not(style)": { width: "100%" } }}
        noValidate
        autoComplete="off"
        style={{ padding: "15px" }}
      >
        <div>
          <IconButton
            aria-label="delete"
            size="large"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon fontSize="inherit" />
          </IconButton>
        </div>
        <DetailsCardCom
          data={blog}
          loading={loading}
          path={path}
          edit={detailsLoc?.state?.edit}
        />
      </Box>
    </div>
  );
};

export default Details;
