function uiS(){
  var maxWidth=144;
  var create=(type)=>{
    return document.createElement(type);
  }
  var namer=(icon,text)=>{
    return "<div style='position:relative;height:auto;white-space:nowrap'><i class='material-icons'>"+icon+"</i><div style='position:relative;margin-top:-20px;margin-left:30px'>"+text+"</div></div>";
  }
  var displayMenu=(e,functions)=>{
    console.log(1);
    var menu=$("#menu");
    var list=$("#menuList");
    list.html("");
    for(var f in functions){
      var x=create("a");
      $(x).addClass("menuListItem");
      x.href="#";
      x.innerHTML=functions[f].name;
      x.onclick=functions[f].main;
      list.append(x)
    }
    $("#dropFile").css("display","initial");
    $(menu).css("display","block");
    var height=list.height(),width=list.width();
    var l, t;
    var l = e.clientX;
    var t = e.clientY;
    w=document.body.clientWidth-16;
    h=document.body.clientHeight;
    if(t+height>h)l=h-height;
    if(l+width>w)l=w-width;
    $(menu).css({"top":t+"px","left":l+"px","display":"block"});
    $(menu).css({"height":"0px","width":"0px"});
    $(menu).animate({
        width:width+"px",height:height+"px"
    },300);
  }
  var imageFunctions=(tar,url)=>{
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
                console.log(url);
                back.rmvImg(url);
                tar.parentNode.removeChild(tar);
              },
              name:namer('close',"删除")
          },
          delete:{
              main:()=>{
                back.rmvImg(url);
                tar.parentNode.removeChild(tar);
              },
              name:namer("delete","完全删除")
          }
      }
      return functions;
  }
  var mainFunctions=()=>{
    var functions={
      upload:{
        main:()=>{
          document.getElementById('upload').click();
        },
        name:namer("cloud_upload","上传")
      },
      deleteAll:{
        main:()=>{
          $(".imgcards").each((i,x)=>{
            imageFunctions(x).remove.main();
            //console.log(x);
          });
        },
        name:namer("delete","全部删除")
      },
      mainPage:{
        main:()=>{
          location.href="https://www.github.com/fanshucoders/image-host"
        },
        name:namer("home","项目主页")
      }
    }
    return functions;
  }
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
    var tar=create("div");
      $(tar).addClass("imgcards");
    var copy=create("a");
      var functions=imageFunctions(tar,url);
      copy.oncontextmenu=(e)=>{
        e.cancelBubble = true;
        displayMenu(e,functions);
        return false;
      }
      copy.onclick=functions.copy.main;
      copy.href="#";
      copy.title="点击复制链接"
      copy.innerHTML="<image src='"+url+"' class='hoverwhite resimg'>";
      copy.style="z-index:10";
    var del=create("a");
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
  this.createUploadingImage=(file,cancl,retry)=>{
    var tar=create("div");
    var img=create("img");
    var pgbc=create("div");
    $(pgbc).addClass("progressBarContainer");
    pgbc.innerHTML="<div class='progressBar' style='width:100%'></div>";
    //pgb.MaterialProgress.setProgress(44);
    var cancel=create("a");
    $(img).addClass("resimg");
    $(img).css({"opacity":0.4,"filter":"alpha(opacity=40)"});
    $(tar).addClass("imgcards");
    $(cancel).addClass("close");
    $(cancel).html("<i class='material-icons' style='position:absolute;z-index:10;top:0px;right:0px;background-color:red;color:white'>close</i>");
    $(cancel).click(()=>{tar.parentNode.removeChild(tar);cancl();});
    $(cancel).attr("href","javascript:void(0)");
    tar.appendChild(img);
    tar.appendChild(cancel);
    tar.appendChild(pgbc);
    document.getElementById("main").appendChild(tar);
    $(tar).find(".progressBar").animate({"width":"0%"});
    refresh();
    var reader = new FileReader();
    reader.onload =(e)=>{
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    var setMessage=(m,bi,action)=>{
      $(cancel).css("display","none");
      $(pgbc).animate({
        height:"0px",opacity:"0"
      },"slow",()=>{
        $(pgbc).css("display","none");
        var b=create("button");
        $(b).addClass("action");
        //$(b).addClass("mdl-button mdl-js-button");
        var i=create("i");
        //i.style="display:block;top:0;left:0;right:0;bottom:0;font-size:36px;margin:auto"
        i.innerHTML=bi;
        $(i).addClass("material-icons");
        b.appendChild(i);
        b.onclick=action;
        var mc=create("div");
        $(mc).addClass("message-container");
        var mb=create("div");
        mb.style="position:absolute;top:50%;transform:translate(-0%,-50%);width:100%;height:auto;text-align:center;";
        mc.style="position:absolute;top:0px;left:0px;height:100%;width:100%;z-index:5;opacity:0";
        mb.innerHTML=m+"<br>";
        mb.appendChild(b);
        mc.appendChild(mb);
        tar.appendChild(mc);
        $(mc).animate({
          opacity:1
        });
      });
    }
    var functions={
      setProgress:(progress)=>{
        $(tar).find(".progressBar").animate({"width":progress+"%"});
      },
      updateUploadedImg:(url,functions)=>{
        if(url=="failed")setMessage("<b style='width:auto;color:red'>文件上传失败</b>","refresh",()=>{
          $(tar).find(".message-container").animate({opacity:0},()=>{$(this).css("display","none")});
          $(pgbc).css("display","initial");
          $(pgbc).animate({height:"24px",opacity:0.8});
          $(tar).find(".progressBar").animate({"width":"0%"});
          retry();
        });
        else if(url=="duplicate")setMessage("<b style='color:red'>文件重复</b>","close",()=>{
          $(tar).animate({opacity:0},()=>{
            tar.parentNode.removeChild(tar);
          });
        });
        else if(url=="overSize")setMessage("<b style='color:red'>文件过大，请压缩后再上传</b>","close",()=>{
          $(tar).animate({opacity:0},()=>{
            tar.parentNode.removeChild(tar);
          });
        });
        else{
          $(cancel).css("display","none");
          $(pgbc).animate({
            height:"0px",opacity:"0"
          },"slow",()=>{
            $(pgbc).css("display","none");
            var ok=create("div");
            ok.style="position:absolute;top:50%;left:0;right:0;margin:auto;font-size:0px";
            ok.innerHTML="<i class='material-icons' style='font-size:inherit;top:50%;padding:0px;text-align:center;solid;display:block'>check_circle</i>";
            tar.appendChild(ok);
            $(ok).animate({
              top:"-=18px",fontSize:"36px"
            }).fadeOut(1000,()=>{
              $(ok).css("display","none");
              tar.parentNode.replaceChild(createImageCard(url),tar);
              refresh();
            });
          });
        }
      }
    }
    return functions;
  }
  this.init_=()=>{
    document.onselectstart = function(){ return false;};
    $("#dropFile").click(()=>{$("#menu").animate({
      width:"0px",height:"0px"
    },50,()=>{$("#dropFile").css("display","none");});});
    $("#dropFile").contextmenu(()=>{$("#menu").animate({
      width:"0px",height:"0px"
    },50,()=>{$("#dropFile").css("display","none");});return false;});
    //document.oncontextmenu=()=>{return false;}
    document.getElementById("upload-display").oncontextmenu=(e)=>{
        e.cancelBubble = true;
        console.log(e);
        return false;
    }
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
    var functions=mainFunctions();
    document.querySelector("main.mdl-layout__content").oncontextmenu=(e)=>{
      displayMenu(e,functions);
      return false;
    }
    refresh();
  }
	return this;
}
ui=uiS();
