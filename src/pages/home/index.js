import React, { useEffect, useState } from "react";
import "./index.css";
import { NavBar, Card } from "../../component";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  doc,
  getDoc,
} from "firebase/firestore";

const Home = () => {
  const db = getFirestore();
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "dk-blogs"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchData = async () => {
        const newBlogs = [];

        for (const blogRes of querySnapshot.docs) {
          const blogData = blogRes?.data();
          const userID = blogData?.userID;

          let userData = {};
          if (userID) {
            const userRef = doc(db, "users", userID);
            const userSnap = await getDoc(userRef);
            if (userSnap?.exists()) {
              userData = userSnap.data();
            } else {
              console.warn(`User document not found for userID: ${userID}`);
            }
          }

          newBlogs.push({ ...blogData, ...userData });
        }

        setBlogs(newBlogs);
        setLoading(false);
      };

      fetchData().catch((err) => {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      });
    });

    return () => unsubscribe(); // clean up
  }, [db]);

  const filteredData = blogs
    .filter((item) =>
      item.blogTitle?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // console.log(filteredData);

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
        <Card data={[]} loading={loading} />
      ) : filteredData.length === 0 ? (
        <Box
          sx={{ "& > :not(style)": { width: "100%" } }}
          style={{ padding: "20px" }}
        >
          <h1 style={{ textAlign: "center" }}>Data Not Found!</h1>
        </Box>
      ) : (
        <Card data={filteredData} loading={loading} />
      )}
    </div>
  );
};

export default Home;
