
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn('lovable-tagger not available:', errorMessage);
    }
  }

  return {
    // Remove GitHub Pages base path - deploy on Lovable only
    base: '/',
    server: {
      host: "::",
      port: 8080,
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
