# Tencent Cloud Server Deployment

This server keeps the configurator, feedback and element-annotation APIs, Excel-export telemetry, and internal dashboard on one HTTPS domain.

## Server prerequisites

- Ubuntu or another Linux server with Node.js **24 or newer**.
- Nginx (or a similar reverse proxy) terminating HTTPS.
- A domain name pointing to the server.
- A long random administrator token. Generate one with `openssl rand -hex 32`.

## First deployment

```bash
git clone https://github.com/Laughing-in-dream/Product-sales-kit.git sales-configurator
cd sales-configurator
export ADMIN_TOKEN='replace-this-with-a-long-random-secret'
node server/server.js
```

The app listens only on `127.0.0.1:8080`. Put Nginx in front of it and proxy the public HTTPS domain to that address. Do not expose port 8080 directly to the internet.

Example Nginx location:

```nginx
location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Real-IP $remote_addr;
}
```

Use `systemd` or PM2 to make the process persistent. Store `ADMIN_TOKEN` in the service environment, never in Git.

## Operations

- Website: `https://your-domain/`
- Internal dashboard: `https://your-domain/admin`
- Health check: `https://your-domain/healthz`
- SQLite data: `server/data/configurator.db` (ignored by Git)
- Annotation captures: `server/data/annotations/` (ignored by Git; opened only through the token-protected dashboard)

Back up both `server/data/configurator.db` and `server/data/annotations/` daily before updates. The dashboard intentionally reports exported solutions and unique browser sessions rather than claiming to identify individual people. Element annotations include the clicked element label, page context, written request, and a marked screenshot so the review team can reproduce the issue.
