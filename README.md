# About

Hi there,<br>
I would like to present a small challenge task.
The main purpose is to create a URL shortener service.
The service takes long URLs as input and provides shortened, unique aliases that redirect to the original URLs.

## Start

The simplest way to run the service is by starting it in a Docker container:<br>

```
docker-compose up
```

## Call API

To use this service You can:

- **Open the web console** http://localhost:3000/api/v1/shortener<br>
  Use the following mutation to add a new record:
  ```
    mutation {
       shortenUrl(originalUrl: "https://example17.com")
    }
  ```
- **Use a VSCode plugin:** Refer to the file [http.http](./http.http)
- **Use the** curl **utility:**
  ```
  curl -X POST http://localhost:3000/api/v1/shortener \
  -H "Content-Type: application/json" \
  -d ' {"query": "mutation {\n  shortenUrl(originalUrl: \"https://example.com\")\n}\n"}'
  ```
- ...

## System Design

### Technology stack

Technology Stack
The technology stack was limited and defined in the challenge task description.<br>
For a production-grade version, I would suggest using **AWS Lambda** and **DynamoDB**.

Using GraphQL may seem overengineered for this use case.

### Implementation

To make this system scalable, I chose to implement stateless services.<br>
These services are designed as a single module for simplicity, ensuring ease of development and maintenance.

### Simplification

For simplification, this service does not allow editing or deleting stored links.<br>
If you try to shorten an existing URL, the service will return the already stored shortened link.

### Choosing a Short URL Alias Algorithm

- **Hashing**
- **Base62 Encoding**

To avoid collisions and eliminate the need for additional database checks (which would lead to extra DB access) or advanced techniques like a Bloom Filter (which is definitely outside the scope of this task),
I chose **Encoding**.

### Distributed unique ID

To generate unique IDs that can be used across multiple nodes while preserving chronological order, a composite 64-bit ID is utilized.

ID Structure:

- **Timestamp (41 bits):** Represents the number of milliseconds elapsed since the beginning of 2025.
- **Data NODE ID (4 bits):** Allows for 2⁴ = 16 nodes (data centers).
- **Machine ID (3 bits):** Allows for 2³ = 8 machines per node.
- **Sequence Number (8 bits):** Enables each machine to generate up to 2⁸ = 256 unique IDs per millisecond.

<br>This design ensures efficient and scalable ID generation, making it suitable even for high-load production environments.

### Possible usecases

This containerized solution can be deployed on Kubernetes or other auto-scaling platforms in combination with a load balancer.

Since customers will primarily read rather than write data, it is recommended to integrate a caching system to improve performance.

## Refeerence

In conclusion, I would like to recommend the book that inspired me:<br>
**System Design Interview** by **Alex Xu**.
