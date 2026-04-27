import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { 
  Users, ShoppingBag, Package, 
  TrendingUp, RefreshCcw, Eye, Shield, 
  ChevronRight, Plus, X, Upload, Trash2, Edit,
  CheckCircle2, Truck, Award, GraduationCap, Ticket, Calendar, DollarSign, MapPin, Share2
} from 'lucide-react';
import { API_URL } from '../config';
import MapView from './MapView';




// Import local assets for mapping in inventory (REMOVED HARDCODED)

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: { _id: string, name: string } | string;
  stock: number;
  featured: boolean;
  warranty?: string;
  deliveryInfo?: string;
  colors?: string[];
  specs?: Record<string, string>;
}

interface Category {
  _id: string;
  name: string;
}

export default function AdminPanel() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'services' | 'college-projects' | 'coupons' | 'referrals' | 'battle'>('users');
  const [statsData, setStatsData] = useState({ totalRevenue: 0, totalOrders: 0 });


  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [collegeProjects, setCollegeProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingUpdate, setTrackingUpdate] = useState({ status: '', location: '', description: '' });
  const [battleForm, setBattleForm] = useState({ product1Id: '', product2Id: '' });

  const fetchBattle = async () => {
    try {
      const res = await fetch(`${API_URL}/api/battle`);
      const data = await res.json();
      if (res.ok) {
        setBattleForm({
          product1Id: data?.product1?._id || '',
          product2Id: data?.product2?._id || ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBattleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!battleForm.product1Id || !battleForm.product2Id) {
      showToast('Please select both products', 'error');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/battle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(battleForm)
      });
      if (res.ok) {
        showToast('Battle of the Bots updated!', 'success');
        fetchBattle();
      }
    } catch (err) {
      showToast('Failed to update battle', 'error');
    }
  };

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCollegeProjectModalOpen, setIsCollegeProjectModalOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);


  
  // Multi-step Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '10',
    featured: false,
    warranty: '2 Year Warranty',
    deliveryInfo: 'Express Delivery',
    colors: ['Red', 'White', 'Black'] as string[],
    specs: [] as { key: string, value: string }[],
    existingImages: [] as string[]
  });
  const [productImages, setProductImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingCollegeProjectId, setEditingCollegeProjectId] = useState<string | null>(null);

  const [collegeProjectForm, setCollegeProjectForm] = useState({
    name: '',
    tagline: '',
    price: '',
    originalPrice: '',
    description: '',
    difficultyLevel: 'Intermediate',
    demoLink: '',
    whatYouWillBuild: [''],
    whatYouWillGet: [''],
    useCases: [''],
    supportDetails: [''],
    techStack: [{ key: '', value: '' }]
  });

  const [couponForm, setCouponForm] = useState({
    code: '',
    discountAmount: '',
    expiryDate: '',
    targetUser: '',
    isAllUsers: true
  });



  // Helper to get color name from hex
  const fetchColorName = async (hex: string) => {
    try {
      const cleanHex = hex.replace('#', '');
      const response = await fetch(`https://www.thecolorapi.com/id?hex=${cleanHex}`);
      const data = await response.json();
      return data.name.value;
    } catch (error) {
      return 'Custom Color';
    }
  };

  // Helper to map assets for products in admin
  const getLocalImage = (product: any) => {
    return (product.images && product.images.length > 0) ? product.images[0] : '';
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'products') {
      fetchProducts();
      fetchCategories();
    }
    if (activeTab === 'college-projects') fetchCollegeProjects();
    if (activeTab === 'coupons') fetchCoupons();
    if (activeTab === 'services') fetchOrders();
    fetchStats();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('insforgeToken');
      const response = await fetch(`${API_URL}/api/orders/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setStatsData(data);
    } catch (error) { console.error('Error fetching stats:', error); }
  };



  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('insforgeToken');

      const response = await fetch(`${API_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setUsers(data);
    } catch (error) { console.error('Error fetching users:', error); }
  };


  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);

      const data = await response.json();
      if (response.ok) setProducts(data);
    } catch (error) { console.error('Error fetching products:', error); }
  };


  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      const data = await response.json();
      if (response.ok) setCategories(data);
    } catch (error) { console.error('Error fetching categories:', error); }
  };

  const fetchCollegeProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/college-projects`);
      const data = await response.json();
      if (response.ok) setCollegeProjects(data);
    } catch (error) { console.error('Error fetching college projects:', error); }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('insforgeToken');
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setOrders(data);
    } catch (error) { console.error('Error fetching orders:', error); }
  };

  const updateOrderStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('insforgeToken');
      const response = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          status: trackingUpdate.status,
          tracking: {
            location: trackingUpdate.location,
            description: trackingUpdate.description
          }
        })
      });
      if (response.ok) {
        showToast('Order status updated', 'success');
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (error) { console.error('Error updating order:', error); }
  };

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('insforgeToken');
      const response = await fetch(`${API_URL}/api/coupons`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setCoupons(data);
    } catch (error) { console.error('Error fetching coupons:', error); }
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('insforgeToken');
      const response = await fetch(`${API_URL}/api/coupons`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(couponForm)
      });
      if (response.ok) {
        setIsCouponModalOpen(false);
        setCouponForm({ code: '', discountAmount: '', expiryDate: '', targetUser: '', isAllUsers: true });
        fetchCoupons();
      }
    } catch (error) { console.error('Error saving coupon:', error); }
    finally { setIsSubmitting(false); }
  };

  const deleteCoupon = async (id: string) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const token = localStorage.getItem('insforgeToken');
      const response = await fetch(`${API_URL}/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchCoupons();
    } catch (error) { console.error('Error deleting coupon:', error); }
  };




  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Check for large files (> 10MB)
      const largeFiles = filesArray.filter(file => file.size > 10 * 1024 * 1024);
      if (largeFiles.length > 0) {
        showToast('Some images are too large (Max 10MB). Please compress them.', 'error');
        return;
      }

      if (productImages.length + filesArray.length > 5) {
        showToast('Max 5 images allowed.', 'error');
        return;
      }
      setProductImages([...productImages, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('originalPrice', productForm.originalPrice);
      formData.append('category', productForm.category);
      formData.append('stock', productForm.stock);
      formData.append('featured', String(productForm.featured));
      formData.append('warranty', productForm.warranty);
      formData.append('deliveryInfo', productForm.deliveryInfo);
      formData.append('colors', JSON.stringify(productForm.colors));
      
      const specsObj: Record<string, string> = {};
      productForm.specs.forEach(s => {
        if (s.key && s.value) specsObj[s.key] = s.value;
      });
      formData.append('specs', JSON.stringify(specsObj));
      
      productImages.forEach((file) => {
        formData.append('images', file);
      });

      const token = localStorage.getItem('insforgeToken');
      const url = editingProductId 
        ? `${API_URL}/api/products/${editingProductId}`
        : `${API_URL}/api/products`;
      
      const method = editingProductId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        setIsProductModalOpen(false);
        resetForm();
        fetchProducts();
        showToast(editingProductId ? 'Product updated' : 'Product created', 'success');
      } else {
        const error = await response.json();
        showToast('Error: ' + error.message, 'error');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCollegeProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(collegeProjectForm).forEach(([key, value]) => {
        if (['whatYouWillBuild', 'whatYouWillGet', 'useCases', 'supportDetails'].includes(key)) {
          formData.append(key, JSON.stringify((value as string[]).filter(v => v.trim() !== '')));
        } else if (key === 'techStack') {
          const techObj: Record<string, string> = {};
          (value as any[]).forEach(v => { if (v.key && v.value) techObj[v.key] = v.value; });
          formData.append(key, JSON.stringify(techObj));
        } else {
          formData.append(key, String(value));
        }
      });
      productImages.forEach(file => formData.append('images', file));

      const token = localStorage.getItem('insforgeToken');
      const url = editingCollegeProjectId 
        ? `${API_URL}/api/college-projects/${editingCollegeProjectId}`
        : `${API_URL}/api/college-projects`;
      
      const response = await fetch(url, {
        method: editingCollegeProjectId ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        setIsCollegeProjectModalOpen(false);
        resetCollegeProjectForm();
        fetchCollegeProjects();
      }
    } catch (error) { console.error('Error saving college project:', error); }
    finally { setIsSubmitting(false); }
  };

  const resetCollegeProjectForm = () => {
    setEditingCollegeProjectId(null);
    setCollegeProjectForm({
      name: '', tagline: '', price: '', originalPrice: '', description: '',
      difficultyLevel: 'Intermediate', demoLink: '',
      whatYouWillBuild: [''], whatYouWillGet: [''], useCases: [''], supportDetails: [''],
      techStack: [{ key: '', value: '' }]
    });
    setProductImages([]);
  };

  const deleteCollegeProject = async (id: string) => {
    if (!window.confirm('Delete this college project?')) return;
    try {
      const token = localStorage.getItem('insforgeToken');
      const response = await fetch(`${API_URL}/api/college-projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchCollegeProjects();
    } catch (error) { console.error('Error deleting college project:', error); }
  };


  const handleEditProduct = (product: any) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: (product.originalPrice || '').toString(),
      category: typeof product.category === 'object' ? product.category._id : product.category,
      specs: product.specs ? Object.entries(product.specs).map(([key, value]) => ({ key, value: String(value) })) : [{ key: '', value: '' }],
      stock: product.stock.toString(),
      featured: product.featured || false,
      warranty: product.warranty || '2 Year Warranty',
      deliveryInfo: product.deliveryInfo || 'Express Delivery',
      colors: product.colors || ['Red', 'White', 'Black'],
      existingImages: product.images || []
    });
    setProductImages([]);
    setIsProductModalOpen(true);
    setCurrentStep(1);
  };

  const resetForm = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      stock: '10',
      featured: false,
      warranty: '2 Year Warranty',
      deliveryInfo: 'Express Delivery',
      colors: ['Red', 'White', 'Black'],
      specs: [],
      existingImages: []
    });
    setProductImages([]);
    setCurrentStep(1);
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const token = localStorage.getItem('insforgeToken');
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchProducts();
    } catch (error) { console.error('Error deleting product:', error); }
  };

  const formatCurrency = (num: number) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num}`;
  };

  const stats = [
    { label: 'Total Users', value: users.length.toString(), icon: Users, status: '+12.5%', color: 'text-blue-500' },
    { label: 'Total Revenue', value: formatCurrency(statsData.totalRevenue), icon: TrendingUp, status: 'Steady', color: 'text-green-500' },
    { label: 'Orders', value: statsData.totalOrders.toString(), icon: ShoppingBag, status: 'Clear', color: 'text-orange-500' },
    { label: 'Products', value: products.length.toString(), icon: Package, status: 'Active', color: 'text-purple-500' },
  ];

  return (
    <div className="pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Platform Console</h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Shield size={14} className="text-primary" />
            <span>Root Admin Access</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>Last sync: Just now</span>
          </div>
        </motion.div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (activeTab === 'users') fetchUsers();
              if (activeTab === 'products') fetchProducts();
              if (activeTab === 'college-projects') fetchCollegeProjects();
              if (activeTab === 'battle') fetchBattle();
            }}

            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 shadow-sm hover:shadow-md transition-all"
          >
            <RefreshCcw size={16} />
            Refresh Control
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 sm:p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm group hover:shadow-xl transition-all duration-500"
          >
            <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color} w-fit mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-xl sm:text-3xl font-black text-slate-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 sm:gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'users', label: 'Users', icon: Users },
          { id: 'referrals', label: 'Referrals', icon: Share2 },
          { id: 'products', label: 'Products', icon: Package },
          { id: 'college-projects', label: 'College Projects', icon: GraduationCap },
          { id: 'coupons', label: 'Coupons', icon: Ticket },
          { id: 'services', label: 'Orders', icon: ShoppingBag },
          { id: 'battle', label: 'Comparison', icon: RefreshCcw },
        ].map((tab) => (


          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-slate-500 hover:bg-white hover:text-slate-900'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user._id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group" onClick={() => { setSelectedUser(user); setIsDetailsModalOpen(true); }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center text-slate-400 font-bold ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span>{user.name.charAt(0).toUpperCase()}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 truncate">{user.name}</h4>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{user.role}</p>
                  </div>
                  <div className="p-2 text-slate-300 group-hover:text-primary transition-colors">
                    <Eye size={20} />
                  </div>
                </div>
                <p className="text-sm text-slate-500 truncate mb-4">{user.email}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                  <Truck size={12} />
                  <span>{user.phone || 'No phone'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.filter(u => (u as any).referralCode || (u as any).referredBy).length > 0 ? (
              users.filter(u => (u as any).referralCode || (u as any).referredBy).map((user) => (
                <div key={user._id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group" onClick={() => { setSelectedUser(user); setIsDetailsModalOpen(true); }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-2xl" /> : <Share2 size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-slate-900 truncate">{user.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t border-slate-50">
                    {(user as any).referralCode && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Their Code</span>
                        <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">{(user as any).referralCode}</span>
                      </div>
                    )}
                    {(user as any).referredBy && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Referred By</span>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg truncate max-w-[120px]" title={(user as any).referredBy}>
                          {(user as any).referredBy}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <Share2 size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold">No referrals yet</p>
                <p className="text-slate-300 text-sm">When users generate or use referral codes, they will appear here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-slate-900">Order Pipeline</h3>
                <button onClick={fetchOrders} className="p-2 text-slate-400 hover:text-primary transition-colors">
                  <RefreshCcw size={18} />
                </button>
              </div>
              {orders.length === 0 ? (
                <div className="py-20 text-center">
                  <Package size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-bold">No orders yet</p>
                  <p className="text-slate-300 text-sm">Orders placed by customers will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                        <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                        <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                        <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.map((order) => (
                        <tr key={order._id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-5 font-bold text-sm text-slate-900 px-4">#{order.orderId}</td>
                          <td className="py-5 px-4">
                            <div 
                              className="flex items-center gap-3 cursor-pointer group/user"
                              onClick={() => { 
                                if (order.user) {
                                  setSelectedUser(order.user); 
                                  setIsDetailsModalOpen(true); 
                                }
                              }}
                            >
                              <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center text-slate-400 font-bold border border-slate-100 group-hover/user:border-primary/30 transition-all">
                                {order.user?.avatar ? (
                                  <img src={order.user.avatar} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xs">{order.user?.name?.charAt(0).toUpperCase() || 'C'}</span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-sm text-slate-900 group-hover/user:text-primary transition-colors">{order.user?.name || 'Customer'}</p>
                                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{order.user?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-4">
                            <p className="font-black text-sm text-primary">₹{order.total?.toLocaleString()}</p>
                            {order.couponCode && (
                              <p className="text-[9px] text-green-500 font-bold uppercase">
                                🎟 {order.couponCode} · –₹{order.discount}
                              </p>
                            )}
                          </td>
                          <td className="py-5 px-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              order.orderStatus === 'Delivered' ? 'bg-green-500/10 text-green-500' : 
                              order.orderStatus === 'Cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                            }`}>{order.orderStatus}</span>
                          </td>
                          <td className="py-5 px-4 text-[10px] text-slate-400 font-medium">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                          </td>
                          <td className="py-5 px-4">
                            <button 
                              onClick={() => { setSelectedOrder(order); setTrackingUpdate({ status: order.orderStatus, location: '', description: '' }); }}
                              className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-white hover:shadow-sm rounded-xl transition-all"
                            >
                              <Edit size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Inventory</h3>
                <p className="text-sm text-slate-500">Manage and list your robotics & 3D catalog.</p>
              </div>
              <button 
                onClick={() => { resetForm(); setIsProductModalOpen(true); }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all"
              >
                <Plus size={20} />
                List New Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product._id} className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-sm group hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img src={getLocalImage(product)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                        {typeof product.category === 'object' ? product.category.name : 'Uncategorized'}
                      </span>
                      {product.stock <= 5 && (
                        <span className="px-3 py-1 bg-red-500/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                          Low Stock
                        </span>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => handleEditProduct(product)} className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-slate-900 hover:bg-white transition-all shadow-sm">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteProduct(product._id)} className="p-2.5 bg-red-500/90 backdrop-blur-md rounded-full text-white hover:bg-red-600 transition-all shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-black text-slate-900 mb-2 truncate">{product.name}</h4>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-black text-primary">₹{product.price}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-slate-400 line-through">₹{product.originalPrice}</p>
                      )}
                    </div>
                    <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {product.images.slice(0, 3).map((img, i) => (
                            <img key={i} src={img} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {product.images.length > 1 ? `+${product.images.length - 1} More` : 'Main Photo'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                        <Award size={12} />
                        <span>In Stock</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'college-projects' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Academic Catalog</h3>
                <p className="text-sm text-slate-500">Manage your college project support kits.</p>
              </div>
              <button 
                onClick={() => { resetCollegeProjectForm(); setIsCollegeProjectModalOpen(true); }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all"
              >
                <Plus size={20} />
                Add New Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collegeProjects.map((project) => (
                <div key={project._id} className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-sm group hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img src={project.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => {
                        setEditingCollegeProjectId(project._id);
                        setCollegeProjectForm({
                          name: project.name, tagline: project.tagline, price: project.price.toString(), originalPrice: (project.originalPrice || '').toString(),
                          description: project.description || '', difficultyLevel: project.difficultyLevel || 'Intermediate', demoLink: project.demoLink || '',
                          whatYouWillBuild: project.whatYouWillBuild?.length ? project.whatYouWillBuild : [''],
                          whatYouWillGet: project.whatYouWillGet?.length ? project.whatYouWillGet : [''],
                          useCases: project.useCases?.length ? project.useCases : [''],
                          supportDetails: project.supportDetails?.length ? project.supportDetails : [''],
                          techStack: project.techStack ? Object.entries(project.techStack).map(([key, value]) => ({ key, value: String(value) })) : [{ key: '', value: '' }]
                        });
                        setIsCollegeProjectModalOpen(true);
                      }} className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-slate-900 hover:bg-white shadow-sm"><Edit size={16} /></button>
                      <button onClick={() => deleteCollegeProject(project._id)} className="p-2.5 bg-red-500/90 backdrop-blur-md rounded-full text-white hover:bg-red-600 shadow-sm"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-black text-slate-900 mb-2 truncate">{project.name}</h4>
                    <p className="text-2xl font-black text-primary">₹{project.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Promo Engine</h3>
                <p className="text-sm text-slate-500">Generate and track discount coupons.</p>
              </div>
              <button 
                onClick={() => setIsCouponModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all"
              >
                <Plus size={20} />
                Generate Coupon
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon) => (
                <div key={coupon._id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm group hover:shadow-xl transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100%] -mr-8 -mt-8 transition-all group-hover:scale-150" />
                  <div className="flex items-center justify-between mb-6 relative">
                    <div className="p-3 bg-slate-50 rounded-2xl text-primary">
                      <Ticket size={24} />
                    </div>
                    <button onClick={() => deleteCoupon(coupon._id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-2 font-display">{coupon.code}</h4>
                  <p className="text-lg font-bold text-primary mb-4">₹{coupon.discountAmount} OFF</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                      <Calendar size={12} />
                      <span>Exp: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-500 uppercase">
                      <CheckCircle2 size={12} />
                      <span>{coupon.isActive ? 'Active' : 'Expired'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'battle' && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <RefreshCcw size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Battle of the Bots</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Global Comparison Management</p>
              </div>
            </div>

            <form onSubmit={handleBattleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product 1 */}
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Fighter 1 (Left Side)</label>
                  <div className="space-y-3">
                    <select 
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-primary"
                      value={battleForm.product1Id}
                      onChange={e => setBattleForm({...battleForm, product1Id: e.target.value})}
                    >
                      <option value="">Select Product...</option>
                      {products.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                    {battleForm.product1Id && (
                      <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                        <img src={products.find(p => p._id === battleForm.product1Id)?.images[0]} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{products.find(p => p._id === battleForm.product1Id)?.name}</p>
                          <p className="text-[10px] text-primary font-black uppercase">₹{products.find(p => p._id === battleForm.product1Id)?.price.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product 2 */}
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Fighter 2 (Right Side)</label>
                  <div className="space-y-3">
                    <select 
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-primary"
                      value={battleForm.product2Id}
                      onChange={e => setBattleForm({...battleForm, product2Id: e.target.value})}
                    >
                      <option value="">Select Product...</option>
                      {products.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                    {battleForm.product2Id && (
                      <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                        <img src={products.find(p => p._id === battleForm.product2Id)?.images[0]} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{products.find(p => p._id === battleForm.product2Id)?.name}</p>
                          <p className="text-[10px] text-primary font-black uppercase">₹{products.find(p => p._id === battleForm.product2Id)?.price.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Technical Breakdown Notice</p>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  Ensure both products have their <strong>Specifications</strong> filled out in the inventory. The comparison tool automatically maps the first 6 specs for the side-by-side battle view.
                </p>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3"
              >
                <Award size={20} />
                Confirm Battle Matchup
              </button>
            </form>
          </div>
        )}
      </div>



      {/* New Product Modal - REFERENCE BASED DESIGN */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProductModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100"
            >
              {/* Reference Style Header */}
              <div className="px-10 pt-10 pb-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <ShoppingBag className="text-slate-900" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Product</h3>
                      <p className="text-sm text-slate-500 mt-1">Set up a new product listing to start organizing your catalog.</p>
                    </div>
                  </div>
                  <button onClick={() => setIsProductModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={20} /></button>
                </div>
                <div className="h-px bg-slate-100 w-full mt-6" />
              </div>

              {/* Step Progress - Minimal */}
              <div className="px-10 mb-4 flex items-center gap-4">
                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${(currentStep / 4) * 100}%` }} 
                    className="h-full bg-primary"
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phase {currentStep}/4</span>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
                <form onSubmit={handleProductSubmit} className="space-y-8">
                  {currentStep === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Product Name <span className="text-red-500">*</span></label>
                        <input required type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-3 px-4 text-sm text-slate-900 focus:bg-white focus:border-primary/50 outline-none transition-all placeholder:text-slate-400" placeholder="Enter product name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Description <span className="text-red-500">*</span></label>
                        <textarea required rows={5} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-3 px-4 text-sm text-slate-600 focus:bg-white focus:border-primary/50 outline-none transition-all resize-none" placeholder="Describe the product features and specifications" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Category <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <button type="button" onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-3 px-4 text-sm flex justify-between items-center text-slate-600 hover:bg-white transition-all">
                            <span>{categories.find(c => c._id === productForm.category)?.name || 'Select category'}</span>
                            <ChevronRight size={16} className={`transition-transform ${isCategoryDropdownOpen ? 'rotate-90' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {isCategoryDropdownOpen && (
                              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-[110] p-1 overflow-hidden">
                                {categories.map(c => (
                                  <button key={c._id} type="button" onClick={() => { setProductForm({...productForm, category: c._id}); setIsCategoryDropdownOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-primary/10 hover:text-primary text-[13px] font-medium text-slate-600">
                                    {c.name}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[13px] font-bold text-slate-700">Sale Price (₹) <span className="text-red-500">*</span></label>
                          <input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-3 px-4 text-sm" placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-bold text-slate-700">Original Price (₹)</label>
                          <input type="number" value={productForm.originalPrice} onChange={e => setProductForm({...productForm, originalPrice: e.target.value})} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-3 px-4 text-sm" placeholder="0.00" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[13px] font-bold text-slate-700">Stock Units <span className="text-red-500">*</span></label>
                          <input required type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-3 px-4 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-bold text-slate-700">Warranty</label>
                          <input type="text" value={productForm.warranty} onChange={e => setProductForm({...productForm, warranty: e.target.value})} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-3 px-4 text-sm" placeholder="e.g. 2 Year Warranty" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Delivery Information</label>
                        <input type="text" value={productForm.deliveryInfo} onChange={e => setProductForm({...productForm, deliveryInfo: e.target.value})} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-3 px-4 text-sm" placeholder="e.g. Ships in 2-3 days" />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div className="p-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50/30 group hover:border-primary transition-colors">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                          <Upload size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Select files or drag and drop here</p>
                        <p className="text-xs text-slate-400 mb-6">JPG, PNG or WEBP, max 5 images</p>
                        <label className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                          Browse files
                          <input type="file" multiple hidden onChange={handleImageChange} accept="image/*" />
                        </label>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {/* Stored Images */}
                        {productForm.existingImages?.map((url, i) => (
                          <div key={`existing-${i}`} className="aspect-square relative rounded-xl overflow-hidden border border-slate-200 opacity-60">
                            <img src={url} className="w-full h-full object-cover grayscale-[0.5]" />
                            <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                              <span className="text-[8px] font-black text-white uppercase bg-slate-900/40 px-2 py-1 rounded">Stored</span>
                            </div>
                          </div>
                        ))}
                        {/* New Uploads */}
                        {productImages.map((file, i) => (
                          <div key={`new-${i}`} className="aspect-square relative rounded-xl overflow-hidden border border-primary/20 ring-2 ring-primary/10">
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-slate-900 hover:text-red-500"><X size={12} /></button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[13px] font-bold text-slate-700">Available Colors</label>
                        <div className="flex items-center gap-2 mb-4">
                          <input type="text" placeholder="Add color name or Hex (909590)" onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              const val = input.value.trim();
                              if (val) {
                                // If it's a hex without #, add it
                                if (/^[0-9A-F]{6}$/i.test(val)) {
                                  const name = await fetchColorName(val);
                                  setProductForm({...productForm, colors: [...productForm.colors, `${name} (#${val})`]});
                                } else {
                                  setProductForm({...productForm, colors: [...productForm.colors, val]});
                                }
                                input.value = '';
                              }
                            }
                          }} className="flex-1 bg-slate-50/50 border border-slate-100 rounded-xl py-3 px-4 text-sm" />
                          <button type="button" onClick={async () => {
                            const input = document.querySelector('input[placeholder="Add color name or Hex (909590)"]') as HTMLInputElement;
                            const val = input.value.trim();
                            if (val) {
                               if (/^[0-9A-F]{6}$/i.test(val)) {
                                  const name = await fetchColorName(val);
                                  setProductForm({...productForm, colors: [...productForm.colors, `${name} (#${val})`]});
                                } else {
                                  setProductForm({...productForm, colors: [...productForm.colors, val]});
                                }
                              input.value = '';
                            }
                          }} className="p-3 bg-slate-50 text-slate-400 hover:text-primary rounded-xl border border-slate-100"><Plus size={20} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {productForm.colors.map((color, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-700 group hover:bg-white hover:border-primary/30 transition-all">
                              {/* Color Preview Circle */}
                              <div 
                                className="w-3 h-3 rounded-full border border-slate-200" 
                                style={{ 
                                  backgroundColor: color.includes('(#') 
                                    ? color.match(/\(#([0-9A-F]{6})\)/i)?.[1] ? `#${color.match(/\(#([0-9A-F]{6})\)/i)?.[1]}` : color
                                    : (color.startsWith('#') ? color : `#${color}`) 
                                }} 
                              />
                              <span>{color}</span>
                              <button type="button" onClick={() => setProductForm({...productForm, colors: productForm.colors.filter((_, idx) => idx !== i)})} className="text-slate-300 hover:text-red-500"><X size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[13px] font-bold text-slate-700">Specifications</label>
                          <button type="button" onClick={() => setProductForm({...productForm, specs: [...productForm.specs, { key: '', value: '' }]})} className="text-xs font-bold text-primary">+ Add field</button>
                        </div>
                        <div className="space-y-3">
                          {productForm.specs.map((spec, i) => (
                            <div key={i} className="flex gap-3">
                              <input type="text" placeholder="Key" value={spec.key} onChange={(e) => {
                                const newSpecs = [...productForm.specs];
                                newSpecs[i].key = e.target.value;
                                setProductForm({...productForm, specs: newSpecs});
                              }} className="flex-1 bg-slate-50/50 border border-slate-100 rounded-xl py-2.5 px-4 text-sm" />
                              <input type="text" placeholder="Value" value={spec.value} onChange={(e) => {
                                const newSpecs = [...productForm.specs];
                                newSpecs[i].value = e.target.value;
                                setProductForm({...productForm, specs: newSpecs});
                              }} className="flex-1 bg-slate-50/50 border border-slate-100 rounded-xl py-2.5 px-4 text-sm" />
                              <button onClick={() => setProductForm({...productForm, specs: productForm.specs.filter((_, idx) => idx !== i)})} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl">
                        <input type="checkbox" checked={productForm.featured} onChange={e => setProductForm({...productForm, featured: e.target.checked})} className="w-4 h-4 accent-primary" id="featured-check" />
                        <label htmlFor="featured-check" className="text-sm font-medium text-slate-700 cursor-pointer">Promote this product to featured collection</label>
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>

              {/* Reference Style Footer */}
              <div className="px-10 py-6 bg-white border-t border-slate-100 flex items-center justify-end gap-3">
                <button 
                  onClick={currentStep === 1 ? () => setIsProductModalOpen(false) : () => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                >
                  {currentStep === 1 ? 'Cancel' : 'Back'}
                </button>
                <button 
                  onClick={currentStep < 4 ? () => setCurrentStep(prev => prev + 1) : handleProductSubmit}
                  disabled={isSubmitting || (currentStep === 3 && !editingProductId && productImages.length < 3)}
                  className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-[13px] font-bold hover:bg-primary transition-all shadow-md flex items-center gap-2"
                >
                  {isSubmitting ? <RefreshCcw className="animate-spin" size={16} /> : (currentStep === 4 ? <CheckCircle2 size={16} /> : null)}
                  {currentStep < 4 ? 'Continue' : (isSubmitting ? 'Saving...' : 'Save product')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* College Project Modal */}
      <AnimatePresence>
        {isCollegeProjectModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCollegeProjectModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100"
            >
              <div className="px-8 pt-8 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                      <GraduationCap size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Manage Academic Kit</h3>
                  </div>
                  <button onClick={() => setIsCollegeProjectModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={20} /></button>
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${currentStep >= s ? 'bg-primary' : 'bg-slate-100'}`} />
                  ))}
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Step {currentStep}/4</p>
              </div>

              <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                <form onSubmit={handleCollegeProjectSubmit} className="space-y-6">
                  {currentStep === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project Name</label>
                        <input className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all" placeholder="e.g. Spider-Bot Chassis Kit" value={collegeProjectForm.name} onChange={e => setCollegeProjectForm({...collegeProjectForm, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Short Tagline</label>
                        <input className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all" placeholder="e.g. Gesture Controlled Autonomous Robot" value={collegeProjectForm.tagline} onChange={e => setCollegeProjectForm({...collegeProjectForm, tagline: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Price (₹)</label>
                          <input type="number" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all" placeholder="15999" value={collegeProjectForm.price} onChange={e => setCollegeProjectForm({...collegeProjectForm, price: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Difficulty</label>
                          <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all" value={collegeProjectForm.difficultyLevel} onChange={e => setCollegeProjectForm({...collegeProjectForm, difficultyLevel: e.target.value})}>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Detailed Description</label>
                        <textarea className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all min-h-[100px] resize-none" placeholder="Provide a detailed overview of the project, features and academic value..." value={collegeProjectForm.description} onChange={e => setCollegeProjectForm({...collegeProjectForm, description: e.target.value})} />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">What You Will Get</label>
                          <button type="button" onClick={() => setCollegeProjectForm({...collegeProjectForm, whatYouWillGet: [...collegeProjectForm.whatYouWillGet, '']})} className="text-[11px] font-black text-primary uppercase">+ Add Item</button>
                        </div>
                        {collegeProjectForm.whatYouWillGet.map((val, i) => (
                          <div key={i} className="flex gap-2">
                            <input className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" placeholder="e.g. Complete Hardware Kit / Source Code" value={val} onChange={e => {
                              const newArr = [...collegeProjectForm.whatYouWillGet];
                              newArr[i] = e.target.value;
                              setCollegeProjectForm({...collegeProjectForm, whatYouWillGet: newArr});
                            }} />
                            <button type="button" onClick={() => {
                              const newArr = collegeProjectForm.whatYouWillGet.filter((_, idx) => idx !== i);
                              setCollegeProjectForm({...collegeProjectForm, whatYouWillGet: newArr.length ? newArr : ['']});
                            }} className="p-3 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Use Cases</label>
                          <button type="button" onClick={() => setCollegeProjectForm({...collegeProjectForm, useCases: [...collegeProjectForm.useCases, '']})} className="text-[11px] font-black text-primary uppercase">+ Add Item</button>
                        </div>
                        {collegeProjectForm.useCases.map((val, i) => (
                          <div key={i} className="flex gap-2">
                            <input className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" placeholder="e.g. Final Year Project / Mini Project" value={val} onChange={e => {
                              const newArr = [...collegeProjectForm.useCases];
                              newArr[i] = e.target.value;
                              setCollegeProjectForm({...collegeProjectForm, useCases: newArr});
                            }} />
                            <button type="button" onClick={() => {
                              const newArr = collegeProjectForm.useCases.filter((_, idx) => idx !== i);
                              setCollegeProjectForm({...collegeProjectForm, useCases: newArr.length ? newArr : ['']});
                            }} className="p-3 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Demo Video URL</label>
                        <input className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" placeholder="https://youtube.com/..." value={collegeProjectForm.demoLink} onChange={e => setCollegeProjectForm({...collegeProjectForm, demoLink: e.target.value})} />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">What You Will Build</label>
                          <button type="button" onClick={() => setCollegeProjectForm({...collegeProjectForm, whatYouWillBuild: [...collegeProjectForm.whatYouWillBuild, '']})} className="text-[11px] font-black text-primary uppercase">+ Add Step</button>
                        </div>
                        {collegeProjectForm.whatYouWillBuild.map((val, i) => (
                          <div key={i} className="flex gap-2">
                            <input className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" placeholder="e.g. Autonomous Obstacle Avoidance" value={val} onChange={e => {
                              const newArr = [...collegeProjectForm.whatYouWillBuild];
                              newArr[i] = e.target.value;
                              setCollegeProjectForm({...collegeProjectForm, whatYouWillBuild: newArr});
                            }} />
                            <button type="button" onClick={() => {
                              const newArr = collegeProjectForm.whatYouWillBuild.filter((_, idx) => idx !== i);
                              setCollegeProjectForm({...collegeProjectForm, whatYouWillBuild: newArr.length ? newArr : ['']});
                            }} className="p-3 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tech Stack</label>
                          <button type="button" onClick={() => setCollegeProjectForm({...collegeProjectForm, techStack: [...collegeProjectForm.techStack, { key: '', value: '' }]})} className="text-[11px] font-black text-primary uppercase">+ Add Field</button>
                        </div>
                        {collegeProjectForm.techStack.map((tech, i) => (
                          <div key={i} className="flex gap-2">
                            <input placeholder="Core" className="w-1/3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={tech.key} onChange={e => {
                              const newTech = [...collegeProjectForm.techStack];
                              newTech[i].key = e.target.value;
                              setCollegeProjectForm({...collegeProjectForm, techStack: newTech});
                            }} />
                            <input placeholder="e.g. Arduino Uno" className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={tech.value} onChange={e => {
                              const newTech = [...collegeProjectForm.techStack];
                              newTech[i].value = e.target.value;
                              setCollegeProjectForm({...collegeProjectForm, techStack: newTech});
                            }} />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Support Perks</label>
                          <button type="button" onClick={() => setCollegeProjectForm({...collegeProjectForm, supportDetails: [...collegeProjectForm.supportDetails, '']})} className="text-[11px] font-black text-primary uppercase">+ Add Perk</button>
                        </div>
                        {collegeProjectForm.supportDetails.map((val, i) => (
                          <div key={i} className="flex gap-2">
                            <input className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" placeholder="e.g. 1:1 WhatsApp Debugging" value={val} onChange={e => {
                              const newArr = [...collegeProjectForm.supportDetails];
                              newArr[i] = e.target.value;
                              setCollegeProjectForm({...collegeProjectForm, supportDetails: newArr});
                            }} />
                            <button type="button" onClick={() => {
                              const newArr = collegeProjectForm.supportDetails.filter((_, idx) => idx !== i);
                              setCollegeProjectForm({...collegeProjectForm, supportDetails: newArr.length ? newArr : ['']});
                            }} className="p-3 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                      <div className="p-10 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center bg-slate-50/50 group hover:border-primary transition-all">
                        <Upload size={32} className="text-slate-300 mb-4 group-hover:text-primary transition-colors" />
                        <p className="text-sm font-bold text-slate-600 mb-1">Project Media</p>
                        <p className="text-[10px] text-slate-400 mb-6 uppercase tracking-widest">Images or GIF, max 5</p>
                        <label className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                          Select Files
                          <input type="file" multiple hidden onChange={handleImageChange} accept="image/*" />
                        </label>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {productImages.map((file, i) => (
                          <div key={i} className="aspect-square relative rounded-xl overflow-hidden border border-slate-100 group">
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>

              <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <button 
                  onClick={currentStep === 1 ? () => setIsCollegeProjectModalOpen(false) : () => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {currentStep === 1 ? 'Cancel' : 'Previous'}
                </button>
                <button 
                  onClick={currentStep < 4 ? () => setCurrentStep(prev => prev + 1) : handleCollegeProjectSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-primary transition-all shadow-lg flex items-center gap-2"
                >
                  {isSubmitting ? <RefreshCcw className="animate-spin" size={16} /> : null}
                  {currentStep < 4 ? 'Next Step' : (isSubmitting ? 'Syncing...' : 'Publish Project')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* User Details Modal */}

      <AnimatePresence>
        {isDetailsModalOpen && selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDetailsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-y-auto max-h-[90vh] p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-primary to-orange-500 p-1 mb-6">
                  <div className="w-full h-full bg-white rounded-[28px] overflow-hidden flex items-center justify-center text-3xl font-black text-primary">
                    {selectedUser.avatar ? <img src={selectedUser.avatar} className="w-full h-full object-cover" /> : <span>{selectedUser.name.charAt(0).toUpperCase()}</span>}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">{selectedUser.name}</h3>
                <p className="text-slate-500 font-medium mb-4">{selectedUser.email}</p>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-400 uppercase">
                  <Calendar size={14} /> Joined {new Date(selectedUser.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                {/* Referrals */}
                {((selectedUser as any).referralCode || (selectedUser as any).referredBy) && (
                  <div className="flex flex-col gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Share2 className="text-primary" size={18} />
                      <h4 className="font-bold text-primary text-sm">Referral Info</h4>
                    </div>
                    {/* User's Referral Code */}
                    {(selectedUser as any).referralCode && (
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Their Code</p>
                        <p className="font-black text-primary tracking-widest text-lg">{(selectedUser as any).referralCode}</p>
                      </div>
                    )}
                    {/* Referred By */}
                    {(selectedUser as any).referredBy && (
                      <div className="pt-2 border-t border-primary/10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Referred By User ID</p>
                        <p className="font-bold text-slate-900 text-xs mt-1 bg-white p-2 rounded-lg border border-primary/10 truncate">
                          {(selectedUser as any).referredBy}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Phone */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Truck size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                    <p className="font-bold text-slate-900 text-sm">{(selectedUser as any).phone || '—'}</p>
                  </div>
                </div>

                {/* GPS Location */}
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-primary" size={18} />
                    <h4 className="font-bold text-slate-900 text-sm">Last Known Location</h4>
                  </div>
                  {(selectedUser as any).lastLocation?.lat && (selectedUser as any).lastLocation.lat !== 0 ? (
                    <>
                      {/* Live Leaflet Map */}
                      <MapView 
                        lat={(selectedUser as any).lastLocation.lat}
                        lng={(selectedUser as any).lastLocation.lng}
                        label={selectedUser.name}
                      />
                      {/* Coordinates row */}
                      <div className="grid grid-cols-2 gap-3 text-[11px]">
                        <div className="p-3 bg-white rounded-xl border border-slate-100">
                          <p className="text-slate-400 uppercase tracking-widest font-black mb-1">Latitude</p>
                          <p className="font-bold text-slate-900">{(selectedUser as any).lastLocation.lat.toFixed(6)}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-100">
                          <p className="text-slate-400 uppercase tracking-widest font-black mb-1">Longitude</p>
                          <p className="font-bold text-slate-900">{(selectedUser as any).lastLocation.lng.toFixed(6)}</p>
                        </div>
                      </div>
                      {(selectedUser as any).lastLocation.address && (
                        <p className="text-xs text-slate-500 font-medium">📍 {(selectedUser as any).lastLocation.address}, {(selectedUser as any).lastLocation.city}</p>
                      )}
                      <a 
                        href={`https://www.google.com/maps?q=${(selectedUser as any).lastLocation.lat},${(selectedUser as any).lastLocation.lng}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 w-full py-2.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest justify-center hover:bg-primary/20 transition-all"
                      >
                        <MapPin size={14} /> Open in Google Maps
                      </a>
                    </>
                  ) : (
                    <p className="text-[11px] text-slate-400 font-medium py-2">No location data captured yet. Location is stored when the user checks out or logs in with GPS enabled.</p>
                  )}
                </div>
              </div>
              <button onClick={() => setIsDetailsModalOpen(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20">
                Close Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Coupon Modal */}
      <AnimatePresence>
        {isCouponModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCouponModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden p-8 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-900">New Promo Code</h3>
                <button onClick={() => setIsCouponModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-900"><X size={24} /></button>
              </div>

              <form onSubmit={handleCouponSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Coupon Code</label>
                  <div className="relative">
                    <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required 
                      type="text" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-primary outline-none uppercase" 
                      placeholder="e.g. BISONIX50"
                      value={couponForm.code}
                      onChange={e => setCouponForm({...couponForm, code: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Discount Amount (₹)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required 
                      type="number" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-primary outline-none" 
                      placeholder="500"
                      value={couponForm.discountAmount}
                      onChange={e => setCouponForm({...couponForm, discountAmount: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Expiry Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required 
                      type="date" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-primary outline-none" 
                      value={couponForm.expiryDate}
                      onChange={e => setCouponForm({...couponForm, expiryDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Target Audience</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setCouponForm({...couponForm, isAllUsers: true, targetUser: ''})}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${couponForm.isAllUsers ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-white'}`}
                    >
                      All Users
                    </button>
                    <button 
                      type="button"
                      onClick={() => setCouponForm({...couponForm, isAllUsers: false})}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${!couponForm.isAllUsers ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-white'}`}
                    >
                      Specific User
                    </button>
                  </div>

                  {!couponForm.isAllUsers && (
                    <div className="space-y-4">
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="text" 
                          placeholder="Search by name or email..."
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-primary outline-none"
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <div className="max-h-48 overflow-y-auto space-y-1.5 custom-scrollbar p-1">
                        {users
                          .filter(u => 
                            u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                            u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                          )
                          .map(u => (
                            <div 
                              key={u._id} 
                              className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all cursor-pointer ${couponForm.targetUser === u._id ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-100 hover:bg-slate-50'}`}
                              onClick={() => setCouponForm({...couponForm, targetUser: u._id})}
                            >
                              <div 
                                className="w-9 h-9 rounded-xl bg-slate-200 overflow-hidden flex items-center justify-center text-slate-500 font-bold hover:scale-110 transition-transform relative group/avatar"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUser(u);
                                  setIsDetailsModalOpen(true);
                                }}
                              >
                                {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : <span>{u.name.charAt(0).toUpperCase()}</span>}
                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center">
                                  <Eye size={14} className="text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{u.name}</p>
                                <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                              </div>
                              {couponForm.targetUser === u._id && <CheckCircle2 className="text-primary" size={18} />}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <RefreshCcw size={18} className="animate-spin" /> : <Ticket size={18} />}
                  {isSubmitting ? 'Generating...' : 'Generate Coupon'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Status Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 border border-slate-100 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-3">
                <Truck className="text-primary" /> Update Tracking
              </h3>
              <p className="text-xs text-slate-400 mb-6">Order #{selectedOrder.orderId}</p>

              {/* Order Items */}
              <div className="space-y-3 mb-6 pb-6 border-b border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items Ordered</p>
                {selectedOrder.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    {item.image && <img src={item.image} className="w-12 h-12 rounded-xl object-cover shrink-0" alt={item.name} />}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.color && (
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full inline-block border border-slate-200" style={{ backgroundColor: item.color?.toLowerCase() === 'white' ? '#f8f8f8' : item.color?.toLowerCase() === 'black' ? '#111' : item.color }} />
                            {item.color}
                          </span>
                        )}
                        <span className="text-[9px] text-slate-400 font-bold">× {item.qty}</span>
                      </div>
                    </div>
                    <p className="font-black text-sm text-primary shrink-0">₹{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
                <div className="flex justify-between pt-2 text-sm font-black">
                  <span className="text-slate-500">Total Paid</span>
                  <span className="text-primary">₹{selectedOrder.total?.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">New Status</label>
                  <select 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                    value={trackingUpdate.status}
                    onChange={e => setTrackingUpdate({...trackingUpdate, status: e.target.value})}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Current Location</label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                    placeholder="e.g. Hyderabad Hub"
                    value={trackingUpdate.location}
                    onChange={e => setTrackingUpdate({...trackingUpdate, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Tracking Info</label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                    placeholder="e.g. In transit to destination"
                    value={trackingUpdate.description}
                    onChange={e => setTrackingUpdate({...trackingUpdate, description: e.target.value})}
                  />
                </div>
                <button 
                  onClick={() => updateOrderStatus(selectedOrder._id)}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all"
                >
                  Confirm Update
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
