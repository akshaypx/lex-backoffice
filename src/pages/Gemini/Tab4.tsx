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
  "ya29.a0AfB_byB089RBQ7leThgQQXBTLR-PvqN7AqkJaS_hp7gYiBA0Th_BLz_6AMCRX7uFkYRn0QKnjT6OPR-ODKh-L-kNB_KUFxii7Vq106XkEcrCL-sJmZEJkPe0jAxDbu0rTjeFzHfQydMNpToU3NrceNSlzhs8uuc6xrXtYHsk7D11aCgYKAQQSARESFQHGX2MiCpqV6MbQybPXR7jgLh9IEg0179";

const Tab4 = () => {
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [isloading, setIsLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const showToast = (msg: string) => {
    toast.current!.show({
      severity: "info",
      summary: "Info",
      detail: msg,
    });
  };

  const fetchData = async () => {
    console.log(count);
    try {
      setImages([]);
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
      if (response.status === 200) {
        console.log(result);
        Array.from(result!.predictions!).map((data) =>
          setImages((prevState) => [
            ...prevState,
            "data:" + data.mimeType + ";base64," + data.bytesBase64Encoded,
          ])
        );
      } else {
        const err: any = result;
        showToast(err.error.message);
        console.log("res");
        console.log("result", result);
      }
    } catch (err: any) {
      console.log("err", err);
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
