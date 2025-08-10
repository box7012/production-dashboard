<template>
  <div id="app">
    <aside class="sidebar">
      <ul>
        <li
          v-for="tab in tabs"
          :key="tab"
          :class="{ active: currentTab === tab }"
          @click="currentTab = tab"
        >
          {{ tab }}
        </li>
      </ul>
    </aside>
    <section class="content">
      <Dashboard :title="currentTab" :data="dashboardData[currentTab]" />
    </section>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'App',
  components: { Dashboard },
  data() {
    return {
      tabs: ['D02', 'D07', 'D14', 'D20'],
      currentTab: 'D02',
      dashboardData: {
        D02: [
          { title: '오늘 생산량', value: 1200, unit: '개' },
          { title: '가동률', value: '85%', unit: '' },
          { title: '불량률', value: '1.8%', unit: '' },
        ],
        D07: [
          { title: '오늘 생산량', value: 1340, unit: '개' },
          { title: '가동률', value: '90%', unit: '' },
          { title: '불량률', value: '2.1%', unit: '' },
        ],
        D14: [
          { title: '오늘 생산량', value: 1100, unit: '개' },
          { title: '가동률', value: '88%', unit: '' },
          { title: '불량률', value: '2.5%', unit: '' },
        ],
        D20: [
          { title: '오늘 생산량', value: 1250, unit: '개' },
          { title: '가동률', value: '86%', unit: '' },
          { title: '불량률', value: '1.9%', unit: '' },
        ],
      },
    }
  },
}
</script>

<style>
#app {
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.sidebar {
  width: 120px;
  background: #2c3e50;
  color: white;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 15px 10px;
  cursor: pointer;
  user-select: none;
  text-align: center;
}

.sidebar li.active,
.sidebar li:hover {
  background: #34495e;
}

.content {
  flex-grow: 1;
  padding: 20px;
  background: #ecf0f1;
  overflow-y: auto;
}
</style>
