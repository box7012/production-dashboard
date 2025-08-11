const express = require('express');
const cors = require('cors');
const fs = require('fs'); // fs 모듈 import
const path = require('path'); // path 모듈 import

const app = express();
const port = 3000; // 서버 포트

// 다운로드할 파일이 있는 실제 경로
const downloadFolderPath = "C:\\Users\\PC_05\\Desktop\\db";
// 이미지 파일이 있는 실제 경로 (가정)
const imageBaseFolderPath = "C:\\Users\\PC_05\\Desktop\\db\\images";

app.use(cors()); // 모든 도메인에서의 요청을 허용 (개발용)

// 파일 목록을 반환하는 API
app.get('/api/files', (req, res) => {
  fs.readdir(downloadFolderPath, (err, files) => {
    if (err) {
      console.error("Could not list the directory.", err);
      return res.status(500).send('Server error');
    }
    res.json(files);
  });
});

// 파일을 다운로드하는 API
app.get('/api/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(downloadFolderPath, filename);

  // 보안: 경로 조작 공격 방지
  if (path.dirname(filePath) !== downloadFolderPath) {
    return res.status(400).send('Invalid path');
  }

  res.download(filePath, (err) => {
    if (err) {
      console.error("File download error.", err);
      res.status(404).send('File not found.');
    }
  });
});

// 이미지 목록을 반환하는 API
app.get('/api/images/:tab', (req, res) => {
  const { tab } = req.params;
  const tabImagePath = path.join(imageBaseFolderPath, tab);

  fs.readdir(tabImagePath, (err, files) => {
    if (err) {
      console.error(`Could not list images for tab ${tab}:`, err);
      // 폴더가 없으면 빈 배열 반환
      if (err.code === 'ENOENT') {
        return res.json([]);
      }
      return res.status(500).send('Server error');
    }

    // 이미지 파일만 필터링 (예: jpg, png, gif)
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif';
    });
    res.json(imageFiles);
  });
});

// 이미지 파일을 제공하는 API
app.get('/api/images/serve/:tab/:filename', (req, res) => {
  const { tab, filename } = req.params;
  const imagePath = path.join(imageBaseFolderPath, tab, filename);

  // 보안: 경로 조작 공격 방지
  if (!imagePath.startsWith(path.join(imageBaseFolderPath, tab))) {
    return res.status(400).send('Invalid path');
  }

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error(`Error serving image ${filename} for tab ${tab}:`, err);
      res.status(404).send('Image not found.');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});