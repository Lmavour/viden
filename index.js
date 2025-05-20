// === FILE: index_web.js ===
const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000; // Web berjalan di port 3000

app.get('/v/:id', async (req, res) => {
  const id = req.params.id;
  const htmlPath = path.join(__dirname, 'player.html');

  try {
    // Ambil data video dari server API
    const apiRes = await fetch(`http://fi5.bot-hosting.net:22117/api/v1?id=${id}`);
    if (!apiRes.ok) return res.status(404).send('Video tidak ditemukan');

    const video = await apiRes.json();

    // Baca file HTML player
    fs.readFile(htmlPath, 'utf8', (err, html) => {
      if (err) return res.status(500).send('Gagal membaca player.html');

      html = html
        .replace('url_pomf', video.link)
        .replace('title_video', video.title)
        .replace('date_upload', video.date_upload);

      res.send(html);
    });
  } catch (err) {
    res.status(500).send('Terjadi kesalahan saat mengambil data dari API');
  }
});

app.listen(PORT, () => {
  console.log(`Web Server listening at http://localhost:${PORT}`);
});
