import React, { useEffect, useState } from "react";
import "./index.css";
import { NavBar, Card } from "../../component";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  doc,
  getDoc,
  where,
} from "firebase/firestore";

const Dashboard = () => {
  const navigate = useNavigate();
  const db = getFirestore();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.emailVerified) {
          const q = query(
            collection(db, "dk-blogs"),
            where("userID", "==", user.uid)
          );
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newBlogs = [];
            const fetchData = async () => {
              for (const blogRes of querySnapshot.docs) {
                const blogData = blogRes.data();
                const userRef = doc(db, "users", blogData.userID);
                const UserSnap = await getDoc(userRef);
                const userData = UserSnap.data();
                newBlogs.push({ ...blogData, ...userData });
              }
              setBlogs([...newBlogs]);
              setLoading(false);
            };

            fetchData();
          });
        } else {
          navigate("/email-verification");
        }
      } else {
        navigate("/");
      }
    });
  }, []);

  const filteredData = blogs
    .filter((item) =>
      item.blogTitle.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); //
  console.log(filteredData);

  return (
    <div>
      <NavBar activePage="Home" />
      <Box
        component="form"
        sx={{ "& > :not(style)": { width: "100%" } }}
        noValidate
        autoComplete="off"
        style={{ padding: "15px" }}
      >
        <TextField
          style={{ marginTop: "15px" }}
          id="outlined-basic"
          type="search"
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
        />
      </Box>
      {loading ? (
        <Card data={filteredData} loading={loading} />
      ) : filteredData.length === 0 ? (
        <Box
          component="form"
          sx={{ "& > :not(style)": { width: "100%" } }}
          noValidate
          autoComplete="off"
          style={{ padding: "20px" }}
        >
          <h1 style={{ textAlign: "center" }}>Data Not Found!</h1>
        </Box>
      ) : (
        <Card data={filteredData} loading={loading} edit={true} />
      )}
    </div>
  );
};

export default Dashboard;
