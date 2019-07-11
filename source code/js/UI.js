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
      $(".imgcards").css("max-width",w-32+"px");
		}else{
			$(".resimg").css("max-width",maxWidth+"px");
      $(".imgcards").css("max-width",maxWidth+"px");
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
  var createImageCard=(url)=>{
    var tar=document.createElement("div");
      $(tar).addClass("imgcards");
    var copy=document.createElement("a");
      $("#dropFile").click(()=>{$("#menu").animate({
        width:"0px",height:"0px"
      },50,()=>{$("#dropFile").css("display","none");});});
      $("#dropFile").contextmenu(()=>{$("#menu").animate({
        width:"0px",height:"0px"
      },50,()=>{$("#dropFile").css("display","none");});});
      var functions=back.imageFunctions(tar);
      copy.oncontextmenu=(e)=>{
        var menu=$("#menu");
        console.log(e);
        menu.html("");
        for(var f in functions){
          var x=document.createElement("a");
          $(x).css({"color":"CadetBlue","clear":"both","textDecoration":"none","display":"block","padding":"4px","width":"auto","z-index":"13","position":"relative"});
          x.href="#";
          x.innerHTML=functions[f].name;
          x.onclick=functions[f].main;
          menu.append(x)
        }
        $("#dropFile").css("display","initial");
        $(menu).css({"height":"auto","width":"auto"});
        var height=$(menu).height(),width=$(menu).width();
        var l, t;
        var l = e.clientX;
        var t = e.clientY;
        w=document.body.clientWidth;
        h=document.body.clientHeight;
        if(t+height>h)l=h-height;
        if(l+72>w)l=w-72;
        $(menu).css({"top":t+"px","left":l+"px","display":"block"});
        $(menu).css({"height":"0px","width":"0px"});
        $(menu).animate({
            width:width+"px",height:height+"px"
        },300);
        return false;
      }
      copy.onclick=functions.copy.main;
      copy.href="#";
      copy.title="点击复制链接"
      copy.innerHTML="<image src='"+url+"' class='hoverwhite resimg'>";
    var del=document.createElement("a");
      $(del).addClass("close");
      $(del).css("display","none");
      del.href="#";
      del.innerHTML="<i class='material-icons' style='position:absolute;z-index:10;top:0px;right:0px;background-color:red;color:white;'>close</i>";
      del.onclick=functions.remove.main;
      tar.appendChild(copy);
      tar.appendChild(del);
    return tar;
  }
	this.addImg=(url,functions)=>{
    document.getElementById("main").appendChild(createImageCard(url));
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
      updateUploadedImg:(url,functions)=>{
        $(pgbc).animate({
          height:"0px",opacity:"0"
        },"slow",()=>{
          $(pgbc).css("display","none");
          var ok=document.createElement("div");
          ok.style="position:absolute;top:50%;left:0;right:0;margin:auto;font-size:0px";
          ok.innerHTML="<i class='material-icons' style='font-size:inherit;top:50%;padding:0px;text-align:center;solid;display:block'>check_circle</i>";
          tar.appendChild(ok);
          $(ok).animate({
            top:"-=18px",fontSize:"36px"
          }).fadeOut(1000,()=>{
            $(ok).css("display","none");
            tar.parentNode.replaceChild(createImageCard(url,functions),tar);
            refresh();
          });
        });
      }
    }
    return functions;
  }
	return this;
}
ui=uiS();
