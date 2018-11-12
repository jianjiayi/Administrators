<template>
  <section>
    <el-upload
      :action="uploadOption.url"
      list-type="picture-card"
      :name="uploadOption.name"
      :limit="uploadOption.limit"
      :file-list="uploadOption.fileList"
      :on-exceed="handleExceed"
      :on-error="pictureError"
      :on-success="pictureSuccess"
      :on-preview="handleDownload"
      :before-remove="handleBeforeRemove"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
      <div class="el-upload__tip" slot="tip">请上传png、jpg及jpeg格式图片(大小 {{uploadOption.size}} 以下,建议分辨率 {{uploadOption.resolution}} )</div>
    </el-upload>
    <input :id="uploadOption.id" type="hidden" :value="value">
  </section>
</template>
<script>
  export default {
    props:['uploadOption'],
    data(){
      return{
        value:'',
      }
    },
    methods:{
      pictureError(err){
        console.log(err)
      },
      handleExceed(fileList){
        this.$message.warning(`已达到图片上限，共选择了 ${fileList.length} 个文件`);
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
      //下载图片
      handleDownload(file) {
        // 创建隐藏的可下载链接

        this.loadImageToBlob(file.url, function(blobFile) {//这里的file.url：图片路径

          if(!blobFile) return false;

          let eleLink = document.createElement('a');
          eleLink.download = file.name;//图片名字
          eleLink.style.display = 'none';
          eleLink.href = window.URL.createObjectURL(blobFile);
          // 触发点击
          document.body.appendChild(eleLink);
          eleLink.click();
          // 然后移除
          document.body.removeChild(eleLink);
        });
      },
      loadImageToBlob(url, callback) {

        if(!url || !callback) return false;

        var xhr = new XMLHttpRequest();

        xhr.open('get', url, true);

        xhr.responseType = 'blob';

        xhr.onload = function() {

          // 注意这里的this.response 是一个blob对象 就是文件对象

          callback(this.status == 200 ? this.response : false);

        };
        xhr.send();
        return true;
      }
    }
  }
</script>
<style scoped lang="scss">

</style>
