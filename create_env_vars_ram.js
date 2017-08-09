var WshShell = WScript.CreateObject("WScript.Shell");
var WshSysEnv = WshShell.Environment("SYSTEM");
var wdir = WScript.CreateObject("Scripting.FileSystemObject");
var rootPath = wdir.GetAbsolutePathName("../");
var WshShell = WScript.CreateObject("WScript.Shell");
var WshSysEnv = WshShell.Environment("SYSTEM");

// создать путь относительно Root
function CreatePath(sub_dir)
{
	var path = rootPath + "\\" + sub_dir;
	//WScript.Echo(path);
	return path;
};

// срздать переменную среды окружения
function CreateEnvVar(var_name, param)
{
	//WScript.Echo("Установка переменной: " + var_name + " = " + param);
	WshSysEnv(var_name) = param;
}

function AppendEnvVar(var_name, param)
{
	//WScript.Echo("Установка переменной: " + var_name + " = " + param);
	WshSysEnv(var_name) += ";" + param;
}

// создать все необходимые переменные
CreateEnvVar("SharedTecINT", "R:\\_obj-lib-etc\\intermediate");
WScript.Echo("SharedTec SDK ready to work");