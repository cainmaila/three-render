const express = require('express');
const cors = require('cors');
const http = require('http');
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
const server = http.createServer(app);

socketServer(server);
// let renderBrowser = null; //Render page

server.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});

const puppeteer = require('puppeteer');
if (process.env.NODE_ENV === 'production') {
  //TODO:暫時寫死
  openPage(`http://localhost:${PORT}/render/tci`);
  openPage(`http://localhost:${PORT}/render/gltf`);
}

function openPage(url) {
  puppeteer
    .launch({
      executablePath: '/usr/bin/google-chrome',
      // executablePath: '/usr/bin/google-chrome-stable',
      headless: true,
      args: [
        '--use-gl=egl',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    })
    .then(async (browser) => {
      const page = await browser.newPage();
      await page.goto(url);
    });
}
