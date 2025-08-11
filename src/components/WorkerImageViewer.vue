<template>
  <div class="image-viewer-container">
    <h3>{{ tab }} 이미지 뷰어</h3>

    <div v-if="loading" class="loading-message">이미지 로딩 중...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="images.length === 0" class="no-images-message">표시할 이미지가 없습니다.</div>

    <div v-else class="image-grid">
      <div
        v-for="image in images"
        :key="image"
        class="image-item"
        @click="openModal(image)"
        style="cursor: pointer;"
      >
        <img :src="getImageUrl(image)" :alt="image" />
        <p>{{ image }}</p>
      </div>
    </div>

    <!-- 모달 -->
    <div v-if="selectedImage" class="modal" @click.self="closeModal">
      <span class="close-button" @click="closeModal">&times;</span>
      <img class="modal-content" :src="getImageUrl(selectedImage)" :alt="selectedImage" />
      <div class="caption">{{ selectedImage }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkerImageViewer',
  props: {
    tab: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      images: [],
      loading: false,
      error: null,
      selectedImage: null, // 클릭한 이미지 저장
      backendUrl: 'http://192.168.0.95:8081',
    };
  },
  watch: {
    tab: {
      immediate: true,
      handler: 'fetchImages',
    },
  },
  methods: {
    async fetchImages() {
      this.loading = true;
      this.error = null;
      this.images = [];
      try {
        const response = await fetch(`${this.backendUrl}/api/images/${this.tab}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.images = data;
      } catch (e) {
        console.error("Failed to fetch images:", e);
        this.error = '이미지를 불러오는 데 실패했습니다. 백엔드 서버와 이미지 경로를 확인하세요.';
      } finally {
        this.loading = false;
      }
    },
    getImageUrl(filename) {
      return `${this.backendUrl}/api/images/serve/${this.tab}/${encodeURIComponent(filename)}`;
    },
    openModal(image) {
      this.selectedImage = image;
    },
    closeModal() {
      this.selectedImage = null;
    },
  },
};
</script>


<style scoped>

/* 모달 스타일 추가 */
.modal {
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  max-width: 90%;
  max-height: 80vh;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0,0,0,0.5);
}

.close-button {
  position: fixed;
  top: 20px;
  right: 40px;
  color: white;
  font-size: 40px;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
}

.caption {
  margin-top: 10px;
  color: white;
  text-align: center;
  font-size: 1em;
}
.image-viewer-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  margin-top: 20px;
  min-width: 800px;
}
h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}
.loading-message,
.error-message,
.no-images-message {
  text-align: center;
  padding: 20px;
  color: #666;
}
.error-message {
  color: red;
}
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}
.image-item {
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  background-color: #f9f9f9;
}
.image-item img {
  max-width: 100%;
  height: auto;
  border-radius: 3px;
  margin-bottom: 5px;
}
.image-item p {
  font-size: 0.8em;
  color: #555;
  word-break: break-all;
}
</style>
