# QuickNotes System Architecture

## 1. Overview

QuickNotes is a web application that allows users to create, view, and delete notes. The current project demonstrates API requests using JSONPlaceholder. A production version would use a backend service and a persistent database.

## 2. Architecture diagram

```text
                  Users / Browsers
                         |
                         v
                    DNS Service
                         |
                         v
                    CDN / WAF
                         |
                         v
                   Load Balancer
                    /          \
                   v            v
             App Server 1    App Server 2
                   \            /
                    \          /
                     v        v
                    Primary Database
                           |
                           v
                       Read Replica

              App Servers
                   |
                   v
                Job Queue
                   |
                   v
              Background Worker

              App Servers <--> Cache
```

## 3. Component responsibilities

### DNS service

Translates the application's domain name into the appropriate network address.

### CDN and web application firewall (WAF)

The CDN caches static assets such as CSS, JavaScript, and images near users to reduce latency. A WAF can filter some malicious requests before they reach the application.

### Load balancer

Distributes incoming requests across multiple application servers. Health checks help it avoid sending traffic to unhealthy instances.

### Application servers

Run backend business logic, validate requests, authenticate users, and communicate with the database. Two or more servers improve availability and allow the application to handle more traffic.

### Cache

Stores frequently accessed data temporarily to reduce repeated database queries. Cache entries need expiration and invalidation rules to prevent stale results.

### Primary database

Stores authoritative user accounts, notes, and tags. Writes are sent to the primary database.

### Read replica

Receives replicated database changes and can serve suitable read queries. Replication may be delayed, so recently written data may not appear immediately on a replica.

### Job queue and background worker

The queue holds tasks that do not need to finish during the original request, such as sending email notifications. Workers process queued tasks and retry temporary failures safely.

## 4. Request flows

### GET: Retrieve notes

1. The browser sends a request to the application's API.
2. DNS resolves the domain, and the request passes through the CDN/WAF and load balancer.
3. An application server authenticates the user and validates the request.
4. The server checks the cache for the requested notes.
5. If the cache misses, the server reads from the database or a suitable read replica.
6. The server returns a JSON response to the browser.

### POST: Create a note

1. The browser submits the note title and body to the API.
2. The load balancer forwards the request to a healthy application server.
3. The server authenticates the user and validates the title and body.
4. The server writes the note to the primary database within a transaction.
5. The server invalidates or updates affected cache entries.
6. The server returns a success response, typically `201 Created`.

## 5. Scaling to one million users

One million registered users do not necessarily mean one million simultaneous requests. Capacity planning should begin by measuring active users, request rates, note sizes, and read/write patterns.

Potential improvements include:

- Add application server instances as traffic increases.
- Use connection pooling to manage database connections.
- Cache popular or frequently accessed data.
- Add indexes for common queries, such as retrieving notes by user ID.
- Use pagination rather than returning all notes in one response.
- Monitor latency, error rates, CPU, memory, database load, and queue depth.
- Load-test the system before choosing server and database capacity.

## 6. Reliability and avoiding single points of failure

- Run multiple application servers across separate failure zones where available.
- Use a highly available load balancer and redundant DNS arrangements.
- Back up the database regularly and test restoration.
- Monitor replication lag and prepare a database failover procedure.
- Use retries with limits and exponential backoff for temporary failures.
- Make background jobs idempotent so retries do not create duplicate effects.
- Keep secrets out of source control and use secure connections.
- Add health checks, alerts, and documented recovery procedures.

A read replica improves read capacity and may support recovery, but it is not a substitute for backups.

## 7. Trade-offs

### Cache versus consistency

Caching improves speed and reduces database load, but cached data can become stale. Short expiration times and explicit invalidation help balance speed and freshness.

### Read replicas versus consistency

Read replicas can handle additional read traffic, but replication delay may cause a user not to see a recent update immediately. Critical reads can be sent to the primary database.

### Background processing versus simplicity

A queue keeps slow tasks out of the request path, but adds infrastructure and operational complexity. It is most useful when background work is significant.

### SQL versus NoSQL

A relational database provides transactions, constraints, and clear relationships for users, notes, and tags. Other storage technologies can be introduced later if measured requirements justify them.

## 8. Conclusion

The proposed architecture separates static content delivery, request routing, application logic, caching, persistent storage, and background processing. This supports incremental scaling and resilience while keeping the initial design understandable. The correct capacity and technology choices should be validated through monitoring and load testing.

## Capacity estimates (1 million users)

### Assumptions
- 1,000,000 registered users, 20% active each day, so 200,000 daily active users.
- Each active user creates 5 notes and views the notes list 20 times per day.
- An average note is about 1 KB including metadata.
- A day has 86,400 seconds. Peak traffic is 5 times the average.

### Writes per second
- Writes per day: 200,000 × 5 = 1,000,000.
- Average: 1,000,000 ÷ 86,400 ≈ 12 writes per second.
- Peak (×5): ≈ 58 writes per second.

### Reads per second
- Reads per day: 200,000 × 20 = 4,000,000.
- Average: 4,000,000 ÷ 86,400 ≈ 46 reads per second.
- Peak (×5): ≈ 230 reads per second.

### Storage per year
- Per day: 1,000,000 notes × 1 KB = 1 GB.
- Per year: 1 GB × 365 ≈ 365 GB. With tags and indexes (about 2×), plan for roughly 750 GB.

### What this means
The system is **read-heavy**, with about 4 reads for every write. At 230 reads per second at peak, one PostgreSQL primary with a read replica and a cache is enough. Storage grows by under 1 TB a year, so a single database can last for years before it needs splitting.