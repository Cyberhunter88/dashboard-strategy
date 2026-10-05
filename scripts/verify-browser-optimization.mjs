import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(process.argv[2] ?? fileURLToPath(new URL('../', import.meta.url)));
const require = createRequire(path.join(root, 'package.json'));
const webpack = require('webpack');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const output = fs.mkdtempSync(path.join(os.tmpdir(), 'dashboard-browser-'));
const compiler = webpack({
  mode: 'development', context: root, entry: path.join(root, 'tests/browser/optimization-harness.ts'),
  output: { path: output, filename: 'harness.js', publicPath: '/assets/', chunkFilename: '[name].[contenthash:8].js' },
  resolve: { extensions: ['.ts', '.js'] },
  module: { rules: [{ test: /\.ts$/, exclude: /node_modules/, use: { loader: require.resolve('ts-loader'), options: { transpileOnly: true, configFile: path.join(root, 'tsconfig.json') } } }] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => { compiler.close(() => {}); error || stats.hasErrors() ? reject(error ?? new Error(stats.toString('errors-only'))) : resolve(); }));
const server = http.createServer((request, response) => {
  response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  const url = new URL(request.url, 'http://localhost');
  if (url.pathname === '/synthetic-dashboard/home') {
    response.setHeader('Content-Type', 'text/html');
    response.end('<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:8px;font-family:sans-serif}#content{min-width:0;max-width:100%}#content>*{display:block;margin-bottom:12px}ha-card{display:block}button:focus-visible,[role=link]:focus-visible{outline:2px solid blue}</style></head><body><main id="content"></main><script src="/assets/harness.js"></script></body></html>');
    return;
  }
  const name = path.basename(url.pathname);
  if (!url.pathname.startsWith('/assets/') || !fs.existsSync(path.join(output, name))) { response.writeHead(404); response.end(); return; }
  response.setHeader('Content-Type', 'text/javascript');
  response.end(fs.readFileSync(path.join(output, name)));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.OPTIMIZATION_BROWSER_PATH ? { executablePath: process.env.OPTIMIZATION_BROWSER_PATH } : {}) });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/synthetic-dashboard/home`);
  await page.waitForFunction(() => window.optimization);
  const benchmark = await page.evaluate(() => window.optimization.benchmark());
  const checks = process.env.OPTIMIZATION_BASELINE ? [] : [
    ...await page.evaluate(() => window.optimization.checkEditor()),
    ...await page.evaluate(() => window.optimization.checkCards()),
    ...await page.evaluate(() => { document.getElementById('content').replaceChildren(); return window.optimization.checkCamera(); }),
    ...await page.evaluate(() => window.optimization.checkAsyncCards()),
  ];
  const layouts = [];
  if (!process.env.OPTIMIZATION_BASELINE) for (const width of [360, 768, 1280]) for (const sidebar of [false, true]) {
    await page.setViewportSize({ width, height: 900 });
    layouts.push(await page.evaluate((expanded) => window.optimization.layout(expanded), sidebar));
    await page.screenshot({ path: path.join(output, `layout-${width}-${sidebar}.png`), fullPage: false });
  }
  if (errors.length) throw new Error(errors.join('\n'));
  const report = { root, benchmark, checks, layouts, screenshots: output };
  if (process.env.OPTIMIZATION_REPORT) fs.writeFileSync(process.env.OPTIMIZATION_REPORT, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
