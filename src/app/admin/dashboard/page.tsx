'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  Settings,
  LogOut,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Database,
  Megaphone,
  Handshake,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Cloud,
  CloudOff,
  RefreshCw
} from 'lucide-react';
import { usePriorities, useFormSubmissions, useDataService } from '../../../hooks/useLocalStorage';

interface AddDataSubmission {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  category: string;
  description: string;
  products?: string;
  certifications?: string;
  gstNumber?: string;
  visitingCardName?: string;
  submittedAt: string;
  type: string;
}

interface AdvertiseSubmission {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  category: string;
  adType: string;
  budget?: string;
  message?: string;
  submittedAt: string;
  type: string;
}

interface CollaborateSubmission {
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  organizationType: string;
  collaborationType: string;
  projectDescription: string;
  timeline?: string;
  budget?: string;
  experience?: string;
  submittedAt: string;
  type: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'add-data' | 'advertise' | 'collaborate' | 'priority'>('overview');
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [priorityForm, setPriorityForm] = useState({
    companyName: '',
    category: '',
    position: '',
    priorityType: 'permanent', // permanent or temporary
    duration: '',
    durationType: 'days' // days, months, years
  });
  const [editingPriority, setEditingPriority] = useState<any>(null);
  const router = useRouter();

  // Use local storage hooks
  const { isReady, isOffline } = useDataService();
  const { priorities, loading: prioritiesLoading, createPriority, updatePriority, deletePriority, reload: reloadPriorities } = usePriorities();
  const { submissions: allSubmissions, loading: submissionsLoading, reload: reloadSubmissions } = useFormSubmissions();

  // Filter submissions by type with proper typing
  const addDataSubmissions = allSubmissions
    .filter(s => s.type === 'add-data')
    .map(s => ({ ...s.formData, type: s.type, submittedAt: s.submittedAt } as AddDataSubmission));
  
  const advertiseSubmissions = allSubmissions
    .filter(s => s.type === 'advertise')
    .map(s => ({ ...s.formData, type: s.type, submittedAt: s.submittedAt } as AdvertiseSubmission));
  
  const collaborateSubmissions = allSubmissions
    .filter(s => s.type === 'collaborate')
    .map(s => ({ ...s.formData, type: s.type, submittedAt: s.submittedAt } as CollaborateSubmission));

  const categories = [
    'Yarn',
    'Fabric Suppliers',
    'Knitting',
    'Buying Agents',
    'Printing',
    'Threads',
    'Trims & Accessories',
    'Dyes & Chemicals',
    'Machineries',
    'Machine Spares'
  ];

  useEffect(() => {
    const auth = localStorage.getItem('adminAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      router.push('/admin');
    }
  }, [router]);

  const calculateExpiryDate = (duration: string, durationType: string) => {
    const now = new Date();
    const durationNum = parseInt(duration);
    
    switch (durationType) {
      case 'days':
        return new Date(now.getTime() + durationNum * 24 * 60 * 60 * 1000);
      case 'months':
        return new Date(now.setMonth(now.getMonth() + durationNum));
      case 'years':
        return new Date(now.setFullYear(now.getFullYear() + durationNum));
      default:
        return null;
    }
  };

  const handlePrioritySubmit = async () => {
    if (!priorityForm.companyName || !priorityForm.category || !priorityForm.position) {
      alert('Please fill all required fields');
      return;
    }

    if (priorityForm.priorityType === 'temporary' && !priorityForm.duration) {
      alert('Please specify duration for temporary priority');
      return;
    }

    const expiresAt = priorityForm.priorityType === 'temporary' 
      ? calculateExpiryDate(priorityForm.duration, priorityForm.durationType)
      : null;

    const priorityData = {
      companyId: `local-${priorityForm.companyName.replace(/\s+/g, '-').toLowerCase()}`,
      companyName: priorityForm.companyName,
      category: priorityForm.category,
      position: parseInt(priorityForm.position),
      priorityType: priorityForm.priorityType as 'permanent' | 'temporary',
      duration: priorityForm.duration ? parseInt(priorityForm.duration) : undefined,
      durationType: priorityForm.durationType as 'days' | 'months' | 'years',
      expiresAt: expiresAt ? { toDate: () => expiresAt } as any : null,
      createdBy: 'admin',
      status: 'active' as const
    };

    try {
      if (editingPriority) {
        await updatePriority(editingPriority.id, priorityData);
      } else {
        await createPriority(priorityData);
      }

      // Reset form
      setPriorityForm({
        companyName: '',
        category: '',
        position: '',
        priorityType: 'permanent',
        duration: '',
        durationType: 'days'
      });
      setEditingPriority(null);
      setShowPriorityModal(false);
    } catch (error) {
      console.error('Error saving priority:', error);
      alert('Error saving priority. Please try again.');
    }
  };

  const editPriority = (priority: any) => {
    setPriorityForm({
      companyName: priority.companyName,
      category: priority.category,
      position: priority.position.toString(),
      priorityType: priority.priorityType,
      duration: priority.duration?.toString() || '',
      durationType: priority.durationType || 'days'
    });
    setEditingPriority(priority);
    setShowPriorityModal(true);
  };

  const handleDeletePriority = async (id: string) => {
    try {
      await deletePriority(id);
    } catch (error) {
      console.error('Error deleting priority:', error);
      alert('Error deleting priority. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel') {
        setSelectedFile(file);
        setUploadStatus('idle');
        setUploadMessage('');
      } else {
        setUploadMessage('Please select a valid Excel file (.xlsx or .xls)');
        setUploadStatus('error');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedCategory) {
      setUploadMessage('Please select both a file and category');
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    setUploadMessage('Uploading and processing file...');

    try {
      // Step 1: Delete all existing companies in this category
      console.log(`Step 1: Deleting existing companies in ${selectedCategory} category...`);
      setUploadMessage(`Deleting existing ${selectedCategory} companies...`);
      
      const supabase = (await import('@/lib/supabase')).default;
      const { data: existingCompanies, error: fetchError } = await supabase
        .from('companies')
        .select('id, company_name')
        .eq('category', selectedCategory);

      if (fetchError) {
        console.error('Error fetching existing companies:', fetchError);
        throw new Error(`Failed to fetch existing companies: ${fetchError.message}`);
      }

      const existingCount = existingCompanies?.length || 0;
      console.log(`Found ${existingCount} existing companies to delete`);

      if (existingCount > 0) {
        const { error: deleteError } = await supabase
          .from('companies')
          .delete()
          .eq('category', selectedCategory);

        if (deleteError) {
          console.error('Error deleting existing companies:', deleteError);
          throw new Error(`Failed to delete existing companies: ${deleteError.message}`);
        }

        console.log(`✅ Deleted ${existingCount} existing companies`);
      }

      // Step 2: Read and process Excel file
      console.log('Step 2: Reading Excel file...');
      setUploadMessage('Reading Excel file...');
      
      const XLSX = await import('xlsx');
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log('Excel data loaded:', jsonData.length, 'rows');
      console.log('First row sample:', jsonData[0]);
      console.log('Available columns:', Object.keys(jsonData[0] || {}));

      // Check if products column exists
      const firstRow = jsonData[0] as any;
      const hasProductsColumn = firstRow && (
        'PRODUCTS' in firstRow || 
        'Products' in firstRow || 
        'products' in firstRow || 
        'PRODUCT' in firstRow
      );
      
      if (!hasProductsColumn) {
        console.warn('⚠️ WARNING: No PRODUCTS column found in Excel file!');
        console.warn('Available columns:', Object.keys(firstRow || {}));
        console.warn('Products will be empty for all companies.');
      }

      // Process each row and create companies
      const companiesAPI = (await import('@/lib/api')).companiesAPI;
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const row of jsonData) {
        try {
          // Helper function to get value from multiple possible column names
          const getValue = (keys: string[]) => {
            for (const key of keys) {
              const value = (row as any)[key];
              if (value !== undefined && value !== null && value !== '') return String(value).trim();
            }
            return '';
          };

          // Clean phone number - remove extra spaces and limit length
          const cleanPhone = (phone: string) => {
            return phone.replace(/\s+/g, ' ').substring(0, 50);
          };

          const companyData = {
            companyName: getValue(['COMPANY NAME', 'Company Name', 'companyName', 'COMPANY_NAME', 'NAME']),
            contactPerson: getValue(['CONTACT PERSON', 'Contact Person', 'contactPerson', 'CONTACT']),
            email: getValue(['E-MAIL ID', 'EMAIL ID', 'Email', 'email', 'EMAIL']),
            phone: cleanPhone(getValue(['PHONE NUMBER', 'Phone Number', 'phone', 'PHONE', 'NUMBER'])),
            address: getValue(['ADDRESS', 'Address', 'address']),
            category: selectedCategory,
            description: getValue(['DESCRIPTION', 'Description', 'description']),
            products: (() => {
              const productsStr = getValue(['PRODUCTS', 'Products', 'products', 'PRODUCT']);
              if (!productsStr) return [];
              // Split by comma and clean up each product
              const productArray = productsStr.split(',').map((p: string) => p.trim()).filter((p: string) => p.length > 0);
              console.log('Products parsed:', productsStr, '→', productArray);
              return productArray;
            })(),
            website: getValue(['WEBSITE', 'Website', 'website']),
            certifications: getValue(['CERTIFICATIONS', 'Certifications', 'certifications']),
            gstNumber: getValue(['GST NUMBER', 'GST Number', 'gstNumber', 'GST']).substring(0, 50),
            status: 'active'
          };

          console.log('Processing company:', companyData.companyName, 'Products:', companyData.products);

          // Only create if company name exists
          if (companyData.companyName && companyData.companyName.trim()) {
            try {
              const result = await companiesAPI.create(companyData);
              console.log('Company created:', result);
              successCount++;
            } catch (apiError: any) {
              console.error('API error, trying direct Supabase insert:', apiError);
              
              // Fallback: Direct Supabase insert
              try {
                const supabase = (await import('@/lib/supabase')).default;
                const { data, error: supabaseError } = await supabase
                  .from('companies')
                  .insert([{
                    company_name: companyData.companyName,
                    contact_person: companyData.contactPerson || '',
                    email: companyData.email || '',
                    phone: companyData.phone || '',
                    address: companyData.address || '',
                    category: companyData.category,
                    description: companyData.description || '',
                    products: companyData.products || [],
                    website: companyData.website || '',
                    certifications: companyData.certifications || '',
                    gst_number: companyData.gstNumber || '',
                    status: companyData.status || 'active'
                  }])
                  .select();
                
                if (supabaseError) {
                  throw supabaseError;
                }
                
                console.log('Company created via Supabase:', data);
                successCount++;
              } catch (supabaseError: any) {
                console.error('Supabase error:', supabaseError);
                errors.push(`${companyData.companyName}: ${supabaseError.message}`);
                errorCount++;
              }
            }
          } else {
            console.warn('Skipping row - no company name. Available keys:', Object.keys(row as object));
          }
        } catch (error: any) {
          console.error('Error creating company:', error);
          errors.push(error.message || 'Unknown error');
          errorCount++;
        }
      }

      console.log('Upload complete:', { successCount, errorCount, errors });

      let message = `Successfully replaced ${selectedCategory} data! `;
      if (existingCount > 0) {
        message += `Deleted ${existingCount} old companies. `;
      }
      message += `Added ${successCount} new companies`;
      if (errorCount > 0) {
        message += `, ${errorCount} errors`;
      }
      if (!hasProductsColumn) {
        message += `. ⚠️ Note: No PRODUCTS column found in Excel - products will be empty.`;
      }

      setUploadStatus('success');
      setUploadMessage(message);
      
      // Reset form after success
      setTimeout(() => {
        setSelectedFile(null);
        setSelectedCategory('');
        setUploadStatus('idle');
        setUploadMessage('');
        setShowUploadModal(false);
      }, 3000);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setUploadMessage(`Upload failed: ${error.message || 'Unknown error'}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1e3a8a]"></div>
      </div>
    );
  }

  const stats = [
    { title: 'Add Data Requests', value: addDataSubmissions.length.toString(), icon: Database, color: 'bg-blue-500' },
    { title: 'Advertise Requests', value: advertiseSubmissions.length.toString(), icon: Megaphone, color: 'bg-green-500' },
    { title: 'Collaborate Requests', value: collaborateSubmissions.length.toString(), icon: Handshake, color: 'bg-purple-500' },
    { title: 'Priority Companies', value: priorities.length.toString(), icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const recentOrders = [
    { id: 1, book: 'Textile Industry Guide', customer: 'John Doe', amount: '$500', status: 'Completed' },
    { id: 2, book: 'Advanced Knitting Techniques', customer: 'Jane Smith', amount: '$25', status: 'Pending' },
    { id: 3, book: 'Fabric Science & Technology', customer: 'Mike Johnson', amount: '$40', status: 'Processing' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">KnitInfo Directory Management</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Firebase Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm">
                {isReady ? (
                  isOffline ? (
                    <>
                      <CloudOff size={16} className="text-orange-500" />
                      <span className="text-orange-600">Offline</span>
                    </>
                  ) : (
                    <>
                      <Cloud size={16} className="text-green-500" />
                      <span className="text-green-600">Firebase Connected</span>
                    </>
                  )
                ) : (
                  <>
                    <Database size={16} className="text-gray-500" />
                    <span className="text-gray-600">Local Storage</span>
                  </>
                )}
              </div>
              
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e3a8a]/90 transition-colors"
              >
                <Upload size={20} />
                <span>Upload Excel</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
                 onClick={() => {
                   if (index === 0) setActiveTab('add-data');
                   else if (index === 1) setActiveTab('advertise');
                   else if (index === 2) setActiveTab('collaborate');
                   else if (index === 3) setActiveTab('priority');
                   else setActiveTab('overview');
                 }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('add-data')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'add-data'
                  ? 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Add Data ({addDataSubmissions.length})
            </button>
            <button
              onClick={() => setActiveTab('advertise')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'advertise'
                  ? 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Advertise ({advertiseSubmissions.length})
            </button>
            <button
              onClick={() => setActiveTab('collaborate')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'collaborate'
                  ? 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Collaborate ({collaborateSubmissions.length})
            </button>
            <button
              onClick={() => setActiveTab('priority')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'priority'
                  ? 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Priority ({priorities.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
        <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.book}</h3>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{order.amount}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
                  <BookOpen className="text-blue-600 mb-2" size={24} />
                  <h3 className="font-semibold text-gray-900">Manage Books</h3>
                  <p className="text-sm text-gray-600">Add, edit, or remove books</p>
                </button>
                
                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
                  <Users className="text-green-600 mb-2" size={24} />
                  <h3 className="font-semibold text-gray-900">User Management</h3>
                  <p className="text-sm text-gray-600">View and manage users</p>
                </button>
                
                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
                  <MessageSquare className="text-purple-600 mb-2" size={24} />
                  <h3 className="font-semibold text-gray-900">Messages</h3>
                  <p className="text-sm text-gray-600">View customer inquiries</p>
                </button>
                
                <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left">
                  <Settings className="text-orange-600 mb-2" size={24} />
                  <h3 className="font-semibold text-gray-900">Settings</h3>
                  <p className="text-sm text-gray-600">Configure app settings</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Info - Only in overview */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700">Application</h3>
              <p className="text-gray-600">KnitInfo Directory v1.0</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Last Updated</h3>
              <p className="text-gray-600">January 31, 2026</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Status</h3>
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Online
              </span>
            </div>
          </div>
        </div>
        </div>
        )}

        {/* Add Data Submissions Tab */}
        {activeTab === 'add-data' && (
          <div className="space-y-4">
            {submissionsLoading ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading submissions...</p>
              </div>
            ) : addDataSubmissions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Database size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No add data submissions yet</p>
              </div>
            ) : (
              addDataSubmissions.map((submission, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{submission.companyName}</h3>
                      <p className="text-sm text-gray-700">
                        <Calendar size={14} className="inline mr-1" />
                        {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                      {submission.category}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-600" />
                      <span className="text-gray-700">Contact:</span>
                      <span className="font-medium text-gray-900">{submission.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-600" />
                      <span className="text-gray-700">Phone:</span>
                      <a href={`tel:${submission.phone}`} className="font-medium text-blue-700 hover:underline">{submission.phone}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-600" />
                      <span className="text-gray-700">Email:</span>
                      <a href={`mailto:${submission.email}`} className="font-medium text-blue-700 hover:underline">{submission.email}</a>
                    </div>
                    {submission.gstNumber && (
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-600" />
                        <span className="text-gray-700">GST:</span>
                        <span className="font-medium text-gray-900">{submission.gstNumber}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin size={16} className="text-gray-600 mt-0.5" />
                      <p className="text-sm text-gray-800 font-medium">{submission.address}</p>
                    </div>
                    <p className="text-sm text-gray-800 mt-2">{submission.description}</p>
                    {submission.products && (
                      <div className="mt-2">
                        <span className="text-sm font-bold text-gray-900">Products: </span>
                        <span className="text-sm text-gray-800">{submission.products}</span>
                      </div>
                    )}
                    {submission.visitingCardName && (
                      <div className="mt-2 text-sm text-gray-800">
                        <FileText size={14} className="inline mr-1" />
                        Visiting Card: {submission.visitingCardName}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Advertise Submissions Tab */}
        {activeTab === 'advertise' && (
          <div className="space-y-4">
            {submissionsLoading ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading submissions...</p>
              </div>
            ) : advertiseSubmissions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Megaphone size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No advertising requests yet</p>
              </div>
            ) : (
              advertiseSubmissions.map((submission, index) => (
                <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{submission.companyName}</h3>
                      <p className="text-sm text-gray-500">
                        <Calendar size={14} className="inline mr-1" />
                        {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {submission.adType}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-medium">{submission.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-gray-600">Phone:</span>
                      <a href={`tel:${submission.phone}`} className="font-medium text-blue-600 hover:underline">{submission.phone}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-gray-600">Email:</span>
                      <a href={`mailto:${submission.email}`} className="font-medium text-blue-600 hover:underline">{submission.email}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{submission.category}</span>
                    </div>
                  </div>
                  
                  {submission.budget && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">Budget: </span>
                      <span className="text-sm text-gray-600">{submission.budget}</span>
                    </div>
                  )}
                  {submission.message && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-700">{submission.message}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Collaborate Submissions Tab */}
        {activeTab === 'collaborate' && (
          <div className="space-y-4">
            {submissionsLoading ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading submissions...</p>
              </div>
            ) : collaborateSubmissions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Handshake size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No collaboration proposals yet</p>
              </div>
            ) : (
              collaborateSubmissions.map((submission, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{submission.organizationName}</h3>
                      <p className="text-sm text-gray-500">
                        <Calendar size={14} className="inline mr-1" />
                        {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      {submission.collaborationType}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-medium">{submission.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-gray-600">Phone:</span>
                      <a href={`tel:${submission.phone}`} className="font-medium text-blue-600 hover:underline">{submission.phone}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-gray-600">Email:</span>
                      <a href={`mailto:${submission.email}`} className="font-medium text-blue-600 hover:underline">{submission.email}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{submission.organizationType}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Project Description:</h4>
                    <p className="text-sm text-gray-700 mb-3">{submission.projectDescription}</p>
                    
                    {submission.timeline && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700">Timeline: </span>
                        <span className="text-sm text-gray-600">{submission.timeline}</span>
                      </div>
                    )}
                    {submission.budget && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700">Budget: </span>
                        <span className="text-sm text-gray-600">{submission.budget}</span>
                      </div>
                    )}
                    {submission.experience && (
                      <div className="mt-3">
                        <h4 className="font-semibold text-gray-900 mb-1">Experience:</h4>
                        <p className="text-sm text-gray-700">{submission.experience}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Priority Management Tab */}
        {activeTab === 'priority' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Company Priority Management</h2>
              <button
                onClick={() => setShowPriorityModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e3a8a]/90 transition-colors"
              >
                <TrendingUp size={20} />
                <span>Add Priority</span>
              </button>
            </div>

            <div className="space-y-4">
              {prioritiesLoading ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading priorities...</p>
                </div>
              ) : priorities.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No priority companies set</p>
                  <p className="text-gray-500 text-sm mt-2">Add companies to prioritize them in search results</p>
                </div>
              ) : (
                priorities
                  .sort((a, b) => a.position - b.position)
                  .map((priority) => {
                    const isExpired = priority.expiresAt && new Date() > new Date(priority.expiresAt);
                    const daysLeft = priority.expiresAt 
                      ? Math.ceil((new Date(priority.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                      : null;
                    
                    return (
                    <div key={priority.id} className={`bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow ${isExpired ? 'opacity-60' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="flex items-center justify-center w-8 h-8 bg-[#1e3a8a] text-white rounded-full text-sm font-bold">
                              {priority.position}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900">{priority.companyName}</h3>
                            <span className={`px-3 py-1 text-sm rounded-full ${
                              priority.priorityType === 'permanent' 
                                ? 'bg-green-100 text-green-800' 
                                : isExpired 
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {priority.priorityType === 'permanent' 
                                ? 'Permanent' 
                                : isExpired 
                                  ? 'Expired' 
                                  : `Temporary (${daysLeft}d left)`
                              }
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">Category:</span>
                              <span className="font-medium">{priority.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-gray-400" />
                              <span className="text-gray-600">Added:</span>
                              <span className="font-medium">
                                {new Date(priority.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {priority.expiresAt && (
                              <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                <span className="text-gray-600">Expires:</span>
                                <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                                  {new Date(priority.expiresAt).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-4 flex gap-2">
                          <button
                            onClick={() => editPriority(priority)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => priority.id && handleDeletePriority(priority.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    );
                  })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Priority Modal */}
      {showPriorityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingPriority ? 'Edit Company Priority' : 'Set Company Priority'}
                </h2>
                <button
                  onClick={() => {
                    setShowPriorityModal(false);
                    setEditingPriority(null);
                    setPriorityForm({
                      companyName: '',
                      category: '',
                      position: '',
                      priorityType: 'permanent',
                      duration: '',
                      durationType: 'days'
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={priorityForm.companyName}
                  onChange={(e) => setPriorityForm({...priorityForm, companyName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none text-gray-900 placeholder-gray-500"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={priorityForm.category}
                  onChange={(e) => setPriorityForm({...priorityForm, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none text-gray-900 bg-white"
                >
                  <option value="" className="text-gray-500">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category} className="text-gray-900">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority Position *
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={priorityForm.position}
                  onChange={(e) => setPriorityForm({...priorityForm, position: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none text-gray-900 placeholder-gray-500"
                  placeholder="Enter position (1 = highest priority)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPriorityForm({...priorityForm, priorityType: 'permanent'})}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      priorityForm.priorityType === 'permanent'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">Permanent</div>
                      <div className="text-xs text-gray-600">Always prioritized</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriorityForm({...priorityForm, priorityType: 'temporary'})}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      priorityForm.priorityType === 'temporary'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">Temporary</div>
                      <div className="text-xs text-gray-600">Time-limited priority</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Duration fields for temporary priority */}
              {priorityForm.priorityType === 'temporary' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      min="1"
                      value={priorityForm.duration}
                      onChange={(e) => setPriorityForm({...priorityForm, duration: e.target.value})}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
                      placeholder="Enter number"
                    />
                    <select
                      value={priorityForm.durationType}
                      onChange={(e) => setPriorityForm({...priorityForm, durationType: e.target.value})}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
                    >
                      <option value="days">Days</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Priority will automatically expire after this duration
                  </p>
                </div>
              )}

              <button
                onClick={handlePrioritySubmit}
                className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <TrendingUp size={20} />
                <span>{editingPriority ? 'Update Priority' : 'Set Priority'}</span>
              </button>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">How Priority Works:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Position 1 = Highest priority (appears first)</li>
                  <li>• Permanent: Always stays at set position until manually removed</li>
                  <li>• Temporary: Automatically expires after specified duration</li>
                  <li>• Companies appear in order of their position number</li>
                  <li>• You can edit or remove priorities anytime</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Upload Excel File</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none text-gray-900 bg-white"
                >
                  <option value="" className="text-gray-500">Choose a category...</option>
                  {categories.map((category) => (
                    <option key={category} value={category} className="text-gray-900">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Excel File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1e3a8a] transition-colors">
                  <FileSpreadsheet size={48} className="mx-auto text-gray-400 mb-4" />
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="excel-upload"
                  />
                  <label
                    htmlFor="excel-upload"
                    className="cursor-pointer text-[#1e3a8a] hover:text-[#1e3a8a]/80 font-medium"
                  >
                    Click to select Excel file
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Supports .xlsx and .xls files
                  </p>
                  {selectedFile && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">
                        Selected: {selectedFile.name}
                      </p>
                      <p className="text-xs text-blue-600">
                        Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Message */}
              {uploadMessage && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                  uploadStatus === 'success' ? 'bg-green-50 text-green-800' :
                  uploadStatus === 'error' ? 'bg-red-50 text-red-800' :
                  'bg-blue-50 text-blue-800'
                }`}>
                  {uploadStatus === 'success' && <CheckCircle size={20} />}
                  {uploadStatus === 'error' && <AlertCircle size={20} />}
                  {uploadStatus === 'uploading' && (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <p className="text-sm">{uploadMessage}</p>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || !selectedCategory || uploadStatus === 'uploading'}
                className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>Replace {selectedCategory || 'Category'} Data</span>
                  </>
                )}
              </button>

              {/* Warning Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">⚠️ Important Notice</h4>
                    <p className="text-sm text-yellow-800">
                      Uploading will <strong>DELETE ALL existing companies</strong> in the selected category and replace them with the new Excel data. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Excel Format Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Column A: Company Name</li>
                  <li>• Column B: Contact Person</li>
                  <li>• Column C: Phone Number</li>
                  <li>• Column D: Email Address</li>
                  <li>• Column E: Address</li>
                  <li>• Column F: Description</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
