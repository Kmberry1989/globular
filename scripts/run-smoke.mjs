import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const viteEntry = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));
const testEntry = fileURLToPath(new URL('../output/playwright/vertical-slice.js', import.meta.url));
const externalUrl = process.env.GLOBULAR_ROAM_URL;
const baseUrl = externalUrl || 'http://127.0.0.1:4177';
let server = null;

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: projectRoot, stdio: 'inherit', ...options });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with ${code ?? signal}`));
    });
  });
}

async function waitForServer(url, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Vite is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

try {
  if (!externalUrl) {
    server = spawn(process.execPath, [
      viteEntry,
      '--host', '127.0.0.1',
      '--port', '4177',
      '--strictPort',
    ], {
      cwd: projectRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    server.stdout.on('data', (chunk) => process.stdout.write(`[vite] ${chunk}`));
    server.stderr.on('data', (chunk) => process.stderr.write(`[vite] ${chunk}`));
  }
  await waitForServer(baseUrl);
  await run(process.execPath, [testEntry], {
    env: { ...process.env, GLOBULAR_ROAM_URL: baseUrl },
  });
} finally {
  if (server && server.exitCode === null) {
    server.kill('SIGTERM');
    await new Promise((resolve) => {
      server.once('exit', resolve);
      setTimeout(resolve, 2_000);
    });
  }
}
