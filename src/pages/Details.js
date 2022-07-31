import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchData } from "../store/data-actions";
import { dataActions } from "../store/data-slice";
import "./Details.scss";

const Details = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [pairInfo, setPairInfo] = useState({});

  const favorited = useSelector((state) =>
    state.data.favorites.includes(params.pair)
  );

  const isLoggedIn = useSelector((state) => state.data.isLoggedIn);

  // Load details from API
  useEffect(() => {
    const getInfo = async () => {
      try {
        const pairData = await fetchData(`/v1/pubticker/${params.pair}`);
        setPairInfo(pairData);
      } catch (err) {
        console.log(err);
      }
    };

    getInfo();
  }, []);

  // Add / remove favorite handler
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
            favorited
              ? "details__button-remove details__button"
              : "details__button-add details__button"
          }
        >
          {favorited ? "Remove from Favorites" : "Add to Favorites"}
        </button>
      )}
    </div>
  );
};

export default Details;
