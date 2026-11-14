/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * public/_headers içindeki Content-Security-Policy'yi derlenmiş index.html'e <meta> olarak da ekler.
 * Cloudflare başlığı kendisi gönderir; GitHub Pages başlık desteklemediği için orada <meta> devreye girer.
 * Yalnız derlemede çalışır: geliştirme sunucusu satır içi betik/stil kullandığı için CSP onu bozardı.
 * frame-ancestors <meta> ile verilemez, bu yüzden çıkarılır.
 */
function cspMeta(): Plugin {
  return {
    name: 'csp-meta',
    apply: 'build',
    transformIndexHtml() {
      const headers = readFileSync(fileURLToPath(new URL('./public/_headers', import.meta.url)), 'utf8');
      const line = headers.split(/\r?\n/).find((l) => l.trim().startsWith('Content-Security-Policy:'));
      if (!line) throw new Error('public/_headers içinde Content-Security-Policy bulunamadı');
      const content = line
        .split('Content-Security-Policy:')[1]
        .split(';')
        .map((d) => d.trim())
        .filter((d) => d && !d.startsWith('frame-ancestors'))
        .join('; ');
      return [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content }, injectTo: 'head-prepend' }];
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), cspMeta()],
  build: {
    chunkSizeWarningLimit: 900,
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
