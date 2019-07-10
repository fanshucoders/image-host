<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin:*");
header('Access-Control-Allow-Methods:POST');
header('Access-Control-Allow-Headers:x-requested-with, content-type');
//获取回调函数名
function upload($savedir = 'uploads')
{
	//-------------保存文件
	//临时目录
	$tmppath = $savedir ;
	if (!file_exists($tmppath)) {@mkdir($tmppath, 0777, true);}//文件夹不存在就创建
	//临时文件名
	$tmpname = getParam("fname");
	//储存临时文件
	@move_uploaded_file($_FILES["file"]["tmp_name"], "{$tmppath}/{$tmpname}");
}
upload($savedir = 'uploads');
function getParam($key, $default='')
{
    return trim($key && is_string($key) ? (isset($_POST[$key]) ? $_POST[$key] : (isset($_GET[$key]) ? $_GET[$key] : $default)) : $default);
}