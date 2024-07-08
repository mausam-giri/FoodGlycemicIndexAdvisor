import { FormEvent, useState } from "react";
import "./App.css";
import axios from "axios";

interface ResponseItemType {
  fi: string;
  gi: string | number;
  sfd: string;
  rc: string;
}

function App() {
  const [response, setResponse] = useState<ResponseItemType[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorRes, setErrorRes] = useState(null);

  const url = "https://mausamgiri.pythonanywhere.com/airesponse";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const token = "your_token_here";

    try {
      const res = await axios.post(
        url,
        { image_url: imageUrl },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      setResponse(res.data);
      setLoading(false);
    } catch (error: any) {
      setErrorRes(error.response ? error.response.data : "Error");
      console.log(error.response ? error.response.data : "Error");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <input
              type="url"
              name="image_url"
              id="image_url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
            />
            <p className="img_instruction">
              (Only JPG, JPEG files allowed. Max Size: 3 Mb)
            </p>
            {imageUrl && <img src={imageUrl} alt="image placeholder" />}
            <button type="submit">Get Result</button>
          </form>
        </div>
        {loading && <div className="result-wrapper">Fetching Result ...</div>}
        {!loading && errorRes && (
          <div className="result-wrapper">
            Some error occured: <pre>{JSON.stringify(errorRes)}</pre>
          </div>
        )}
        {/* {response && JSON.stringify(response)} */}
        {!loading && !errorRes && (
          <div className="result-wrapper">
            {response &&
              response.map((item: ResponseItemType, index) => (
                <div key={index} className="food-item">
                  <div className="food-item-prop">
                    Food Item: <span>{item.fi}</span>
                  </div>
                  <div className="food-item-prop">
                    Glycemic Index: {item.gi}
                  </div>
                  <div className="food-item-prop">
                    Suitability for Diabetes: {item.sfd}
                  </div>
                  <div className="food-item-prop">
                    Recommended Consumption: {item.rc}
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="result-wrapper sum-gi">
          Total Glycemic Index:{" "}
          {response.reduce((acc, item) => acc + Number(item.gi), 0)}
        </div>
      </div>
    </>
  );
}

export default App;
