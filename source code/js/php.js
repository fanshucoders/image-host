function phpS(){
	var fileNameLength=32;
  var uploading=false;
  this.upload=(file,completeDo,setProgress)=>{
    var _this={
        upload:function(file){
          uploading=true;
          var t=new FormData;
            t.append("file",file);
            t.append("fname",this.randomString(fileNameLength)+"."+getFileExt(file));
          let xhr = new XMLHttpRequest();
            xhr.open('post',domain+"/upload.php");
            xhr.send(t);
          xhr.onload = () =>
            {
              console.log(file,domain+"/uploads/"+t.get("fname"));
              uploading=false;
              completeDo(domain+"/uploads/"+t.get("fname"));
            }
          xhr.error = () =>
            {
              uploading=false;
              completeDo("failed");
            }
        },
        randomString:function (len) {
    　　		var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678oOLl9gqVvUuI1_-';
    　　		var maxPos = $chars.length;
    　　		var pwd = '';
    　			for (i = 0; i < len; i++) {
    　　　		　	pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    　　		}
    　			return pwd;
        },
        /**
        * 校验图片转换后大小并上传
        */
        checkAndHandleUpload:function(file) {
          this.imgBase64(file, function (image, canvas) {
            var maxSize = 2.0*1024*1024; // 2M
            var fileSize = file.size; // 图片大小
            if(fileSize > maxSize) { // 如果图片大小大于2m，进行压缩
              //console.log(maxSize,fileSize, maxSize/fileSize );
              uploadSrc = canvas.toDataURL(file.type, maxSize/fileSize);
              uploadFile = _this.convertBase64UrlToFile(uploadSrc, file.name.split('.')[0]+"."+file.name.split('.')[1]); // 转成file文件
            } else {
              uploadSrc = image.src; //canvas.toDataURL(file.type,0.5);
              uploadFile = file;
            }
            if(uploadFile.size > maxSize) {
              _this.checkAndHandleUpload(uploadFile);
            } else {
              _this.upload(uploadFile);
            }
          });
        },
        /**
        * 将图片转化为base64
        */
        imgBase64:function(file,callback){
          var self = this;
          // 看支持不支持FileReader
          if (!file || !window.FileReader) return;
          // 创建一个 Image 对象
          var image = new Image();
          // 绑定 load 事件处理器，加载完成后执行
          image.onload = function(){
            // 获取 canvas DOM 对象
            var canvas = document.createElement('canvas')
            // 返回一个用于在画布上绘图的环境, '2d' 指定了您想要在画布上绘制的类型
            var ctx = canvas.getContext('2d')
            // 如果高度超标 // 参数，最大高度
            var MAX_HEIGHT = 3000;
            if(image.height > MAX_HEIGHT) {
              // 宽度等比例缩放 *=
              image.width *= MAX_HEIGHT / image.height;
              image.height = MAX_HEIGHT;
            }
            // 获取 canvas的 2d 环境对象,
            // 可以理解Context是管理员，canvas是房子
            // canvas清屏
            console.log('canvas.width:', canvas.width);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // 重置canvas宽高
            canvas.width = image.width;
            canvas.height = image.height;
            // 将图像绘制到canvas上
            ctx.drawImage(image, 0, 0, image.width, image.height);
            // !!! 注意，image 没有加入到 dom之中
            console.log(file.type);
            // console.log(canvas.toDataURL('image/jpeg',0.5));
            //----------//
            callback(image, canvas);
            //--------//
          };
          if (/^image/.test(file.type)) {
            // 创建一个reader
            var reader = new FileReader();
            // 将图片将转成 base64 格式
            reader.readAsDataURL(file);
            // 读取成功后的回调
            reader.onload = function () {
              // self.imgUrls.push(this.result);
              // 设置src属性，浏览器会自动加载。
              // 记住必须先绑定事件，才能设置src属性，否则会出同步问题。
              image.src = this.result;
            }
          }
        },
        //base64 To Img
        convertBase64UrlToFile:function (base64Data,imgName){

          var blob = this.dataURLtoBlob(base64Data);
          var file = this.blobToFile(blob, imgName);
          return file;
        },
        //base64 To blob
        dataURLtoBlob:function(dataurl){
          var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],bstr = atob(arr[1]),n = bstr.length,
          u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new Blob([u8arr], { type: mime });
        },
        //blob To File
        blobToFile:function(theBlob, fileName){
          theBlob.lastModifiedDate = new Date();
          theBlob.name = fileName;
          return theBlob;
        }
      }
      _this.checkAndHandleUpload(file);
			return ()=>{
				/*取消上传这个文件*/
			}
    }
    return this;
}
var php=phpS();
