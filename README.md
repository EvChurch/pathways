# EV Pathways

A React-based organization chart application built with TypeScript and Vite.

## Features

- Interactive organization chart visualization
- Built with React 19, TypeScript, and Vite
- Uses ReactFlow for chart rendering
- Tailwind CSS for styling
- ESLint configuration for code quality

## Development

This project uses the following technologies:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Getting Started

Use Node.js 26.13.1 from `.nvmrc` and the declared `pnpm@12.18.0`.
Node 22.23.5+, 24.22.3+ and 26.13.1+ are supported within their respective majors.

1. Install dependencies:
   ```bash
   pnpm install --frozen-lockfile
   ```

2. Start the development server:
   ```bash
   pnpm run dev
   ```

3. Build for production:
   ```bash
   pnpm run build
   ```

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Workflow Details

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- Build the project using Node.js
- Run linting and type checking
- Build the production bundle
- Deploy to GitHub Pages

The app will be available at: `https://evchurch.github.io/pathways/`

## Behavioral tests

Run `pnpm test` on the Node version in `.nvmrc`. The Node test runner loads the
TypeScript node helper through the existing Vite dependency. Tests use synthetic
in-memory statuses, people and surveys. The loader opens no HTTP/WebSocket
listener and closes after the suite; no Rock/API calls are made. A separate
read-only workflow runs these tests for pull requests and pushes to `main`.

## Netlify build

Netlify uses Node.js 22.23.5 and the declared pnpm version. Both automatic
dependency installation and the build command use the frozen pnpm lockfile;
the build publishes the static `dist` directory. Vite uses its locked Rolldown
binding, so no separate Rollup binary installation is needed.
