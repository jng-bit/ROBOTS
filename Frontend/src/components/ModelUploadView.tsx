import { useState, useMemo } from 'react';
import { API_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Upload, FileCode, CheckCircle, ArrowLeft, Globe, Layers, Box } from 'lucide-react';
import ModelViewer from './ModelViewer';
import { useToast } from '../context/ToastContext';

interface ModelUploadViewProps {
  onBack: () => void;
}

export default function ModelUploadView({ onBack }: ModelUploadViewProps) {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [material, setMaterial] = useState('Resin (Grey)');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    country: '',
    city: '',
    pincode: ''
  });

  const materials = [
    { name: 'Resin (Grey)', price: '₹499', color: '#8E8E8E' },
    { name: 'PLA (White)', price: '₹299', color: '#FFFFFF' },
    { name: 'Carbon Fiber', price: '₹999', color: '#1A1A1A' },
    { name: 'TPU (Flexible)', price: '₹599', color: '#E0E0E0' },
  ];

  const handleFile = (e: any) => {
    const selectedFile = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (selectedFile) {
      // Check if file is GLB
      if (selectedFile.name.toLowerCase().endsWith('.glb')) {
        // Check size (100MB limit for our Cloudinary configuration)
        if (selectedFile.size > 100 * 1024 * 1024) {
          showToast("File is too large. Maximum size is 100MB.", 'error');
          return;
        }
        setFile(selectedFile);
      } else {
        showToast("Please upload a .glb file only.", 'error');
      }
    }
  };

  const fileUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return null;
  }, [file]);

  const countries = ["India", "United States", "United Kingdom", "Germany", "Japan", "Canada", "Australia"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showToast('Please upload a 3D model file first', 'error');
      return;
    }

    setLoading(true);
    const submitData = new FormData();
    submitData.append('modelFile', file);
    submitData.append('material', material);
    
    // Stringify nested objects
    submitData.append('contact', JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email
    }));
    
    submitData.append('shipping', JSON.stringify({
      address: formData.address,
      country: formData.country,
      city: formData.city,
      pincode: formData.pincode
    }));

    try {
      const res = await fetch(`${API_URL}/api/custom-prints`, {
        method: 'POST',
        body: submitData
      });
      const data = await res.json();
      
      if (res.ok) {
        showToast(data.message || 'Quotation request submitted!', 'success');
        setStep(1);
        setFile(null);
        setFormData({
          firstName: '', lastName: '', phone: '', email: '',
          address: '', country: '', city: '', pincode: ''
        });
      } else {
        showToast(data.message || 'Failed to submit request', 'error');
      }
    } catch (err) {
      showToast('Connection failed. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 px-4 sm:px-8 transition-colors duration-400"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-12">
          <button onClick={onBack} className="hover:text-primary transition-colors flex items-center gap-1">
            Home
          </button>
          <ChevronRight size={12} />
          <span className="text-[var(--text-main)] font-bold">Upload GLB Model</span>
          {step === 2 && (
            <>
              <ChevronRight size={12} />
              <span className="text-primary font-bold">Quotation Form</span>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="sticky top-32">
            <h1 className="text-4xl md:text-7xl font-black font-display text-[var(--text-main)] mb-8 leading-[0.9] tracking-tighter">
              {step === 1 ? (
                <>Custom <span className="text-primary italic">3D Print</span> Service.</>
              ) : (
                <>Request a <span className="text-primary italic">Quotation</span>.</>
              )}
            </h1>
            
            {/* Real 3D Preview */}
            <div className="mb-12 aspect-video bg-[var(--bg-secondary)] rounded-[2.5rem] border border-primary/20 overflow-hidden relative shadow-2xl">
              <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-6 left-6 z-20 flex gap-2">
                <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Live 3D Preview</span>
                {file && <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/10">{material}</span>}
              </div>
              
              <div className="w-full h-full">
                {fileUrl ? (
                  <ModelViewer modelPath={fileUrl} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-muted)] space-y-4">
                    <Box size={48} className="opacity-20 animate-pulse" />
                    <p className="text-xs font-bold uppercase tracking-widest">Waiting for GLB File...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {[
                { title: 'GLB Only Support', desc: 'Optimized for high-fidelity 3D assets and AR readiness.' },
                { title: 'Material Selection', desc: 'Choose from PLA, ABS, PETG, or Carbon Fiber.' },
                { title: 'Fast Delivery', desc: 'Worldwide shipping within 3-5 business days.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle className="text-primary" size={18} />
                  </div>
                  <div>
                    <h4 className="text-[var(--text-main)] font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-[var(--text-muted)] text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden min-h-[600px]">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative z-10"
                >
                  <h3 className="text-2xl font-bold text-[var(--text-main)] mb-8 font-display tracking-tight">Step 1: Customize & Upload</h3>
                  
                  <div className="space-y-8">
                    {/* Material Selection */}
                    <div className="grid grid-cols-2 gap-4">
                      {materials.map((m) => (
                        <button 
                          key={m.name}
                          onClick={() => setMaterial(m.name)}
                          className={`p-4 rounded-2xl border text-left transition-all group ${
                            material === m.name ? 'border-primary bg-primary/5' : 'border-[var(--border-subtle)] hover:border-primary/20'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="w-4 h-4 rounded-full border border-[var(--border-subtle)]" style={{ backgroundColor: m.color }} />
                            <span className="text-[10px] font-bold text-primary">{m.price}/cm³</span>
                          </div>
                          <p className="text-xs font-bold text-[var(--text-main)]">{m.name}</p>
                        </button>
                      ))}
                    </div>

                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e); }}
                      className={`w-full aspect-video border-2 border-dashed rounded-[2rem] transition-all flex flex-col items-center justify-center p-8 text-center ${
                        isDragging ? 'border-primary bg-primary/5 scale-[0.98]' : 'border-[var(--border-subtle)]'
                      } ${file ? 'border-green-500 bg-green-500/5' : ''}`}
                    >
                      {!file ? (
                        <>
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                            <Upload size={24} />
                          </div>
                          <h4 className="text-[var(--text-main)] font-bold text-sm mb-1">Upload .GLB Model</h4>
                          <p className="text-[var(--text-muted)] text-[10px] mb-4">Only GLB files supported for live preview</p>
                          <label className="bg-primary text-white font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-orange-600 transition-colors text-xs shadow-lg shadow-primary/20">
                            Select GLB File
                            <input type="file" className="hidden" accept=".glb" onChange={handleFile} />
                          </label>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                            <FileCode size={24} />
                          </div>
                          <h4 className="text-[var(--text-main)] font-bold text-sm mb-1 line-clamp-1 px-4">{file.name}</h4>
                          <p className="text-green-500 text-[10px] font-bold mb-4 uppercase tracking-widest">Model Loaded Successfully</p>
                          <button 
                            onClick={() => setFile(null)}
                            className="text-red-500 text-[10px] font-bold hover:underline"
                          >
                            Remove and Select Different File
                          </button>
                        </>
                      )}
                    </div>

                    <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                      <div className="flex gap-4">
                        <Layers className="text-blue-500 shrink-0" size={18} />
                        <p className="text-[var(--text-muted)] text-[10px] leading-relaxed">
                          Your model will be printed with <span className="text-[var(--text-main)] font-bold">0.1mm layer precision</span> using industrial {material} technology.
                        </p>
                      </div>
                    </div>

                    <button 
                      disabled={!file}
                      onClick={() => setStep(2)}
                      className="w-full bg-gradient-to-r from-primary to-orange-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 hover:from-orange-600 hover:to-orange-500 transition-all disabled:opacity-30 active:scale-95 flex items-center justify-center gap-2"
                    >
                      Step 2: Quotation Form <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="relative z-10"
                >
                  <button 
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-primary font-bold text-xs mb-6 hover:gap-3 transition-all"
                  >
                    <ArrowLeft size={14} /> Back to Customize
                  </button>
                  <h3 className="text-2xl font-bold text-[var(--text-main)] mb-8 font-display">Step 2: Contact Details</h3>
                  
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">First Name <span className="text-primary">*</span></label>
                        <input 
                          type="text" 
                          required 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          disabled={loading}
                          placeholder="John" 
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors disabled:opacity-50" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Last Name <span className="text-primary">*</span></label>
                        <input 
                          type="text" 
                          required 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          disabled={loading}
                          placeholder="Doe" 
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors disabled:opacity-50" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Phone Number <span className="text-primary">*</span></label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pr-2 border-r border-[var(--border-subtle)]">
                            <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-4 h-3 object-cover rounded-sm" />
                            <span className="text-[10px] font-bold text-[var(--text-main)]">+91</span>
                          </div>
                          <input 
                            type="tel" 
                            required 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/[^0-9]/g, '')})}
                            disabled={loading}
                            minLength={10}
                            maxLength={10}
                            pattern="[0-9]{10}"
                            placeholder="9876543210" 
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl pl-16 pr-4 py-3 text-sm focus:border-primary outline-none transition-colors disabled:opacity-50" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Email <span className="text-primary">*</span></label>
                        <input 
                          type="email" 
                          required 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          disabled={loading}
                          placeholder="john@example.com" 
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors disabled:opacity-50" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Address <span className="text-primary">*</span></label>
                      <textarea 
                        required 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        disabled={loading}
                        placeholder="Full street address" 
                        rows={2} 
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors resize-none disabled:opacity-50" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Country <span className="text-primary">*</span></label>
                        <div className="relative">
                          <Globe className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
                          <select 
                            required 
                            value={formData.country}
                            onChange={(e) => setFormData({...formData, country: e.target.value})}
                            disabled={loading}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors appearance-none cursor-pointer disabled:opacity-50"
                          >
                            <option value="">Select Country</option>
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">City <span className="text-primary">*</span></label>
                        <input 
                          type="text" 
                          required 
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          disabled={loading}
                          placeholder="Mumbai" 
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors disabled:opacity-50" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">PIN Code <span className="text-primary">*</span></label>
                      <input 
                        type="text" 
                        required 
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/[^0-9]/g, '')})}
                        disabled={loading}
                        maxLength={6}
                        pattern="[0-9]{6}"
                        placeholder="400001" 
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors disabled:opacity-50" 
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full mt-4 bg-gradient-to-r from-primary to-orange-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 hover:from-orange-600 hover:to-orange-500 transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> 
                          Uploading... This may take a minute.
                        </>
                      ) : (
                        "Submit Quotation Request"
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
