# HTTP/2 Server with Node.js

This project demonstrates how to create an HTTP/2 server using Node.js. The server includes SSL/TLS configuration and a sample delayed response endpoint. This create simulation apis to test the max browser limit of making 6 api calls. But http2 supports multiplexing. So, all the api calls can be pushed to the server by making a single handshake. 

## Prerequisites

- **Node.js** installed (version 10+)
- **SSL/TLS Certificates**: You need a certificate and a private key for HTTPS. You can create self-signed certificates for testing purposes or use certificates from a trusted authority.

## Setup

1. **Create a Certificate and Key**

   Place your SSL/TLS certificate and private key files in a `cert` directory at the root of your project.

   - `cert/server.key` - Private key file
   - `cert/server.cert` - Certificate file

   For local development, you can create a self-signed certificate with OpenSSL:

   ```bash
   mkdir cert
   openssl req -x509 -newkey rsa:4096 -keyout cert/server.key -out cert/server.cert -days 365 -nodes

### Installation
Clone the repository to your local machine.

Open a terminal and navigate to the project directory.

Run the following command to install the necessary dependencies:

```bash
npm install
```
This command installs all packages required by the project.

### Starting the Project
To start the development server, run:

```bash
npm start
```

This command launches the application, and you can view it in your browser.

Happy coding!