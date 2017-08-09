var scriptPath = WScript.ScriptFullName.substring(0, WScript.ScriptFullName.lastIndexOf('\\')+1);
//WScript.Echo(scriptPath);

var sandboxPath = scriptPath+"..\\..\\..\\SandBox\\";
//WScript.Echo(sandboxPath);

var productPath = scriptPath+"..\\..\\..\\SandBox\\Product\\";
//WScript.Echo(productPath);

var wdir = WScript.CreateObject("Scripting.FileSystemObject");
var startPath = wdir.GetAbsolutePathName("");
//WScript.Echo(startPath);

// ������ ���������� �������
// ��������� ������� ���������� � / ��� ��� �� ���������� � ����� ������� ��������� ���������� ��� ��������� 
var projectName;
var projectConfiguration = "Debug";
var projectParam = "";
var packType = "op";
var solutionName = "";

var objArgs = WScript.Arguments;
for (i = 0; i < objArgs.length; i++)
{
	if(i==0)
	{
		projectName = objArgs(i);
		continue;
	}
	var param = objArgs(i);
	if(param.substr(0,1) == "/")
	{
		if(param.length < 2)
		{
			WScript.Echo("����������� ������� <"+param+">" );
			WScript.Quit(1)
		}
	
		var paramType = param.substr(1,1);
		if(paramType == "d") // ���������� debug /d
			continue;
		else if(paramType=="r") // /r
		{
			projectConfiguration = "Release";
		} 
		else if(paramType=="t") 	// ��� ������:
							// /t=op - (only pack)������ ��������; 
							// � ��������� ������ ���� ����� �������� ��������:  
							// /t=bp - (build project)������� ������ ������, 
							// /t=ba - (build all)������� ������ � artyLibs, 
							// /t=ra - (rebuild all)������������ ������ � artyLibs
		{
			if(param.length < 5)
			{	
				WScript.Echo("����������� ������� <"+param+">" );
				WScript.Quit(1)
			}
			packType = param.substr(3,2);
			if(packType != "op" && packType != "bp" && packType != "ba" && packType != "ra")
			{
				WScript.Echo("����������� ��� �������� <"+param+">" );
				WScript.Quit(1)

			}
		}
		else if(paramType=="s")
		{
			if(param.length<4)
			{
				WScript.Echo("����������� ��� �������� <"+param+">" );
				WScript.Quit(1)
			}
			
			solutionName = param.substr(3, param.length-3);
		}
		else
		{
			WScript.Echo("����������� ������� <"+param+">" );
			WScript.Quit(1)
		}
	}
	else
	{
		projectParam += " "+param;
	}
	
}
//WScript.Echo(projectName);
//WScript.Echo(projectParam);
//WScript.Echo(projectConfiguration);
//WScript.Echo(packType);
//WScript.Echo(solutionName);

//����
var wshShell = WScript.CreateObject("WScript.Shell");
var wshSysEnv = wshShell.Environment("Process");

var vcvars32_runPath =  "\"" + wshSysEnv("VS100COMNTOOLS") + "vsvars32.bat" + "\"";
WScript.Echo(vcvars32_runPath);
wshShell.Run(vcvars32_runPath, 1, true);
//wshShell.Run("devenv", 1, true);



if(packType!="op")
{
	if(solutionName.length<1)
	{
		WScript.Echo("����� ��� �������� �� ������� ��� ���������� �������, �� �� ����� visual studio solution" );
		WScript.Quit(1)
	}
}

if(packType=="bp" || packType=="ba" || packType=="ra")
{
	var devenvPath = "devenv ";
	
	var buildMode = " /build ";
	
	if(packType == "ra")
	{
	    buildMode = " /rebuild ";
	}	
		
	if(packType=="ba" || packType == "ra")
   	{
   	    //var sdkPath = WshSysEnv("Arty_SDK_path");
   	    var sdkPath = "Artyshock";
   	    var devenvCommand = devenvPath + sdkPath + "/ArtyLibs.sln" + buildMode + projectConfiguration;
   	    //WScript.Echo(devenvCommand);
        wshShell.Run(devenvCommand, 1, true);    	
	}

	var solutionPath = sandboxPath + solutionName + ".sln";		
	var devenvCommand = devenvPath +"\""+ solutionPath +"\" "+ buildMode + projectConfiguration +" /project \"" + projectName +"\" ";
	//WScript.Echo(devenvCommand);
	//wshShell.Run(devenvCommand, 1, true);

	wshShell.Run(devenvCommand ,1,true);
}

var programDir = productPath + projectName + "\\";
var programPath = programDir + projectName+ "." + projectConfiguration + ".exe";// + " " +projectParam;
//WScript.Echo(programPath );
if(!wdir.FileExists(programPath))
{
	WScript.Echo("������. ��������� ����: " + programPath);
	WScript.Quit(1)
}

wshShell.Run(programPath + " " + projectParam, 1, true);

// ���������
var programFolderPath = productPath + projectName + "\\";
//WScript.Echo(programFolderPath );

var excludedConfig = projectConfiguration == "Debug" ? "Release" : "Debug";
var excludeExe = projectName + "." + excludedConfig +".exe";
var excludeCmd = "-xr!" + excludeExe;
//WScript.Echo(excludeCmd);

var dllPath = "Artyshock\\ThirdParty\\lib\\";
//WScript.Echo(dllPath);
//WScript.Echo(programDir);
wdir.CopyFile(dllPath+"*.dll", programDir, 1);
wshShell.Run("7z.exe a "+projectName+".7z \""+programFolderPath+"\" -xr!*.pdb -xr!_err.txt -xr!_log.txt -xr!*.commands -xr!*.jpg -xr!*.avi " + excludeCmd, 1, true);
//WScript.Echo("Enjoy!");

//*/

