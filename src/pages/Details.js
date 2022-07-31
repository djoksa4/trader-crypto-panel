import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { dataActions } from "../store/data-slice";
import "./Details.scss";

const Details = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const pairData = useSelector((state) =>
    state.data.pairs.find((pair) => pair.pair === params.pair)
  );
  const isLoggedIn = useSelector((state) => state.data.isLoggedIn);
  const [pairInfo, setPairInfo] = useState({});

  useEffect(() => {
    const getInfo = async () => {
      try {
        const response = await fetch(`/v1/pubticker/${params.pair}`);
        if (!response.ok) {
          throw new Error("Fetch error!");
        }
        const data = await response.json();

        setPairInfo(data);
      } catch (err) {
        console.log(err);
      }
    };

    getInfo();
  }, []);

  const toggleFavHandler = () => {
    dispatch(dataActions.toggleFav(params.pair));
  };

  return (
    <div className="details">
      <table className="details__table">
        <thead className="details__table-header">
          <tr>
            <th>Symbol</th>
            <th>Last Price</th>
            <th>High</th>
            <th>Low</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{params.pair}</td>
            <td>{pairInfo.last_price}</td>
            <td>{pairInfo.high}</td>
            <td>{pairInfo.low}</td>
          </tr>
        </tbody>
      </table>

      {isLoggedIn && (
        <button
          onClick={toggleFavHandler}
          className={
            pairData.fav
              ? "details__button-remove details__button"
              : "details__button-add details__button"
          }
        >
          {pairData.fav ? "Remove from Favorites" : "Add to Favorites"}
        </button>
      )}
    </div>
  );
};

export default Details;
