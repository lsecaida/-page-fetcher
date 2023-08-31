const fs = require("fs");
const https = require("https");
const { URL } = require("url");

// Check if the correct number of command line arguments is provided
if (process.argv.length !== 4) {
  console.error("Usage: node fetcher.js <URL> <localFilePath>");
  process.exit(1);
}

// Extract URL and local file path from command line arguments
const url = process.argv[2];
const localFilePath = process.argv[3];

// Function to download a file from a URL and save it locally
const downloadFile = (url, localFilePath, callback) => {
  const parsedURL = new URL(url);

  const options = {
    hostname: parsedURL.hostname,
    port: 443,
    path: parsedURL.pathname,
    method: "GET",
  };

  // Send an HTTP request to the URL
  const req = https.request(options, (res) => {
    let data = "";

    // Receive data in chunks and concatenate them
    res.on("data", (chunk) => {
      data += chunk;
    });

    // When all data is received, write it to the local file
    res.on("end", () => {
      // Write the data to the local file
      fs.writeFile(localFilePath, data, (err) => {
        if (err) {
          callback(`Error writing to local file: ${err}`);
        } else {
          callback(
            null,
            `Downloaded and saved ${data.length} bytes to ${localFilePath}.`
          );
        }
      });
    });
  });

  // Handle errors during the HTTP request
  req.on("error", (err) => {
    callback(`Error downloading the file: ${err}`);
  });

  // End the request
  req.end();
};

// Call the downloadFile function with the provided URL and local file path
downloadFile(url, localFilePath, (err, message) => {
  if (err) {
    console.error(err);
  } else {
    console.log(message);
  }
});
