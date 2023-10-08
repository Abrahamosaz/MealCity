import React from "react";
import Logo from "../../../assets/404_page.png";
import "./NoMatch.css";
import { useNavigate } from "react-router-dom";

const NoMatch: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="nomatch__container">
      <div className="nomatch__content">
        <div className="nomatch__image__section">
          <img src={Logo} />
        </div>
        <div className="nomatch__text__section">
          <h1>Oops!</h1>
          <div>
            <p>something gone missing. we can't find</p>
            <p>the pageyou looking for.</p>
          </div>

          <button onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default NoMatch;
