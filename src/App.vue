<template>
  <div id="app">
    <left-nav v-if="$route.meta.auth"></left-nav>
    <div :class="$route.meta.auth?'main':'main1'">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import leftNav from "@/components/common/leftNav";
export default {
  name: "App",
  components: {
    leftNav
  }
};
</script>

<style>
  body{
    background-color: #EFF2F7;
  }
#app {
  font-family: "Microsoft YaHei", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.main {
  float: left;
  width: 95%;
  /* height: 100%; */
  background-color: #EFF2F7;
  overflow: hidden;
}
.main1 {
  float: left;
  width: 100%;
  height: 100%;
  background-color: #EFF2F7;
  overflow: hidden;
}
/* .form{
  margin-top:10%;
  float: left;
  width: 95%;
  height: 100%;
  background-color: #EFF2F7;
  overflow: hidden;
} */
</style>
