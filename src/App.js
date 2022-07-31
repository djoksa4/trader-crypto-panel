import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { dataActions } from "./store/data-slice";

import ScrollToTop from "./Utility Components/ScrollToTop";
import PageNotFound from "./pages/PageNotFound";
import NavBar from "./Components/NavBar";
import LiveList from "./pages/LiveList";
import Details from "./pages/Details";

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.data.isLoggedIn);

  useEffect(() => {
    const setupConnection = async () => {
      // GET FIRST 5 CURRENCY PAIRS FROM THE REST API
      const getPairs = async () => {
        try {
          const response = await fetch("/v1/symbols");
          if (!response.ok) {
            throw new Error("Fetch error!");
          }
          const data = await response.json();

          return data.slice(0, 5).map((pair) => pair.toUpperCase());
        } catch (err) {
          console.log(err);
        }
      };

      const pairs = await getPairs();

      // SETUP WEBSOCKET SUBSCRIPTIONS
      const ws = new WebSocket("wss://api.bitfinex.com/ws/1");

      // RECIEVE AND HANDLE WEBSOCKET RESPONSE (SUBSCRIPTIONS AND DATA)
      ws.onmessage = (msg) => {
        const parsedMsg = JSON.parse(msg.data);

        if (!Array.isArray(parsedMsg) && parsedMsg.event === "subscribed") {
          // SUBSCRIPTION RESPONSE

          dispatch(
            dataActions.onSubsrcibe({
              pair: parsedMsg.pair,
              channelId: parsedMsg.chanId,
              fav: false,
            })
          );
        } else if (Array.isArray(parsedMsg) && parsedMsg[1] !== "hb") {
          // ACTUAL DATA STREAM

          dispatch(
            dataActions.update({
              channelId: parsedMsg[0],
              lastPrice: parsedMsg[7],
              dailyChange: parsedMsg[5],
              dailyChangePercent: parsedMsg[6],
              dailyHigh: parsedMsg[9],
              dailyLow: parsedMsg[10],
            })
          );
        }
      };

      // REQUEST WEBSOCKET SUBSCRIPTIONS FOR EACH OF THE PAIRS
      ws.onopen = (event) => {
        pairs.forEach((pair) => {
          ws.send(
            JSON.stringify({
              event: "subscribe",
              channel: "ticker",
              pair: pair,
            })
          );
        });
      };
    };
    setupConnection();

    // PERSISTENT LOGIN
    const persistentLogin = localStorage.getItem("userLoggedIn");
    if (persistentLogin === "1") {
      dispatch(dataActions.onLogin());
    }
  }, []);

  return (
    <>
      <NavBar />

      <main>
        <ScrollToTop>
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<LiveList />} />

            {isLoggedIn && (
              <Route
                path="/favorites"
                element={<LiveList content="favorites" />}
              />
            )}

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
