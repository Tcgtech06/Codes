TCG INVOICE MANAGEMENT SYSTEM

A professional, multi-business invoice management system built with Python and CustomTkinter. Generate beautiful PDF and Word invoices with ease.

================================================================================
FEATURES
================================================================================

Multi-Business Support
- Manage up to 4 different businesses from one application
- Each business has its own:
  - Custom branding (name, address, email, phone)
  - Unique color theme
  - Logo
  - GST number
  - Custom watermark
  - Invoice numbering sequence

Invoice Generation
- PDF Generation with Unicode support (Rs symbol)
- Word Document generation (.docx)
- Professional invoice layouts
- Automatic calculations (subtotal, discount, tax, total)
- Quantity support with multiple units (Kg, gm, Litre, Piece, Rounds, Trips, Custom)
- Fraction support (1/2, 1/4, etc.)

Advanced Features
- Unlimited Invoice History per business
- Search Functionality - Search by invoice ID or client name
- Auto-calculation - Quantity x Price per unit
- Pending Status - Mark invoices as pending with red/bold display
- Preview Dialog - See invoice before saving
- Client Phone Numbers - Saved and loaded from history
- Custom Watermarks - Add custom text at bottom of invoices

User Interface
- Modern, clean design with CustomTkinter
- Full-screen splash screen with fade-in animation
- Color-coded business themes
- Responsive layout
- Easy business switching

================================================================================
REQUIREMENTS
================================================================================

Python Version
- Python 3.8 or higher

Dependencies
- customtkinter
- fpdf
- python-docx
- Pillow

================================================================================
INSTALLATION
================================================================================

1. Clone the repository
   git clone https://github.com/Tcgtech06/Codes.git
   cd INVOICE-GENERATOR

2. Install dependencies
   pip install -r requirements.txt

3. Run the application
   python test.py
   or
   python main.py

================================================================================
PROJECT STRUCTURE
================================================================================

INVOICE-GENERATOR/
├── test.py                 # Main application file
├── main.py                 # Alternative main file
├── requirements.txt        # Python dependencies
├── README.txt              # This file
├── TERMS_OF_SERVICE.txt    # Terms and conditions
├── USER_GUIDE.txt          # Detailed user guide
├── DejaVuSans.ttf         # Unicode font for PDF
├── DejaVuSans-Bold.ttf    # Bold Unicode font
├── DB/                    # Database folder
│   ├── profiles.json      # Business profiles
│   ├── history.json       # Invoice history
│   └── logos/             # Business logos
└── Image/                 # Application images
    ├── logo.jpg           # Application logo
    └── Tcgtech.png        # TCG Tech logo

================================================================================
BUSINESS THEMES
================================================================================

1. Business 1 - Blue Theme (#1e40af)
2. Business 2 - Green Theme (#059669)
3. Business 3 - Pink Theme (#ec4899)
4. Business 4 - Purple Theme (#7c3aed)

================================================================================
QUICK START
================================================================================

1. Launch Application - Run "python test.py"
2. Select Business - Click on a business from the sidebar
3. Enter Business Details - Fill in name, address, email, phone, GST, watermark
4. Upload Logo - Click "Upload Logo" to add your business logo
5. Save Info - Click "Save Info" to save business details
6. Create Invoice:
   - Enter client details
   - Add invoice items
   - Set discount and tax
   - Click "Generate PDF" or "Generate Word"

================================================================================
SEARCH FEATURE
================================================================================

- Use the search bar in the sidebar
- Search by invoice ID (e.g., "1005")
- Search by client name (e.g., "Mohan")
- Real-time filtering as you type

================================================================================
QUANTITY SYSTEM
================================================================================

Supports multiple input formats:
- Whole numbers: 1, 2, 10
- Decimals: 15.5, 0.5
- Fractions: 1/2, 1/4, 3/4

Units available:
- gm (grams)
- Kg (kilograms)
- Litre
- Piece
- Rounds
- Trips
- Custom (enter your own unit)

================================================================================
DATA STORAGE
================================================================================

All data is stored locally in JSON format:
- DB/profiles.json - Business profiles
- DB/history.json - Invoice history
- DB/logos/ - Business logos

================================================================================
TROUBLESHOOTING
================================================================================

PDF Generation Issues
- Ensure DejaVuSans.ttf fonts are in the root directory
- Check that watermark text uses ASCII characters only
- Verify all required fields are filled

Logo Not Displaying
- Supported formats: JPG, PNG
- Recommended size: 500x500 pixels or smaller
- Check file path in profiles.json

Application Won't Start
- Verify Python version (3.8+)
- Install all dependencies: pip install -r requirements.txt
- Check for error messages in console

================================================================================
LICENSE
================================================================================

This project is developed by TCG Technology.

================================================================================
SUPPORT
================================================================================

For support, please contact:
- Email: support@tcgtech.com
- Website: www.tcgtech.com

================================================================================
ACKNOWLEDGMENTS
================================================================================

- CustomTkinter for the modern UI framework
- FPDF for PDF generation
- python-docx for Word document generation
- DejaVu Fonts for Unicode support

================================================================================
VERSION HISTORY
================================================================================

Version 2.0 (Current)
- Added unlimited invoice storage
- Implemented search functionality
- Added watermark support
- Enhanced quantity system with fractions
- Improved UI with modern design
- Added client phone number storage
- Pink theme for Business 3

Version 1.0
- Initial release
- Multi-business support
- PDF and Word generation
- Basic invoice management

================================================================================

A PRODUCT OF TCG TECHNOLOGY
