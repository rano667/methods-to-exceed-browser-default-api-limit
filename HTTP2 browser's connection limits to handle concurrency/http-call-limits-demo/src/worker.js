/* eslint-disable no-restricted-globals */

// worker.js
self.addEventListener('message', async (e) => {
    const apiUrl = e.data; // Get the API URL passed from the main thread
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      // Send the result back to the main thread
      self.postMessage({ status: 'fulfilled', data });
    } catch (error) {
      // Send an error response back to the main thread
      self.postMessage({ status: 'rejected', error: error.message });
    }
  });
  