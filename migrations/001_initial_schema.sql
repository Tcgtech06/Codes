-- KnitInfo Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    website VARCHAR(255),
    address TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    products TEXT[] DEFAULT '{}',
    certifications TEXT,
    gst_number VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Priorities Table
CREATE TABLE IF NOT EXISTS priorities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    position INTEGER NOT NULL,
    priority_type VARCHAR(50) NOT NULL CHECK (priority_type IN ('permanent', 'temporary')),
    duration INTEGER,
    duration_type VARCHAR(50) CHECK (duration_type IN ('days', 'months', 'years')),
    expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255)
);

-- Form Submissions Table
CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('add-data', 'advertise', 'collaborate')),
    form_data JSONB NOT NULL,
    attachments TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by VARCHAR(255),
    review_notes TEXT
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Excel Uploads Table
CREATE TABLE IF NOT EXISTS excel_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT,
    category VARCHAR(100),
    uploaded_by VARCHAR(255),
    status VARCHAR(50) DEFAULT 'processing',
    records_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    errors TEXT[],
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Error Logs Table
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    error_message TEXT NOT NULL,
    error_stack TEXT,
    context JSONB,
    severity VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Metrics Table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_type VARCHAR(100),
    duration INTEGER,
    endpoint VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Books Table
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    cover_image TEXT,
    stock INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- App Settings Table
CREATE TABLE IF NOT EXISTS app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_category ON companies(category);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_companies_category_status ON companies(category, status);

CREATE INDEX IF NOT EXISTS idx_priorities_category ON priorities(category);
CREATE INDEX IF NOT EXISTS idx_priorities_status ON priorities(status);
CREATE INDEX IF NOT EXISTS idx_priorities_position ON priorities(position);
CREATE INDEX IF NOT EXISTS idx_priorities_expires_at ON priorities(expires_at);

CREATE INDEX IF NOT EXISTS idx_submissions_type ON form_submissions(type);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON form_submissions(submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contact_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_book_id ON orders(book_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_settings_key ON app_settings(key);

CREATE INDEX IF NOT EXISTS idx_excel_uploads_status ON excel_uploads(status);
CREATE INDEX IF NOT EXISTS idx_excel_uploads_uploaded_at ON excel_uploads(uploaded_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_duration ON performance_metrics(duration DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON performance_metrics(created_at DESC);

-- Insert sample data
INSERT INTO companies (company_name, contact_person, email, phone, address, category, description, products, status)
VALUES 
    ('ABC Textiles Ltd', 'John Doe', 'john@abctextiles.com', '+91 9876543210', 
     '123 Industrial Area, Tirupur, Tamil Nadu', 'Yarn', 
     'Leading yarn manufacturer specializing in cotton and polyester yarns', 
     ARRAY['Cotton Yarn', 'Polyester Yarn'], 'active'),
    ('Global Yarn Suppliers', 'Jane Smith', 'jane@globalyarn.com', '+91 9876543212',
     '789 Export Zone, Chennai, Tamil Nadu', 'Yarn',
     'Premium yarn suppliers with focus on organic and recycled materials',
     ARRAY['Organic Cotton', 'Recycled Yarn'], 'active');

-- Insert categories
INSERT INTO categories (name, slug, display_order, is_active) VALUES
    ('Yarn', 'yarn', 1, true),
    ('Fabric Suppliers', 'fabric-suppliers', 2, true),
    ('Knitting', 'knitting', 3, true),
    ('Buying Agents', 'buying-agents', 4, true),
    ('Printing', 'printing', 5, true),
    ('Threads', 'threads', 6, true),
    ('Trims & Accessories', 'trims-accessories', 7, true),
    ('Dyes & Chemicals', 'dyes-chemicals', 8, true),
    ('Machineries', 'machineries', 9, true),
    ('Machine Spares', 'machine-spares', 10, true);

-- Insert sample books
INSERT INTO books (title, author, description, price, category, stock, status) VALUES
    ('Textile Manufacturing Guide', 'Dr. Rajesh Kumar', 'Comprehensive guide to textile manufacturing processes', 599.00, 'Technical', 50, 'active'),
    ('Knitting Patterns Encyclopedia', 'Priya Sharma', 'Complete collection of knitting patterns and techniques', 799.00, 'Design', 30, 'active');

-- Insert app settings
INSERT INTO app_settings (key, value) VALUES
    ('general', '{"siteName": "KnitInfo Directory", "contactEmail": "info@knitinfo.com", "contactPhone": "+91 9943632229"}'::jsonb),
    ('homepage_slides', '{"slides": [{"image": "/s1.jpg", "caption": "Welcome to KnitInfo"}, {"image": "/s2.jpg", "caption": "Textile Industry Directory"}, {"image": "/s3.jpg", "caption": "Connect with Suppliers"}]}'::jsonb);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for companies table
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for books table
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for companies
CREATE POLICY "Public can read active companies" ON companies
    FOR SELECT USING (status = 'active');

-- Public read access for priorities
CREATE POLICY "Public can read active priorities" ON priorities
    FOR SELECT USING (status = 'active');

-- Public read access for categories
CREATE POLICY "Public can read active categories" ON categories
    FOR SELECT USING (is_active = true);

-- Public read access for books
CREATE POLICY "Public can read active books" ON books
    FOR SELECT USING (status = 'active');

-- Public read access for app settings
CREATE POLICY "Public can read app settings" ON app_settings
    FOR SELECT USING (true);

-- Public can create submissions and contacts
CREATE POLICY "Public can create submissions" ON form_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create contacts" ON contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Note: For admin operations, you'll need to create policies based on your auth setup
-- Example: CREATE POLICY "Admins can do everything" ON companies FOR ALL USING (auth.role() = 'admin');
