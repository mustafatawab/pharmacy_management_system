## Frontend Application

Set `NEXT_PUBLIC_API_URL` to the backend's publicly reachable base URL in the
frontend deployment environment (for example, `https://api.example.com`).
Without it, browser requests use `http://localhost:8000`, which only works when
the API is running on the same machine as the browser.

When the frontend and API are on different sites, configure the backend with
`COOKIE_SECURE=true` and `COOKIE_SAMESITE=none` so the browser will send the
authentication cookies on credentialed API requests. The backend CORS allowed
origins must also include the exact frontend origin. For local development,
the defaults remain `localhost:8000` and `SameSite=Strict`.
