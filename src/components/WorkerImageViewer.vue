<template>
  <div class="image-viewer-container">
    <h3>{{ tab }} 이미지 뷰어</h3>

    <!-- 크게 보여지는 이미지 영역 -->
    <div v-if="selectedImage" class="large-image-wrapper">
      <img :src="getImageUrl(selectedImage)" :alt="selectedImage" />
      <div class="caption">{{ selectedImage }}</div>
      <button class="close-btn" @click="selectedImage = null">닫기 ✕</button>
    </div>

    <!-- 로딩 / 에러 메시지 -->
    <div v-if="loading" class="loading-message">이미지 로딩 중...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>

    <!-- 버튼 그룹은 항상 보여주기 -->
    <div class="button-group">
      <button v-for="tag in tags" :key="tag" @click="addTagToAllImages(tag)">
        {{ tag }}
      </button>
      <button @click="removeTagFromAllImages">태그 제거</button>
    </div>

    <!-- 이미지 목록 테이블: 로딩이나 에러 없을 때만 -->
    <table v-if="!loading && !error" class="image-table">
      <thead>
        <tr>
          <th>이미지 경로</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="image in images"
          :key="image"
          class="clickable-row"
          @click="openModal(image)"
        >
          <td>{{ image }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'WorkerImageViewerVue',
  props: {
    tab: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      tags: ['(ngr)', '(nog_foreign)', '(nog_flaw)', '(nog_dust)', '(nog_chip)', '(nog_water)', '(noh)'],
      images: [],
      loading: false,
      error: null,
      selectedImage: null,
      backendUrl: 'http://192.168.0.95:8081',
    }
  },
  watch: {
    tab: {
      immediate: true,
      handler() {
        this.fetchImages()
      }
    }
  },
  methods: {

    async addTagToAllImages(tag) {
      try {
        const response = await fetch(`${this.backendUrl}/api/images/${this.tab}/prepend-tag`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tag }),
        });

        if (!response.ok) {
          throw new Error('Failed to prepend tag');
        }

        alert(`모든 이미지에 "${tag}" 태그가 붙었습니다.`);
        // 필요하면 이미지 목록 다시 불러오기
        this.fetchImages();

      } catch (error) {
        console.error(error);
        alert('태그 저장 중 오류가 발생했습니다.');
      }
    },

    async removeTagFromAllImages() {
      try {
        const response = await fetch(`${this.backendUrl}/api/images/${this.tab}/remove-tag`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to  remove tags');
        }

        alert('모든 이미지의 tag가 제거 되었습니다!');
        this.fetchImages();
      } catch (error) {
        console.error(error);
        alert('태그 제거 중 오류가 발생했습니다.');
      }
    },

    async fetchImages() {
      this.loading = true;
      this.error = null;
      this.images = [];
      this.selectedImage = null;
      try {
        const res = await fetch(`${this.backendUrl}/api/images/${this.tab}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        this.images = data;  // images가 ["img1.jpg", "img2.jpg", ...] 형태여야 합니다.
      } catch (e) {
        this.error = "이미지를 불러오는 데 실패했습니다.";
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    getImageUrl(filename) {
      return `${this.backendUrl}/api/images/serve/${this.tab}/${encodeURIComponent(filename)}`;
    },
    openModal(image) {
      this.selectedImage = image;
      window.scrollTo({ top: 0, behavior: 'smooth' }); // 선택 시 페이지 위로 스크롤
    }
  }
}
</script>

<style scoped>
.image-viewer-container {
  padding: 20px;
  background: white;
  border-radius: 8px;
  min-width: 1000px;
}

.loading-message,
.error-message {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error-message {
  color: red;
}

.image-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.image-table th,
.image-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.image-table th {
  background-color: #f4f4f4;
  text-align: left;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: #efefef;
}

.large-image-wrapper {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

.large-image-wrapper img {
  width: 1000px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0,0,0,0.2);
  max-width: 100%;
}

.caption {
  margin-top: 8px;
  font-size: 0.9em;
  color: #555;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  background: #ff5c5c;
  border: none;
  color: white;
  font-size: 1.2em;
  border-radius: 3px;
  cursor: pointer;
  padding: 3px 8px;
}

.button-group {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.button-group button {
  padding: 8px 12px;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.button-group button:hover {
  background-color: #45a049;
}

</style>
