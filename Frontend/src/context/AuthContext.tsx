import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';
import { insforge } from '../lib/insforge';

interface User {
  id: string;
  _id?: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  referralCode?: string;
  referredBy?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  handleSession: (token: string, additionalData?: { name?: string, phone?: string, coordinates?: { lat: number; lng: number }, referralCode?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (token: string, additionalData?: { name?: string, phone?: string, referralCode?: string }) => {
    if (!token || token === 'null') return;
    
    try {
      console.log('Fetching profile with token...');
      const response = await fetch(`${API_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-name': additionalData?.name || '',
          'x-user-phone': additionalData?.phone || '',
          'x-referral-code': additionalData?.referralCode || ''
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser({
          ...data,
          id: data._id
        });
        console.log('Profile loaded successfully:', data.email);
      } else {
        console.error('Auth Sync Error:', data.message);
        if (response.status === 401) {
          console.warn('Backend returned 401. User may need to re-login if fallback fails.');
          // Remove logout() to avoid forced loops if backend is just being slow
        }
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      // Don't alert on every network error to avoid spamming the user
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('insforgeToken');
      if (token) {
        await fetchUserProfile(token);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const handleSession = async (accessToken: string, additionalData?: { name?: string, phone?: string, coordinates?: { lat: number; lng: number }, referralCode?: string }) => {
    localStorage.setItem('insforgeToken', accessToken);
    await fetchUserProfile(accessToken, additionalData);

    // If additional data provided (signup), sync phone + GPS to MongoDB immediately
    if (additionalData?.phone || additionalData?.coordinates) {
      try {
        const body: any = {};
        if (additionalData.name) body.name = additionalData.name;
        if (additionalData.phone) body.phone = additionalData.phone;
        if (additionalData.coordinates) {
          body.lastLocation = {
            lat: additionalData.coordinates.lat,
            lng: additionalData.coordinates.lng,
            updatedAt: new Date().toISOString()
          };
        }
        await fetch(`${API_URL}/api/users/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'x-user-name': additionalData.name || '',
            'x-user-phone': additionalData.phone || '',
            'x-referral-code': additionalData.referralCode || ''
          },
          body: JSON.stringify(body)
        });
      } catch (e) {
        console.warn('Profile sync after session failed:', e);
      }
    }
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await (insforge.auth as any).signInWithPassword({ email, password });
    if (error) throw error;
    if (data?.accessToken) {
      await handleSession(data.accessToken);
    }
  };

  const logout = async () => {
    await insforge.auth.signOut();
    localStorage.removeItem('insforgeToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, handleSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
