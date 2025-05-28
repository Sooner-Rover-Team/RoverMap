import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
    server: {
        https: {
            key: fs.readFileSync(path.resolve(__dirname, '../localhost-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, '../localhost.pem')),
        },
        port: 4433,
        cors: {
            origin: true,
            credentials: true,
        },
    },
});
