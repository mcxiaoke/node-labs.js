Set WshShell  = CreateObject ("Wscript.Shell") 
Dim strArgs
strArgs = "node autowallpaper.js"
WshShell.Run strArgs, 0, false
Set WshShell = Nothing