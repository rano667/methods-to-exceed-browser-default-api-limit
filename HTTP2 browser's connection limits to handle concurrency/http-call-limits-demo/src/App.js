import React, { useState } from "react";
import axios from "axios";

const TOTAL_REQUESTS = 10; // Number of simultaneous HTTP requests to test

function App() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeHttpCalls = async () => {
    setLoading(true);
    setResponses([]);
    setError(null);

    const apiUrl = "https://localhost:4000/delayed-response";
    const requests = [];

    for (let i = 1; i <= TOTAL_REQUESTS; i++) {
      requests.push(axios.get(apiUrl)); // Removed https agent
    }

    try {
      const results = await Promise.allSettled(requests);
      const formattedResponses = results.map((result, index) => {
        if (result.status === "fulfilled") {
          return {
            id: index + 1,
            status: "success",
            data: result.value.data,
          };
        } else {
          return {
            id: index + 1,
            status: "error",
            error: result.reason.message,
          };
        }
      });

      setResponses(formattedResponses);
    } catch (err) {
      setError("Something went wrong with the HTTP calls");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "50px" }}>
      <h1>HTTP/2 Call Concurrency Test</h1>
      <button onClick={makeHttpCalls} disabled={loading}>
        {loading ? "Making Requests..." : `Make ${TOTAL_REQUESTS} HTTP Calls`}
      </button>

      {loading && <p>Waiting for the API responses...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && responses.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>API Responses</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "10px" }}>
                  Request ID
                </th>
                <th style={{ border: "1px solid black", padding: "10px" }}>
                  Status
                </th>
                <th style={{ border: "1px solid black", padding: "10px" }}>
                  Message
                </th>
                <th style={{ border: "1px solid black", padding: "10px" }}>
                  Delay (s)
                </th>
                <th style={{ border: "1px solid black", padding: "10px" }}>
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => (
                <tr key={response.id}>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {response.data ? response.data.requestId : response.id}
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {response.status === "success" ? "✅ Success" : "❌ Error"}
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {response.data ? response.data.message : "N/A"}
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {response.data
                      ? response.data.delayInSeconds.toFixed(2)
                      : "N/A"}
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {response.data ? response.data.timestamp : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
