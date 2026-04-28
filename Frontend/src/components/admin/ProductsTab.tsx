import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { API_URL } from '../../config';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: { _id: string, name: string } | string;
  stock: number;
}

export default function ProductsTab({ 
  onEdit, 
  onAdd 
}: { 
  onEdit: (product: Product) => void,
  onAdd: () => void 
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const data = await response.json();
      if (response.ok) setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const token = localStorage.getItem('insforgeToken');
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-secondary)] p-6 rounded-[32px] border border-[var(--border-subtle)] shadow-sm">
        <div>
          <h3 className="text-2xl font-black text-[var(--text-main)]">Inventory</h3>
          <p className="text-sm text-[var(--text-muted)]">Manage and list your robotics & 3D catalog.</p>
        </div>
        <button 
          onClick={onAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all"
        >
          <Plus size={20} />
          List New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] skeleton-shimmer rounded-[40px]" />
          ))
        ) : (
          products.map((product) => (
            <div key={product._id} className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[40px] overflow-hidden shadow-sm group hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={product.images?.[0] || ''} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                    {typeof product.category === 'object' ? product.category.name : 'Uncategorized'}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => onEdit(product)}
                    className="p-4 bg-[var(--bg-primary)] text-[var(--text-main)] rounded-2xl hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => deleteProduct(product._id)}
                    className="p-4 bg-[var(--bg-primary)] text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 delay-75"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-[var(--text-main)] mb-1">{product.name}</h4>
                <p className="text-primary font-black text-lg">₹{product.price.toLocaleString()}</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {product.stock} Units in stock
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
