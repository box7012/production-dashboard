<template>
  <div>
    <h4>{{ tab }} 이미지 보기</h4>
    <!-- tab에 따라 이미지/데이터 불러오는 로직 -->
    <img :src="imageUrl" alt="Image" />
  </div>
</template>

<script>
export default {
  props: ['tab'],
  computed: {
    imageUrl() {
      // tab 이름에 따라 이미지 경로 다르게 지정
      return `/images/${this.tab}/sample.jpg`
    }
  }
}
</script>