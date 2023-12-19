import { defineConfig } from "vite"
import uni from "@dcloudio/vite-plugin-uni"

export default defineConfig({
	server: {
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:9001',
				changeOrigin: true,
				rewrite: path => {
					return path.replace(/^\/api/, '')
				}
			},
		}
	},
	plugins: [
		uni()
	]
})