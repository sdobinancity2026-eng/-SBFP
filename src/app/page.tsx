'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  TrendingUp, 
  DollarSign, 
  GraduationCap, 
  AlertTriangle, 
  ShieldCheck, 
  PieChart as PieIcon, 
  CheckCircle2, 
  Activity,
  HeartPulse,
  Utensils,
  CalendarCheck,
  Plus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function SBFPExecutiveDashboard() {
  const [stats, setStats] = useState({
    overallPerformance: 78,
    budgetUtilization: 92,
    learnerOutcomes: 76,
    riskAlerts: 3,
  });

  const [governanceData, setGovernanceData] = useState<any[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Trend Data for Executive Chart
  const trendData = [
    { month: 'JAN', performance: 35 },
    { month: 'FEB', performance: 52 },
    { month: 'MAR', performance: 48 },
    { month: 'APR', performance: 68 },
    { month: 'MAY', performance: 82 },
    { month: 'JUN', performance: 94 },
  ];

  // Category Breakdown Data
  const categoryData = [
    { name: 'Strategic', value: 30, color: '#1E40AF' },
    { name: 'Financial', value: 20, color: '#16A34A' },
    { name: 'Operational', value: 20, color: '#2563EB' },
    { name: 'Governance', value: 10, color: '#0284C7' },
    { name: 'Risk', value: 10, color: '#EA580C' },
    { name: 'Learner Outcomes', value: 10, color: '#EAB308' },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(false);
    try {
      const { data: gov } = await supabase.from('governance_indicators').select('*');
      const { data: ben } = await supabase.from('beneficiaries').select('*');
      if (gov) setGovernanceData(gov);
      if (ben) setBeneficiaries(ben);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      {/* Header Banner */}
      <header className="mb-8 border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Utensils className="text-blue-500 h-8 w-8" />
            School-Based Feeding Program (SBFP) Executive Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Transforming evidence into performance intelligence for student health & attendance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/intake" 
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> Log Daily Intake
          </Link>

          <div className="bg-blue-950 border border-blue-800 px-4 py-1.5 rounded-lg text-right">
            <span className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider block">Target Attendance</span>
            <span className="text-base font-bold text-blue-400">85% - 100%</span>
          </div>
        </div>
      </header>

      {/* SECTION 1: EXECUTIVE DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Performance</p>
            <h2 className="text-3xl font-black text-blue-400 mt-1">{stats.overallPerformance}%</h2>
            <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> On Track
            </p>
          </div>
          <div className="p-3 bg-blue-950/60 rounded-full border border-blue-800/50">
            <TrendingUp className="w-7 h-7 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Budget Utilization</p>
            <h2 className="text-3xl font-black text-emerald-400 mt-1">{stats.budgetUtilization}%</h2>
            <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> Efficient
            </p>
          </div>
          <div className="p-3 bg-emerald-950/60 rounded-full border border-emerald-800/50">
            <DollarSign className="w-7 h-7 text-emerald-400" />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Learner Outcomes</p>
            <h2 className="text-3xl font-black text-purple-400 mt-1">{stats.learnerOutcomes}%</h2>
            <p className="text-xs text-purple-300 flex items-center gap-1 mt-1">
              <GraduationCap className="w-3 h-3" /> Improving
            </p>
          </div>
          <div className="p-3 bg-purple-950/60 rounded-full border border-purple-800/50">
            <HeartPulse className="w-7 h-7 text-purple-400" />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk Alerts</p>
            <h2 className="text-3xl font-black text-amber-500 mt-1">{stats.riskAlerts}</h2>
            <p className="text-xs text-amber-400 flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3" /> Needs Attention
            </p>
          </div>
          <div className="p-3 bg-amber-950/60 rounded-full border border-amber-800/50">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
          </div>
        </div>
      </div>

      {/* SECTION 2: VISUAL ANALYTICS & AHA MOMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Trend line Chart */}
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl col-span-1">
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" /> Trend Over Time
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Line type="monotone" dataKey="performance" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance by Area Donut */}
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl col-span-1">
          <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-emerald-400" /> Performance By Area
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={45} outerRadius={70} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AHA Moment & Core Goals Card */}
        <div className="bg-gradient-to-br from-amber-950/40 to-slate-800 border border-amber-500/30 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-base mb-2">
              <span className="p-1.5 bg-amber-500/20 rounded-lg">💡</span> AHA MOMENT
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              "Good monitoring transforms data into decisions. Decisions drive outcomes."
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Dashboards should answer leadership questions—not just display raw data.
            </p>
          </div>

          <div className="border-t border-slate-700/60 pt-3 mt-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase mb-2">SBFP Core Focus:</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-blue-400"/> Restore Wasted/Severely Wasted to Normal</li>
              <li className="flex items-center gap-1.5"><CalendarCheck className="w-3.5 h-3.5 text-emerald-400"/> Daily Meals + Milk Provision Cycles</li>
              <li className="flex items-center gap-1.5"><HeartPulse className="w-3.5 h-3.5 text-purple-400"/> Deworming + Gulayan sa Paaralan</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 3: GOVERNANCE MONITORING DASHBOARD TEMPLATE */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">Governance Monitoring Matrix</h2>
            <p className="text-xs text-slate-400">Activity 24: Purpose & Performance Indicators Alignment</p>
          </div>
          <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs font-mono rounded">Frequency: Review Monthly</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-700 text-xs text-slate-300 uppercase bg-slate-900/50">
                <th className="p-3">Category</th>
                <th className="p-3">Objective</th>
                <th className="p-3">Evidence of Success</th>
                <th className="p-3">KPI</th>
                <th className="p-3">Leading Indicator</th>
                <th className="p-3">Lagging Indicator</th>
                <th className="p-3">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-xs text-slate-300">
              {governanceData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-3 font-semibold text-blue-400">{row.category}</td>
                  <td className="p-3 font-medium text-slate-200">{row.objective}</td>
                  <td className="p-3 text-slate-400">{row.evidence_of_success}</td>
                  <td className="p-3 text-emerald-400 font-semibold">{row.kpi}</td>
                  <td className="p-3 text-slate-300">{row.leading_indicator}</td>
                  <td className="p-3 text-slate-300">{row.lagging_indicator}</td>
                  <td className="p-3 font-bold text-amber-400">{row.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: STUDENT NUTRITIONAL MONITORING LIST */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mt-8">
        <h2 className="text-lg font-bold text-white mb-4">Learner Recovery Roster (SBFP Beneficiaries)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase bg-slate-900/50">
                <th className="p-3">LRN</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Grade & Section</th>
                <th className="p-3">Baseline Status</th>
                <th className="p-3">Current Status</th>
                <th className="p-3">Dewormed?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-xs">
              {beneficiaries.map((b) => (
                <tr key={b.id} className="hover:bg-slate-700/30">
                  <td className="p-3 font-mono text-slate-400">{b.lrn}</td>
                  <td className="p-3 font-semibold text-slate-200">{b.first_name} {b.last_name}</td>
                  <td className="p-3 text-slate-300">Grade {b.grade_level} - {b.section}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-red-300 bg-red-950/80 border border-red-800">
                      {b.initial_bmi_status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded ${b.current_bmi_status === 'Normal' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                      {b.current_bmi_status}
                    </span>
                  </td>
                  <td className="p-3">
                    {b.is_dewormed ? (
                      <span className="text-emerald-400 font-bold">✓ Yes</span>
                    ) : (
                      <span className="text-amber-500 font-bold">✗ Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
