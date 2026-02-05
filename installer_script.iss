; TCG Invoice Management System - Inno Setup Script
; This script creates a Windows installer for TCG Invoice

[Setup]
; Application Information
AppName=TCG Invoice Management System
AppVersion=2.0
AppPublisher=TCG Technology
AppPublisherURL=https://www.tcgtech.com
AppSupportURL=https://www.tcgtech.com
AppUpdatesURL=https://www.tcgtech.com
DefaultDirName={autopf}\TCG Invoice
DefaultGroupName=TCG Invoice
AllowNoIcons=yes
LicenseFile=TERMS_OF_SERVICE.txt
InfoBeforeFile=README.txt
OutputDir=Output
OutputBaseFilename=TCG_Invoice_Setup_v2.0
SetupIconFile=Image\logo.jpg
Compression=lzma2
SolidCompression=yes
PrivilegesRequired=admin
WizardStyle=modern

; Minimum Windows version
MinVersion=6.1sp1

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; Main application files from PyInstaller output
Source: "dist\TCG_Invoice\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; Documentation files
Source: "README.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "USER_GUIDE.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "TERMS_OF_SERVICE.txt"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
; Start Menu shortcuts
Name: "{group}\TCG Invoice"; Filename: "{app}\TCG_Invoice.exe"
Name: "{group}\User Guide"; Filename: "{app}\USER_GUIDE.txt"
Name: "{group}\{cm:UninstallProgram,TCG Invoice}"; Filename: "{uninstallexe}"
; Desktop shortcut (optional)
Name: "{autodesktop}\TCG Invoice"; Filename: "{app}\TCG_Invoice.exe"; Tasks: desktopicon

[Run]
; Option to launch application after installation
Filename: "{app}\TCG_Invoice.exe"; Description: "{cm:LaunchProgram,TCG Invoice}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
; Note: User data in %APPDATA%\TCG_Invoice is NOT deleted
; Users can manually delete it if they want to remove all data

[Code]
procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
  begin
    // Create AppData directory structure (will be created by app on first run)
    // This is just informational
  end;
end;

procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
var
  AppDataPath: String;
  ResultCode: Integer;
begin
  if CurUninstallStep = usUninstall then
  begin
    AppDataPath := ExpandConstant('{userappdata}\TCG_Invoice');
    if DirExists(AppDataPath) then
    begin
      if MsgBox('Do you want to delete all your invoice data and business profiles?' + #13#10 + 
                'This will permanently delete all your invoices and settings.' + #13#10#13#10 +
                'Location: ' + AppDataPath, 
                mbConfirmation, MB_YESNO) = IDYES then
      begin
        DelTree(AppDataPath, True, True, True);
      end;
    end;
  end;
end;
