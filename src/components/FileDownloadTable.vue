
<template>
  <div class="file-download-container">
    <h3>다운로드 가능 파일 목록</h3>
    <table class="file-table">
      <thead>
        <tr>
          <th>파일명</th>
          <th>작업</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="error">
          <td colspan="2" class="error-message">{{ error }}</td>
        </tr>
        <tr v-if="files.length === 0 && !error">
          <td colspan="2">다운로드할 파일이 없습니다.</td>
        </tr>
        <tr v-for="file in files" :key="file">
          <td>{{ file }}</td>
          <td>
            <a :href="getDownloadUrl(file)" class="download-button" download>다운로드</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const files = ref([]);
const error = ref(null);
const backendUrl = 'http://localhost:3000'; // 백엔드 서버 주소

// 컴포넌트가 마운트될 때 파일 목록을 가져옵니다.
onMounted(async () => {
  try {
    const response = await fetch(`${backendUrl}/api/files`);
    if (!response.ok) {
      throw new Error('서버에서 파일 목록을 가져오는 데 실패했습니다.');
    }
    files.value = await response.json();
  } catch (err) {
    console.error(err);
    error.value = '파일 목록을 불러올 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.';
  }
});

// 다운로드 URL을 생성하는 함수
const getDownloadUrl = (filename) => {
  return `${backendUrl}/api/download/${encodeURIComponent(filename)}`;
};
</script>

<style scoped>
.file-download-container {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.file-table {
  width: 100%;
  border-collapse: collapse;
}

.file-table th,
.file-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.file-table th {
  background-color: #f2f2f2;
}

.download-button {
  display: inline-block;
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  text-align: center;
}

.download-button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  font-weight: bold;
}
</style>
