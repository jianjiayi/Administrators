<template>
  <div class="container">
    <div class="player">
      <video-player  class="video-player vjs-custom-skin"
                     ref="videoPlayer"
                     :playsinline="true"
                     :options="playOptions"
                     @play="onPlayerPlay($event)"
                     @pause="onPlayerPause($event)"
      >
      </video-player>
    </div>
  </div>
</template>

<script>
  import { videoPlayer } from 'vue-video-player';

  export default {
    props:['playOptions'],
    data () {
      return {}
    },
    components: {
      videoPlayer
    },
    methods: {
      onPlayerPlay(player) {
        console.log("play");
      },
      onPlayerPause(player){
        console.log("pause");
      },
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/css" scoped>
  .container {
    background-color: #efefef;
    min-height: 100%;
  }
  .vjs-poster{
    background-size: cover;
  }
</style>
