import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  define: {
    'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gdzhdhrabupsmgsyjecu.supabase.co'
    ),
    'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_zXfKbnn0_qUMk50LeGdKpA_W2ZkPanr'
    ),
  },
  server: {
    port: 3000,
    open: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
