import React, { useState, useEffect } from "react";
import axios from "../src/api/axios";

const Footer = () => {
  const [marqueeText2, setMarqueeText2] = useState("");

  useEffect(() => {
    const loadMarquee = async () => {
      try {
        const res = await axios.get("/marquee");
        setMarqueeText2(res.data.text2 || "");
      } catch (err) {
        console.error("Failed to load marquee");
      }
    };

    loadMarquee();
  }, []);

  return (
    <footer className="footer  py-4">
      <marquee behavior="scroll" direction="left">
        {marqueeText2}
      </marquee>
    </footer>
  );
};

export default Footer;
