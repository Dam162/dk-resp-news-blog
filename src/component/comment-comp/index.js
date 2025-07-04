import { useState, useEffect } from "react";
import "./index.css";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import moment from "moment";
import Avatar from "@mui/material/Avatar";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const CommentComponent = ({ data }) => {
  const [comments, setComments] = useState([]);
  const [replyComment, setReplyComment] = useState({});
  const [loading, setLoading] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      let commentsData = [];
      for (let index in data) {
        const userRef = doc(db, "users", data[index].uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          commentsData.push({
            ...data[index],
            ...userSnap.data(),
          });
        }
      }
      setComments(commentsData);
    };
    fetchData();
  }, [data, db]);

  const handleReplyChange = (index, value) => {
    setReplyComment((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  let sortComments = comments?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  console.log("sort Comments", sortComments);
  return (
    <div style={{ width: "100%" }}>
      {sortComments?.map((item, index) => {
        console.log("item", item);
        return (
          <Paper key={index} className="paper">
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

                {/* <Grid className="replyBox" container spacing={1}> */}

                {/* </Grid> */}

                <Box
                  className="replyBox"
                  component="form"
                  // sx={{ "& > :not(style)": {   width: "100%" } }}
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
                      value={replyComment[index] || ""}
                      onChange={(e) => handleReplyChange(index, e.target.value)}
                    />
                  </Grid>
                  <Grid
                    className="replyGridButton"
                    size={{ xl: 1, lg: 1, md: 2, sm: 2, xs: 12 }}
                  >
                    <Button
                      className="replyButtonField"
                      variant="contained"
                      disabled={!replyComment[index]}
                    >
                      {loading ? (
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
