import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

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
  "ya29.a0AfB_byBqnwhoK6I9L8jRNlVRTZc7E3gZu0vBMwmSgF1o-x7idW8uTaZhNy13ZVecWPnBnVFG8_8oRids9g09L1aXGdU4RiYe_t8ufp76vRGSEGe3PGFdatP2aIx5mggjL7QW-igYObwpecBdWprQo40_E9yosd3rVweMlbc2Wt8LaCgYKAbMSARESFQHGX2MiD9dcwu-Jr-vJWhXclUjrrw0179";

const Tab4 = () => {
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(1);
  const [images, setImages] = useState<string[]>([]);
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
    }
  };

  return (
    <div>
      <h3>Image Generation using Imaged</h3>
      <InputText value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <Button onClick={() => fetchData()} label="Generate" />
      <InputText
        keyfilter="int"
        placeholder="Integers"
        max={8}
        min={1}
        value={`${count}`}
        onChange={(e) => setCount(parseInt(e.target.value, 10))}
      />
      {/* <button onClick={() => fetchData()}>Fetch</button> */}
      <div>
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
