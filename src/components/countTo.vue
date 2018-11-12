<template>
  <countTo :startVal='countVal.startVal' :endVal='countVal.endVal' :duration='3000'></countTo>
</template>

<script>
  import countTo from 'vue-count-to';
  export default {
    props:['countData'],
    data () {
      return {
        countVal:{
          startVal: 0,
          endVal: 2017,
          decimal:2,
        }
      }
    },
    watch:{
      countData:{
        handler(){
          this.countVal = this.countData;
        },
        immediate: true,
      }
    },
    methods:{
      clearData(){
        this.countVal = {
          startVal: 0,
          endVal: 0
        }
      }
    },
    components: {
      countTo
    },
  }
</script>
