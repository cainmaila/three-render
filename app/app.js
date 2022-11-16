const express = require('express');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const compression = require('compression');
function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }
  return compression.filter(req, res);
}
const socketServer = require('./socketServer');

const PORT = process.env.PORT || 3030;
const app = express().use('*', cors());
app.use(compression({ filter: shouldCompress }));
const docs = path.join(__dirname, '../', 'dist');
app.use(express.static(docs));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'dist/index.html'));
});

let server = null;
let serverType = '';

if (process.env.SSL_CERT_FILE && process.env.SSL_KEY_FILE) {
  /* https */
  serverType = 'https';
  server = https.createServer(
    {
      cert: fs.readFileSync(path.resolve(process.env.SSL_CERT_FILE)),
      key: fs.readFileSync(path.resolve(process.env.SSL_KEY_FILE)),
    },
    app,
  );
} else {
  /* http */
  serverType = 'http';

  server = http.createServer(app);
}
socketServer(server);
// let renderBrowser = null; //Render page

server.listen(PORT, () => {
  console.info(`⛩️ ${serverType} Server Listening on port ${PORT}`);
});

const puppeteer = require('puppeteer');
const puppeteerSetting = process.env.DOCKER
  ? {
      executablePath: '/usr/bin/google-chrome',
      // executablePath: '/usr/bin/google-chrome-stable',
      headless: true,
      args: [
        '--use-gl=egl',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    }
  : {
      headless: true,
      args: ['--use-gl=egl'],
    };
function openPage(url) {
  puppeteer.launch(puppeteerSetting).then(async (browser) => {
    const page = await browser.newPage();
    await page.goto(url);
  });
}
if (process.env.NODE_ENV === 'production') {
  //TODO:暫時寫死
  openPage(`${serverType}://localhost:${PORT}/render/tci`);
  openPage(`${serverType}://localhost:${PORT}/render/gltf`);
  openPage(`${serverType}://localhost:${PORT}/render/man`);
  openPage(`${serverType}://localhost:${PORT}/render/mCSC2022`);
}

// const { PeerServer } = require('peer');
// const peerServer = PeerServer({ port: 9000, path: '/peer' });
