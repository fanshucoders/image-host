function backS(){
		var maxUp=4;
    var ext = new Set(["ICON","BMP","GIF","JPEG","PNG","ICO","JPG","DIB","JFIF","PJPEG","PJP"]);
    this.imgs=[];
    $(document).ready(function(){
        document.getElementById("dropFile").ondrop=(e)=>{
            up(e.target.files?e.target.files:e.dataTransfer.files);
        };
        var div = document.createElement('div');
        div.innerHTML = '<a href="./"></a>';
        domain=(div.firstChild.href);
        domain=domain.substring(0,domain.length-1);
        div = null;
        console.log(domain);
        imgs=getImgs();
        for(var img in imgs){
            ui.addImg(imgs[img]);
        }
        $(window).resize(ui.changeSize);
				ui.init_();
    });
    var setImgs=(value) =>
    {
        localStorage.setItem("Imgs",JSON.stringify(value));
    }
		this.rmvImg=(url)=>{
				console.log(imgs);
				imgs.splice(imgs.indexOf(url),1);
				setImgs(imgs);
				return imgs;
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
    this.getFileExt=(ox)=>{
        o=ox.name;
        var pos=o.lastIndexOf(".");
        //console.log(o.substring(pos+1))
        return o.substring(pos+1);
    }
    var qing=false;
    var files=[];
		var uploading=0;
		var stop={};
    this.up=(fls)=>{
        for(var i=0;i<fls.length;i++){
            var file=fls[i];
            if(ext.has(getFileExt(file).toUpperCase())){
	            var functions=ui.createUploadingImage(file,()=>{
								var pos;
								for(pos=0;pos<files.length;pos++)
									if(files[pos].file==file)break;
								if(pos!=files.length){files.splice(pos,1);}
								else {stop[file]();uploading=uploading-1;stop[file]=null;}
	            },()=>{files.push({file:file,functions:functions});if(files.length==1)upone();});
	            files.push({file:file,functions:functions});
						}else ui.notif("不支持的文件类型");
        }
        if(files.length<=fls.length)upone();
    }
    var wait=()=>{
        if(uploading>=maxUp)setTimeout(wait,500);
        else upone();
    }
    var upone=()=>{
				console.log(1);
        if(files.length>0){
            var pair=files.shift();
            var file=pair.file,functions=pair.functions;
            var completeDo=(url)=>{
							uploading-=1;
              functions.updateUploadedImg(url);
							if(url!="failed"&&url!="rejected"&&url!="duplicate"&&url!="overSize"){
								imgs.push(url);
	              setImgs(imgs);
							}
							stop[file]=null;
            }
						var setProgress=functions.setProgress;
            notif("开始上传"+file.name);
						uploading+=1;
            stop[file]=php.additem(file,{completeDo:completeDo,setProgress:setProgress});
            setTimeout(wait,500);
        }
    }
    return this;
}
back=backS();
