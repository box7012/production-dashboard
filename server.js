const express = require('express');
const cors = require('cors');
const fs = 'fs';
const path = 'path';

const app = express();
const port = 3000; // 서버 포트

// 다운로드할 파일이 있는 실제 경로
const downloadFolderPath = "C:\Users\PC_05\Desktop\db";

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
});