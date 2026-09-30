import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('--- Voyana AI: Starting Production Build ---');

// 1. Run Vite build
execSync('npx vite build', { stdio: 'inherit' });

// 2. Populate .vercel/output/static for Vercel Build Output API v3 compatibility
try {
  const vercelOutputDir = path.resolve('.vercel/output');
  const vercelStaticDir = path.resolve(vercelOutputDir, 'static');

  if (!fs.existsSync(vercelOutputDir)) {
    fs.mkdirSync(vercelOutputDir, { recursive: true });
  }

  if (fs.existsSync(vercelStaticDir)) {
    fs.rmSync(vercelStaticDir, { recursive: true, force: true });
  }

  const distDir = path.resolve('dist');
  if (fs.existsSync(distDir)) {
    fs.cpSync(distDir, vercelStaticDir, { recursive: true });
    console.log('✓ Successfully synchronized build artifacts to .vercel/output/static');

    // Create Vercel config.json
    const config = {
      version: 3,
      routes: [
        { handle: 'filesystem' },
        { src: '/(.*)', dest: '/index.html' }
      ]
    };
    fs.writeFileSync(
      path.resolve(vercelOutputDir, 'config.json'),
      JSON.stringify(config, null, 2)
    );
    console.log('✓ Wrote .vercel/output/config.json with SPA rewrites');
  }
} catch (err) {
  console.warn('Notice: Vercel output sync skipped or optional:', err.message);
}

console.log('--- Voyana AI: Build Completed Successfully ---');
