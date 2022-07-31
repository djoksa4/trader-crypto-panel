import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { dataActions } from "./store/data-slice";
import { fetchData, setupWebsocketSub } from "./store/data-actions";

import ScrollToTop from "./Utility Components/ScrollToTop";
import PageNotFound from "./pages/PageNotFound";
import NavBar from "./Components/NavBar";
import LiveList from "./pages/LiveList";
import Details from "./pages/Details";

let isInitial = true;

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.data.isLoggedIn);
  const favorites = useSelector((state) => state.data.favorites);

  // INITIAL LOAD SIDE EFFECTS
  useEffect(() => {
    const setupConnection = async () => {
      // Get initial pairs and transform them
      const allPairs = await fetchData("/v1/symbols");
      const pairs = allPairs.slice(0, 5).map((pair) => pair.toUpperCase());

      // Setup websocket and handle reponses thunk
      dispatch(setupWebsocketSub(pairs));
    };

    setupConnection();

    // Persistent login
    const persistentLogin = localStorage.getItem("userLoggedIn");
    if (persistentLogin === "1") {
      dispatch(dataActions.onLogin());
    }

    // Persistent favorites load
    const retrievedFavorites = JSON.parse(localStorage.getItem("favorites"));
    dispatch(dataActions.loadFavorites(retrievedFavorites || []));
  }, []);

  // PERSISTENT FAVORITES SIDE EFFECTS
  useEffect(() => {
    // Prevent pushing an empty array when redux state is initiated
    if (isInitial) {
      isInitial = false;
      return;
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <>
      <NavBar />

      <main>
        <ScrollToTop>
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<LiveList />} />

            <Route
              path="/favorites"
              element={
                isLoggedIn ? <LiveList /> : <Navigate replace to="/home" />
              }
            />

            <Route path="/details">
              <Route index element={<Navigate replace to={"/home"} />} />
              <Route path=":pair" element={<Details />} />
            </Route>

            <Route path="/404" element={<PageNotFound />} />
            <Route path="*" element={<Navigate replace to={"/404"} />} />
          </Routes>
        </ScrollToTop>
      </main>
    </>
  );
};

export default App;
