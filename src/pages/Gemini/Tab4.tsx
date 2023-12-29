import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useRef, useState } from "react";

import styles from "./Tab4.module.scss";
import { InputTextarea } from "primereact/inputtextarea";
import { Sparkles } from "lucide-react";
import { Toast, ToastProps } from "primereact/toast";

interface Response {
  predictions?: PredictionsEntity[] | null;
  deployedModelId: string;
}
interface PredictionsEntity {
  mimeType: string;
  bytesBase64Encoded: string;
}

const PROJECT_ID = "test1-ywpq";
//gcloud auth print-access-token
const ACCESS_TOKEN =
  "ya29.a0AfB_byBRia0MllUJy-jODawrRgOcJGgRzIZBeeD3fKz5iD7u3XV7TaU9CWvxtWw1-Dt-x7awpxGfNHJJqtEVLOUPcqN9h9e6oBUTOtOD6r_bSfypam-Fhe6S77rxwQnC2BFuOD5NI3RQTaVkAcSH4OgxszI-kQCX6MFFM99ctsIfaCgYKAdsSARESFQHGX2Mi6w1KO_llNjzxjdckntDF-g0179";

const Tab4 = () => {
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [isloading, setIsLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const showToast = () => {
    toast.current!.show({
      severity: "info",
      summary: "Info",
      detail: "Message Content",
    });
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/imagegeneration:predict`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instances: [
              {
                prompt,
              },
            ],
            parameters: {
              sampleCount: count,
            },
          }),
        }
      );
      const result: Response = await response.json();
      Array.from(result!.predictions!).map((data) =>
        setImages((prevState) => [
          ...prevState,
          "data:" +
            result!.predictions![0].mimeType +
            ";base64," +
            result!.predictions![0].bytesBase64Encoded,
        ])
      );
    } catch (err) {
      console.log(err);
      showToast();
    }
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <h3>Imagen for Image Generation</h3>
      <div className={styles.actions}>
        <InputTextarea
          className={styles.inputarea}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className={styles.actionsInner}>
          <InputText
            className={styles.innerInput}
            keyfilter="int"
            placeholder="Integers"
            max={8}
            min={1}
            value={`${count}`}
            onChange={(e) => setCount(parseInt(e.target.value, 10))}
          />
          <Button
            onClick={() => {
              setIsLoading(true);
              fetchData().then(() => setIsLoading(false));
            }}
            disabled={isloading}
            icon={isloading ? "pi pi-spin pi-spinner" : <Sparkles />}
          />
        </div>
      </div>
      {/* <button onClick={() => fetchData()}>Fetch</button> */}
      <div className={styles.gallery}>
        {images.length > 0 &&
          images.map((image, index) => (
            <img
              key={index}
              style={{ height: "200px", width: "200px" }}
              src={image}
              alt=""
            />
          ))}
      </div>
    </div>
  );
};

export default Tab4;
