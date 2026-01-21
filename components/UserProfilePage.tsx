
import React from 'react';
import { UserProfile } from '../types';

interface UserProfilePageProps {
  user: UserProfile;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: User Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="blockchain-gradient h-32 relative">
              <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 rounded-3xl bg-white p-1 border border-slate-100 shadow-xl overflow-hidden">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=f8fafc&color=065f46&size=128&bold=true`} 
                    alt={user.name} 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
            <div className="pt-16 p-8">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                {user.verified && (
                  <i className="fa-solid fa-circle-check text-emerald-500 text-lg" title="Identity Verified"></i>
                )}
              </div>
              <p className="text-slate-500 font-medium mb-6">{user.email}</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Account Role</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">{user.role}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Wallet Address</span>
                  <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{user.walletAddress}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">KYC Status</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <i className="fa-solid fa-shield-check"></i> VERIFIED
                  </span>
                </div>
              </div>

              <button className="w-full mt-8 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                Edit Profile Settings
              </button>
            </div>
          </div>

          <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-100">
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">Available Balance</p>
            <h3 className="text-4xl font-black mb-6">KSh {user.walletBalance.toLocaleString()}</h3>
            <div className="flex gap-3">
              <button className="flex-grow py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold backdrop-blur-sm transition-all text-sm">
                Top Up
              </button>
              <button className="flex-grow py-3 bg-white text-emerald-700 rounded-xl font-bold transition-all text-sm">
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900">Blockchain Activity Log</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600">
                  <i className="fa-solid fa-download"></i>
                </button>
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600">
                  <i className="fa-solid fa-filter"></i>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Entity/Reference</th>
                    <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">TX Hash</th>
                    <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {user.transactions.length > 0 ? (
                    [...user.transactions].reverse().map((tx) => (
                      <tr key={tx.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-5 text-sm font-medium text-slate-600">{tx.timestamp}</td>
                        <td className="py-5">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                            tx.type === 'TRANSFER' ? 'bg-blue-100 text-blue-700' :
                            tx.type === 'REGISTRATION' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-5">
                          <p className="text-sm font-bold text-slate-800">{tx.landLrNumber || 'N/A'}</p>
                          <p className="text-[10px] text-slate-400">From: {tx.from.substring(0, 10)}...</p>
                        </td>
                        <td className="py-5">
                          <span className="text-[10px] font-mono text-slate-400 group-hover:text-emerald-600 cursor-help" title={tx.hash}>
                            {tx.hash.substring(0, 12)}...
                          </span>
                        </td>
                        <td className="py-5 text-right">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            CONFIRMED
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <i className="fa-solid fa-receipt text-slate-100 text-6xl mb-4"></i>
                        <p className="text-slate-400 font-medium">No transactions recorded yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <h4 className="text-lg font-bold">Security Awareness</h4>
                <p className="text-sm opacity-60">Protect your digital identity and land assets.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <h5 className="text-sm font-bold mb-1">Two-Factor Authentication</h5>
                <p className="text-xs opacity-60">Keep your login secure with a secondary code sent to your mobile device.</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <h5 className="text-sm font-bold mb-1">Private Key Safety</h5>
                <p className="text-xs opacity-60">ArdhiChain will never ask for your recovery phrase. Never share it with anyone.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
