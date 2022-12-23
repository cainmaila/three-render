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
const dist = path.join(__dirname, '../', 'dist');
app.use(express.static(dist));
const model = path.join(__dirname, '../', 'model');
app.use(express.static(model));
const modelsConfig = require('../model/config.json');

const server = http.createServer(app);
new socketServer(server);

/* 確認開啟render */
app.get('/load/:id', (req, res) => {
  const model = {
    ...modelsConfig.models.find((model) => model.id === req.params.id),
  };
  if (!model?.type) {
    res.status(404).send(404);
  } else if (socketServer.hasTag(req.params.id)) {
    model.error = socketServer.isError(req.params.id);
    delete model.path;
    if (model.error) {
      res.send(model);
    } else {
      res.send(socketServer.isReady(req.params.id) ? model : 'loading');
    }
  } else {
    //還沒開render
    openPage(`http://localhost:${PORT}/render/${req.params.id}`);
    res.send('loading');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'dist/index.html'));
});

server.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
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
