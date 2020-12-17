import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

export default function Signup() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setimage] = useState("");
  const [url, seturl] = useState(undefined);
  useEffect(() => {
    if (url) {
      uploadfields();
    }
  }, [url]);
  const uploadpic = () => {
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
        seturl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const uploadfields = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "invalid email", classes: "#d32f2f red darken-2" });
      return;
    }

    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#d32f2f red darken-2" });
        } else {
          M.toast({ html: data.massage, classes: "#388e3c green darken-2" });
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const postdata = () => {
    if (image) {
      uploadpic();
    } else {
      uploadfields();
    }
  };
  return (
    <div className="mycart">
      <div className="card auth-card input-field ">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="emial"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="file-field input-field">
          <div className="btn #1e88e5 blue darken-1">
            <span>Upload Pic</span>
            <input type="file" onChange={(e) => setimage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect waves-light #1e88e5 blue darken-1"
          onClick={() => postdata()}
        >
          SignUp
        </button>
        <h5>
          <Link to="/login">Already have account?</Link>
        </h5>
      </div>
    </div>
  );
}
