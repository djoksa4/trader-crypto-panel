import { dataActions } from "./data-slice";

// API CALL HELPER FUNCTION
export const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Fetch request failed!");
    }
    const data = await response.json();

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

// SETUP WEBSOCKET AND HANDLE RESPONSES THUNK
export const setupWebsocketSub = (pairs) => {
  return async (dispatch) => {
    try {
      // Initiate websocket
      const ws = new WebSocket("wss://api.bitfinex.com/ws/1");

      // Recieve and handle websocket reponse (subscription and data)
      ws.onmessage = (msg) => {
        const parsedMsg = JSON.parse(msg.data);

        if (!Array.isArray(parsedMsg) && parsedMsg.event === "subscribed") {
          // subscription response - pushes objects into redux, links pairs(names) with channelIDs

          dispatch(
            dataActions.onSubsrcibe({
              pair: parsedMsg.pair,
              channelId: parsedMsg.chanId,
            })
          );
        } else if (Array.isArray(parsedMsg) && parsedMsg[1] !== "hb") {
          // actual data stream, updates previously pushed objects with incoming information

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

      // Request a websocket subsription for each pair
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
    } catch (err) {
      throw new Error(err);
    }
  };
};
