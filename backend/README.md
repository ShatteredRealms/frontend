# Backend Orchestration
## Overview
The frontend communciates with the backend using gRPC and protobuf. Since this is a SPA/CSR application
grpc-web is used. This requires HTTP/2 support on the server side. The easiest way to achieve this is to use
envoy as a reverse proxy.

## Development
Start the backend services on their default ports. Run the following command to start the envoy proxy:
```bash
docker-compose up -d
```

To stop the envoy proxy run:
```bash
docker-compose down
```
