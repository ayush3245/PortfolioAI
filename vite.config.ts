
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react()];
  
  // Dynamically import lovable-tagger only in development mode
  if (mode === 'development') {
    try {
      const { componentTagger } = await import('lovable-tagger');
      plugins.push(componentTagger());
    } catch (error) {
      console.warn('lovable-tagger not available:', error.message);
    }
  }

  return {
    base: mode === 'production' ? '/PortfolioAI/' : '/',
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api/groq': {
          target: 'https://api.groq.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/groq/, ''),
        }
      }
    },
    define: {
      // No need to define environment variables with VITE_ prefix as they are automatically exposed
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: [
              '@radix-ui/react-accordion',
              '@radix-ui/react-dialog',
              // Add other UI components here
            ],
          },
        },
      },
    },
  };
});
