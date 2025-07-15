import React, { useState, useEffect } from "react";
import { NavBar } from "../../component";
import "./index.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { CircularProgressWithLabel } from "../../component";
import Grid from "@mui/material/Grid";
import moment from "moment";
import ReactPlayer from "react-player";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getFirestore,
  updateDoc,
  collection,
  addDoc,
} from "firebase/firestore";

const CreateBlog = () => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDetails, setBlogDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadStart, setUploadStart] = useState(false);
  const [fileProgress, setFileProgress] = useState(0);
  const [fileURL, setFileURL] = useState(0);
  const [fileType, setFileType] = useState("");
  const [uid, setUid] = useState("");
  const navigate = useNavigate();
  const uuid = uuidv4();
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    // console.log("-----------FileURL----------", fileURL);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user?.emailVerified) {
          setUid(user?.uid);
        } else {
          navigate("/email-verification");
        }
      } else {
        navigate("/");
      }
    });
  }, []);
  // createBlogHandler
  const createBlogHandler = async () => {
    if (fileURL === 0) {
      toast.error("File required...!!!", {
        position: "top-right",
      });
    } else if (blogTitle === "") {
      toast.error("Title required...!!!", {
        position: "top-right",
      });
    } else if (blogTitle.length < 70) {
      toast.error("Title must greater than 70...!!!", {
        position: "top-right",
      });
    } else if (blogDetails === "") {
      toast.error("Details required...!!!", {
        position: "top-right",
      });
    }  else if (blogDetails.length < 170) {
      toast.error("Details must greater than 170...!!!", {
        position: "top-right",
      });
    } else {
      setLoading(true);
      const newBlog = {
        fileURL: fileURL,
        blogTitle: blogTitle,
        blogDetails: blogDetails,
        like: [],
        comment: [],
        share: [],
        createdAt: moment().format(),
        fileID: uuid,
        fileType: fileType,
        userID: uid,
      };
      const docRef = await addDoc(collection(db, "dk-blogs"), newBlog);
      const blogRef = doc(db, "dk-blogs", docRef?.id);
      await updateDoc(blogRef, {
        blogID: docRef?.id,
      });
      toast.success("New blog created...!!!", {
        position: "top-right",
      });
      setLoading(false);
      setFileURL("")
      setBlogTitle("");
      setBlogDetails("");
    }
  };

  //   blogFileUplaod
  const blogFileUplaod = (e) => {
    const file = e.target.files[0];
    // console.log("--------------File------------>", file);
    if (
      file.type.slice(0, 5) === "image" ||
      file.type.slice(0, 5) === "video"
    ) {
      setUploadStart(true);
      const storageRef = ref(storage, `dk-blog-files/${uuid}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setFileProgress(progress);
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setFileURL(downloadURL);
            setFileType(file.type.slice(0, 5));
            setUploadStart(false);
          });
        }
      );
    } else {
      toast.error("File must be in image or video...!!!", {
        position: "top-right",
      });
    }
  };
  return (
    <div>
      <NavBar />
      <h1 className="heading">Create your blogs here!</h1>
      <Box
        className="box"
        component="form"
        sx={{ "& > :not(style)": { width: "100%" } }}
        noValidate
        autoComplete="off"
        style={{ padding: "10px" }}
      >
        <Grid container spacing={1}>
          <Grid className="grid" size={{ xl: 8, lg: 8, md: 8, sm: 6, xs: 12 }}>
            <TextField
              className="fileUplaod"
              id="outlined-basic"
              label=""
              variant="outlined"
              type="file"
              onChange={(e) => blogFileUplaod(e)}
            />
          </Grid>
          <Grid
            id="showImageGrid"
            className="grid"
            size={{ xl: 2, lg: 2, md: 2, sm: 3, xs: 12 }}
          >
            <div className="showImage">
              {fileType === "" ? (<div className="previewImage">Preview Image</div>) : (
                <div className="showImg">
                  {fileType === "image" ? (
                    <img
                      src={fileURL}
                      style={{
                        width: "100%",
                        height: "20vh",
                        borderRadius: "5px",
                        // margin: "15px 0px",
                      }}
                    />
                  ) : (
                    <ReactPlayer
                      style={{
                        borderRadius: "5px",
                      }}
                      width={"100%"}
                      height={"20vh"}
                      controls={true}
                      url={fileURL}
                    />
                  )}
                </div>
              )}
            </div>
          </Grid>
          <Grid className="grid" size={{ xl: 2, lg: 2, md: 2, sm: 3, xs: 12 }}>
            <div className="circularProgress">
              <CircularProgressWithLabel
                show={uploadStart}
                progress={fileProgress}
              />
            </div>
          </Grid>
        </Grid>
      

        <TextField
          style={{ marginTop: "10px" }}
          className="outlined-basic"
          id="outlined-basic"
          label="Title"
          variant="outlined"
          type="text"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
        />
        {blogTitle.length !== 0 && (
          <p
            className="paragraphBlog"
            // style={{
            //   textAlign: "right",
            //   marginTop: "15px",
            //   paddingRight: "30px",
            // }}
          >
            {blogTitle.length}
          </p>
        )}
        <TextField
          style={{ marginTop: "10px" }}
          id="outlined-textarea"
          label="Details"
          placeholder="Details"
          multiline
          rows={3}
          value={blogDetails}
          onChange={(e) => setBlogDetails(e.target.value)}
        />
        {blogDetails.length !== 0 && (
          <p
            className="paragraphBlog"
            // style={{
            //   textAlign: "right",
            //   marginTop: "15px",
            //   paddingRight: "30px",
            // }}
          >
            {blogDetails.length}
          </p>
        )}
        <Button
          onClick={createBlogHandler}
          style={{ marginTop: "10px" }}
          variant="contained"
        >
          {loading ? (
            <CircularProgress style={{ color: "white" }} size={20} />
          ) : (
            "Create"
          )}
        </Button>
      </Box>
    </div>
  );
};
export default CreateBlog;
