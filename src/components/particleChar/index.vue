<template>
    <section class="section">
      <div id="particleChar"></div>
    </section>
</template>

<script>
      import '../../../static/particleChar/js/sketch.min.js'
      import '../../../static/particleChar/js/particleChar.js'
    import '../../../static/particleChar/js/main.js'
//    import '../../../static/particleChar/css/demo.css'

//    import '../../../static/particleChar/js/demo.js'


//    var pc = new particleChar();
//    var timer = null;
//    pc.queueCreate({
//      text: "DEMO",
//      fontColor: "#95f0c0",
//      showNext: false,
//      showOpen: false,
//    });


    export default {
        name: "parChar",
        data() {
            return {
                particleChar:null,
            }
        },
        mounted(){
//          this.particleChar = particleChar();
//          this.particleChar.queueCreate({
//            text: "DEMO",
//            fontColor: "#95f0c0",
//            showNext: false,
//            showOpen: false,
//          });

        },
        methods: {
            //mehods
        },
        components: {
            //someComponent
        },
    }
</script>

<style scoped lang="scss">
    .section {

    }
</style>
