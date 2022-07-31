import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { dataActions } from "../store/data-slice";
import "./NavBar.scss";

const NavBar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.data.isLoggedIn);

  const loginHandler = () => {
    dispatch(dataActions.onLogin());
    localStorage.setItem("userLoggedIn", 1);
  };

  return (
    <header className="nav">
      <div className="nav__links">
        <NavLink
          to="/home"
          className={(navData) =>
            navData.isActive ? "nav__link--active" : "nav__link"
          }
        >
          Home
        </NavLink>
        {isLoggedIn && (
          <NavLink
            to="/favorites"
            className={(navData) =>
              navData.isActive ? "nav__link--active" : "nav__link"
            }
          >
            Favorites
          </NavLink>
        )}
      </div>

      {!isLoggedIn && (
        <button onClick={loginHandler} className="nav__button">
          Login
        </button>
      )}
    </header>
  );
};

export default NavBar;
