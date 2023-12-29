import React, { useState } from "react";
import Markdown from "react-markdown";

import styles from "./Tab2.module.scss";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Send } from "lucide-react";

interface IImageParts {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

// interface multipleImages {
//   imageParts: IImageParts[];
// }

const Tab3 = () => {
  //   const [imgData, setImgData] = useState<string>("");
  //   const [type, setType] = useState<string>("");
  const [images, setImages] = useState<IImageParts[]>([]);
  const [resultData, setResultData] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isloading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      if (images) {
        const response = await fetch("http://localhost:8000/textfrombase64m", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            imageParts: images,
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
              const files = e.target.files;
              Array.from(files).map((f) => {
                let reader = new FileReader();
                reader.onload = () => {
                  if (reader.result) {
                    const base64Data = reader.result.toString().split(",")[1];
                    const mimeType = reader.result
                      .toString()
                      .split(";")[0]
                      .split(":")[1];
                    // console.log("Base64 Data:", base64Data);
                    // console.log("MIME Type:", mimeType);

                    setImages((prevImages) => [
                      ...prevImages,
                      {
                        inlineData: {
                          data: base64Data,
                          mimeType: mimeType,
                        },
                      },
                    ]);
                  }
                };
                reader.onerror = function (error) {
                  console.log("Error: ", error);
                };
                reader.readAsDataURL(f);
                return null; // This is necessary to avoid a warning about unhandled promises
              });
              //   console.log(newdata);
            } else {
              console.log("no file selected!");
            }
          }}
        />
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

export default Tab3;
