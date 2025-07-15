import { useState, useEffect } from "react";
import "./index.css";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import moment from "moment";
import Avatar from "@mui/material/Avatar";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ReplyCommentComp = ({ data, commentIndex }) => {
  const [replyComments, setReplyComments] = useState([]);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchReplyUsers = async () => {
      const currentUser = auth.currentUser;
      const repliesWithUserData = [];

      // Get reply comments of the specific comment only
      const replyList = data?.replyComment || [];

      for (const reply of replyList) {
        // Optional: Filter to only show replies by current user
        // if (reply.uid !== currentUser?.uid) continue;

        try {
          const userRef = doc(db, "users", reply.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            repliesWithUserData.push({
              ...reply,
              ...userData,
              createdAt:
                reply.createdAt?.toDate?.() || new Date(reply.createdAt),
            });
          }
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      }

      // Sort replies (newest first)
      repliesWithUserData.sort((a, b) => b.createdAt - a.createdAt);
      setReplyComments(repliesWithUserData);
    };

    fetchReplyUsers();
  }, [data, auth]);

  return (
    <div style={{ width: "100%" }}>
      {replyComments.map((item) => {
        const date = moment(item.createdAt);
        const key = `reply_${commentIndex}_${item.uid}_${date.valueOf()}`;

        return (
          <Paper key={key} className="reply-cmnt-paper">
            <Grid container spacing={2} className="mainGridComp">
              <Grid item className="avatarGridReply">
                <Avatar
                  alt={item?.name || "User"}
                  src={item?.profileURL || ""}
                  sx={{ width: 50, height: 50 }}
                />
              </Grid>

              <Grid item className="insideGrid" zeroMinWidth>
                <h4 className="headingFourReply">
                  {item?.name || "Anonymous"}
                </h4>
                <p className="replyCommentText">
                  {item?.replyCommentText || ""}
                </p>
                <p className="dateParagraphReply">{date.fromNow()}</p>
              </Grid>
            </Grid>
          </Paper>
        );
      })}
    </div>
  );
};

export default ReplyCommentComp;
  