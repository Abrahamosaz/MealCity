import React, { useState } from "react";
import "./LandingPage.css";
import { motion } from "framer-motion";
import TypeWriter from "typewriter-effect";

const LandingPage: React.FC = () => {
  const [isShow, setIsShow] = useState<{ getStat: boolean; explore: boolean }>({
    getStat: true,
    explore: false,
  });

  return (
    <div className="landingpage__container">
      <div className="landingpage__content">
        <motion.div
          whileInView={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, type: "tween" }}
          className="landing__content__first"
        >
          <div className="landing__phase">
            <p>Elevate Your Food</p>
            <p>Business Online.</p>
            <TypeWriter
              options={{
                autoStart: true,
                loop: true,
                delay: 40,
                strings: ["Fast .", "Secure.", "We offer reliable services."],
              }}
            />{" "}
          </div>
          <div className="landing__phase__text">
            <p>
              Transform your food business with our cutting-edge platform,
              empowering you to take your culinary creations online and reach a
              wider audience like never before
            </p>
          </div>
          <div className="landing__btn">
            <button
              style={{ cursor: "pointer" }}
              onClick={() => {
                setIsShow({ getStat: true, explore: false });
              }}
              className={isShow.getStat ? "active" : "inactive"}
            >
              Get Started
            </button>
            <button
              style={{ cursor: "pointer" }}
              onClick={() => {
                setIsShow({ getStat: false, explore: true });
              }}
              className={+isShow.explore ? "active" : "inactive"}
            >
              Explore shops
            </button>
          </div>
        </motion.div>
        {/* <div className="landing__content__second">
          <div className="img__section"></div>
        </div> */}
      </div>
    </div>
  );
};

export default LandingPage;
