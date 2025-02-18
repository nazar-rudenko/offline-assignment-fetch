# Take Home Assignment

This project is a small web application for the take-home assignment. Follow the instructions below to set up, run, and test the project locally.

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js version 22 or higher
- pnpm version 10 or higher

You can check the installed versions using the following commands:

```bash
node -v
pnpm -v
```

If you don't have them installed, you can download and install them from their official websites:
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/nazar-rudenko/offline-assignment-fetch.git
   cd offline-assignment-fetch
   ```

2. Install dependencies using pnpm:
   ```bash
   pnpm install
   ```

3. To run the application locally, use the following command:
   ```bash
   pnpm dev
   ```

   This will start the development server on port `5173`, and you can view the app in your browser at [http://localhost:5173](http://localhost:5173).

## Build for Production

To build the project for production:

```bash
pnpm build
```

This will create an optimized build in the `dist` directory.

## Running Tests

To run the tests for the project:

```bash
pnpm test
```

Make sure your test suite is configured correctly before running this command.

## Linting

To run the linter to ensure code quality:

```bash
pnpm lint
```

This will check your code for any style or quality issues and provide feedback.

## Edge Function for Cookie Handling in Vercel Deployment

In this project, we use an **Edge Function** deployed on Vercel to spoof the **Set-Cookie** header from the backend and ensure it is sent correctly in browsers with strict security settings (such as Safari/Chrome on iOS). This helps in setting the `SameSite=Strict` attribute on the cookie, allowing it to be stored properly by the browser, while also ensuring CORS compliance.

### Overview
1. **Spoofing the `Set-Cookie` Header**: The Edge Function intercepts the response from the backend and modifies the `Set-Cookie` header to set `SameSite=Strict`, ensuring the browser stores the cookie in stricter environments.
2. **Setting `SameSite=Strict`**: The cookie’s `SameSite` attribute is modified to `Strict`, making sure it behaves correctly in browsers with stricter cookie policies, like those on mobile devices.
3. **Ensuring CORS Compliance**: The Edge Function also ensures that CORS headers are properly set to avoid issues with cross-origin requests.

### How It Works

- **Production Environment**: In production, the Edge Function runs in Vercel’s Edge Network, where it intercepts responses from the backend. If a `Set-Cookie` header is present, it modifies the cookie to include `SameSite=Strict` and passes it back to the client.
- **Development Environment**: In the development environment, we bypass the Edge Function and interact directly with the backend, as no modifications are required in this environment.

### Code Flow

1. **Edge Function (Vercel)**: The Edge Function intercepts the response from the backend. If a `Set-Cookie` header is present, it modifies token in the cookie by adding `SameSite=Strict` to ensure the browser handles it appropriately.
2. **Proxy Handling (`api/proxy.ts`)**: The proxy serves as an intermediary, passing the modified cookies to the user while ensuring that the CORS headers are properly set for compliance.
3. **Browser Behavior**: With `SameSite=Strict`, browsers like Safari and Chrome on iOS, which have stricter cookie policies, will store the cookie and send it back on subsequent requests through the proxy.

This setup ensures that your authentication cookies are sent and stored properly in all environments, particularly in browsers with stricter default security policies, and ensures proper CORS handling.

## License

This project is licensed under NOLICENSE - no rights are granted.
