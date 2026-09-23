'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, CheckCircle2, UserCheck, Utensils, Scale, LogOut, Shield } from 'lucide-react';
import Link from 'next/link';

export default function SBFPDataIntake() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [attended, setAttended] = useState<boolean>(true);
  const [mealProvided, setMealProvided] = useState<boolean>(true);
  const [milkProvided, setMilkProvided] = useState<boolean>(false);
  const [currentBmi, setCurrentBmi] = useState<string>('Wasted');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    checkUserSession();
  }, []);

  async function checkUserSession() {
    // 1. Verify active session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    // 2. Fetch profile role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    // 3. Enforce Role Protection
    if (!profile || (profile.role !== 'super_admin' && profile.role !== 'admin')) {
      await supabase.auth.signOut();
      router.push('/login');
      return;
    }

    setUserEmail(session.user.email || '');
    setUserRole(profile.role);
    setCheckingAuth(false);
    fetchStudents();
  }

  async function fetchStudents() {
    const { data } = await supabase.from('beneficiaries').select('id, first_name, last_name, lrn, current_bmi_status');
    if (data) setBeneficiaries(data);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStudent) return;
    setLoading(true);

    // 1. Log daily feeding & attendance entry
    const { error: logError } = await supabase.from('daily_logs').insert([
      {
        beneficiary_id: selectedStudent,
        attended,
        meal_provided: mealProvided,
        milk_provided: milkProvided,
      },
    ]);

    // 2. Update current BMI status on beneficiary record if changed
    const { error: updateError } = await supabase
      .from('beneficiaries')
      .update({ current_bmi_status: currentBmi })
      .eq('id', selectedStudent);

    setLoading(false);
    if (!logError && !updateError) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center font-sans">
        <p className="text-sm text-slate-400">Verifying authorization permissions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-2xl">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-700">
              <Shield className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                {userRole.replace('_', ' ')}
              </span>
            </div>
            <span className="text-xs text-slate-400">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 text-xs rounded-lg flex items-center gap-1 transition"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-white mb-2 flex items-center gap-2">
          <Utensils className="text-blue-500" /> SBFP Beneficiary Intake Form
        </h1>
        <p className="text-xs text-slate-400 mb-6">
          Record daily feeding cycle attendance, milk provision, and nutritional updates.
        </p>

        {submitted && (
          <div className="mb-6 p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-lg flex items-center gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Daily monitoring log recorded successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Learner */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Select Student / Beneficiary</label>
            <select
              required
              value={selectedStudent}
              onChange={(e) => {
                setSelectedStudent(e.target.value);
                const s = beneficiaries.find((b) => b.id === e.target.value);
                if (s) setCurrentBmi(s.current_bmi_status);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">-- Choose Learner --</option>
              {beneficiaries.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.first_name} {b.last_name} (LRN: {b.lrn})
                </option>
              ))}
            </select>
          </div>

          {/* Daily Checks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-400" /> Present in Class?
              </span>
              <input
                type="checkbox"
                checked={attended}
                onChange={(e) => setAttended(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-emerald-400" /> Hot Meal Served?
              </span>
              <input
                type="checkbox"
                checked={mealProvided}
                onChange={(e) => setMealProvided(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-400" /> Fresh Milk Served?
              </span>
              <input
                type="checkbox"
                checked={milkProvided}
                onChange={(e) => setMilkProvided(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded"
              />
            </label>
          </div>

          {/* Updated BMI Status */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Updated BMI Status</label>
            <select
              value={currentBmi}
              onChange={(e) => setCurrentBmi(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="Severely Wasted">Severely Wasted</option>
              <option value="Wasted">Wasted</option>
              <option value="Normal">Normal</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !selectedStudent}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold rounded-lg transition-colors text-sm"
          >
            {loading ? 'Submitting Log...' : 'Save Monitoring Entry'}
          </button>
        </form>
      </div>
    </div>
  );
}