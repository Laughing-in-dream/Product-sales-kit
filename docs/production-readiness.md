# Production Readiness Checklist

## Required before public beta

- [ ] Point a domain or subdomain at the Tencent Cloud server and enable HTTPS.
- [ ] Deploy this repository with Node.js 24 or newer so the website, feedback API, and admin dashboard run from the same domain.
- [ ] Set a long, unique `ADMIN_TOKEN` on the server. Never put it in this repository or frontend JavaScript.
- [ ] Restrict the server firewall to HTTPS (and SSH only from trusted IP addresses).
- [ ] Configure a process manager such as `systemd` or PM2 to restart the service after a reboot.
- [ ] Configure automated daily backups of `server/data/configurator.db` and test restoring one backup.
- [ ] Open `/admin` from a private browser window and confirm the token is required.
- [ ] Submit one test feedback message and export one test Excel list; confirm both appear in `/admin`.
- [ ] Review `docs/release-notes.md`, update the visible version, and tag the Git commit before each release.

## Operating rules

- A “solution provided” means an Excel list was exported. The dashboard reports exported solutions and unique browser sessions, not verified individual people.
- Feedback contains the active product, step, chosen items, and the visitor's message. Do not ask customers to enter passwords, vehicle-identification numbers, or other sensitive data.
- Read the feedback queue before changing product rules. Confirm the applicable product knowledge-base document first.
- Keep the feedback API on the same HTTPS domain as the configurator. This avoids cross-site configuration and keeps the browser request simple.

## Release procedure

1. Update product knowledge-base rules if the release changes any selection rule.
2. Update `docs/release-notes.md` and `docs/branch-log.md` in plain language.
3. Bump `APP_VERSION` in `js/01-bootstrap-i18n.js` and the cache versions of changed browser files in `index.html`.
4. Run JavaScript syntax checks and walk through affected product paths in the browser.
5. Commit, push, deploy, then tag the exact published commit (for example `B1.0.2`).
6. Verify the live site, feedback submission, Excel-export telemetry, and `/admin` dashboard.
