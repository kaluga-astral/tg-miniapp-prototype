import path from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import dotenv from 'dotenv';

// используем dotenv, чтобы получить доступ к process.env перед началом сборки
dotenv.config();

const isProdStand =
  Boolean(process.env.VITE_STAND?.match(/production|demo|staging/));

const sentryAuthToken = process.env.PUBLIC_SENTRY_AUTH_TOKEN;
const sentryProject = process.env.PUBLIC_SENTRY_PROJECT;
const sentryOrg = process.env.PUBLIC_SENTRY_ORG;
const isSentryEnabled = process.env.PUBLIC_IS_SENTRY_ENABLED === 'true';
const version = process.env.PUBLIC_VERSION;

export default defineConfig({
  base: '/tg-miniapp-prototype/',
  plugins: [
    splitVendorChunkPlugin(),
    react(),
    svgrPlugin({ svgrOptions: { icon: true } }),
    tsconfigPaths(),
    isSentryEnabled ? sentryVitePlugin({
      org: sentryOrg,
      project: sentryProject,
      authToken: sentryAuthToken,
      release: {
        name: version,
      },
      silent: true,
      sourcemaps: {
        filesToDeleteAfterUpload: '**/*.map',
      },
    }) : null,
  ],
  logLevel: isProdStand ? 'error' : 'info',
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    sourcemap: !isProdStand,
    outDir: path.resolve(__dirname, 'dist'),
  },
  envPrefix: ['PUBLIC_', 'PRIVATE_'],
  server: {
    port: 3000
  }
});
