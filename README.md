# WebSockets Maps Application — Client

[![React](https://img.shields.io/badge/Library-React%2019-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build%20Tool-Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Mapbox](https://img.shields.io/badge/Map%20Rendering-Mapbox%20GL-000000?style=flat&logo=mapbox&logoColor=white)](https://www.mapbox.com/)

The frontend for the WebSockets Maps Application — a real-time user interface to visualize and interact with connected users on a dynamic map.

**🚀 Live Demo:** [https://web-sockets-maps.vercel.app/](https://web-sockets-maps.vercel.app/)

> The server is in a separate repository: [WebSockets-Maps-server](https://github.com/mikeislas06/WebSockets-Maps-server).

## Table of Contents

- [Technologies](#technologies)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Scripts](#scripts)
- [Project Structure](#project-structure)

## Technologies

- **Library:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Map Rendering:** Mapbox GL JS
- **Real-time:** Native WebSockets

## Features

- Real-time location updates from the server using WebSockets
- Dynamic map rendering of connected users and their movements
- Custom connection form to set user name and color
- Blazing-fast development and optimized production builds with Vite

## Prerequisites

- Node.js 18+ or Bun
- npm, pnpm, yarn, or bun
- Mapbox API Token (create an account at [Mapbox](https://www.mapbox.com/))
- The server running locally or deployed (see [WebSockets-Maps-server](https://github.com/mikeislas06/WebSockets-Maps-server))

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/mikeislas06/WebSockets-Maps-client.git
cd WebSockets-Maps-client
```

2. Install dependencies:

```bash
npm install
# or
bun install
```

3. Set up environment variables:
Create a `.env.local` file based on the template:

```bash
cp .env.template .env.local
```
Then, add your Mapbox API token to the `.env.local` file.

4. Start the development server:

```bash
npm run dev
# or
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Script          | Description                                   |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Start Vite development server                 |
| `npm run build` | Build for production                          |
| `npm run lint`  | Run ESLint                                    |
| `npm run preview`| Serve production build locally                |

## Project Structure

```
client/
├── public/               # Static assets
├── src/                  # React source code
│   ├── assets/           # Images and icons
│   ├── components/       # Reusable React components (ConnectForm, etc.)
│   ├── context/          # React contexts (WebSocketContext)
│   ├── hooks/            # Custom hooks (useSocketMap)
│   ├── pages/            # Page components (MapPage)
│   ├── types/            # TypeScript type definitions
│   ├── SocketsMapApp.tsx # Main application component
│   └── main.tsx          # React entry point
├── eslint.config.js      # ESLint configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```
