import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import moment from "moment";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./index.css";
const language = "en";
function Media(props) {
  const { loading, data, uid, edit } = props;
  const isLiked = data?.like?.includes(uid);
  const navigate = useNavigate();
  console.log("-----UserData----->>>>>>", data);
  console.log("-----uid----->>>>>>", uid);
  return (
    <Card
      className="card"
      onClick={() =>
        !loading &&
        navigate(`/blog-details/${data?.blogID}`, { state: { edit: edit } })
      }
    >
      <CardHeader
        avatar={
          loading ? (
            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
            />
          ) : (
            <Avatar alt={data?.name} src={data?.profileURL} />
          )
        }
        title={
          loading ? (
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          ) : (
            data.name
            // username
          )
        }
        subheader={
          loading ? (
            <Skeleton animation="wave" height={10} width="40%" />
          ) : (
            moment(data?.createdAt).fromNow()
          )
        }
      />
      {loading ? (
        <Skeleton sx={{ height: 200 }} animation="wave" variant="rectangular" />
      ) : (
        <div className="mediaImgVideo">
          {data?.fileType === "image" ? (
            <CardMedia
              // style={{ borderRadius: "10px" }}
              component="img"
              width={"100%"}
              height={"100%"}
              image={data?.fileURL}
            />
          ) : (
            <ReactPlayer
              // style={{ borderRadius: "10px" }}
              width={"100%"}
              height={"100%"}
              controls={true}
              url={data?.fileURL}
            />
          )}
        </div>
      )}
      <CardContent>
        {loading ? (
          <React.Fragment>
            <Skeleton
              animation="wave"
              height={10}
              style={{ marginBottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        ) : (
          <Typography
            variant="body2"
            component="p"
            className="title"
            // sx={{ color: "text.secondary" }}
          >
            {data?.blogTitle}
          </Typography>
        )}
      </CardContent>
      <CardContent>
        {loading ? (
          <React.Fragment>
            <Skeleton
              animation="wave"
              height={10}
              // style={{ marginBottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        ) : (
          <Typography
            variant="body2"
            component="p"
            className="details"
            sx={{ color: "text.secondary" }}
          >
            {data?.blogDetails}
          </Typography>
        )}
      </CardContent>
      <div className="card-footer">
        <CardContent>
          {loading ? (
            <React.Fragment>
              <Skeleton
                animation="wave"
                height={8}
                style={{ marginBottom: 6 }}
              />
              <Skeleton animation="wave" height={60} width={40} />
            </React.Fragment>
          ) : (
            <div className="footer-box">
              {isLiked ? (
                <ThumbUpIcon style={{ color: "#1976d2" }} />
              ) : (
                <ThumbUpOutlinedIcon className="icon" />
              )}

              <p className="paragraphTag">
                {Intl.NumberFormat(language, { notation: "compact" }).format(
                  data?.like?.length
                )}
              </p>
            </div>
          )}
        </CardContent>

        <CardContent>
          {loading ? (
            <React.Fragment>
              <Skeleton
                animation="wave"
                height={8}
                style={{ marginBottom: 6 }}
              />
              <Skeleton animation="wave" height={60} width={40} />
            </React.Fragment>
          ) : (
            <div className="footer-box" id="comntSec">
              <ChatBubbleOutlineOutlinedIcon className="icon" />
              <p className="paragraphTag" id="comntParag">
                {Intl.NumberFormat(language, { notation: "compact" }).format(
                  data?.comment?.length
                )}
              </p>
            </div>
          )}
        </CardContent>

        <CardContent>
          {loading ? (
            <React.Fragment>
              <Skeleton
                animation="wave"
                height={8}
                style={{ marginBottom: 0 }}
              />
              <Skeleton animation="wave" height={60} width={40} />
            </React.Fragment>
          ) : (
            <div className="footer-box" id="footerBox">
              <SendOutlinedIcon className="icon" />
              <p className="paragraphTag">
                {Intl.NumberFormat(language, { notation: "compact" }).format(
                  data?.share.length
                )}
              </p>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}

Media.propTypes = {
  loading: PropTypes.bool,
};

export default function CardCom({ data, loading, edit }) {
  const auth = getAuth();
  const [uid, setUid] = useState("");
  console.log("-------data-------", data);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("----userData---", user.uid);
        setUid(user.uid);
      } else {
      }
    });
  }, []);
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} style={{ padding: "15px" }}>
          {(loading ? Array.from(new Array(18)) : data).map((item, index) => (
            // here in item receives value form data var we passed
            <Grid size={{ xl: 2, lg: 3, md: 4, sm: 6, xs: 12 }}>
              <Media loading={loading} data={item} uid={uid} edit={edit} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}
