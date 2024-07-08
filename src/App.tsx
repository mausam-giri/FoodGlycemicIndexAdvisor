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
  const [errorRes, setErrorRes] = useState({
    error: false,
    message: "",
  });

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
      setErrorRes({ error: false, message: "" });
      setLoading(false);
    } catch (error: any) {
      const errorMessage = error.response ? error.response.data : error.message;
      setErrorRes({
        error: true,
        message: errorMessage,
      });
      setLoading(false);
    }
  }

  function isPexelsUrl(url: string) {
    return url.includes("https://images.pexels.com");
  }

  function handleImage(url: string) {
    if (!isPexelsUrl(url)) {
      setImageUrl("");
      setErrorRes({
        error: true,
        message:
          "Image domain url not supported. Visit: https://www.pexels.com/search/food/",
      });
      return;
    }
    const modifier = "?auto=compress&cs=tinysrgb&w=480&h=400&dpr=1";
    const base_url = url.split("?")[0];
    const modified = base_url + modifier;
    setImageUrl(modified);
  }

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <h1 className="app-heading">Food Glycemic Index</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="url"
              name="image_url"
              id="image_url"
              value={imageUrl}
              onChange={(e) => handleImage(e.target.value)}
              placeholder="Enter image URL"
            />
            <p className="img_instruction">
              (Images from Pexels is supported now.{" "}
              <a href="https://www.pexels.com/search/food/" target="_blank">
                Click here
              </a>{" "}
              )
            </p>
            {imageUrl && <img src={imageUrl} alt="image placeholder" />}
            <button type="submit">Get Result</button>
          </form>
        </div>
        {loading && (
          <div className="result-wrapper fetch-result">Fetching Result ...</div>
        )}
        {!loading && errorRes.error && (
          <div className="result-wrapper error-result">
            Some error occured: <pre>{JSON.stringify(errorRes.message)}</pre>
          </div>
        )}
        {/* {response && JSON.stringify(response)} */}
        {!loading && !errorRes.error && response.length > 1 && (
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

        {!loading && response.length > 1 && (
          <div className="result-wrapper sum-gi">
            Total Glycemic Index:{" "}
            {response &&
              response.reduce((acc, item) => acc + Number(item.gi), 0)}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
