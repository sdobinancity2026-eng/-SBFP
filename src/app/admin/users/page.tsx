'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function UserManagement() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSuperAdmin();
  }, []);

  async function checkSuperAdmin() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push('/login');

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'super_admin') {
      router.push('/intake'); // Redirect non-super admins
      return;
    }

    loadProfiles();
  }

  async function loadProfiles() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setProfiles(data);
    setLoading(false);
  }

  async function updateRole(userId: string, newRole: string) {
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    loadProfiles();
  }

  if (loading) return <div className="p-8 text-white">Loading users...</div>;

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-slate-100 font-sans">
      <h1 className="text-2xl font-bold mb-6">User Role Management</h1>
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-4xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="pb-3">Email</th>
              <th className="pb-3">Current Role</th>
              <th className="pb-3">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-b border-slate-700/50">
                <td className="py-3">{p.email}</td>
                <td className="py-3 font-semibold uppercase text-xs text-blue-400">{p.role}</td>
                <td className="py-3">
                  <select
                    value={p.role}
                    onChange={(e) => updateRole(p.id, e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
