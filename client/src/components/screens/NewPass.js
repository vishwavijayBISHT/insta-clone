import React, { useState, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";

export default function Login() {
  const history = useHistory();
  const { token } = useParams();
  console.log(token);
  const [password, setPassword] = useState("");

  const postdata = () => {
    fetch("/newpass", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#d32f2f red darken-2" });
        } else {
          M.toast({
            html: data.message,
            classes: "#388e3c green darken-2",
          });
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field ">
        <h2>Instagram</h2>

        <input
          type="password"
          placeholder="Enter a new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #1e88e5 blue darken-1"
          onClick={() => postdata()}
        >
          update password
        </button>
      </div>
    </div>
  );
}
