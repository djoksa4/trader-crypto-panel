import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import "./LiveList.scss";

const LiveList = () => {
  const location = useLocation();
  const allPairs = useSelector((state) => state.data.pairs);

  // console.log(location); location.pathname = '/home'

  const favoritedPairs = allPairs.filter((pair) => pair.fav === true);

  const rows = (location.pathname === "/home" ? allPairs : favoritedPairs).map(
    (pair) => (
      <tr key={pair.channelId}>
        <td>
          <Link to={`/details/${pair.pair}`}>{pair.pair}</Link>
        </td>
        <td>{pair.lastPrice}</td>
        <td>{pair.dailyChange}</td>
        <td>{pair.dailyChangePercent}%</td>
        <td>{pair.dailyHigh}</td>
        <td>{pair.dailyLow}</td>
      </tr>
    )
  );

  return (
    <div className="livelist">
      <table className="livelist__table">
        <thead className="livelist__table-header">
          <tr>
            <th>Name</th>
            <th>Last</th>
            <th>Change</th>
            <th>Change Percent</th>
            <th>High</th>
            <th>Low</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

export default LiveList;

{
  /* <table>
      <tr>
        
      </tr>
    </table> */
}
