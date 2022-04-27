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

const PORT = 3030;
const app = express().use('*', cors());
app.use(compression({ filter: shouldCompress }));
const docs = path.join(__dirname, '../', 'dist');
app.use(express.static(docs));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'dist/index.html'));
});
const server = http.createServer(app);

socketServer(server);
let renderBrowser = null; //Render page

server.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});

if (process.env.NODE_ENV === 'production') {
  const puppeteer = require('puppeteer');
  puppeteer.launch().then(async (browser) => {
    const page = await browser.newPage();
    renderBrowser = browser;
    //TODO:暫時寫死
    await page.goto('http://localhost:3030/render/tci');
    await page.goto('http://localhost:3030/render/gltf');
  });
}
