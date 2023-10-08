import React from "react";
import "./Footer.css";
import { BsFacebook, BsInstagram, BsLinkedin } from "react-icons/bs";
import { PiHandWavingDuotone } from "react-icons/pi";

const Footer: React.FC = () => {
  return (
    <div className="footer__container">
      <div className="footer__content">
        <div className="upper__section">
          <div>
            <p>Hello</p>
            <PiHandWavingDuotone />
          </div>
          <div>
            <h3>Ready to started? Get in touch with us</h3>
            <button>contact</button>
          </div>
        </div>
        <hr
          style={{
            width: "100%",
            marginTop: "1.5rem",
            backgroundColor: "#252c31",
            outline: "none",
            border: "1px solid #252c31",
          }}
        />
      </div>
      <div className="lower__section">
        <div className="footer__sec">
          <h3>MeetCity</h3>
          <div className="footer__icons">
            <BsFacebook />
            <BsInstagram />
            <BsLinkedin />
          </div>
        </div>
        <div>
          <div className="footer__sec">
            <h3>ABOUT US</h3>
            <p>Company</p>
            <p>Our team</p>
            <p>life at MealCity</p>
          </div>
          <div className="footer__sec">
            <h3>PRODUCTS</h3>
            <p>online shops</p>
            <p>fast delivery</p>
          </div>
          <div className="footer__sec">
            <h3>SUPPORT</h3>
            <p>Raise a support ticket</p>
            <p>Privacy & Terms</p>
            <p>Site Maps</p>
          </div>
        </div>
      </div>
      <div className="footer__tag">
        <p>COPYRIGHT @ MEALCITY</p>
        <p>ALL RIGHTS RESERVED</p>
      </div>
    </div>
  );
};

export default Footer;
