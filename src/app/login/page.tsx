'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('1. Form submit triggered');
    
    if (loading) return;
    setLoading(true);
    setErrorMsg('');

    try {
      console.log('2. Calling authenticate_user RPC...', { email });

      // 1. Call custom RPC function to verify credentials against app_users
      const { data, error } = await supabase.rpc('authenticate_user', {
        p_email: email,
        p_password: password,
      });

      console.log('3. RPC Response:', { data, error });

      if (error) {
        console.error('RPC Error:', error);
        setErrorMsg(`Auth Error: ${error.message || 'Failed to authenticate.'}`);
        setLoading(false);
        return;
      }

      // 2. Validate returned user data
      if (!data || data.length === 0) {
        console.warn('No matching user found.');
        setErrorMsg('Invalid email address or password.');
        setLoading(false);
        return;
      }

      const user = data[0];
      console.log('4. User found:', user);

      // 3. Verify allowed roles
      if (user.role === 'super_admin' || user.role === 'admin') {
        localStorage.setItem('sbfp_user', JSON.stringify(user));
        console.log('5. Navigating to /intake...');
        window.location.href = '/intake';
      } else {
        setErrorMsg('Access denied. Administrator privileges required.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Catch Error:', err);
      setErrorMsg(err?.message || 'An unexpected error occurred during authentication.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#111c38] border border-slate-800 rounded-xl p-8 shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-600/20 rounded-full text-blue-400">
            <ShieldCheck className="w-10 h-10" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-white mb-2">
          SBFP Executive Portal
        </h1>
        <p className="text-sm text-center text-slate-400 mb-6">
          Sign in to access daily intake logging and monitoring controls.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@deped.gov.ph"
                className="w-full bg-[#0b1329] border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0b1329] border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}