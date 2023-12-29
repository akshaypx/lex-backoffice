import React, { useState } from "react";
import Markdown from "react-markdown";

import styles from "./Tab2.module.scss";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Send } from "lucide-react";

const Tab2 = () => {
  const [imgData, setImgData] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [resultData, setResultData] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isloading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      if (imgData.length > 0 && prompt.length > 0) {
        const response = await fetch("http://localhost:8000/textfrombase64", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            imgData,
            type,
          }),
        });
        const result = await response.json();
        console.log(result);
        setResultData(result.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={styles.parentContainer}>
      <div className={styles.actions}>
        <input
          className={styles.input1}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              var file = e.target.files[0];
              let reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => {
                console.log(reader);
                if (reader.result) {
                  setImgData(
                    reader.result
                      .toString()
                      .substring(reader.result.toString().indexOf(",") + 1)
                  );
                  console.log(
                    reader.result
                      .toString()
                      .substring(5, reader.result.toString().indexOf(";"))
                  );
                  setType(
                    reader.result
                      .toString()
                      .substring(5, reader.result.toString().indexOf(";"))
                  );
                }
              };
              reader.onerror = function (error) {
                console.log("Error: ", error);
              };
            } else {
              setImgData("");
            }
          }}
        />
        {/* <input
          className={styles.input2}
          type="text"
          value={prompt}
          placeholder="Enter prompt"
          onChange={(e) => setPrompt(e.target.value)}
        /> */}
        <InputText
          className={styles.input2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        {/* <button onClick={fetchData}>fetch</button> */}
        <Button
          onClick={() => {
            setIsLoading(true);
            fetchData().then(() => setIsLoading(false));
          }}
          icon={isloading ? "pi pi-spin pi-spinner" : <Send />}
          disabled={isloading}
        />
      </div>
      <div className={styles.header}>
        <h3>Response</h3>
      </div>
      <div className={styles.markdownContainer}>
        <Markdown>{resultData}</Markdown>
      </div>
    </div>
  );
};

export default Tab2;
