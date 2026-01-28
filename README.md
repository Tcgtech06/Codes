# 🧾 TCG Tech Multi Business Invoice Generator

A modern, professional invoice management system built with Python and CustomTkinter. Generate beautiful PDF and Word invoices for multiple businesses with ease.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Features

### 🏢 Multi-Business Support
- Manage up to 4 different business profiles
- Each business has its own:
  - Logo
  - Contact information
  - Color theme
  - Invoice numbering
  - Custom styling

### 📄 Professional Invoice Generation
- **PDF Generation** - 4 different professional styles:
  - Modern Tech (Blue theme)
  - Nature/Classic (Green theme)
  - Industrial (Orange theme)
  - Minimalist (Purple theme)
- **Word Document** generation
- Live preview before generating
- Automatic logo embedding

### 💼 Modern UI/UX
- Beautiful, colorful, and professional interface
- Card-based design with smooth animations
- Icon-enhanced labels and buttons
- Responsive layout
- Dark/Light mode support

### 📊 Invoice Management
- Add multiple items per invoice
- Tax calculation
- Subtotal and grand total
- Due date tracking
- Pending status checkbox
- Recent invoices history (last 5)
- Load previous invoices
- Delete invoices

### 🎨 Customization
- Upload custom logos for each business
- Customizable business information
- Multiple invoice styles
- Color-coded themes

## 🚀 Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Required Libraries
```bash
pip install customtkinter
pip install fpdf
pip install python-docx
pip install Pillow
```

### Clone the Repository
```bash
git clone https://github.com/Tcgtech06/Codes.git
cd "INVOICE GENERATOR"
```

## 📖 Usage

### Running the Application
```bash
python test.py
```

### Quick Start Guide

1. **Select a Business**
   - Click on one of the business buttons in the sidebar
   - Update business information if needed
   - Upload a logo (optional)

2. **Create an Invoice**
   - Fill in client details (name, email, address)
   - Add invoice items with descriptions and amounts
   - Set tax rate if applicable
   - Mark as pending if needed

3. **Generate Invoice**
   - Click "Generate PDF" or "Generate Word"
   - Preview the invoice
   - Choose save location
   - Done!

## 🎯 Key Components

### Business Profiles
- **Tech Solutions Inc.** - Modern tech style (Blue)
- **Green Earth Gardens** - Classic nature style (Green)
- **Express Logistics** - Industrial style (Orange)
- **TREK INDIA** - Minimalist style (Purple)

### File Structure
```
INVOICE GENERATOR/
├── test.py              # Main application file
├── main.py              # Alternative entry point
├── logo.png             # Application logo
├── DB/
│   ├── logos/           # Business logos
│   ├── history.json     # Invoice history
│   └── profiles.json    # Business profiles
└── README.md            # This file
```

## 🛠️ Configuration

### Adding a New Business
Edit the `DEFAULT_PROFILES` in `test.py`:
```python
"biz_5": {
    "name": "Your Business Name",
    "address": "Your Address",
    "email": "your@email.com",
    "phone": "+1 234 567 8900",
    "color": "#hexcolor",
    "icon": "🏢",
    "style": "Modern",
    "logo": None,
    "last_invoice_num": 5000
}
```

## 📸 Screenshots

### Main Interface
- Modern sidebar with business selection
- Professional invoice form
- Real-time calculations

### Invoice Preview
- PDF-like preview with logo
- Complete invoice details
- Generate or cancel options

### Generated Invoices
- Professional PDF output
- Multiple style options
- Logo and branding included

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**TCG Technology**
- GitHub: [@Tcgtech06](https://github.com/Tcgtech06)
- Email: tcgtech06@gmail.com

## 🙏 Acknowledgments

- CustomTkinter for the modern UI framework
- FPDF for PDF generation
- python-docx for Word document generation
- Pillow for image processing

## 📞 Support

For support, email tcgtech06@gmail.com or open an issue in the GitHub repository.

---

Made with ❤️ by TCG Technology
