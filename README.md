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

## License

This project is licensed under NOLICENSE - no rights are granted.
