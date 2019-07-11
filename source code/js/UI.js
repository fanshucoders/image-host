function uiS(){
  var maxWidth=144;
	this.notif=(m,t=500)=>{
		var notification = document.querySelector('.mdl-js-snackbar');
		notification.MaterialSnackbar.showSnackbar(
		  {
			message: m,
			timeout: t,
		  }
		);
	}
	this.refresh=()=>{
		w=document.body.clientWidth;
		if(w<=maxWidth+32){
			$(".resimg").css("max-width",w-32+"px");
		}else{
			$(".resimg").css("max-width",maxWidth+"px");
		}
    $(".imgcards").hover(
      function(){
        $(this).children("a.close").css("display","initial");
      },function(){
        $(this).children("a.close").css("display","none");
      },
    );
	}
  this.changeSize=refresh;
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
    var tar=document.createElement("div");
    $(tar).addClass("imgcards");
    $(tar).html("<a title='点击复制链接' href='javascript:void(0)' onclick='back.clip(\""+url+"\")'><image src='"+url+"' class='hoverwhite resimg'></a><a class='close' style='display:none'href='javascript:back.removeImg(\""+url+"\")'><i class='material-icons' style='position:absolute;z-index:10;top:0px;right:0px;background-color:red;color:white'>close</i></a>");
    document.getElementById("main").appendChild(tar);
    refresh();
  }
	this.rmvImg=(url)=>{
		var target=document.querySelector("img[src='"+url+"']").parentNode.parentNode;
		target.parentNode.removeChild(target);
		notif('删除成功');
	}
  this.createUploadingImage=(file)=>{
    var tar=document.createElement("div");
    var img=document.createElement("img");
    var pgbc=document.createElement("div");
    $(pgbc).addClass("progressBarContainer");
    pgbc.innerHTML="<div class='progressBar'></div>";
    //pgb.MaterialProgress.setProgress(44);
    var cancel=document.createElement("a");
    $(img).addClass("resimg");
    $(img).css({"opacity":0.4,"filter":"alpha(opacity=40)"});
    $(tar).addClass("imgcards");
    $(cancel).addClass("close");
    $(cancel).html("<i class='material-icons' style='position:absolute;z-index:10;top:0px;right:0px;background-color:red;color:white'>close</i>");
    $(cancel).click(()=>{tar.parentNode.removeChild(tar);back.cancel(file);});
    $(cancel).attr("href","javascript:void(0)");
    tar.appendChild(img);
    tar.appendChild(cancel);
    tar.appendChild(pgbc);
    document.getElementById("main").appendChild(tar);
    refresh();
    var reader = new FileReader();
    reader.onload =(e)=>{
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    var functions={
      setProgress:(progress)=>{
        $(tar).find(".progressBar").css("width",progress+"%");
      },
      updateUploadedImg:(url)=>{
        tar.innerHTML="<a title='点击复制链接' href='javascript:void(0)' onclick='back.clip(\""+url+"\")'><image src='"+url+"' class='hoverwhite resimg'></a><a class='close' style='display:none'href='javascript:back.removeImg(\""+url+"\")'><i class='material-icons' style='position:absolute;z-index:10;top:0px;right:0px;background-color:red;color:white'>close</i></a>";
        refresh();
      }
    }
    return functions;
  }
	return this;
}
ui=uiS();
