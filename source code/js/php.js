function upload(data=!1){
	//设置
	var config =
		{ 	file_max_size : data.file_max_size || 1024 * 1024 * 1024,//单文件大小限制false\0不限制
			chunkSize : data.chunkSize || 1024 * 1024 * 1 ,//单个切片大小
			//注意PHP默认上传文件默认最大2MB   若要更改请找到    upload_max_filesize = 2m ;   这行进行更改
			uploadphp : data.uploadphp || "upload.php",//文件上传php
			accept_type : data.accept_type || "",//空\false\0为不限制
			Maximum : data.Maximum  || 0,//一次最多可上传数目false\0不限制
			accept_re : data.accept_re || false ,//false\0为不允许 true\1 允许
			nameLength: Math.floor(data.nameLength) || 32,
			savedir : data.savedir || "uploads"
		},
	g = 0,
	FUploaders = Object.create(null,{}),
	//计算临时ID
	y =()=>{
		var e = Math.random().toString(32).substr(2, 5),
		t = Math.floor(Date.now() / 1e3);
		return "FUploader_".concat(g++, "_",e, "_",t);
	};
	//获取随机文件名
	var randomString = ()=> {
		var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678oOLl9gqVvUuI1_-';
		var maxPos = $chars.length;
		var pwd = '';
		for (i = 0; i < config.nameLength; i++) {
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
			}
			return pwd;
	}
	//添加文件
	this.additem=(file,functions)=>{
		//判断是否允许重复
		if(!config.accept_re){
			//不允许
			//获取全部文件名
			let names = ()=>{
				let name = [],
					names = Object.keys(FUploaders);
				for(let i=0;i<names.length;i++){
					name.push(FUploaders[names[i]].file.name);
				}
				return name;
			}
			//有相同文件名的
			if(names().indexOf(file.name)!=-1){
				//console.log( files[i].name + "文件重复选择");
				functions.completeDo("duplicate");
				return;
			}

		}
		//判断是否限制大小
		if(config.file_max_size)
			//判断不通过
			if(config.file_max_size<=file.size){
				functions.completeDo("overSize");
				//console.log( "文件大小不符合");
				return;
			}

		//获取本次ID
		let id = y();
		FUploaders[id]={};
		FUploaders[id].file = file;
		FUploaders[id].chunks = Math.ceil(file.size / config.chunkSize);
		console.log(FUploaders[id].chunks)
		FUploaders[id].uploading = 1; //1进行 0暂停
		FUploaders[id].currentChunk = 0 ;
		FUploaders[id].load = 0;
		FUploaders[id].functions = functions;
		upload(id);

		//删除
		return ()=>{
			FUploaders[id].uploading = 0;
			let fd = new FormData();
			fd.append("id",id);
			fd.append('act', 'del');
			fd.append('load', FUploaders[id].load);
			if(FUploaders[id].load)fd.append('fname', FUploaders[id].fname);
			let xhr = new XMLHttpRequest();
			xhr.open('post',config.uploadphp);
			xhr.send(fd);
			xhr.onreadystatechange = ()=> {
				if (xhr.readyState == 4 && xhr.status == 200 ) {
					console.log(id + " 已删除");
					delete FUploaders[id]
					//从文件列表移除
				}
			}
		}

	}
	//上传
	var upload=(id)=>{
		console.log(FUploaders[id])
		let file = FUploaders[id].file,
			start = FUploaders[id].currentChunk * config.chunkSize,
			end = start + config.chunkSize >= file.size ? file.size : start + config.chunkSize,
			blob = file.slice(start,end);
		let fd = new FormData();
		let startT;
		fd.append("file",blob);
		fd.append("chunks",  FUploaders[id].chunks);
		fd.append("chunksize", blob.size);
		fd.append('Chunkindex', FUploaders[id].currentChunk);
		fd.append('id', id);
		fd.append('savedir', config.savedir);
		fd.append('act', 'upload');
		let xhr = new XMLHttpRequest();
		xhr.open('post',config.uploadphp);
		xhr.send(fd);
		startT = (new Date()).getTime();
		xhr.upload.onloadstart = ()=>{
			startT = (new Date()).getTime();
		}
		function onprogress(size,e){
			var nowTime = (new Date()).getTime();
				progress = parseInt( size / FUploaders[id].file.size * 100),
				speed = parseInt(e / [(nowTime - startT + 20) / 1000]),
				preTime = Math.round((FUploaders[id].file.size - size) / speed);
			FUploaders[id].functions.setProgress()
		}
		//成功
		xhr.onload = ()=> {
			onprogress(FUploaders[id].currentChunk * config.chunkSize + blob.size,blob.size);
			FUploaders[id].currentChunk++;
			if(FUploaders[id].currentChunk < FUploaders[id].chunks) {
				//下一片

				if(FUploaders[id].uploading == 1 ){
					upload(id);
				}
			} else {
			// 文件上传完成
				let fd2 = new FormData();
				fd2.append("id",id);
				fd2.append('fname', randomString()+"."+getFileExt(file));
				fd2.append('act', 'combine');
				fd2.append("chunks",  FUploaders[id].chunks);
				fd2.append('savedir', config.savedir);
				let xhr2 = new XMLHttpRequest();
				xhr2.open('post',config.uploadphp);
				xhr2.send(fd2);
				xhr2.onreadystatechange = ()=> {
					if (xhr2.readyState == 4 && xhr2.status == 200 ) {
						//文件合并完成
						FUploaders[id].load = 1;
						FUploaders[id].fname = fd2.get("fname");
						FUploaders[id].functions.completeDo(xhr2.responseText+fd2.get("fname"));
						xhr2 = null;
						fd2 = null;
					}
				}
			}
			//暂停
			if(FUploaders[id].uploading == 0 ){
				return;
			}

			xhr = null;
			blob = null;
			return;
		}
		//给计算参数
		xhr.onprogress=(evt)=>{
			onprogress( evt.loaded + FUploaders[id].currentChunk * config.chunkSize,evt.loaded)
		};
		// 文件上传出错
		xhr.onerror = xhr.upload.onerror = ()=> {
			FUploaders[id].functions.completeDo("failed");
		}
		fd = null;

	}

	return this;
}
var php=upload({file_max_size:1024 * 1024 * 10,chunkSize : 1024 * 100});
