import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const [mypics, setPics] = useState([]);

  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [user, setuser] = useState();
  console.log(state);
  const [sf, setsf] = useState(state?.followers?.includes(userid));
  useEffect(() => {
    fetch(`/users/${userid}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
    }).then((res) =>
      res.json().then((result) => {
        setPics(result.post);
        setuser(result.user);
      })
    );
  }, []);
  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.follower },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setuser({
          ...user,
          following: data.following.following,
          followers: data.follower.followers,
        });
        setsf(false);
      });
  };
  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.follower },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setuser({
          ...user,
          following: data.following.following,
          followers: data.follower.followers,
        });
        setsf(true);
      });
  };
  console.log(user);
  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src={user?.pic}
          />
        </div>
        <div>
          <h4>{user ? user.name : ";loading"}</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6>{mypics?.length} post</h6>
            <h6>{user?.followers.length} followers</h6>
            <h6>{user?.following.length} following</h6>
          </div>
          {sf ? (
            <button
              className="btn waves-effect waves-light #1e88e5 blue darken-1"
              onClick={() => followUser()}
            >
              Follow
            </button>
          ) : (
            <button
              className="btn waves-effect waves-light #1e88e5 blue darken-1"
              onClick={() => unfollowUser()}
            >
              Unfollow
            </button>
          )}
        </div>
      </div>
      <div className="gallary">
        {mypics.map((item) => {
          return (
            <img
              key={item._id}
              classname="item"
              src={item.photo}
              alt={item.title}
            />
          );
        })}
      </div>
    </div>
  );
}
