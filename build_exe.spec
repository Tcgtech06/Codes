# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['test.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('Image/logo.jpg', 'Image'),
        ('Image/Tcgtech.png', 'Image'),
        ('DejaVuSans.ttf', '.'),
        ('DejaVuSans-Bold.ttf', '.'),
        ('DejaVuSans.pkl', '.'),
        ('DejaVuSans-Bold.pkl', '.'),
        ('DejaVuSans.cw127.pkl', '.'),
        ('DejaVuSans-Bold.cw127.pkl', '.'),
    ],
    hiddenimports=[
        'customtkinter',
        'PIL._tkinter_finder',
        'fpdf',
        'docx',
        'docx.enum',
        'docx.enum.text',
        'docx.shared',
        'PIL',
        'tkinter',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='TCG_Invoice',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,  # Set to True temporarily to see debug messages
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='Image/logo.jpg',  # Optional: Add .ico file if you have one
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='TCG_Invoice',
)
