import React, { useState } from "react";
import styles from "./Gemini.module.scss";
import { Button } from "primereact/button";
import Gemini from "./Gemini";
import Tab2 from "./Tab2";
import Tab3 from "./Tab3";
import Tab4 from "./Tab4";

const tabs = [<Gemini />, <Tab2 />, <Tab3 />, <Tab4 />];

const MainPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftPanel}>
        <Button
          onClick={() => setActiveIndex(0)}
          className={activeIndex === 0 ? "" : "p-button-text"}
          label="Chat with Gemini"
        />
        <Button
          onClick={() => setActiveIndex(1)}
          className={activeIndex === 1 ? "" : "p-button-text"}
          label="Data Extraction from Image"
        />
        <Button
          onClick={() => setActiveIndex(2)}
          className={activeIndex === 2 ? "" : "p-button-text"}
          label="Multiple Image Data Extraction"
        />
        <Button
          onClick={() => setActiveIndex(3)}
          className={activeIndex === 3 ? "" : "p-button-text"}
          label="Image Generation"
        />
      </div>
      <div className={styles.rightPanel}>
        {tabs.filter((comp, index) => index === activeIndex && comp)}
      </div>
    </div>
  );
};

export default MainPage;
