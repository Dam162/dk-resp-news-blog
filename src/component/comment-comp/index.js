import { useState, useEffect } from "react";
import "./index.css";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import moment from "moment";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import BasicModal from "../basic-model";
import {
  getFirestore,
  getDoc,
  updateDoc,
  setDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import ReplyCommentComp from "../replyCmnt-Comp";
const CommentComponent = ({ data }) => {
  // console.log("dataComment", data?.comment);
  const userCommentsData = data?.comment;
  const [comments, setComments] = useState([]);
  const [replyComment, setReplyComment] = useState({});
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [modelOpen, setModelOpen] = useState(false);
  const [commentRes, setCommentRes] = useState(false);
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      let commentsData = [];
      for (let index in userCommentsData) {
        const userRef = doc(db, "users", userCommentsData[index].uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          commentsData.push({
            ...userCommentsData[index],
            ...userSnap.data(),
            blogID: userCommentsData[index].uid,
          });
        }
      }
      setComments(commentsData);
    };
    fetchData();
  }, [data, db]);
  // console.log(
  //   "CCCCCCCCCCCCooooooooooooooMMMMMMMMMeeeeeennnnnnnnnttttttttttttSSSS",
  //   comments
  // );

  const handleReplyChange = (index, value) => {
    setReplyComment((prev) => ({
      ...prev,
      [index]: value,
    }));
  };
  let sortComments = comments?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // replyCommentHandlder

  const replyCommentHandler = async (originalIndex) => {
    if (!user) {
      setModelOpen(true);
      return;
    }

    setLoadingIndex(originalIndex);

    try {
      const currentReplies = Array.isArray(
        data.comment[originalIndex]?.replyComment
      )
        ? [...data.comment[originalIndex].replyComment]
        : [];

      currentReplies.push({
        replyCommentText: replyComment[originalIndex],
        createdAt: moment().format(),
        uid: user.uid,
      });

      const updatedComments = [...data.comment];
      updatedComments[originalIndex] = {
        ...updatedComments[originalIndex],
        replyComment: currentReplies,
      };

      const blogRef = doc(db, "dk-blogs", data.blogID);

      await updateDoc(blogRef, {
        comment: updatedComments,
      });

      setReplyComment((prev) => ({
        ...prev,
        [originalIndex]: "",
      }));

      toast.success("Replied successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error replying!");
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <BasicModal open={modelOpen} handleClose={() => setModelOpen(false)} />
      {sortComments?.map((item, index) => {
        // console.log("item", item);
        const originalIndex = data.comment.findIndex(
          (c) =>
            c.uid === item?.uid &&
            c.commentText === item?.commentText &&
            c.createdAt === item?.createdAt
        );
        return (
          <Paper key={originalIndex} className="paper">
            <Grid
              className="mainGridComp"
              container
              spacing={2}
              size={{ xl: 12, lg: 12, md: 12, sm: 12, xs: 12 }}
            >
              <Grid
                className="avatarGrid"
                item
                size={{ xl: 1, lg: 1, md: 1, sm: 12, xs: 12 }}
              >
                <Avatar
                  alt={item?.name}
                  src={item?.profileURL}
                  sx={{ width: "60px", height: "60px" }}
                />
              </Grid>
              <Grid
                size={{ xl: 11, lg: 11, md: 11, sm: 12, xs: 12 }}
                className="insideGrid"
                justifyContent="left"
                item
                xs
                zeroMinWidth
              >
                <h4 className="headingFour">{item?.name}</h4>
                <p className="commentText" style={{ textAlign: "justify" }}>
                  {item?.commentText}
                </p>
                <p className="dateParagraph">
                  {moment(item?.createdAt).fromNow()}
                </p>
                {!item?.comment?.replyComment && (
                  <ReplyCommentComp data={item} commentIndex={originalIndex} />
                )}

                <Box
                  className="replyBox"
                  component="form"
                  noValidate
                  autoComplete="off"
                >
                  <Grid
                    className="replyTextGrid"
                    size={{ xl: 11, lg: 11, md: 10, sm: 10, xs: 12 }}
                  >
                    <TextField
                      className="replyTextField"
                      id="outlined-basic"
                      label="Reply"
                      variant="outlined"
                      size="small"
                      value={replyComment[originalIndex] || ""}
                      onChange={(e) =>
                        handleReplyChange(originalIndex, e.target.value)
                      }
                    />
                  </Grid>
                  <Grid
                    className="replyGridButton"
                    size={{ xl: 1, lg: 1, md: 2, sm: 2, xs: 12 }}
                  >
                    <Button
                      className="replyButtonField"
                      variant="contained"
                      onClick={() => replyCommentHandler(originalIndex)}
                      disabled={
                        !replyComment[originalIndex] ||
                        loadingIndex === originalIndex
                      }
                    >
                      {loadingIndex === originalIndex ? (
                        <CircularProgress
                          style={{ color: "white" }}
                          size={20}
                        />
                      ) : (
                        "Reply"
                      )}
                    </Button>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        );
      })}
    </div>
  );
};
export default CommentComponent;
