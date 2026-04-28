import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Truck, Search } from 'lucide-react';
import { API_URL } from '../../config';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
}

export default function UsersTab({ onUserClick }: { onUserClick: (user: User) => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('insforgeToken');
      const response = await fetch(`${API_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Search users by name or email..."
          className="w-full pl-12 pr-4 py-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-main)] rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-[var(--text-muted)]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 skeleton-shimmer rounded-[32px]" />
          ))
        ) : (
          filteredUsers.map((user) => (
            <motion.div 
              layout
              key={user._id} 
              className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group" 
              onClick={() => onUserClick(user)}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-primary)] overflow-hidden flex items-center justify-center text-[var(--text-muted)] font-bold ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
                  {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span>{user.name.charAt(0).toUpperCase()}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-[var(--text-main)] truncate">{user.name}</h4>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{user.role}</p>
                </div>
                <div className="p-2 text-slate-300 group-hover:text-primary transition-colors">
                  <Eye size={20} />
                </div>
              </div>
              <p className="text-sm text-[var(--text-muted)] truncate mb-4">{user.email}</p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                <Truck size={12} />
                <span>{user.phone || 'No phone'}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
