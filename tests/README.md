# Tests

- Install dependencies: `npm ci`
- Install the browser once: `npx playwright install chromium`
- Run everything: `npm test`
- Run unit tests: `npm run test:unit`
- Run browser tests: `npm run test:browser`
- Run one browser test: `npm run test:browser -- testimonialChoices`

Playwright starts an isolated Astro server on port 4322 and closes it afterwards.
Browser tests use the base URL in playwright.config.ts. A fresh browser context
is created for each test. Failure traces are saved in test-results/.
The browser files are registered Playwright tests; do not run them with node --test.
