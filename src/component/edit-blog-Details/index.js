import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { CircularProgressWithLabel } from "../../component";
import Grid from "@mui/material/Grid";
import ReactPlayer from "react-player";
import "./index.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
export default function EditBlog({ open, handleClose, data }) {
  console.log("data in edit blog", data);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDetails, setBlogDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadStart, setUploadStart] = useState(false);
  const [fileProgress, setFileProgress] = useState(0);
  const [fileURL, setFileURL] = useState(0);
  const [fileType, setFileType] = useState("");

  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  useEffect(() => {
    if (data) {
      setBlogTitle(data?.blogTitle);
      setBlogDetails(data?.blogDetails);
      setFileURL(data?.fileURL);
      setFileType(data?.fileType);
    }
  }, [data]);

  //   blogFileUplaod
  const blogFileUplaod = (e) => {
    const file = e.target.files[0];
    console.log("--------------File------------>", file);
    if (
      file.type.slice(0, 5) === "image" ||
      file.type.slice(0, 5) === "video"
    ) {
      setUploadStart(true);
      const storageRef = ref(storage, `dk-blog-files/${data?.fileID}`);
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
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);
            const blogRef = doc(db, "dk-blogs", data?.blogID);
            await updateDoc(blogRef, {
              fileURL: downloadURL,
              fileType: file.type.slice(0, 5),
            });
            toast.success("File uploaded successfully");
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

  const editBlogHandler = async () => {
    if (fileURL === "") {
      toast.error("Please upload a file");
    } else if (blogTitle.length === "") {
      toast.error("Please enter blog title");
    } else if (blogTitle.length < 70) {
      toast.error("Title must be greater than 70 characters");
    } else if (blogDetails.length === "") {
      toast.error("Please enter blog details");
    } else if (blogDetails.length < 170) {
      toast.error("Details must be greater than 170 characters");
    } else {
      setLoading(true);
      const editBlog = {
        blogTitle: blogTitle,
        blogDetails: blogDetails,
      };

      const blogRef = doc(db, "dk-blogs", data?.blogID);
      await updateDoc(blogRef, editBlog);

      try {
        toast.success("Blog post updated successfully");
      } catch (error) {
        console.error("Error updating blog post:", error);
        toast.error("Failed to update blog post");
      } finally {
        setLoading(false);
        handleClose();
      }
    }
  };
  return (
    <React.Fragment>
      <Dialog fullWidth={true} maxWidth="xl" open={open} onClose={handleClose}>
        <Box
          className="box"
          component="form"
          sx={{ "& > :not(style)": { width: "100%" } }}
          noValidate
          autoComplete="off"
          style={{ padding: "10px" }}
        >
          <h1 className="headerTag">Edit Blog Post</h1>
          <Grid container spacing={1}>
            <Grid
              className="grid"
              size={{ xl: 8, lg: 8, md: 8, sm: 6, xs: 12 }}
            >
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
                {fileType !== "" && fileType !== "image" && (
                  <div className="previewImage"> Preview Image</div>
                )}

                {fileType === "" ? (
                  <div className="previewImage">Preview Image</div>
                ) : (
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
            <Grid
              className="grid"
              size={{ xl: 2, lg: 2, md: 2, sm: 3, xs: 12 }}
            >
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
            <p className="paragraphBlog">{blogTitle.length}</p>
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
            <p className="paragraphBlog">{blogDetails.length}</p>
          )}
          <Button
            onClick={editBlogHandler}
            style={{ marginTop: "10px" }}
            variant="contained"
          >
            {loading ? (
              <CircularProgress style={{ color: "white" }} size={20} />
            ) : (
              "Edit Blog post"
            )}
          </Button>
        </Box>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
