<?php
header("Access-Control-Allow-Origin:*");
session_start();

class uploader
{
	 //上传
	 public function upload($chunk_name, $savedir ){
		  //if (empty($_FILES[$chunk_name]) || $_FILES[$chunk_name]["error"] > 0) {echo '["fales"]';}//上传失败
		  //-------------保存临时文件
		  //总分块个数
		  $chunks = intval(getParam('chunks'));
		  //当前分块索引
		  $chunk_id = intval(getParam('Chunkindex'));
		  //临时目录
		  $tmppath = $savedir . '/tmp/' . getParam("id");
		  if (!file_exists($tmppath)) {@mkdir($tmppath, 0777, true);}//文件夹不存在就创建
		  //临时文件名
		  $tmpname = getParam("id") . "_{$chunk_id}";
		  //储存临时文件
		  @move_uploaded_file($_FILES["file"]["tmp_name"], "{$tmppath}/{$tmpname}");
	 }
	 
	 //合成
	public function combine($id, $savedir){
		//总分块个数
		$chunks = intval(getParam('chunks'));
		//临时目录
		$tmppath = $savedir . '/tmp/' . $id;
		$savedir = $savedir . '/files/'.date('Ym', time());
		if (!file_exists($savedir)) {@mkdir($savedir, 0777, true);}//文件夹不存在就创建
		//处理文件
		$nwename=getParam('fname');
		$writer = fopen("{$savedir}/{$nwename}", "ab");
		for ($i = 0; $i < $chunks; $i++) {
			$file2read = "{$tmppath}/{$id}_{$i}";
			$reader = fopen($file2read, "rb");
			fwrite($writer, fread($reader, filesize($file2read)));
			fclose($reader);
			unset($reader);
			@unlink($file2read);
		}
		fclose($writer);
		@rmdir($tmppath);
		echo $savedir;
		 
	}
	
	//删除
	public function del_tmp($id, $savedir){
		$path = $savedir . '/tmp/' . $id ."/";
		if(is_dir($path)){
			//扫描一个文件夹内的所有文件夹和文件并返回数组
			$p = scandir($path);
			//遍历数组
			foreach($p as $val){
				if($val !="." && $val !=".."){
					//删除文件
					unlink($path.$val);
				}
			}
		}
		//删除文件夹
		rmdir($path);
	}
	
	//删除
	public function del_file($path){
		unlink($path);
	}
}
$er = new uploader();
switch(getParam('act')){
	case 'upload':
		$data = $er->upload("file",getParam("savedir"));
	break;
	
	case 'combine':
		$data = $er->combine(getParam("id"),getParam("savedir"));
	break;
	
	case 'del_tmp':
		$data = $er->del_tmp(getParam("id"),getParam("savedir"));
	break;
	
	case 'del_file':
		$data = $er->del_file(getParam("path"));
	break;
}


function getParam($key, $default='')
{
    return trim($key && is_string($key) ? (isset($_POST[$key]) ? $_POST[$key] : (isset($_GET[$key]) ? $_GET[$key] : $default)) : $default);
}