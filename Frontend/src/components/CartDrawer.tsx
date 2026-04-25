import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  setCartItems: (items: any[]) => void;
}

export default function CartDrawer({ isOpen, onClose, cartItems, setCartItems }: CartDrawerProps) {
  
  const handleQtyChange = (id: number, delta: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const handleRemove = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = () => {
    const number = "7995232673";
    const itemDetails = cartItems.map(item => `- ${item.name} (x${item.qty}): $${item.price * item.qty}`).join('%0A');
    const message = `Hello BISONIX! I would like to place an order:%0A%0A${itemDetails}%0A%0A*Total: $${subtotal.toLocaleString()}*%0A%0APlease let me know the next steps.`;
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--bg-primary)] border-l border-[var(--border-subtle)] z-[101] shadow-2xl flex flex-col transition-colors duration-400"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--bg-secondary)]/50">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-primary" size={24} />
                <h2 className="text-xl font-bold text-[var(--text-main)] font-display">Your Collection</h2>
                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{cartItems.length}</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-[var(--text-main)]/5 rounded-full transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center text-[var(--text-muted)]">
                    <ShoppingBag size={40} />
                  </div>
                  <h3 className="text-[var(--text-main)] font-bold">Your cart is empty</h3>
                  <button onClick={onClose} className="text-primary font-bold hover:underline">Continue Exploring</button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 rounded-2xl bg-[var(--bg-secondary)] overflow-hidden border border-[var(--border-subtle)]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="text-[var(--text-main)] font-bold text-sm mb-1">{item.name}</h3>
                        <p className="text-primary font-bold text-sm">${item.price}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 bg-[var(--bg-secondary)] rounded-lg px-2 py-1 border border-[var(--border-subtle)]">
                          <button 
                            onClick={() => handleQtyChange(item.id, -1)}
                            className="text-[var(--text-muted)] hover:text-primary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-[var(--text-main)] text-xs font-bold w-4 text-center">{item.qty}</span>
                          <button 
                            onClick={() => handleQtyChange(item.id, 1)}
                            className="text-[var(--text-muted)] hover:text-primary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleRemove(item.id)}
                          className="text-red-500/50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)] text-sm uppercase tracking-wider font-semibold">Subtotal</span>
                <span className="text-[var(--text-main)] text-xl font-bold font-display">${subtotal.toLocaleString()}</span>
              </div>
              <p className="text-[var(--text-muted)] text-xs leading-relaxed text-center">
                Shipping and taxes calculated at checkout. Secure 256-bit encrypted transaction.
              </p>
              <button 
                disabled={cartItems.length === 0}
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                Proceed to Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
