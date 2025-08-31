<template>
  <div class="file-download-container">
    <h3>다운로드 가능 파일 목록</h3>

    <!-- 에러 메시지 -->
    <div v-if="error" class="error-message">{{ error }}</div>

    <!-- 전체 현황: 라인별 그룹 -->
    <div v-else-if="currentTab === '전체 현황'">
      <div v-for="(fileList, line) in groupedFiles" :key="line" class="line-section">
        <h4>{{ line }}</h4>
        <table class="file-table">
          <thead>
            <tr>
              <th>파일명</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="fileList.length === 0">
              <td colspan="2">다운로드할 파일이 없습니다.</td>
            </tr>
            <tr v-for="file in fileList" :key="file">
              <td>{{ file }}</td>
              <td>
                <a :href="getDownloadUrl(line, file)" class="download-button" download>다운로드</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 개별 라인 -->
    <div v-else>
      <table class="file-table">
        <thead>
          <tr>
            <th>파일명</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="files.length === 0">
            <td colspan="2">다운로드할 파일이 없습니다.</td>
          </tr>
          <tr v-for="file in files" :key="file">
            <td>{{ file }}</td>
            <td>
              <a :href="getDownloadUrl(currentTab, file)" class="download-button" download>다운로드</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentTab: String
  },
  data() {
    return {
      files: [],          // 단일 라인 데이터
      groupedFiles: {},   // 전체 현황 (라인별 객체)
      error: null,
      backendUrl: 'http://192.168.0.95:8081',
    };
  },
  watch: {
    currentTab: {
      immediate: true,
      handler(newTab) {
        this.fetchFiles(newTab);
      }
    }
  },
  methods: {
    async fetchFiles(tab) {
      this.error = null;
      this.files = [];
      this.groupedFiles = {};

      let apiUrl;
      if (tab === '전체 현황') {
        apiUrl = `${this.backendUrl}/api/files/all`;
      } else {
        apiUrl = `${this.backendUrl}/api/files/${encodeURIComponent(tab)}`;
      }

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('서버에서 파일 목록을 가져오는 데 실패했습니다.');
        const data = await response.json();

        if (tab === '전체 현황') {
          this.groupedFiles = data; // 객체 (라인별 파일 리스트)
        } else {
          this.files = data;        // 배열
        }
      } catch (err) {
        console.error(err);
        this.error = '파일 목록을 불러올 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.';
      }
    },
    getDownloadUrl(folderName, filename) {
      return `${this.backendUrl}/api/download/${encodeURIComponent(folderName)}/${encodeURIComponent(filename)}`;
    }
  },
  mounted() {
    this.fetchFiles(this.currentTab);
  }
}
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
