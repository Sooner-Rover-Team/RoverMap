// Config file for vite (bundler for npm)
import basicSsl from '@vitejs/plugin-basic-ssl';

export default {
    plugins: [basicSsl()],
    server: {
        https: true,
        port: 5173,
    }
};
