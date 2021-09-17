import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [user, setuser] = useState();
  useEffect(() => {
    fetch(`/users/${userid}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
    }).then((res) =>
      res.json().then((result) => {
        console.log(result);
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
        followid: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };
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
          {/* <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src={user?.pic}
          /> */}
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
            <h6>40 post</h6>
            <h6>40 follwers</h6>
            <h6>40 folowing</h6>
          </div>
          <button
            className="btn waves-effect waves-light #1e88e5 blue darken-1"
            onClick={() => followUser()}
          >
            follow
          </button>
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
