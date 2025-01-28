import {defineConfig, UserConfig} from 'vite'
import { reactRouter } from "@react-router/dev/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRouter()],
  preview: {
    port: 1026
  }
} satisfies UserConfig)
