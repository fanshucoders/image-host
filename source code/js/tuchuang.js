function uiS(){
	this.notif=(m,t=500)=>{
		var notification = document.querySelector('.mdl-js-snackbar');
		notification.MaterialSnackbar.showSnackbar(
		  {
			message: m,
			timeout: t,
		  }
		);
	}
	this.changeSize=()=>{
		w=document.body.clientWidth;
		if(w<=400){
			$(".resimg").css("max-width",w-32+"px");
		}else{
			$(".resimg").css("max-width","368px");
		}
	}
	this.rst=(file,result)=>{
		if(result=="rejected")notif(file.name+'违规，被拒绝');
		else if(result=="failed")notif(file.name+'上传失败');
		else{
			addImg(result);
			notif(file.name+'上传成功');
			changeSize();
		}
	}
	this.addImg=(url)=>{
		document.getElementById("main").innerHTML+="<div class='imgcards'><a title='点击复制链接' href='javascript:void(0)' onclick='back.clip(\""+url+"\")'><image src='"+url+"' class='hoverwhite resimg'></a><a class='close' style='display:none'href='javascript:back.removeImg(\""+url+"\")'><i class='material-icons' style='position:absolute;z-index:10;top:0px;right:0px;background-color:red;color:white'>close</i></a></div>"
		$(".imgcards").hover(
			function(){
				$(this).children("a.close").css("display","initial");
			},function(){
				$(this).children("a.close").css("display","none");
			},
		);
	}
	this.rmvImg=(url)=>{
		target=document.querySelector("img[src='"+url+"']").parentNode.parentNode;
		target.parentNode.removeChild(target);
		notif('删除成功');
	}
	return this;
}
function backS(){
	var fileNameLength=32;
	var ext = new Set(["ICON","BMP","GIF","JPEG","PNG","ICO","JPG","DIB","JFIF","PJPEG","PJP"]);
	var imgs=[];
	$(document).ready(function(){
		var div = document.createElement('div');
		div.innerHTML = '<a href="./"></a>';
		domain=(div.firstChild.href);
		domain=domain.substring(0,domain.length-1);
		div = null;
		console.log(domain);
		$(document).on({
			dragover:function(e){
				e.preventDefault();
				$("#dropFile").css("display","initial");
				$("#dropFile1").css("display","initial");
			},
		});
		$("#dropFile").on({
			dragleave:function(e){
				e.preventDefault();
				$("#dropFile").css("display","none");
				$("#dropFile1").css("display","none");
			},
			drop:function(e){
				e.preventDefault();
				$("#dropFile").css("display","none");
				$("#dropFile1").css("display","none");
			},
		});
		imgs=getImgs();
		for(var img in imgs){
			ui.addImg(imgs[img]);
		}
		ui.changeSize();
		$(window).resize(ui.changeSize);
	});
	this.removeImg=(url)=>{
		imgs.splice(imgs.indexOf(url),1);
		setImgs(imgs);
		ui.rmvImg(url);
	}
	var setImgs=(value) =>
	{ 
		localStorage.setItem("Imgs",JSON.stringify(value));
	}
	var getImgs=()=>
	{ 
		value=localStorage.getItem("Imgs")
		//console.log(value=localStorage.getItem("Imgs"));
		if(value!=null)
			return JSON.parse(value); 
		else 
			return []; 
	}
	this.clip=(content)=>{
		const input = document.createElement('input');
		document.body.appendChild(input);
		input.setAttribute('value', content);
		input.select();
		if (document.execCommand('copy')) {
			document.execCommand('copy');
			var notification = document.querySelector('.mdl-js-snackbar');
			notification.MaterialSnackbar.showSnackbar(
			  {
				message: '复制成功',
				timeout: 500,
			  }
			);
		}
		document.body.removeChild(input);
	}
	this.getFileExt=(ox)=>{
		o=ox.name;
		var pos=o.lastIndexOf(".");
		//console.log(o.substring(pos+1))
		return o.substring(pos+1);  
	}
	var qing=false;
	var files=[];
	var uploading=false;
	this.up=(fls)=>{
		files.push.apply(files,fls);
		if(files.length==fls.length)upone();
	}
	var wait=()=>{
		if(uploading)setTimeout(wait,500);
		else upone();
	}
	var upone=()=>{
		if(files.length>0){
			file=files.shift();
			notif("开始上传"+file.name);
			if(ext.has(getFileExt(file).toUpperCase())){
				upload(file);uploading=true;
				setTimeout,(wait,500);
			}else notif("不支持该文件类型");
		}
	}
	var upload=(file)=>{
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
							ui.rst(file,domain+"/uploads/"+t.get("fname"));
							imgs.push(domain+"/uploads/"+t.get("fname"));
							setImgs(imgs);
						}
					xhr.error = () =>
						{
							uploading=false;
							ui.rst(file,"failed");
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
		}
	return this;
}
ui=uiS();
back=backS();
