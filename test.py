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
        self.biz_phone_entry.pack(anchor="w")

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
        self.client_address = self.create_input(client_frame, "Client Address", "📍")
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
                                     width=500, height=45,
                                     corner_radius=12,
                                     border_width=2,
                                     font=ct.CTkFont(size=13))
        self.item_desc.pack(side="left", padx=5)

        self.item_price = ct.CTkEntry(entry_grid, placeholder_text="Amount (₹)", 
                                      width=180, height=45,
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

        ct.CTkLabel(tax_frame, text="💰 Tax Rate (%):", 
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

    # --- Business Profile Logic ---

    def switch_business(self, biz_id):
        # AUTO-SAVE LOGIC: Save current input to the OLD profile before switching
        current_name = self.biz_name_entry.get()
        current_addr = self.biz_addr_entry.get()

        if current_name:
            self.profiles[self.current_biz_id]["name"] = current_name
            self.profiles[self.current_biz_id]["address"] = current_addr
            self.save_profiles()  # Commit to file so it persists

        # Now switch
        self.current_biz_id = biz_id
        self.current_theme = self.profiles[biz_id]["color"]
        self.refresh_theme()

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
        if name:
            self.profiles[self.current_biz_id]["name"] = name
            self.profiles[self.current_biz_id]["address"] = addr
            self.profiles[self.current_biz_id]["email"] = email
            self.profiles[self.current_biz_id]["phone"] = phone
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
            desc = self.item_desc.get()
            price = float(self.item_price.get())
            if desc:
                self.items.append({"desc": desc, "price": price})
                self.item_desc.delete(0, 'end')
                self.item_price.delete(0, 'end')
                self.refresh_table()
        except ValueError:
            messagebox.showerror("Error", "Price must be a number")

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
                   text_color="white").pack(side="right", padx=20)

        subtotal = 0.0
        for idx, item in enumerate(self.items):
            # Alternating row colors
            row_color = ("#f8fafc", "#1a1f2e") if idx % 2 == 0 else ("#ffffff", "#0f172a")
            
            row = ct.CTkFrame(self.table_frame, fg_color=row_color,
                            corner_radius=8)
            row.pack(fill="x", pady=3, padx=10)
            
            row_content = ct.CTkFrame(row, fg_color="transparent")
            row_content.pack(fill="x", padx=15, pady=10)
            
            ct.CTkLabel(row_content, text=item['desc'],
                       font=ct.CTkFont(size=12),
                       text_color=("#1e293b", "#e2e8f0")).pack(side="left", padx=10)
            ct.CTkLabel(row_content, text=f"₹{item['price']:.2f}",
                       font=ct.CTkFont(size=12, weight="bold"),
                       text_color=("#059669", "#10b981")).pack(side="right", padx=20)
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
        ct.CTkLabel(tax_row, text=f"Tax ({tax_rate}%):", 
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
        self.client_address.delete(0, 'end')
        self.invoice_num.delete(0, 'end')
        self.invoice_num.insert(0, self.get_next_invoice_number())
        self.due_date.delete(0, 'end')
        self.tax_entry.delete(0, 'end')
        self.tax_entry.insert(0, "0")
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
        
        data = {
            "id": self.invoice_num.get(),
            "date": datetime.now().strftime("%d-%m-%Y"),
            "due_date": due_date_value,
            "client_name": self.client_name.get(),
            "client_email": self.client_email.get(),
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
                # Dispatcher for PDF Styles
                if self.current_biz_id == "biz_1":
                    self.make_pdf_style_1(data, save_path)
                elif self.current_biz_id == "biz_2":
                    self.make_pdf_style_2(data, save_path)
                elif self.current_biz_id == "biz_3":
                    self.make_pdf_style_3(data, save_path)
                elif self.current_biz_id == "biz_4":
                    self.make_pdf_style_4(data, save_path)
                else:
                    self.make_pdf_style_1(data, save_path)  # Default
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
        ct.CTkLabel(tax_row, text=f"Tax ({data['tax_rate']}%):", 
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

    def make_pdf_style_1(self, data, path):
        """ Style 1: Modern Tech - Right Aligned Blue Theme """
        pdf = FPDF()
        pdf.add_page()
        
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
                pdf.image(logo_path, 10, 8, 40)
            except Exception as e:
                print(f"Logo load failed: {e}")
                # Continue without logo

        pdf.set_font(font_name, 'B', 24)
        pdf.set_text_color(r, g, b)
        pdf.cell(0, 15, "INVOICE", 0, 1, 'R')

        pdf.set_font(font_name, '', 10)
        pdf.set_text_color(100)
        pdf.cell(0, 5, f"#{data['id']}", 0, 1, 'R')
        pdf.cell(0, 5, f"Date: {data['date']}", 0, 1, 'R')
        if data['due_date']:
            pdf.cell(0, 5, f"Due: {data['due_date']}", 0, 1, 'R')
        pdf.ln(10)

        # Info Blocks
        pdf.set_text_color(0)
        pdf.set_font(font_name, 'B', 12)
        pdf.cell(95, 8, "FROM:", 0, 0)
        pdf.cell(95, 8, "TO:", 0, 1)

        pdf.set_font(font_name, '', 10)
        # From
        x = pdf.get_x()
        y = pdf.get_y()
        from_info = f"{data['biz_name']}\n{data['biz_addr']}"
        if data['biz_email']:
            from_info += f"\n{data['biz_email']}"
        if data['biz_phone']:
            from_info += f"\n{data['biz_phone']}"
        pdf.multi_cell(90, 5, from_info)
        # To
        pdf.set_xy(x + 95, y)
        client_info = f"{data['client_name']}\n{data['client_email']}"
        if data.get('client_address'):
            client_info += f"\n{data['client_address']}"
        pdf.multi_cell(90, 5, client_info)
        pdf.ln(15)

        pdf.set_fill_color(r, g, b)
        pdf.set_text_color(255)
        pdf.cell(140, 10, " Description", 0, 0, 'L', True)
        pdf.cell(50, 10, " Price (INR)", 0, 1, 'R', True)

        # Items
        pdf.set_text_color(0)
        pdf.set_fill_color(245, 245, 245)
        fill = False
        for item in data['items']:
            pdf.cell(140, 10, f" {item['desc']}", 0, 0, 'L', fill)
            pdf.cell(50, 10, f"INR {item['price']:.2f} ", 0, 1, 'R', fill)
            fill = not fill

        # Total
        pdf.ln(5)
        pdf.set_text_color(0)
        pdf.cell(140, 7, "Subtotal", 0, 0, 'R')
        pdf.cell(50, 7, f"INR {data['subtotal']:.2f}", 0, 1, 'R')

        pdf.cell(140, 7, f"Tax ({data['tax_rate']}%)", 0, 0, 'R')
        pdf.cell(50, 7, f"INR {data['tax_amt']:.2f}", 0, 1, 'R')

        pdf.set_text_color(r, g, b)
        pdf.set_font(font_name, 'B', 14)
        pdf.cell(140, 10, "GRAND TOTAL", 0, 0, 'R')
        pdf.cell(50, 10, f"INR {data['total']:.2f}", 0, 1, 'R')

        pdf.output(path)

    def make_pdf_style_2(self, data, path):
        """ Style 2: Nature/Classic - Centered, Green Theme """
        pdf = FPDF()
        pdf.add_page()

        # Top Bar
        pdf.set_fill_color(5, 150, 105)  # Green
        pdf.rect(0, 0, 210, 40, 'F')

        # Logo Centered on left side - only if exists
        if data['biz_logo'] and os.path.exists(data['biz_logo']):
            try:
                logo_path = data['biz_logo']
                if logo_path.lower().endswith('.png'):
                    from PIL import Image
                    img = Image.open(logo_path)
                    if img.mode == 'RGBA':
                        img = img.convert('RGB')
                    jpeg_path = logo_path.replace('.png', '_temp.jpg')
                    img.save(jpeg_path, 'JPEG')
                    logo_path = jpeg_path
                pdf.image(logo_path, 15, 5, 35)
            except Exception as e:
                print(f"Logo load failed: {e}")

        pdf.set_y(45)
        pdf.set_font("Times", 'B', 20)
        pdf.cell(0, 10, data['biz_name'], 0, 1, 'C')
        pdf.set_font("Times", 'I', 10)
        pdf.cell(0, 5, data['biz_addr'], 0, 1, 'C')

        pdf.ln(10)
        pdf.line(20, pdf.get_y(), 190, pdf.get_y())
        pdf.ln(10)

        # Client Info
        pdf.set_font("Times", '', 12)
        pdf.cell(0, 6, f"Billed To: {data['client_name']}", 0, 1, 'L')
        if data.get('client_address'):
            pdf.cell(0, 6, f"Address: {data['client_address']}", 0, 1, 'L')
        pdf.cell(0, 6, f"Email: {data['client_email']}", 0, 1, 'L')
        pdf.cell(0, 6, f"Invoice: #{data['id']}", 0, 1, 'R')

        pdf.ln(10)

        # Table
        pdf.set_font("Times", 'B', 12)
        pdf.cell(150, 8, "Item", 'B', 0)
        pdf.cell(40, 8, "Cost (INR)", 'B', 1, 'R')

        pdf.set_font("Times", '', 12)
        for item in data['items']:
            pdf.cell(150, 8, item['desc'], 'B', 0)
            pdf.cell(40, 8, f"INR {item['price']:.2f}", 'B', 1, 'R')

        pdf.ln(5)
        pdf.cell(150, 6, f"Tax ({data['tax_rate']}%)", 0, 0, 'R')
        pdf.cell(40, 6, f"INR {data['tax_amt']:.2f}", 0, 1, 'R')

        pdf.ln(5)
        pdf.set_font("Times", 'B', 16)
        pdf.cell(0, 10, f"Grand Total: INR {data['total']:.2f}", 0, 1, 'R')

        pdf.output(path)

    def make_pdf_style_3(self, data, path):
        """ Style 3: Industrial - Orange, Bold Lines, Grid """
        pdf = FPDF()
        pdf.add_page()
        pdf.set_draw_color(0)
        pdf.set_line_width(0.5)

        # Border around page
        pdf.rect(5, 5, 200, 287)

        # Header Box
        pdf.rect(5, 5, 200, 50)

        # Logo on left side - only if exists
        if data['biz_logo'] and os.path.exists(data['biz_logo']):
            try:
                logo_path = data['biz_logo']
                if logo_path.lower().endswith('.png'):
                    from PIL import Image
                    img = Image.open(logo_path)
                    if img.mode == 'RGBA':
                        img = img.convert('RGB')
                    jpeg_path = logo_path.replace('.png', '_temp.jpg')
                    img.save(jpeg_path, 'JPEG')
                    logo_path = jpeg_path
                pdf.image(logo_path, 10, 10, 30)
            except Exception as e:
                print(f"Logo load failed: {e}")

        pdf.set_xy(40, 10)
        pdf.set_font("Courier", 'B', 22)
        pdf.cell(100, 10, data['biz_name'].upper(), 0, 1)

        # Company info below name
        pdf.set_xy(40, 20)
        pdf.set_font("Courier", '', 10)
        pdf.multi_cell(120, 4, f"{data['biz_addr']}\n{data['biz_email']}\n{data['biz_phone']}")

        pdf.set_xy(107, 62)
        pdf.multi_cell(90, 5, f"DETAILS:\nID: {data['id']}\nDate: {data['date']}")

        # Bill To section
        pdf.set_xy(10, 55)
        pdf.set_font("Courier", 'B', 12)
        pdf.cell(60, 5, "BILL TO:", 0, 1)
        pdf.set_font("Courier", '', 10)
        bill_to = f"{data['client_name']}\n"
        if data.get('client_address'):
            bill_to += f"{data['client_address']}\n"
        bill_to += f"{data['client_email']}"
        pdf.multi_cell(90, 4, bill_to)

        pdf.set_y(95)
        # Items Grid
        pdf.set_fill_color(220, 220, 220)
        pdf.cell(160, 10, "DESCRIPTION", 1, 0, 'L', True)
        pdf.cell(40, 10, "AMOUNT (INR)", 1, 1, 'C', True)

        for item in data['items']:
            pdf.cell(160, 10, item['desc'], 1, 0)
            pdf.cell(40, 10, f"INR {item['price']:.2f}", 1, 1, 'R')

        # Tax Rows in Grid
        pdf.cell(160, 10, f"TAX ({data['tax_rate']}%)", 1, 0, 'R')
        pdf.cell(40, 10, f"INR {data['tax_amt']:.2f}", 1, 1, 'R')

        pdf.cell(160, 10, "TOTAL DUE", 1, 0, 'R', True)
        pdf.cell(40, 10, f"INR {data['total']:.2f}", 1, 1, 'R', True)

        pdf.output(path)

    def make_pdf_style_4(self, data, path):
        """ Style 4: Minimalist - Purple, Left Aligned, Clean """
        pdf = FPDF()
        pdf.add_page()

        # Sidebar Color Strip
        pdf.set_fill_color(124, 58, 237)  # Purple
        pdf.rect(0, 0, 10, 297, 'F')

        pdf.set_left_margin(20)
        pdf.ln(10)

        # Logo - only if exists
        if data['biz_logo'] and os.path.exists(data['biz_logo']):
            try:
                logo_path = data['biz_logo']
                if logo_path.lower().endswith('.png'):
                    from PIL import Image
                    img = Image.open(logo_path)
                    if img.mode == 'RGBA':
                        img = img.convert('RGB')
                    jpeg_path = logo_path.replace('.png', '_temp.jpg')
                    img.save(jpeg_path, 'JPEG')
                    logo_path = jpeg_path
                pdf.image(logo_path, 20, 15, 25)
                pdf.ln(25)
            except Exception as e:
                print(f"Logo load failed: {e}")
                pdf.ln(10)
        else:
            pdf.ln(10)

        pdf.set_font("Helvetica", '', 35)
        pdf.set_text_color(50)
        pdf.cell(0, 15, "invoice.", 0, 1)

        pdf.set_font("Helvetica", '', 10)
        pdf.cell(0, 5, data['client_name'], 0, 1)
        if data.get('client_address'):
            pdf.cell(0, 5, data['client_address'], 0, 1)
        pdf.cell(0, 5, data['client_email'], 0, 1)

        pdf.ln(20)

        # Minimal List
        for item in data['items']:
            pdf.set_font("Helvetica", 'B', 12)
            pdf.cell(140, 8, item['desc'], 0, 0)
            pdf.set_font("Helvetica", '', 12)
            pdf.cell(40, 8, f"INR {item['price']:.2f}", 0, 1, 'R')
            # Light gray line
            pdf.set_draw_color(240)
            pdf.line(20, pdf.get_y(), 190, pdf.get_y())
            pdf.ln(2)

        pdf.ln(5)
        pdf.cell(140, 8, "Subtotal", 0, 0)
        pdf.cell(40, 8, f"INR {data['subtotal']:.2f}", 0, 1, 'R')
        pdf.cell(140, 8, f"Tax ({data['tax_rate']}%)", 0, 0)
        pdf.cell(40, 8, f"INR {data['tax_amt']:.2f}", 0, 1, 'R')

        pdf.ln(5)
        pdf.set_font("Helvetica", 'B', 20)
        pdf.cell(140, 10, "Total", 0, 0)
        pdf.cell(40, 10, f"INR {data['total']:.2f}", 0, 1, 'R')

        pdf.output(path)

    def make_word(self, data, path):
        # Basic Word generation kept simple but robust
        doc = Document()

        # Header Table for Logo and Biz Name
        header_table = doc.add_table(rows=1, cols=2)
        header_table.autofit = False
        header_table.columns[0].width = Inches(2.0)
        header_table.columns[1].width = Inches(4.0)

        # Logo Cell
        c1 = header_table.rows[0].cells[0]
        p1 = c1.paragraphs[0]
        if data['biz_logo'] and os.path.exists(data['biz_logo']):
            run = p1.add_run()
            run.add_picture(data['biz_logo'], width=Inches(1.5))

        # Biz Info Cell
        c2 = header_table.rows[0].cells[1]
        p2 = c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        run = p2.add_run(data['biz_name'] + "\n")
        run.bold = True
        run.font.size = Pt(16)
        p2.add_run(data['biz_addr'])
        if data['biz_email']:
            p2.add_run(f"\n{data['biz_email']}")
        if data['biz_phone']:
            p2.add_run(f"\n{data['biz_phone']}")

        doc.add_heading(f"INVOICE ({data['biz_style']})", 0)
        invoice_info = f"Invoice #: {data['id']}\nDate: {data['date']}"
        if data['due_date']:
            invoice_info += f"\nDue: {data['due_date']}"
        doc.add_paragraph(invoice_info)

        doc.add_heading('Bill To:', level=2)
        client_info = f"{data['client_name']}\n{data['client_email']}"
        if data.get('client_address'):
            client_info += f"\n{data['client_address']}"
        doc.add_paragraph(client_info)

        table = doc.add_table(rows=1, cols=2)
        table.style = 'Table Grid'
        hdr_cells = table.rows[0].cells
        hdr_cells[0].text = 'Description'
        hdr_cells[1].text = 'Amount'

        for item in data['items']:
            row_cells = table.add_row().cells
            row_cells[0].text = item['desc']
            row_cells[1].text = str(item['price'])

        # Tax Rows in Word
        row_tax = table.add_row().cells
        row_tax[0].text = f"Tax ({data['tax_rate']}%)"
        row_tax[1].text = f"{data['tax_amt']:.2f}"

        doc.add_paragraph(f"\nTOTAL: {data['total']:.2f}", style='Heading 2').alignment = WD_ALIGN_PARAGRAPH.RIGHT
        doc.save(path)

    def save_to_history(self, data):
        # Enhanced history with complete invoice data
        history_item = {
            "id": data['id'],
            "client": data['client_name'],
            "client_email": data['client_email'],
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
        self.history.append(history_item)
        
        # Keep only the last 5 invoices
        if len(self.history) > 5:
            self.history = self.history[-5:]
        
        with open(HISTORY_FILE, 'w') as f:
            json.dump(self.history, f)
        self.refresh_history_ui()

    def load_history(self):
        if os.path.exists(HISTORY_FILE):
            try:
                with open(HISTORY_FILE, 'r') as f:
                    return json.load(f)
            except:
                return []
        return []

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
        
        self.client_name.delete(0, 'end')
        self.client_name.insert(0, history_item['client'])
        
        self.client_email.delete(0, 'end')
        self.client_email.insert(0, history_item.get('client_email', ''))
        
        self.client_address.delete(0, 'end')
        self.client_address.insert(0, history_item.get('client_address', ''))
        
        self.due_date.delete(0, 'end')
        self.due_date.insert(0, history_item.get('due_date', ''))
        
        self.tax_entry.delete(0, 'end')
        self.tax_entry.insert(0, str(history_item.get('tax_rate', 0)))
        
        # Load items
        self.items = history_item.get('items', [])
        
        # Refresh table to show loaded items
        self.refresh_table()

    def delete_invoice_from_history(self, invoice_id):
        """Delete an invoice from history with confirmation"""
        # Find invoice details for confirmation
        invoice_to_delete = None
        for h in self.history:
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
                self.history = [h for h in self.history if h['id'] != invoice_id]
                with open(HISTORY_FILE, 'w') as f:
                    json.dump(self.history, f)
                self.refresh_history_ui()
                messagebox.showinfo("Success", f"Invoice #{invoice_id} has been deleted.")

    def refresh_history_ui(self):
        for w in self.history_list.winfo_children(): w.destroy()
        
        if not self.history:
            empty_frame = ct.CTkFrame(self.history_list, 
                                     fg_color=("#f1f5f9", "#1e293b"),
                                     corner_radius=8)
            empty_frame.pack(fill="x", pady=10, padx=5)
            ct.CTkLabel(empty_frame, text="📭 No recent invoices", 
                       text_color=("#94a3b8", "#64748b"),
                       font=ct.CTkFont(size=11)).pack(pady=12)
            return
        
        # Show last 5 invoices with compact modern card design
        for idx, h in enumerate(reversed(self.history[-5:])):
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
            
            # Bottom row - Business and date
            bottom_row = ct.CTkFrame(content_frame, fg_color="transparent")
            bottom_row.pack(fill="x", pady=(2, 0))
            
            ct.CTkLabel(bottom_row, text=f"{h['business'][:15]}...", 
                       font=ct.CTkFont(size=9),
                       text_color=("#64748b", "#94a3b8")).pack(side="left")
            
            if h.get('date'):
                ct.CTkLabel(bottom_row, text=h['date'], 
                           font=ct.CTkFont(size=9),
                           text_color=("#94a3b8", "#64748b")).pack(side="right")
            
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