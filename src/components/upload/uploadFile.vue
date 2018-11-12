<template>
  <section>
    <el-upload
      class=""
      drag
      :name="uploadOption.name"
      :action="uploadOption.url"
      multiple
      :on-error="pictureError"
      :on-success="pictureSuccess"
      :before-remove="handleBeforeRemove"
      :on-remove="handleRemove">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传文件(大小 {{uploadOption.size}} 以下)</div>
    </el-upload>
    <input :id="uploadOption.id" type="hidden" :value="value">
  </section>
</template>
<script>
  export default {
    props:['uploadOption'],
    data(){
      return{
        value:''
      }
    },
    methods:{
      pictureError(err){
        console.log(err)
      },
      handleBeforeRemove(file) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleRemove(file, fileList){
        console.log(file)
        let params = {
          name:this.uploadOption.name,
          value:this.uploadOption.url
        }
        this.$emit('delete',params)
      },
      pictureSuccess(response, file, fileList){
        console.log(response, file, fileList);
        let params={
          name :this.uploadOption.name,
          value : response.replace('[','').replace(']','').split(',')[1]
        }
        this.$emit('success',params);
      },
    }
  }
</script>
<style scoped lang="scss">

</style>
