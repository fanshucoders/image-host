function backS(){
	document.oncontextmenu=()=>{return false;}
	var ext = new Set(["ICON","BMP","GIF","JPEG","PNG","ICO","JPG","DIB","JFIF","PJPEG","PJP"]);
	var imgs=[];
	this.imageFunctions=(tar)=>{
	  var namer=(icon,text)=>{
	    return "<i class='material-icons' style='float:left'>"+icon+"</i><abbr style='display:inline-block;margin-top:3px'>&nbsp;"+text+"</abbr>";
	  }
		var url=$(tar).find("img").attr("src");
		var functions={
			copy:{
				main:()=>{
						const input = document.createElement('input');
						document.body.appendChild(input);
						input.setAttribute('value', url);
						input.select();
						if (document.execCommand('copy')) {
							document.execCommand('copy');ui.notif("复制成功");
						}
				},
				name:namer("flip_to_front","复制")
			},
			remove:{
				main:()=>{
					imgs.splice(imgs.indexOf(url),1);
					setImgs(imgs);
					ui.rmvImg(url);
				},
				name:namer('close',"删除")
			},
			delete:{
				main:()=>{
					imgs.splice(imgs.indexOf(url),1);
					setImgs(imgs);
					ui.rmvImg(url);
				},
				name:namer("delete","完全删除")
			}
		}
		return functions;
	}
	$(document).ready(function(){
		var menu=document.createElement("div");
		$(menu).attr("id","menu");
		$(menu).css({"padding":"5px","border-radius":"4px","box-shadow":"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)","opacity":"80","overflow":"hidden","position":"fixed","height":"auto","display":"none","z-index":"13","background-color":"white"});
		document.getElementById("dropFile").appendChild(menu);
		document.getElementById("dropFile").ondrop=(e)=>{
			up(e.target.files?e.target.files:e.dataTransfer.files);
		};
		ui.refresh();
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
	this.cancel=(file)=>{
		return 0;
	}
	var qing=false;
	var files=[];
	this.up=(fls)=>{
		for(var i=0;i<fls.length;i++){
			var file=fls[i];
			console.log(file);
			var functions=ui.createUploadingImage(file);
			files.push({file:file,functions:functions});
		}
		if(files.length==fls.length)upone();
	}
	var wait=()=>{
		if(php.uploading)setTimeout(wait,500);
		else upone();
	}
	var upone=()=>{
		if(files.length>0){
			var pair=files.shift();
			var file=pair.file,functions=pair.functions;
			if(ext.has(getFileExt(file).toUpperCase())){
				var completeDo=(url)=>{
						imgs.push(url);
						functions.updateUploadedImg(url);
						setImgs(imgs);
				}
				php.upload(file,completeDo,functions.setProgress);
				notif("开始上传"+file.name);
				setTimeout,(wait,500);
			}else notif("不支持该文件类型");
		}
	}
	return this;
}
back=backS();
