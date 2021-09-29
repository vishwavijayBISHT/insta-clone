import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";

export default function Navbar() {
  const { state, dispatch } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const history = useHistory();
  const searchModal = useRef(null);
  const [userDetail, setuserdetail] = useState([]);
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);
  const fetchuser = (query) => {
    setSearch(query);

    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        query: query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results);

        setuserdetail(results.user);
      });
  };
  const renderList = () => {
    if (state) {
      return [
        <li>
          <i
            data-target="modal1"
            className="large material-icons modal-trigger"
            style={{ color: "black" }}
          >
            search
          </i>
        </li>,
        <li>
          <Link to="/profile">Profile</Link>
        </li>,
        <li>
          <Link to="/createpost">Create Post</Link>
        </li>,
        <li>
          <Link to="/myfollowerspost">My Following Post</Link>
        </li>,
        <li>
          <button
            className="btn waves-effect waves-light #1e88e5 blue darken-1"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/login");
            }}
          >
            LogOut
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/login">Login</Link>
        </li>,
        <li>
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/login"} className="brand-logo left">
          InstaGram
        </Link>
        <ul id="nav-mobile" className="right ">
          {renderList()}
        </ul>
      </div>
      <div
        id="modal1"
        className="modal"
        ref={searchModal}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e) => fetchuser(e.target.value)}
          />
          <ul className="collection">
            {userDetail.map((item) => {
              return (
                <Link
                  to={
                    item._id !== state._id ? "/profile/" + item._id : "/profile"
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch("");
                  }}
                >
                  <li className="collection-item">{item.email}</li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect-waves-green btn-flat"
            onClick={() => setSearch("")}
          >
            close
          </button>
        </div>
      </div>
    </nav>
  );
}
