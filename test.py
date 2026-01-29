import customtkinter as ct
import os
import json
import shutil
from datetime import datetime
from fpdf import FPDF
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from tkinter import filedialog, messagebox
import base64
from PIL import Image, ImageTk

# --- CONFIGURATION ---
DB_FOLDER = "DB"
LOGOS_FOLDER = os.path.join(DB_FOLDER, "logos")
HISTORY_FILE = os.path.join(DB_FOLDER, "history.json")
PROFILES_FILE = os.path.join(DB_FOLDER, "profiles.json")

# Ensure directories exist
for folder in [DB_FOLDER, LOGOS_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

# Default Profiles Structure
DEFAULT_PROFILES = {
    "biz_1": {
        "name": "Tech Solutions Inc.",
        "address": "123 Silicon Valley, CA",
        "email": "contact@techsolutions.com",
        "phone": "+1 (555) 123-4567",
        "color": "#1e40af",  # Blue
        "icon": "",
        "style": "Modern",
        "logo": None,
        "last_invoice_num": 1000
    },
    "biz_2": {
        "name": "Green Earth Gardens",
        "address": "45 Nature Way, Oregon",
        "email": "info@greenearth.com",
        "phone": "+1 (555) 987-6543",
        "color": "#059669",  # Green
        "icon": "",
        "style": "Classic",
        "logo": None,
        "last_invoice_num": 2000
    },
    "biz_3": {
        "name": "Express Logistics",
        "address": "88 Cargo Blvd, NY",
        "email": "ops@expresslogistics.com",
        "phone": "+1 (555) 456-7890",
        "color": "#d97706",  # Orange
        "icon": "",
        "style": "Industrial",
        "logo": None,
        "last_invoice_num": 3000
    },
    "biz_4": {
        "name": "Creative Studio",
        "address": "99 Design Ave, London",
        "email": "hello@creativestudio.uk",
        "phone": "+44 20 7123 4567",
        "color": "#7c3aed",  # Purple
        "icon": "",
        "style": "Minimalist",
        "logo": None,
        "last_invoice_num": 4000
    }
}


class InvoiceApp(ct.CTk):
    def __init__(self):
        super().__init__()

        self.title("Tcg Tech Multi Business Invoice")
        self.geometry("1400x950")
        ct.set_appearance_mode("light")
        ct.set_default_color_theme("blue")

        # Set window icon
        try:
            icon_img = Image.open("logo.png")
            icon_photo = ImageTk.PhotoImage(icon_img)
            self.iconphoto(True, icon_photo)
            self._icon_ref = icon_photo  # Keep reference
        except Exception as e:
            print(f"Could not set window icon: {e}")

        # Load Data
        self.profiles = self.load_profiles()
        self.history = self.load_history()
        self.items = []

        # State: Default to Business 1
        self.current_biz_id = "biz_1"
        self.current_theme = self.profiles[self.current_biz_id]["color"]

        # Layout
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        self.setup_app_logo()

        self.setup_sidebar()
        self.setup_main_content()

        # Apply initial theme
        self.refresh_theme()

    def setup_app_logo(self):
        """Add application logo to the top left corner of the sidebar"""
        # This will be called before setup_sidebar, so we'll add it in setup_sidebar instead
        pass

    def load_profiles(self):
        if os.path.exists(PROFILES_FILE):
            try:
                with open(PROFILES_FILE, 'r') as f:
                    data = json.load(f)
                    # Merge with defaults to ensure structure exists if file is old
                    for key, val in DEFAULT_PROFILES.items():
                        if key not in data:
                            data[key] = val
                    return data
            except:
                return DEFAULT_PROFILES
        return DEFAULT_PROFILES

    def save_profiles(self):
        with open(PROFILES_FILE, 'w') as f:
            json.dump(self.profiles, f, indent=4)

    def setup_sidebar(self):
        # Modern gradient-like sidebar with shadow effect
        self.sidebar = ct.CTkFrame(self, width=300, corner_radius=0, 
                                   fg_color=("#ffffff", "#1a1a1a"),
                                   border_width=0)
        self.sidebar.grid(row=0, column=0, sticky="nsew")
        
        # Configure grid for better space management
        self.sidebar.grid_rowconfigure(5, weight=1)  # Make history section expandable

        # Add Application Logo at the top with modern styling
        logo_container = ct.CTkFrame(self.sidebar, fg_color="transparent")
        logo_container.pack(pady=(15, 10))
        
        logo_path = "logo.png"
        if os.path.exists(logo_path):
            try:
                logo_img = Image.open(logo_path)
                logo_img = logo_img.resize((80, 80), Image.Resampling.LANCZOS)
                logo_photo = ct.CTkImage(light_image=logo_img, dark_image=logo_img, size=(80, 80))
                
                logo_label = ct.CTkLabel(logo_container, image=logo_photo, text="")
                logo_label.pack()
                
                self._app_logo = logo_photo
            except Exception as e:
                print(f"Could not load logo: {e}")
                ct.CTkLabel(logo_container, text="📊", 
                           font=ct.CTkFont(size=40)).pack()
        else:
            ct.CTkLabel(logo_container, text="📊", 
                       font=ct.CTkFont(size=40)).pack()

        # App title with gradient effect
        ct.CTkLabel(self.sidebar, text="INVOICE", 
                   font=ct.CTkFont(size=20, weight="bold"),
                   text_color=("#1e40af", "#60a5fa")).pack()
        ct.CTkLabel(self.sidebar, text="MANAGEMENT SYSTEM", 
                   font=ct.CTkFont(size=9, weight="bold"),
                   text_color=("#64748b", "#94a3b8")).pack(pady=(0, 10))

        # Decorative line
        ct.CTkFrame(self.sidebar, height=2, fg_color=("#e2e8f0", "#334155"),
                   corner_radius=2).pack(fill="x", padx=30, pady=8)

        # User/Business Switcher Title with icon
        header_frame = ct.CTkFrame(self.sidebar, fg_color="transparent")
        header_frame.pack(pady=(8, 10))
        
        ct.CTkLabel(header_frame, text="🏢", 
                   font=ct.CTkFont(size=16)).pack(side="left", padx=(0, 6))
        ct.CTkLabel(header_frame, text="SELECT BUSINESS",
                   font=ct.CTkFont(size=12, weight="bold"), 
                   text_color=("#475569", "#cbd5e1")).pack(side="left")

        # Business Switcher Buttons with modern card design
        self.biz_btn_frame = ct.CTkFrame(self.sidebar, fg_color="transparent")
        self.biz_btn_frame.pack(fill="x", padx=15)

        self.biz_buttons = {}

        # Create modern card-style buttons for each profile
        for biz_id, data in self.profiles.items():
            display_text = f"{data.get('icon', '🏢')}  {data['name']}"

            btn = ct.CTkButton(
                self.biz_btn_frame,
                text=display_text,
                command=lambda b=biz_id: self.switch_business(b),
                height=45,
                font=ct.CTkFont(size=11, weight="bold"),
                fg_color=("#f8fafc", "#2d3748"),
                text_color=("#1e293b", "#e2e8f0"),
                hover_color=("#e2e8f0", "#374151"),
                border_width=2,
                border_color=("#cbd5e1", "#4a5568"),
                corner_radius=10,
                anchor="w"
            )
            btn.pack(fill="x", pady=4)
            self.biz_buttons[biz_id] = btn

        # Decorative line
        ct.CTkFrame(self.sidebar, height=2, fg_color=("#e2e8f0", "#334155"),
                   corner_radius=1).pack(fill="x", pady=15, padx=25)

        # Style Indicator with modern badge
        style_container = ct.CTkFrame(self.sidebar, fg_color=("#f1f5f9", "#1e293b"),
                                     corner_radius=8)
        style_container.pack(pady=8, padx=20, fill="x")
        
        ct.CTkLabel(style_container, text="✨", 
                   font=ct.CTkFont(size=14)).pack(side="left", padx=(8, 4))
        self.style_label = ct.CTkLabel(style_container, text="Current Style: Modern",
                                       font=ct.CTkFont(size=10, weight="bold"),
                                       text_color=("#64748b", "#94a3b8"))
        self.style_label.pack(side="left", pady=6)

        # History Section with modern header
        history_header = ct.CTkFrame(self.sidebar, fg_color="transparent")
        history_header.pack(pady=(15, 8))
        
        ct.CTkLabel(history_header, text="📋", 
                   font=ct.CTkFont(size=16)).pack(side="left", padx=(0, 6))
        ct.CTkLabel(history_header, text="RECENT INVOICES",
                   font=ct.CTkFont(size=12, weight="bold"), 
                   text_color=("#475569", "#cbd5e1")).pack(side="left")

        # Scrollable history list with fixed height
        self.history_list = ct.CTkScrollableFrame(self.sidebar, 
                                                  fg_color="transparent",
                                                  height=280)
        self.history_list.pack(padx=15, pady=(0, 15), fill="both", expand=True)
        self.refresh_history_ui()

    def setup_main_content(self):
        # Modern main frame with gradient background
        self.main_frame = ct.CTkScrollableFrame(self, corner_radius=0, 
                                                fg_color=("#f8fafc", "#0f172a"))
        self.main_frame.grid(row=0, column=1, sticky="nsew")

        # --- Top Bar: Business Settings with modern card design ---
        settings_card = ct.CTkFrame(self.main_frame, 
                                   fg_color=("#ffffff", "#1e293b"),
                                   corner_radius=20,
                                   border_width=2,
                                   border_color=("#e2e8f0", "#334155"))
        settings_card.pack(fill="x", padx=30, pady=25)

        # Card header
        card_header = ct.CTkFrame(settings_card, fg_color="transparent")
        card_header.pack(fill="x", padx=25, pady=(20, 15))
        
        ct.CTkLabel(card_header, text="🏢", 
                   font=ct.CTkFont(size=24)).pack(side="left", padx=(0, 10))
        ct.CTkLabel(card_header, text="Business Information", 
                   font=ct.CTkFont(size=20, weight="bold"),
                   text_color=("#1e293b", "#f1f5f9")).pack(side="left")

        # Content container
        content_frame = ct.CTkFrame(settings_card, fg_color="transparent")
        content_frame.pack(fill="x", padx=25, pady=(0, 20))

        # Logo Display with modern styling
        logo_frame = ct.CTkFrame(content_frame, 
                                fg_color=("#f8fafc", "#0f172a"),
                                corner_radius=15,
                                border_width=2,
                                border_color=("#cbd5e1", "#475569"))
        logo_frame.pack(side="left", padx=(0, 25), pady=10)
        
        self.logo_preview = ct.CTkLabel(logo_frame, text="No Logo", 
                                       width=100, height=100,
                                       fg_color=("#e2e8f0", "#334155"),
                                       corner_radius=12,
                                       font=ct.CTkFont(size=11))
        self.logo_preview.pack(padx=10, pady=10)

        # Business Info Inputs with modern styling
        info_frame = ct.CTkFrame(content_frame, fg_color="transparent")
        info_frame.pack(side="left", fill="both", expand=True, pady=10)

        self.biz_name_entry = ct.CTkEntry(info_frame, width=350, height=45,
                                          font=ct.CTkFont(size=18, weight="bold"),
                                          placeholder_text="Business Name",
                                          corner_radius=12,
                                          border_width=2,
                                          border_color=("#cbd5e1", "#475569"))
        self.biz_name_entry.pack(anchor="w", pady=(0, 10))

        self.biz_addr_entry = ct.CTkEntry(info_frame, width=350, height=40,
                                          placeholder_text="Business Address",
                                          corner_radius=10,
                                          border_width=2,
                                          border_color=("#cbd5e1", "#475569"))
        self.biz_addr_entry.pack(anchor="w", pady=(0, 10))

        self.biz_email_entry = ct.CTkEntry(info_frame, width=350, height=40,
                                           placeholder_text="Business Email",
                                           corner_radius=10,
                                           border_width=2,
                                           border_color=("#cbd5e1", "#475569"))
        self.biz_email_entry.pack(anchor="w", pady=(0, 10))

        self.biz_phone_entry = ct.CTkEntry(info_frame, width=350, height=40,
                                           placeholder_text="Business Phone",
                                           corner_radius=10,
                                           border_width=2,
                                           border_color=("#cbd5e1", "#475569"))
        self.biz_phone_entry.pack(anchor="w", pady=(0, 10))

        self.biz_gst_entry = ct.CTkEntry(info_frame, width=350, height=40,
                                         placeholder_text="GST No (Optional)",
                                         corner_radius=10,
                                         border_width=2,
                                         border_color=("#cbd5e1", "#475569"))
        self.biz_gst_entry.pack(anchor="w")

        # Save & Upload Buttons with modern styling
        btn_frame = ct.CTkFrame(content_frame, fg_color="transparent")
        btn_frame.pack(side="right", padx=20)

        ct.CTkButton(btn_frame, text="📤 Upload Logo", 
                    command=self.upload_logo, 
                    width=140, height=45,
                    fg_color=("#64748b", "#475569"),
                    hover_color=("#475569", "#334155"),
                    corner_radius=12,
                    font=ct.CTkFont(size=13, weight="bold")).pack(pady=8)
        
        self.save_biz_btn = ct.CTkButton(btn_frame, text="💾 Save Info", 
                                         command=self.save_current_profile_info,
                                         width=140, height=45,
                                         corner_radius=12,
                                         font=ct.CTkFont(size=13, weight="bold"))
        self.save_biz_btn.pack(pady=8)

        # --- Divider ---
        ct.CTkFrame(self.main_frame, height=3, 
                   fg_color=("#e2e8f0", "#334155"),
                   corner_radius=2).pack(fill="x", padx=40, pady=20)

        # --- Invoice Form with modern card design ---
        invoice_card = ct.CTkFrame(self.main_frame,
                                  fg_color=("#ffffff", "#1e293b"),
                                  corner_radius=20,
                                  border_width=2,
                                  border_color=("#e2e8f0", "#334155"))
        invoice_card.pack(fill="x", padx=30, pady=(0, 20))

        # Card header
        invoice_header = ct.CTkFrame(invoice_card, fg_color="transparent")
        invoice_header.pack(fill="x", padx=25, pady=(20, 15))
        
        ct.CTkLabel(invoice_header, text="👤", 
                   font=ct.CTkFont(size=22)).pack(side="left", padx=(0, 10))
        ct.CTkLabel(invoice_header, text="CLIENT DETAILS", 
                   font=ct.CTkFont(size=18, weight="bold"),
                   text_color=("#1e293b", "#f1f5f9")).pack(side="left")

        client_frame = ct.CTkFrame(invoice_card, fg_color="transparent")
        client_frame.pack(fill="x", padx=20, pady=(0, 20))

        self.client_name = self.create_input(client_frame, "Client Name", "👤")
        self.client_email = self.create_input(client_frame, "Client Email", "📧")
        self.client_phone = self.create_input(client_frame, "Client Phone", "📱")
        self.client_address = self.create_input(client_frame, "Client Address", "📍")
        
        # Invoice Date
        invoice_date_container = ct.CTkFrame(client_frame, fg_color="transparent")
        invoice_date_container.pack(side="left", fill="x", expand=True, padx=10)
        
        label_frame = ct.CTkFrame(invoice_date_container, fg_color="transparent")
        label_frame.pack(anchor="w", fill="x")
        
        ct.CTkLabel(label_frame, text="📅", 
                   font=ct.CTkFont(size=14)).pack(side="left", padx=(0, 5))
        lbl = ct.CTkLabel(label_frame, text="Invoice Date", 
                         font=ct.CTkFont(size=13, weight="bold"),
                         text_color=("#475569", "#cbd5e1"))
        lbl.pack(side="left")
        
        self.invoice_date = ct.CTkEntry(invoice_date_container, height=40,
                                        corner_radius=10,
                                        border_width=2,
                                        border_color=("#cbd5e1", "#475569"),
                                        font=ct.CTkFont(size=12))
        self.invoice_date.pack(fill="x", pady=(5, 0))
        # Set today's date as default
        self.invoice_date.insert(0, datetime.now().strftime("%d-%m-%Y"))
        
        self.invoice_num = self.create_input(client_frame, "Invoice #", "🔢")
        self.invoice_num.insert(0, self.get_next_invoice_number())
        
        # Due Date with Pending Checkbox - modern styling
        due_date_container = ct.CTkFrame(client_frame, fg_color="transparent")
        due_date_container.pack(side="left", fill="x", expand=True, padx=10)
        
        label_frame = ct.CTkFrame(due_date_container, fg_color="transparent")
        label_frame.pack(anchor="w", fill="x")
        
        ct.CTkLabel(label_frame, text="📅", 
                   font=ct.CTkFont(size=14)).pack(side="left", padx=(0, 5))
        lbl = ct.CTkLabel(label_frame, text="Due Date", 
                         font=ct.CTkFont(size=13, weight="bold"),
                         text_color=("#475569", "#cbd5e1"))
        lbl.pack(side="left")
        
        due_date_inner = ct.CTkFrame(due_date_container, fg_color="transparent")
        due_date_inner.pack(fill="x", pady=(5, 0))
        
        self.due_date = ct.CTkEntry(due_date_inner, height=40,
                                    corner_radius=10,
                                    border_width=2,
                                    border_color=("#cbd5e1", "#475569"))
        self.due_date.pack(side="left", fill="x", expand=True, padx=(0, 10))
        
        self.pending_var = ct.BooleanVar(value=False)
        self.pending_checkbox = ct.CTkCheckBox(
            due_date_inner, 
            text="⏳ Pending", 
            variable=self.pending_var,
            command=self.toggle_pending,
            font=ct.CTkFont(size=12, weight="bold"),
            text_color=("#1e293b", "#f1f5f9"),
            corner_radius=8
        )
        self.pending_checkbox.pack(side="left")

        # --- Items Section with modern card ---
        items_card = ct.CTkFrame(self.main_frame,
                                fg_color=("#ffffff", "#1e293b"),
                                corner_radius=20,
                                border_width=2,
                                border_color=("#e2e8f0", "#334155"))
        items_card.pack(fill="x", padx=30, pady=(0, 20))

        # Card header
        items_header = ct.CTkFrame(items_card, fg_color="transparent")
        items_header.pack(fill="x", padx=25, pady=(20, 15))
        
        ct.CTkLabel(items_header, text="📦", 
                   font=ct.CTkFont(size=22)).pack(side="left", padx=(0, 10))
        ct.CTkLabel(items_header, text="INVOICE ITEMS", 
                   font=ct.CTkFont(size=18, weight="bold"),
                   text_color=("#1e293b", "#f1f5f9")).pack(side="left")

        entry_grid = ct.CTkFrame(items_card, fg_color="transparent")
        entry_grid.pack(fill="x", padx=25, pady=(0, 15))

        self.item_desc = ct.CTkEntry(entry_grid, placeholder_text="Item Description", 
                                     width=400, height=45,
                                     corner_radius=12,
                                     border_width=2,
                                     font=ct.CTkFont(size=13))
        self.item_desc.pack(side="left", padx=5)

        # Quantity checkbox and controls
        qty_frame = ct.CTkFrame(entry_grid, fg_color="transparent")
        qty_frame.pack(side="left", padx=5)
        
        self.qty_var = ct.BooleanVar(value=False)
        self.qty_checkbox = ct.CTkCheckBox(
            qty_frame,
            text="Qty",
            variable=self.qty_var,
            command=self.toggle_quantity,
            font=ct.CTkFont(size=11, weight="bold"),
            text_color=("#1e293b", "#f1f5f9"),
            width=50,
            height=20
        )
        self.qty_checkbox.pack(pady=(0, 5))
        
        # Quantity input and unit dropdown (initially hidden)
        self.qty_controls = ct.CTkFrame(qty_frame, fg_color="transparent")
        
        self.item_qty = ct.CTkEntry(self.qty_controls, placeholder_text="Qty", 
                                    width=60, height=35,
                                    corner_radius=8,
                                    border_width=2,
                                    font=ct.CTkFont(size=11))
        self.item_qty.pack(side="left", padx=2)
        
        self.item_unit = ct.CTkComboBox(self.qty_controls, 
                                        values=["Kg", "Pieces", "Litres", "Grams", "Meters", "Units"],
                                        width=80, height=35,
                                        corner_radius=8,
                                        font=ct.CTkFont(size=11))
        self.item_unit.pack(side="left", padx=2)
        self.item_unit.set("Pieces")

        self.item_price = ct.CTkEntry(entry_grid, placeholder_text="Amount (₹)", 
                                      width=150, height=45,
                                      corner_radius=12,
                                      border_width=2,
                                      font=ct.CTkFont(size=13))
        self.item_price.pack(side="left", padx=5)

        self.add_btn = ct.CTkButton(entry_grid, text="➕ Add", 
                                    width=100, height=45,
                                    command=self.add_item,
                                    corner_radius=12,
                                    font=ct.CTkFont(size=14, weight="bold"))
        self.add_btn.pack(side="left", padx=5)

        # --- Table & Tax ---
        self.table_frame = ct.CTkFrame(items_card, 
                                      fg_color=("#f8fafc", "#0f172a"),
                                      border_width=2, 
                                      border_color=("#e2e8f0", "#334155"),
                                      corner_radius=15)
        self.table_frame.pack(fill="x", padx=25, pady=(0, 15))

        # Tax Calculation Row with modern styling
        tax_frame = ct.CTkFrame(items_card, fg_color="transparent")
        tax_frame.pack(fill="x", padx=25, pady=(0, 20))

        ct.CTkLabel(tax_frame, text="💰 Tax Rate(GST) (%):", 
                   font=ct.CTkFont(size=13, weight="bold"),
                   text_color=("#475569", "#cbd5e1")).pack(side="left", padx=(0, 10))
        
        self.tax_entry = ct.CTkEntry(tax_frame, width=100, height=40,
                                     placeholder_text="0",
                                     corner_radius=10,
                                     border_width=2,
                                     font=ct.CTkFont(size=13))
        self.tax_entry.pack(side="left", padx=5)
        self.tax_entry.insert(0, "0")
        self.tax_entry.bind("<KeyRelease>", lambda e: self.refresh_table())

        ct.CTkButton(tax_frame, text="🔄 Update Total", 
                    width=140, height=40,
                    fg_color=("#64748b", "#475569"),
                    hover_color=("#475569", "#334155"),
                    corner_radius=10,
                    font=ct.CTkFont(size=12, weight="bold"),
                    command=self.refresh_table).pack(side="left", padx=10)

        self.refresh_table()

        # --- Bottom Actions with modern buttons ---
        action_frame = ct.CTkFrame(self.main_frame, fg_color="transparent")
        action_frame.pack(fill="x", padx=40, pady=30)

        self.btn_pdf = ct.CTkButton(action_frame, text="📄 Generate PDF", 
                                    height=55,
                                    corner_radius=15,
                                    font=ct.CTkFont(size=15, weight="bold"),
                                    command=lambda: self.generate("pdf"))
        self.btn_pdf.pack(side="right", padx=10)

        self.btn_word = ct.CTkButton(action_frame, text="📝 Generate Word", 
                                     height=55,
                                     corner_radius=15,
                                     font=ct.CTkFont(size=15, weight="bold"),
                                     command=lambda: self.generate("word"), 
                                     fg_color=("#3b82f6", "#2563eb"),
                                     hover_color=("#2563eb", "#1d4ed8"))
        self.btn_word.pack(side="right", padx=10)

        ct.CTkButton(action_frame, text="🗑️ Clear Form", 
                    height=55,
                    corner_radius=15,
                    font=ct.CTkFont(size=15, weight="bold"),
                    fg_color=("#64748b", "#475569"),
                    hover_color=("#475569", "#334155"),
                    command=self.clear_form).pack(side="right", padx=10)

    def create_input(self, master, placeholder, icon=""):
        container = ct.CTkFrame(master, fg_color="transparent")
        container.pack(side="left", fill="x", expand=True, padx=10)
        
        # Label with icon
        label_frame = ct.CTkFrame(container, fg_color="transparent")
        label_frame.pack(anchor="w", fill="x")
        
        if icon:
            ct.CTkLabel(label_frame, text=icon, 
                       font=ct.CTkFont(size=14)).pack(side="left", padx=(0, 5))
        
        lbl = ct.CTkLabel(label_frame, text=placeholder, 
                         font=ct.CTkFont(size=13, weight="bold"),
                         text_color=("#475569", "#cbd5e1"))
        lbl.pack(side="left")
        
        entry = ct.CTkEntry(container, height=40,
                           corner_radius=10,
                           border_width=2,
                           border_color=("#cbd5e1", "#475569"),
                           font=ct.CTkFont(size=12))
        entry.pack(fill="x", pady=(5, 0))
        return entry

    def toggle_pending(self):
        """Toggle the pending status and update due date field"""
        if self.pending_var.get():
            self.due_date.configure(state="disabled", placeholder_text="PENDING")
            self.due_date.delete(0, 'end')
        else:
            self.due_date.configure(state="normal", placeholder_text="")

    def toggle_quantity(self):
        """Toggle the quantity controls visibility"""
        if self.qty_var.get():
            self.qty_controls.pack(pady=5)
        else:
            self.qty_controls.pack_forget()

    # --- Business Profile Logic ---

    def switch_business(self, biz_id):
        # AUTO-SAVE LOGIC: Save current input to the OLD profile before switching
        current_name = self.biz_name_entry.get()
        current_addr = self.biz_addr_entry.get()
        current_email = self.biz_email_entry.get()
        current_phone = self.biz_phone_entry.get()
        current_gst = self.biz_gst_entry.get().strip()

        if current_name:
            self.profiles[self.current_biz_id]["name"] = current_name
            self.profiles[self.current_biz_id]["address"] = current_addr
            self.profiles[self.current_biz_id]["email"] = current_email
            self.profiles[self.current_biz_id]["phone"] = current_phone
            self.profiles[self.current_biz_id]["gst_no"] = current_gst
            self.save_profiles()  # Commit to file so it persists

        # Now switch
        self.current_biz_id = biz_id
        self.current_theme = self.profiles[biz_id]["color"]
        self.refresh_theme()
        
        # Refresh history to show current business invoices
        self.refresh_history_ui()

    def refresh_theme(self):
        # 1. Update Sidebar Buttons with modern styling
        for bid, btn in self.biz_buttons.items():
            if bid == self.current_biz_id:
                btn.configure(
                    fg_color=self.current_theme, 
                    text_color="white", 
                    border_width=0,
                    hover_color=self.current_theme
                )
            else:
                btn.configure(
                    fg_color=("#f8fafc", "#2d3748"), 
                    text_color=("#1e293b", "#e2e8f0"), 
                    border_width=2,
                    border_color=("#cbd5e1", "#4a5568"),
                    hover_color=("#e2e8f0", "#374151")
                )

        # 2. Update Inputs with current profile data
        profile = self.profiles[self.current_biz_id]

        self.biz_name_entry.delete(0, 'end')
        self.biz_name_entry.insert(0, profile["name"])

        self.biz_addr_entry.delete(0, 'end')
        self.biz_addr_entry.insert(0, profile["address"])

        self.biz_email_entry.delete(0, 'end')
        self.biz_email_entry.insert(0, profile.get("email", ""))

        self.biz_phone_entry.delete(0, 'end')
        self.biz_phone_entry.insert(0, profile.get("phone", ""))

        self.biz_gst_entry.delete(0, 'end')
        self.biz_gst_entry.insert(0, profile.get("gst_no", ""))

        self.style_label.configure(text=f"Current Format: {profile.get('style', 'Standard')}")

        # 3. Update Buttons Color
        self.save_biz_btn.configure(fg_color=self.current_theme)
        self.add_btn.configure(fg_color=self.current_theme)
        self.btn_pdf.configure(fg_color=self.current_theme)
        self.btn_word.configure(fg_color=self.current_theme)

        # 4. Load Logo
        self.display_logo(profile["logo"])

    def display_logo(self, path):
        if path and os.path.exists(path):
            try:
                img = Image.open(path)
                # Resize keeping aspect ratio
                base_width = 80
                w_percent = (base_width / float(img.size[0]))
                h_size = int((float(img.size[1]) * float(w_percent)))
                img = img.resize((base_width, h_size), Image.Resampling.LANCZOS)

                photo_img = ct.CTkImage(light_image=img, dark_image=img, size=(base_width, h_size))
                # Store reference to prevent garbage collection
                self.logo_preview.current_image = photo_img
                self.logo_preview.configure(image=photo_img, text="")
            except Exception as e:
                # Clear any existing image and set error text
                if hasattr(self.logo_preview, 'current_image'):
                    self.logo_preview.current_image = None
                self.logo_preview.configure(image=None, text="Error")
        else:
            # Clear any existing image and set no logo text
            if hasattr(self.logo_preview, 'current_image'):
                self.logo_preview.current_image = None
            self.logo_preview.configure(image=None, text="No Logo")

    def upload_logo(self):
        file_path = filedialog.askopenfilename(filetypes=[("Images", "*.png;*.jpg;*.jpeg")])
        if file_path:
            # Generate a safe filename inside DB/logos
            ext = os.path.splitext(file_path)[1]
            new_filename = f"{self.current_biz_id}_logo{ext}"
            dest_path = os.path.join(LOGOS_FOLDER, new_filename)

            try:
                shutil.copy(file_path, dest_path)
                # Update Profile
                self.profiles[self.current_biz_id]["logo"] = dest_path
                self.save_profiles()
                self.display_logo(dest_path)
                
                # Force reload the profile to ensure logo is used
                self.refresh_theme()
                
                messagebox.showinfo("Success", "Logo updated for this business profile.")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save logo: {e}")

    def save_current_profile_info(self):
        name = self.biz_name_entry.get()
        addr = self.biz_addr_entry.get()
        email = self.biz_email_entry.get()
        phone = self.biz_phone_entry.get()
        gst_no = self.biz_gst_entry.get().strip()
        if name:
            self.profiles[self.current_biz_id]["name"] = name
            self.profiles[self.current_biz_id]["address"] = addr
            self.profiles[self.current_biz_id]["email"] = email
            self.profiles[self.current_biz_id]["phone"] = phone
            self.profiles[self.current_biz_id]["gst_no"] = gst_no
            self.save_profiles()
            
            # Update the sidebar button text immediately
            self.biz_buttons[self.current_biz_id].configure(
                text=f"{self.profiles[self.current_biz_id].get('icon', '🏢')}  {name}"
            )
            
            messagebox.showinfo("Saved", f"Details saved for {name}")

    # --- Core Invoice Logic ---

    def get_next_invoice_number(self):
        # Get the last invoice number for current business and increment
        last_num = self.profiles[self.current_biz_id].get("last_invoice_num", 1000)
        next_num = last_num + 1
        # Update the profile with the new number
        self.profiles[self.current_biz_id]["last_invoice_num"] = next_num
        self.save_profiles()
        return str(next_num)

    def add_item(self):
        try:
            desc = self.item_desc.get().strip()
            price = float(self.item_price.get())
            
            # Handle quantity if enabled
            qty = None
            unit = None
            if self.qty_var.get():
                try:
                    qty = float(self.item_qty.get()) if self.item_qty.get() else None
                    unit = self.item_unit.get() if qty else None
                except ValueError:
                    messagebox.showerror("Error", "Quantity must be a number")
                    return
            
            if desc:
                # Check if item with same description already exists
                item_exists = False
                for item in self.items:
                    if item['desc'].lower() == desc.lower():
                        # Update existing item
                        item['price'] = price
                        item['qty'] = qty
                        item['unit'] = unit
                        item_exists = True
                        break
                
                # If item doesn't exist, add new one
                if not item_exists:
                    self.items.append({
                        "desc": desc, 
                        "price": price,
                        "qty": qty,
                        "unit": unit
                    })
                
                # Clear input fields
                self.item_desc.delete(0, 'end')
                self.item_price.delete(0, 'end')
                if self.qty_var.get():
                    self.item_qty.delete(0, 'end')
                self.refresh_table()
        except ValueError:
            messagebox.showerror("Error", "Price must be a number")

    def delete_item(self, item_desc):
        """Delete an item from the invoice"""
        self.items = [item for item in self.items if item['desc'] != item_desc]
        self.refresh_table()

    def edit_item(self, item_desc, item_price, item_qty=None, item_unit=None):
        """Load item into text boxes for editing"""
        self.item_desc.delete(0, 'end')
        self.item_desc.insert(0, item_desc)
        self.item_price.delete(0, 'end')
        self.item_price.insert(0, str(item_price))
        
        # Handle quantity
        if item_qty is not None and item_unit is not None:
            self.qty_var.set(True)
            self.toggle_quantity()
            self.item_qty.delete(0, 'end')
            self.item_qty.insert(0, str(item_qty))
            self.item_unit.set(item_unit)
        else:
            self.qty_var.set(False)
            self.toggle_quantity()

    def refresh_table(self):
        for w in self.table_frame.winfo_children(): w.destroy()

        # Modern Header with gradient
        h = ct.CTkFrame(self.table_frame, 
                       fg_color=("#3b82f6", "#2563eb"),
                       corner_radius=10)
        h.pack(fill="x", padx=10, pady=10)
        
        header_content = ct.CTkFrame(h, fg_color="transparent")
        header_content.pack(fill="x", padx=15, pady=12)
        
        ct.CTkLabel(header_content, text="📋 Item Description", 
                   font=ct.CTkFont(size=13, weight="bold"),
                   text_color="white").pack(side="left", padx=10)
        ct.CTkLabel(header_content, text="Price (₹) 💰", 
                   font=ct.CTkFont(size=13, weight="bold"),
                   text_color="white").pack(side="right", padx=(0, 80))

        subtotal = 0.0
        for idx, item in enumerate(self.items):
            # Alternating row colors
            row_color = ("#f8fafc", "#1a1f2e") if idx % 2 == 0 else ("#ffffff", "#0f172a")
            
            row = ct.CTkFrame(self.table_frame, fg_color=row_color,
                            corner_radius=8)
            row.pack(fill="x", pady=3, padx=10)
            
            row_content = ct.CTkFrame(row, fg_color="transparent")
            row_content.pack(fill="x", padx=15, pady=10)
            
            # Description with quantity info
            desc_text = item['desc']
            if item.get('qty') and item.get('unit'):
                desc_text += f" ({item['qty']} {item['unit']})"
            
            ct.CTkLabel(row_content, text=desc_text,
                       font=ct.CTkFont(size=12),
                       text_color=("#1e293b", "#e2e8f0")).pack(side="left", padx=10)
            
            # Buttons on right
            button_frame = ct.CTkFrame(row_content, fg_color="transparent")
            button_frame.pack(side="right", padx=10)
            
            # Price label
            ct.CTkLabel(button_frame, text=f"₹{item['price']:.2f}",
                       font=ct.CTkFont(size=12, weight="bold"),
                       text_color=("#059669", "#10b981")).pack(side="left", padx=(0, 10))
            
            # Edit button
            edit_btn = ct.CTkButton(
                button_frame,
                text="✏️",
                command=lambda d=item['desc'], p=item['price'], q=item.get('qty'), u=item.get('unit'): self.edit_item(d, p, q, u),
                width=35,
                height=30,
                fg_color=("#3b82f6", "#2563eb"),
                hover_color=("#2563eb", "#1d4ed8"),
                corner_radius=8,
                font=ct.CTkFont(size=12)
            )
            edit_btn.pack(side="left", padx=2)
            
            # Delete button
            delete_btn = ct.CTkButton(
                button_frame,
                text="🗑️",
                command=lambda d=item['desc']: self.delete_item(d),
                width=35,
                height=30,
                fg_color=("#ef4444", "#dc2626"),
                hover_color=("#dc2626", "#b91c1c"),
                corner_radius=8,
                font=ct.CTkFont(size=12)
            )
            delete_btn.pack(side="left", padx=2)
            
            subtotal += item['price']

        # Tax Calc
        try:
            tax_rate = float(self.tax_entry.get())
        except:
            tax_rate = 0.0

        tax_amt = subtotal * (tax_rate / 100)
        grand_total = subtotal + tax_amt

        # Modern Summary Frame
        summary_frame = ct.CTkFrame(self.table_frame, 
                                   fg_color=("#f1f5f9", "#1e293b"),
                                   corner_radius=12)
        summary_frame.pack(fill="x", pady=15, padx=10)

        summary_content = ct.CTkFrame(summary_frame, fg_color="transparent")
        summary_content.pack(fill="x", padx=20, pady=15)

        # Subtotal
        subtotal_row = ct.CTkFrame(summary_content, fg_color="transparent")
        subtotal_row.pack(fill="x", pady=3)
        ct.CTkLabel(subtotal_row, text="Subtotal:", 
                   font=ct.CTkFont(size=12),
                   text_color=("#64748b", "#94a3b8")).pack(side="left")
        ct.CTkLabel(subtotal_row, text=f"₹{subtotal:.2f}",
                   font=ct.CTkFont(size=12, weight="bold"),
                   text_color=("#1e293b", "#f1f5f9")).pack(side="right")

        # Tax
        tax_row = ct.CTkFrame(summary_content, fg_color="transparent")
        tax_row.pack(fill="x", pady=3)
        ct.CTkLabel(tax_row, text=f"Tax(GST) ({tax_rate}%):", 
                   font=ct.CTkFont(size=12),
                   text_color=("#64748b", "#94a3b8")).pack(side="left")
        ct.CTkLabel(tax_row, text=f"₹{tax_amt:.2f}",
                   font=ct.CTkFont(size=12, weight="bold"),
                   text_color=("#1e293b", "#f1f5f9")).pack(side="right")

        # Divider
        ct.CTkFrame(summary_content, height=2, 
                   fg_color=("#cbd5e1", "#475569")).pack(fill="x", pady=8)

        # Grand Total
        total_row = ct.CTkFrame(summary_content, fg_color="transparent")
        total_row.pack(fill="x", pady=5)
        ct.CTkLabel(total_row, text="GRAND TOTAL:", 
                   font=ct.CTkFont(size=16, weight="bold"),
                   text_color=self.current_theme).pack(side="left")
        ct.CTkLabel(total_row, text=f"₹{grand_total:.2f}",
                   font=ct.CTkFont(size=18, weight="bold"),
                   text_color=self.current_theme).pack(side="right")

        # Save for generation
        self.current_calc = {
            "subtotal": subtotal,
            "tax_rate": tax_rate,
            "tax_amt": tax_amt,
            "total": grand_total
        }

    def clear_form(self):
        self.items = []
        self.client_name.delete(0, 'end')
        self.client_email.delete(0, 'end')
        self.client_phone.delete(0, 'end')
        self.client_address.delete(0, 'end')
        self.invoice_num.delete(0, 'end')
        self.invoice_num.insert(0, self.get_next_invoice_number())
        self.invoice_date.delete(0, 'end')
        self.invoice_date.insert(0, datetime.now().strftime("%d-%m-%Y"))
        self.due_date.delete(0, 'end')
        self.pending_var.set(False)
        self.due_date.configure(state="normal", placeholder_text="")
        self.tax_entry.delete(0, 'end')
        self.tax_entry.insert(0, "0")
        self.item_desc.delete(0, 'end')
        self.item_price.delete(0, 'end')
        self.qty_var.set(False)
        self.toggle_quantity()
        self.item_qty.delete(0, 'end')
        self.refresh_table()

    # --- Generation Logic ---

    def generate(self, file_type):
        if not self.items: return

        # Ensure calc is up to date
        self.refresh_table()

        profile = self.profiles[self.current_biz_id]
        
        # Handle pending status
        due_date_value = self.due_date.get() or ""
        if self.pending_var.get():
            due_date_value = "PENDING"
        
        # Get invoice date from input or use today's date
        invoice_date = self.invoice_date.get() or datetime.now().strftime("%d-%m-%Y")
        
        data = {
            "id": self.invoice_num.get(),
            "date": invoice_date,
            "due_date": due_date_value,
            "client_name": self.client_name.get(),
            "client_email": self.client_email.get(),
            "client_phone": self.client_phone.get(),
            "client_address": self.client_address.get(),
            "items": self.items,
            "subtotal": self.current_calc["subtotal"],
            "tax_rate": self.current_calc["tax_rate"],
            "tax_amt": self.current_calc["tax_amt"],
            "total": self.current_calc["total"],
            "biz_name": profile["name"],
            "biz_addr": profile["address"],
            "biz_email": profile.get("email", ""),
            "biz_phone": profile.get("phone", ""),
            "biz_gst_no": profile.get("gst_no", ""),
            "biz_logo": profile["logo"],
            "biz_color": profile["color"],
            "biz_style": profile.get("style", "Modern")
        }

        # Show preview dialog first
        if not self.show_preview_dialog(data, file_type):
            return  # User cancelled

        ext = ".pdf" if file_type == "pdf" else ".docx"
        filename = f"{data['biz_name'].replace(' ', '')}_Inv{data['id']}{ext}"

        save_path = filedialog.asksaveasfilename(initialfile=filename, defaultextension=ext)
        if not save_path: return

        try:
            if file_type == "pdf":
                # Use unified modern style for all businesses
                self.make_modern_pdf(data, save_path)
            else:
                self.make_word(data, save_path)

            self.save_to_history(data)
            messagebox.showinfo("Success", f"Invoice saved!\nFormat: {data['biz_style']}")
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def show_preview_dialog(self, data, file_type):
        """Show a preview dialog before generating the invoice with PDF-like format"""
        preview_window = ct.CTkToplevel(self)
        preview_window.title("Invoice Preview")
        preview_window.geometry("700x650")
        preview_window.resizable(True, True)
        preview_window.transient(self)
        preview_window.grab_set()

        # Configure grid for proper layout
        preview_window.grid_rowconfigure(0, weight=0)  # Title
        preview_window.grid_rowconfigure(1, weight=1)  # Content
        preview_window.grid_rowconfigure(2, weight=0)  # Buttons
        preview_window.grid_columnconfigure(0, weight=1)

        # Title at top
        title_label = ct.CTkLabel(preview_window, text="Invoice Preview", 
                    font=ct.CTkFont(size=18, weight="bold"))
        title_label.grid(row=0, column=0, pady=10, sticky="ew")

        # PDF-like Preview Frame (scrollable content)
        preview_frame = ct.CTkScrollableFrame(preview_window, fg_color="white", 
                                            border_width=2, border_color="#cccccc")
        preview_frame.grid(row=1, column=0, padx=15, pady=(0, 10), sticky="nsew")

        # Header with Logo and Business Info
        header_frame = ct.CTkFrame(preview_frame, fg_color="white")
        header_frame.pack(fill="x", padx=15, pady=15)

        # Logo on left
        if data['biz_logo'] and os.path.exists(data['biz_logo']):
            try:
                logo_img = Image.open(data['biz_logo'])
                logo_img = logo_img.resize((80, 80), Image.Resampling.LANCZOS)
                logo_photo = ct.CTkImage(light_image=logo_img, dark_image=logo_img, size=(80, 80))
                logo_label = ct.CTkLabel(header_frame, image=logo_photo, text="")
                logo_label.image = logo_photo
                logo_label.pack(side="left", padx=(0, 15))
            except Exception as e:
                print(f"Preview logo error: {e}")

        # Business info
        biz_info_frame = ct.CTkFrame(header_frame, fg_color="white")
        biz_info_frame.pack(side="left", fill="both", expand=True)

        ct.CTkLabel(biz_info_frame, text=data['biz_name'], 
                   font=ct.CTkFont(size=16, weight="bold"),
                   anchor="w").pack(fill="x")
        ct.CTkLabel(biz_info_frame, text=data['biz_addr'], 
                   font=ct.CTkFont(size=10), anchor="w").pack(fill="x")
        if data['biz_email']:
            ct.CTkLabel(biz_info_frame, text=data['biz_email'], 
                       font=ct.CTkFont(size=10), anchor="w").pack(fill="x")
        if data['biz_phone']:
            ct.CTkLabel(biz_info_frame, text=data['biz_phone'], 
                       font=ct.CTkFont(size=10), anchor="w").pack(fill="x")
        if data.get('biz_gst_no'):
            ct.CTkLabel(biz_info_frame, text=f"GST No: {data['biz_gst_no']}", 
                       font=ct.CTkFont(size=10), anchor="w").pack(fill="x")

        ct.CTkFrame(preview_frame, height=1, fg_color="#e0e0e0").pack(fill="x", padx=15, pady=10)

        # Invoice info
        invoice_header = ct.CTkFrame(preview_frame, fg_color="white")
        invoice_header.pack(fill="x", padx=15)

        ct.CTkLabel(invoice_header, text="INVOICE", 
                   font=ct.CTkFont(size=20, weight="bold"),
                   text_color=data['biz_color']).pack(anchor="w")
        ct.CTkLabel(invoice_header, text=f"Invoice #: {data['id']}", 
                   font=ct.CTkFont(size=11, weight="bold")).pack(anchor="w")
        ct.CTkLabel(invoice_header, text=f"Date: {data['date']}", 
                   font=ct.CTkFont(size=10)).pack(anchor="w")
        if data['due_date']:
            ct.CTkLabel(invoice_header, text=f"Due Date: {data['due_date']}", 
                       font=ct.CTkFont(size=10)).pack(anchor="w")

        ct.CTkFrame(preview_frame, height=1, fg_color="#e0e0e0").pack(fill="x", padx=15, pady=10)

        # Bill To
        ct.CTkLabel(preview_frame, text="BILL TO:", 
                   font=ct.CTkFont(size=11, weight="bold")).pack(anchor="w", padx=15)
        
        client_frame = ct.CTkFrame(preview_frame, fg_color="#f8f8f8", corner_radius=5)
        client_frame.pack(fill="x", padx=15, pady=5)
        
        ct.CTkLabel(client_frame, text=data['client_name'], 
                   font=ct.CTkFont(size=11, weight="bold")).pack(anchor="w", padx=8, pady=2)
        ct.CTkLabel(client_frame, text=data['client_email'], 
                   font=ct.CTkFont(size=10)).pack(anchor="w", padx=8, pady=2)
        if data.get('client_phone'):
            ct.CTkLabel(client_frame, text=data['client_phone'], 
                       font=ct.CTkFont(size=10)).pack(anchor="w", padx=8, pady=2)
        if data.get('client_address'):
            ct.CTkLabel(client_frame, text=data['client_address'], 
                       font=ct.CTkFont(size=10)).pack(anchor="w", padx=8, pady=2)

        ct.CTkFrame(preview_frame, height=1, fg_color="#e0e0e0").pack(fill="x", padx=15, pady=10)

        # Items
        ct.CTkLabel(preview_frame, text="ITEMS:", 
                   font=ct.CTkFont(size=11, weight="bold")).pack(anchor="w", padx=15)
        
        # Table Header
        table_header = ct.CTkFrame(preview_frame, fg_color=data['biz_color'])
        table_header.pack(fill="x", padx=15, pady=5)
        
        header_row = ct.CTkFrame(table_header, fg_color=data['biz_color'])
        header_row.pack(fill="x", padx=5, pady=5)
        
        ct.CTkLabel(header_row, text="Description", 
                   font=ct.CTkFont(size=11, weight="bold"),
                   text_color="white", width=350, anchor="w").pack(side="left", padx=5)
        ct.CTkLabel(header_row, text="Amount (₹)", 
                   font=ct.CTkFont(size=11, weight="bold"),
                   text_color="white", width=120, anchor="e").pack(side="right", padx=5)

        # Items
        for idx, item in enumerate(data['items']):
            item_bg = "#f8f8f8" if idx % 2 == 0 else "white"
            item_row = ct.CTkFrame(preview_frame, fg_color=item_bg)
            item_row.pack(fill="x", padx=15, pady=1)
            
            ct.CTkLabel(item_row, text=item['desc'], 
                       font=ct.CTkFont(size=10), width=350, anchor="w").pack(side="left", padx=8, pady=4)
            ct.CTkLabel(item_row, text=f"₹{item['price']:.2f}", 
                       font=ct.CTkFont(size=10), width=120, anchor="e").pack(side="right", padx=8, pady=4)

        ct.CTkFrame(preview_frame, height=1, fg_color="#e0e0e0").pack(fill="x", padx=15, pady=8)

        # Totals
        totals_frame = ct.CTkFrame(preview_frame, fg_color="white")
        totals_frame.pack(fill="x", padx=15, pady=5)

        subtotal_row = ct.CTkFrame(totals_frame, fg_color="white")
        subtotal_row.pack(fill="x", pady=1)
        ct.CTkLabel(subtotal_row, text="Subtotal:", 
                   font=ct.CTkFont(size=10), width=350, anchor="e").pack(side="left", padx=8)
        ct.CTkLabel(subtotal_row, text=f"₹{data['subtotal']:.2f}", 
                   font=ct.CTkFont(size=10), width=120, anchor="e").pack(side="right", padx=8)

        tax_row = ct.CTkFrame(totals_frame, fg_color="white")
        tax_row.pack(fill="x", pady=1)
        ct.CTkLabel(tax_row, text=f"Tax(GST) ({data['tax_rate']}%):", 
                   font=ct.CTkFont(size=10), width=350, anchor="e").pack(side="left", padx=8)
        ct.CTkLabel(tax_row, text=f"₹{data['tax_amt']:.2f}", 
                   font=ct.CTkFont(size=10), width=120, anchor="e").pack(side="right", padx=8)

        ct.CTkFrame(totals_frame, height=2, fg_color=data['biz_color']).pack(fill="x", pady=5)
        
        total_row = ct.CTkFrame(totals_frame, fg_color="#f0f0f0")
        total_row.pack(fill="x", pady=5)
        ct.CTkLabel(total_row, text="GRAND TOTAL:", 
                   font=ct.CTkFont(size=13, weight="bold"),
                   text_color=data['biz_color'], width=350, anchor="e").pack(side="left", padx=8)
        ct.CTkLabel(total_row, text=f"₹{data['total']:.2f}", 
                   font=ct.CTkFont(size=13, weight="bold"),
                   text_color=data['biz_color'], width=120, anchor="e").pack(side="right", padx=8)

        ct.CTkLabel(preview_frame, text=f"Style: {data['biz_style']}", 
                   font=ct.CTkFont(size=9, slant="italic"),
                   text_color="#888").pack(pady=8)

        # Buttons at bottom - FIXED position
        button_frame = ct.CTkFrame(preview_window, fg_color="transparent")
        button_frame.grid(row=2, column=0, pady=15, sticky="ew")

        result = [False]

        def on_proceed():
            result[0] = True
            preview_window.destroy()

        def on_cancel():
            preview_window.destroy()

        ct.CTkButton(button_frame, text="Generate Invoice", command=on_proceed,
                    fg_color="#10b981", hover_color="#059669",
                    width=160, height=40,
                    font=ct.CTkFont(size=13, weight="bold")).pack(side="left", padx=(150, 10))
        ct.CTkButton(button_frame, text="Cancel", command=on_cancel,
                    fg_color="#ef4444", hover_color="#dc2626",
                    width=160, height=40,
                    font=ct.CTkFont(size=13, weight="bold")).pack(side="left", padx=10)

        preview_window.wait_window()
        return result[0]

    def image_to_base64(self, image_path):
        """Convert image to base64 string for PDF embedding"""
        try:
            with open(image_path, "rb") as image_file:
                return base64.b64encode(image_file.read()).decode('utf-8')
        except Exception as e:
            return None

    def make_modern_pdf(self, data, path):
        """ Unified Modern Style for All Businesses """
        pdf = FPDF()
        pdf.add_page()
        pdf.set_margins(10, 10, 10)  # Reduce margins for full page use
        
        # Add Unicode support font for INR symbol
        try:
            pdf.add_font('DejaVu', '', 'DejaVuSans.ttf', uni=True)
            pdf.add_font('DejaVu', 'B', 'DejaVuSans-Bold.ttf', uni=True)
            font_name = 'DejaVu'
        except:
            # Fallback to default font if DejaVu not available
            font_name = 'Arial'

        # Color helper
        hex_color = data['biz_color'].lstrip('#')
        r, g, b = tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4))

        # Calculate header height based on content
        header_height = 50
        if data.get('biz_gst_no'):
            header_height = 60
        
        # Header Background - Full width
        pdf.set_fill_color(r, g, b)
        pdf.rect(0, 0, 210, header_height, 'F')

        # Logo on left side - only if exists
        if data['biz_logo'] and os.path.exists(data['biz_logo']):
            try:
                logo_path = data['biz_logo']
                # Convert PNG to JPG if needed
                if logo_path.lower().endswith('.png'):
                    from PIL import Image
                    img = Image.open(logo_path)
                    if img.mode == 'RGBA':
                        img = img.convert('RGB')
                    jpeg_path = logo_path.replace('.png', '_temp.jpg')
                    img.save(jpeg_path, 'JPEG')
                    logo_path = jpeg_path
                pdf.image(logo_path, 15, 10, 40)
            except Exception as e:
                print(f"Logo load failed: {e}")

        # Business Info on Header
        pdf.set_xy(60, 12)
        pdf.set_font(font_name, 'B', 20)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(0, 8, data['biz_name'], 0, 1)
        
        current_y = 22
        pdf.set_xy(60, current_y)
        pdf.set_font(font_name, '', 10)
        pdf.cell(0, 5, data['biz_addr'], 0, 1)
        current_y += 6
        
        if data['biz_email']:
            pdf.set_xy(60, current_y)
            pdf.cell(0, 5, f"Email: {data['biz_email']}", 0, 1)
            current_y += 6
        
        if data['biz_phone']:
            pdf.set_xy(60, current_y)
            pdf.cell(0, 5, f"Phone: {data['biz_phone']}", 0, 1)
            current_y += 6

        # Invoice Title on Right
        pdf.set_xy(140, 12)
        pdf.set_font(font_name, 'B', 28)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(0, 12, "INVOICE", 0, 1, 'R')

        # GST No on right side (above invoice details)
        right_y = 26
        if data.get('biz_gst_no'):
            pdf.set_xy(140, right_y)
            pdf.set_font(font_name, '', 10)
            pdf.cell(0, 5, f"GST No: {data['biz_gst_no']}", 0, 1, 'R')
            right_y += 6

        pdf.set_xy(140, right_y)
        pdf.set_font(font_name, '', 11)
        pdf.cell(0, 5, f"#{data['id']}", 0, 1, 'R')
        right_y += 6
        
        pdf.set_xy(140, right_y)
        pdf.cell(0, 5, f"Date: {data['date']}", 0, 1, 'R')
        right_y += 6
        
        if data['due_date']:
            pdf.set_xy(140, right_y)
            pdf.cell(0, 5, f"Due: {data['due_date']}", 0, 1, 'R')

        # Space after header
        pdf.ln(header_height - 30)

        # Client Information Box
        pdf.set_text_color(0, 0, 0)
        pdf.set_font(font_name, 'B', 14)
        pdf.cell(0, 10, "BILL TO:", 0, 1)

        # Calculate client box height dynamically
        client_box_height = 25
        if data.get('client_phone'):
            client_box_height += 6
        if data.get('client_address'):
            client_box_height += 6
        
        pdf.set_fill_color(248, 250, 252)
        pdf.rect(10, pdf.get_y(), 190, client_box_height, 'F')
        
        client_y = pdf.get_y() + 5
        pdf.set_xy(15, client_y)
        pdf.set_font(font_name, 'B', 12)
        pdf.cell(0, 6, data['client_name'], 0, 1)
        client_y += 7
        
        pdf.set_xy(15, client_y)
        pdf.set_font(font_name, '', 10)
        pdf.cell(0, 5, f"Email: {data['client_email']}", 0, 1)
        client_y += 6
        
        if data.get('client_phone'):
            pdf.set_xy(15, client_y)
            pdf.cell(0, 5, f"Phone: {data['client_phone']}", 0, 1)
            client_y += 6
        
        if data.get('client_address'):
            pdf.set_xy(15, client_y)
            pdf.cell(0, 5, f"Address: {data['client_address']}", 0, 1)

        # Move to after client box
        pdf.set_y(pdf.get_y() + client_box_height)
        
        # Space before items table
        pdf.ln(10)

        # Items Table Header - Full width
        pdf.set_fill_color(r, g, b)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font(font_name, 'B', 12)
        pdf.cell(110, 12, " Description", 1, 0, 'L', True)
        pdf.cell(40, 12, " Quantity", 1, 0, 'C', True)
        pdf.cell(40, 12, " Amount (INR)", 1, 1, 'C', True)

        # Items
        pdf.set_text_color(0, 0, 0)
        pdf.set_fill_color(245, 245, 245)
        fill = False
        for item in data['items']:
            pdf.set_font(font_name, '', 10)
            pdf.cell(110, 10, f" {item['desc']}", 1, 0, 'L', fill)
            
            # Quantity column
            qty_text = ""
            if item.get('qty') and item.get('unit'):
                qty_text = f"{item['qty']} {item['unit']}"
            pdf.cell(40, 10, qty_text, 1, 0, 'C', fill)
            
            pdf.cell(40, 10, f"INR {item['price']:.2f}", 1, 1, 'R', fill)
            fill = not fill

        # Space before totals
        pdf.ln(10)

        # Totals - Right aligned
        pdf.set_font(font_name, '', 11)
        pdf.cell(150, 8, "Subtotal", 0, 0, 'R')
        pdf.cell(40, 8, f"INR {data['subtotal']:.2f}", 0, 1, 'R')

        pdf.cell(150, 8, f"Tax (GST) ({data['tax_rate']}%)", 0, 0, 'R')
        pdf.cell(40, 8, f"INR {data['tax_amt']:.2f}", 0, 1, 'R')

        # Grand Total - Full width highlight
        pdf.ln(5)
        pdf.set_fill_color(r, g, b)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font(font_name, 'B', 14)
        pdf.cell(150, 12, "GRAND TOTAL", 1, 0, 'R', True)
        pdf.cell(40, 12, f"INR {data['total']:.2f}", 1, 1, 'R', True)

        # Footer with more space
        pdf.ln(15)
        pdf.set_text_color(100, 100, 100)
        pdf.set_font(font_name, 'I', 10)
        pdf.cell(0, 5, f"Generated by {data['biz_name']}", 0, 1, 'C')
        
        # Thank you note
        pdf.ln(5)
        pdf.set_font(font_name, 'B', 12)
        pdf.set_text_color(r, g, b)
        pdf.cell(0, 8, "Thank you for your business!", 0, 1, 'C')

        pdf.output(path)

    def make_word(self, data, path):
        # Enhanced Word generation with better spacing
        doc = Document()
        
        # Set document margins for full page use
        sections = doc.sections
        for section in sections:
            section.top_margin = Inches(0.5)
            section.bottom_margin = Inches(0.5)
            section.left_margin = Inches(0.75)
            section.right_margin = Inches(0.75)

        # Header Table for Logo and Biz Name
        header_table = doc.add_table(rows=1, cols=2)
        header_table.autofit = False
        header_table.columns[0].width = Inches(2.5)
        header_table.columns[1].width = Inches(4.5)

        # Logo Cell
        c1 = header_table.rows[0].cells[0]
        p1 = c1.paragraphs[0]
        if data['biz_logo'] and os.path.exists(data['biz_logo']):
            run = p1.add_run()
            run.add_picture(data['biz_logo'], width=Inches(2.0))

        # Biz Info Cell
        c2 = header_table.rows[0].cells[1]
        p2 = c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        run = p2.add_run(data['biz_name'] + "\n")
        run.bold = True
        run.font.size = Pt(18)
        run.font.color.rgb = RGBColor(30, 64, 175)  # Blue color
        
        p2.add_run(data['biz_addr'] + "\n")
        if data['biz_email']:
            p2.add_run(f"Email: {data['biz_email']}\n")
        if data['biz_phone']:
            p2.add_run(f"Phone: {data['biz_phone']}\n")
        if data.get('biz_gst_no'):
            p2.add_run(f"GST No: {data['biz_gst_no']}")

        # Add space after header
        doc.add_paragraph()

        # Invoice heading with better styling
        invoice_heading = doc.add_heading(f"INVOICE ({data['biz_style']})", 0)
        invoice_heading.alignment = WD_ALIGN_PARAGRAPH.CENTER
        
        # Invoice details
        invoice_info = f"Invoice #: {data['id']}\nDate: {data['date']}"
        if data['due_date']:
            invoice_info += f"\nDue: {data['due_date']}"
        
        invoice_para = doc.add_paragraph(invoice_info)
        invoice_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
        
        # Add space
        doc.add_paragraph()

        # Bill To section with better formatting
        doc.add_heading('Bill To:', level=2)
        client_info = f"{data['client_name']}\n{data['client_email']}"
        if data.get('client_phone'):
            client_info += f"\nPhone: {data['client_phone']}"
        if data.get('client_address'):
            client_info += f"\nAddress: {data['client_address']}"
        
        client_para = doc.add_paragraph(client_info)
        # Add background color to client info
        client_para.paragraph_format.space_after = Pt(12)

        # Add space before table
        doc.add_paragraph()

        # Items table with better formatting
        table = doc.add_table(rows=1, cols=3)
        table.style = 'Table Grid'
        
        # Set column widths
        table.columns[0].width = Inches(4.0)  # Description
        table.columns[1].width = Inches(1.5)  # Quantity
        table.columns[2].width = Inches(1.5)  # Amount
        
        hdr_cells = table.rows[0].cells
        hdr_cells[0].text = 'Description'
        hdr_cells[1].text = 'Quantity'
        hdr_cells[2].text = 'Amount (INR)'
        
        # Style header row
        for cell in hdr_cells:
            cell.paragraphs[0].runs[0].font.bold = True
            cell.paragraphs[0].runs[0].font.size = Pt(12)

        for item in data['items']:
            row_cells = table.add_row().cells
            row_cells[0].text = item['desc']
            
            # Quantity column
            qty_text = ""
            if item.get('qty') and item.get('unit'):
                qty_text = f"{item['qty']} {item['unit']}"
            row_cells[1].text = qty_text
            
            row_cells[2].text = f"INR {item['price']:.2f}"

        # Tax Rows in Word
        row_tax = table.add_row().cells
        row_tax[0].text = f"Tax(GST) ({data['tax_rate']}%)"
        row_tax[1].text = ""
        row_tax[2].text = f"INR {data['tax_amt']:.2f}"

        # Add space before total
        doc.add_paragraph()

        # Grand total with better styling
        total_para = doc.add_paragraph(f"GRAND TOTAL: INR {data['total']:.2f}", style='Heading 2')
        total_para.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        total_para.runs[0].font.color.rgb = RGBColor(30, 64, 175)  # Blue color
        
        # Add space and thank you note
        doc.add_paragraph()
        thank_you = doc.add_paragraph("Thank you for your business!")
        thank_you.alignment = WD_ALIGN_PARAGRAPH.CENTER
        thank_you.runs[0].font.bold = True
        thank_you.runs[0].font.size = Pt(14)
        thank_you.runs[0].font.color.rgb = RGBColor(30, 64, 175)  # Blue color

        doc.save(path)

    def save_to_history(self, data):
        # Enhanced history with complete invoice data
        history_item = {
            "id": data['id'],
            "client": data['client_name'],
            "client_email": data['client_email'],
            "client_phone": data.get('client_phone', ''),
            "client_address": data.get('client_address', ''),
            "total": data['total'],
            "business": data['biz_name'],
            "items": data['items'],
            "subtotal": data['subtotal'],
            "tax_rate": data['tax_rate'],
            "tax_amt": data['tax_amt'],
            "date": data['date'],
            "due_date": data['due_date'],
            "biz_id": self.current_biz_id
        }
        
        # Add to current business history
        if self.current_biz_id not in self.history:
            self.history[self.current_biz_id] = []
        
        self.history[self.current_biz_id].append(history_item)
        
        # Keep only the last 5 invoices for this business
        if len(self.history[self.current_biz_id]) > 5:
            self.history[self.current_biz_id] = self.history[self.current_biz_id][-5:]
        
        # Save to file
        with open(HISTORY_FILE, 'w') as f:
            json.dump(self.history, f, indent=4)
        
        self.refresh_history_ui()

    def load_history(self):
        if os.path.exists(HISTORY_FILE):
            try:
                with open(HISTORY_FILE, 'r') as f:
                    data = json.load(f)
                    # Ensure it's a dictionary with business IDs as keys
                    if isinstance(data, dict):
                        return data
                    # Convert old list format to new dict format
                    elif isinstance(data, list):
                        # Migrate old format to new format
                        new_format = {
                            "biz_1": [],
                            "biz_2": [],
                            "biz_3": [],
                            "biz_4": []
                        }
                        # Try to assign old invoices to businesses based on biz_id if available
                        for item in data:
                            biz_id = item.get('biz_id', 'biz_1')
                            if biz_id in new_format:
                                new_format[biz_id].append(item)
                        return new_format
                    else:
                        return {"biz_1": [], "biz_2": [], "biz_3": [], "biz_4": []}
            except:
                return {"biz_1": [], "biz_2": [], "biz_3": [], "biz_4": []}
        return {"biz_1": [], "biz_2": [], "biz_3": [], "biz_4": []}

    def load_invoice_from_history(self, history_item):
        """Load invoice data from history into the form"""
        # Switch to the correct business
        if history_item.get('biz_id'):
            self.switch_business(history_item['biz_id'])
        
        # Clear current form
        self.clear_form()
        
        # Load invoice data
        self.invoice_num.delete(0, 'end')
        self.invoice_num.insert(0, history_item['id'])
        
        # Load invoice date
        self.invoice_date.delete(0, 'end')
        self.invoice_date.insert(0, history_item.get('date', datetime.now().strftime("%d-%m-%Y")))
        
        self.client_name.delete(0, 'end')
        self.client_name.insert(0, history_item['client'])
        
        self.client_email.delete(0, 'end')
        self.client_email.insert(0, history_item.get('client_email', ''))
        
        self.client_phone.delete(0, 'end')
        self.client_phone.insert(0, history_item.get('client_phone', ''))
        
        self.client_address.delete(0, 'end')
        self.client_address.insert(0, history_item.get('client_address', ''))
        
        self.due_date.delete(0, 'end')
        due_date_val = history_item.get('due_date', '')
        if due_date_val == "PENDING":
            self.pending_var.set(True)
            self.toggle_pending()
        else:
            self.due_date.insert(0, due_date_val)
            self.pending_var.set(False)
        
        self.tax_entry.delete(0, 'end')
        self.tax_entry.insert(0, str(history_item.get('tax_rate', 0)))
        
        # Load items into the items list (this will show in the table)
        self.items = history_item.get('items', [])
        
        # Also populate the description and price text boxes with the first item (if exists)
        # This allows user to see the format and add more items easily
        if self.items:
            first_item = self.items[0]
            self.item_desc.delete(0, 'end')
            self.item_desc.insert(0, first_item['desc'])
            self.item_price.delete(0, 'end')
            self.item_price.insert(0, str(first_item['price']))
        
        # Refresh table to show loaded items
        self.refresh_table()

    def delete_invoice_from_history(self, invoice_id):
        """Delete an invoice from current business history with confirmation"""
        # Get current business history
        current_history = self.history.get(self.current_biz_id, [])
        
        # Find invoice details for confirmation
        invoice_to_delete = None
        for h in current_history:
            if h['id'] == invoice_id:
                invoice_to_delete = h
                break
        
        if invoice_to_delete:
            # Show confirmation dialog
            result = messagebox.askyesno(
                "Confirm Delete",
                f"Are you sure you want to delete invoice #{invoice_to_delete['id']} for {invoice_to_delete['client']}?\n\nThis action cannot be undone.",
                icon='warning'
            )
            
            if result:
                # Remove from current business history
                self.history[self.current_biz_id] = [h for h in current_history if h['id'] != invoice_id]
                
                # Save to file
                with open(HISTORY_FILE, 'w') as f:
                    json.dump(self.history, f, indent=4)
                
                self.refresh_history_ui()
                messagebox.showinfo("Success", f"Invoice #{invoice_id} has been deleted.")

    def refresh_history_ui(self):
        for w in self.history_list.winfo_children(): w.destroy()
        
        # Get current business history
        current_history = self.history.get(self.current_biz_id, [])
        
        if not current_history:
            empty_frame = ct.CTkFrame(self.history_list, 
                                     fg_color=("#f1f5f9", "#1e293b"),
                                     corner_radius=8)
            empty_frame.pack(fill="x", pady=10, padx=5)
            ct.CTkLabel(empty_frame, text="📭 No recent invoices", 
                       text_color=("#94a3b8", "#64748b"),
                       font=ct.CTkFont(size=11)).pack(pady=12)
            return
        
        # Show last 5 invoices for current business with compact modern card design
        for idx, h in enumerate(reversed(current_history[-5:])):
            # Compact card for each invoice
            item_card = ct.CTkFrame(self.history_list, 
                                   fg_color=("#ffffff", "#1e293b"),
                                   corner_radius=10,
                                   border_width=1,
                                   border_color=("#e2e8f0", "#334155"))
            item_card.pack(fill="x", pady=4, padx=3)
            
            # Main content frame
            content_frame = ct.CTkFrame(item_card, fg_color="transparent")
            content_frame.pack(fill="x", padx=8, pady=8)
            
            # Top row - Invoice number and amount
            top_row = ct.CTkFrame(content_frame, fg_color="transparent")
            top_row.pack(fill="x")
            
            ct.CTkLabel(top_row, text=f"#{h['id']}", 
                       font=ct.CTkFont(size=11, weight="bold"),
                       text_color=("#1e40af", "#60a5fa")).pack(side="left")
            
            ct.CTkLabel(top_row, text=f"₹{h['total']:.2f}", 
                       font=ct.CTkFont(size=11, weight="bold"),
                       text_color=("#059669", "#10b981")).pack(side="right")
            
            # Middle row - Client name
            ct.CTkLabel(content_frame, text=h['client'], 
                       font=ct.CTkFont(size=10),
                       text_color=("#1e293b", "#f1f5f9")).pack(anchor="w", pady=(2, 0))
            
            # Bottom row - Date and status
            bottom_row = ct.CTkFrame(content_frame, fg_color="transparent")
            bottom_row.pack(fill="x", pady=(2, 0))
            
            if h.get('date'):
                ct.CTkLabel(bottom_row, text=f"📅 {h['date']}", 
                           font=ct.CTkFont(size=9),
                           text_color=("#94a3b8", "#64748b")).pack(side="left")
            
            if h.get('due_date'):
                due_text = "⏳ Pending" if h['due_date'] == "PENDING" else f"Due: {h['due_date']}"
                ct.CTkLabel(bottom_row, text=due_text, 
                           font=ct.CTkFont(size=9),
                           text_color=("#f59e0b", "#fbbf24")).pack(side="right")
            
            # Action buttons row
            button_row = ct.CTkFrame(item_card, fg_color="transparent")
            button_row.pack(fill="x", padx=8, pady=(0, 8))
            
            # Load button
            load_btn = ct.CTkButton(
                button_row,
                text="📂 Load",
                command=lambda item=h: self.load_invoice_from_history(item),
                width=80,
                height=28,
                fg_color=("#3b82f6", "#2563eb"),
                hover_color=("#2563eb", "#1d4ed8"),
                corner_radius=6,
                font=ct.CTkFont(size=10, weight="bold")
            )
            load_btn.pack(side="left", padx=(0, 4))
            
            # Delete button
            delete_btn = ct.CTkButton(
                button_row,
                text="✕",
                command=lambda item_id=h['id']: self.delete_invoice_from_history(item_id),
                width=28,
                height=28,
                fg_color=("#ef4444", "#dc2626"),
                hover_color=("#dc2626", "#b91c1c"),
                corner_radius=6,
                font=ct.CTkFont(size=12, weight="bold")
            )
            delete_btn.pack(side="right")


if __name__ == "__main__":
    app = InvoiceApp()
    app.mainloop()