import React, { useState } from "react";
import axios from "axios";

const TOTAL_REQUESTS = 12; // Number of simultaneous HTTP requests to test

function App() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate HTTP calls to different "subdomains" (ports)
  const makeHttpCalls = async () => {
    setLoading(true);
    setResponses([]);
    setError(null);

    const ports = [4001, 4002]; // Simulate different "subdomains" by using different ports
    const apiUrls = ports.map(
      (port) => `http://localhost:${port}/delayed-response`
    );

    const requests = [];

    for (let i = 1; i <= TOTAL_REQUESTS; i++) {
      const url = apiUrls[i % apiUrls.length]; // Cycle through the ports
      requests.push(axios.get(url));
    }

    try {
      const results = await Promise.allSettled(requests);
      setResponses(results);
    } catch (err) {
      setError("Something went wrong with the HTTP calls");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "50px" }}>
      <h1>HTTP Call Concurrency Test (Local Ports as Subdomains)</h1>
      <p>
        Click the button below to make {TOTAL_REQUESTS} simultaneous HTTP
        requests to different ports simulating subdomains.
      </p>
      <button onClick={makeHttpCalls} disabled={loading}>
        {loading ? "Making Requests..." : `Make ${TOTAL_REQUESTS} HTTP Calls`}
      </button>

      {loading && <p>Waiting for the API responses...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && responses.length > 0 && (
        <div>
          <h3>Results:</h3>
          <ul>
            {responses.map((response, index) => (
              <li key={index} style={{ margin: "10px 0" }}>
                {response.status === "fulfilled" ? (
                  <span>
                    ✅ Request {index + 1}:{" "}
                    {JSON.stringify(response.value.data)}
                  </span>
                ) : (
                  <span>❌ Request {index + 1}: Failed</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
