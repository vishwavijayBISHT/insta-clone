import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

export default function Profile() {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setimage] = useState("");
  const [url, seturl] = useState("undefined");
  useEffect(() => {
    fetch("/myposts", {
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
    }).then((res) =>
      res.json().then((result) => {
        console.log(result);
        setPics(result.post);
      })
    );
  }, []);
  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "setu");
      fetch("https://api.cloudinary.com/v1_1/setu/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json)
            .then((result) => {
              console.log("inbody");
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: data.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);
  const updatephoto = (file) => {
    setimage(file);
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
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src={state ? state.pic : "Loading"}
          />
        </div>

        <div>
          <h4>{state ? state.name : ";loading"}</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6>40 post</h6>
            <h6>40 follwers</h6>
            <h6>40 folowwing</h6>
          </div>

          <div className="file-field input-field">
            <div className="btn #1e88e5 blue darken-1">
              <span>Update Pic</span>
              <input
                type="file"
                onChange={(e) => updatephoto(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
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
