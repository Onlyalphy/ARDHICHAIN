
import React, { useState, useEffect } from 'react';
import { LandRecord, LandStatus, UserProfile, TransactionRecord } from './types';
import { INITIAL_LAND_DATA, MOCK_USER } from './constants';
import Marketplace from './components/Marketplace';
import LandDetails from './components/LandDetails';
import LandTransition from './components/LandTransition';
import UserProfilePage from './components/UserProfilePage';

const App: React.FC = () => {
  const [lands, setLands] = useState<LandRecord[]>(INITIAL_LAND_DATA);
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [selectedLand, setSelectedLand] = useState<LandRecord | null>(null);
  const [currentTab, setCurrentTab] = useState<'MARKET' | 'OWNED' | 'TRANSITION' | 'PROFILE'>('MARKET');
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const handleTransfer = (landId: string) => {
    const land = lands.find(l => l.id === landId);
    if (!land) return;

    if (user.walletBalance < land.price) {
      alert("Insufficient funds in blockchain wallet.");
      return;
    }

    // SIMULATE BLOCKCHAIN TRANSFER
    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      timestamp: new Date().toISOString().split('T')[0],
      from: land.owner.name,
      to: user.name,
      type: 'TRANSFER',
      hash: `0x${Math.random().toString(16).substr(2, 32)}`,
      landLrNumber: land.lrNumber
    };

    const updatedLands = lands.map(l => {
      if (l.id === landId) {
        return {
          ...l,
          owner: {
            id: user.id,
            name: user.name,
            identityVerified: true,
            walletAddress: user.walletAddress
          },
          status: LandStatus.SOLD,
          history: [...l.history, newTx],
          deedSignature: `REVOKED-OLD-SIGNATURE-${Math.random().toString(36).substr(2, 5)} >> NEW-BLOCK-${newTx.hash.substr(0, 10)}`
        };
      }
      return l;
    });

    setLands(updatedLands);
    setUser({ 
      ...user, 
      walletBalance: user.walletBalance - land.price,
      transactions: [...user.transactions, newTx]
    });
    setSelectedLand(null);
    setCurrentTab('OWNED');
    setShowNotification(`Successfully purchased land! Title Deed LR NO: ${land.lrNumber} has been transferred to your wallet.`);
    
    setTimeout(() => setShowNotification(null), 8000);
  };

  const ownedLands = lands.filter(l => l.owner.id === user.id);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentTab('MARKET'); setSelectedLand(null); }}>
              <div className="w-10 h-10 blockchain-gradient rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-200">
                <i className="fa-solid fa-cube"></i>
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">ARDHICHAIN</span>
            </div>

            <div className="hidden md:flex items-center gap-8 font-semibold text-slate-600">
              <button 
                onClick={() => { setCurrentTab('MARKET'); setSelectedLand(null); }}
                className={`${currentTab === 'MARKET' ? 'text-emerald-600' : 'hover:text-emerald-600'} transition-colors`}
              >
                Marketplace
              </button>
              <button 
                onClick={() => { setCurrentTab('OWNED'); setSelectedLand(null); }}
                className={`${currentTab === 'OWNED' ? 'text-emerald-600' : 'hover:text-emerald-600'} transition-colors`}
              >
                My Land Portfolio
              </button>
              <button 
                onClick={() => { setCurrentTab('TRANSITION'); setSelectedLand(null); }}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-upload text-sm"></i> List My Land
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Balance</p>
                <p className="text-emerald-600 font-bold">KSh {user.walletBalance.toLocaleString()}</p>
              </div>
              <button 
                onClick={() => { setCurrentTab('PROFILE'); setSelectedLand(null); }}
                className={`w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden transition-all ${currentTab === 'PROFILE' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'}`}
              >
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=065f46&color=fff`} alt="Profile" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-[#F8FAFC]">
        {showNotification && (
          <div className="max-w-7xl mx-auto px-4 pt-4">
            <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl flex items-center justify-between shadow-xl animate-bounce">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-circle-check text-2xl"></i>
                <p className="font-bold">{showNotification}</p>
              </div>
              <button onClick={() => setShowNotification(null)} className="opacity-70 hover:opacity-100">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        )}

        {selectedLand ? (
          <LandDetails 
            land={selectedLand} 
            currentUser={user} 
            onBack={() => setSelectedLand(null)} 
            onTransfer={handleTransfer}
          />
        ) : (
          <>
            {currentTab === 'MARKET' && (
              <Marketplace 
                lands={lands} 
                onSelectLand={setSelectedLand} 
              />
            )}
            {currentTab === 'OWNED' && (
              <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Land Portfolio</h1>
                    <p className="text-slate-500">Your verified digital assets on the blockchain.</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Portfolio Value</p>
                    <p className="text-2xl font-black text-slate-800">
                      KSh {ownedLands.reduce((acc, l) => acc + l.price, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                {ownedLands.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ownedLands.map(land => (
                      <div key={land.id} className="relative">
                        <div className="absolute top-4 left-4 z-10 bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                          OWNED ASSET
                        </div>
                        <Marketplace lands={[land]} onSelectLand={setSelectedLand} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-20 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <i className="fa-solid fa-earth-africa text-slate-300 text-4xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">No lands owned yet</h2>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start building your land portfolio by exploring the secure marketplace.</p>
                    <button 
                      onClick={() => setCurrentTab('MARKET')}
                      className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
                    >
                      Explore Marketplace
                    </button>
                  </div>
                )}
              </div>
            )}
            {currentTab === 'TRANSITION' && (
              <LandTransition onComplete={() => setCurrentTab('OWNED')} />
            )}
            {currentTab === 'PROFILE' && (
              <UserProfilePage user={user} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 text-white mb-6">
                <div className="w-8 h-8 blockchain-gradient rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-cube text-sm"></i>
                </div>
                <span className="text-xl font-black tracking-tight">ARDHICHAIN</span>
              </div>
              <p className="max-w-md">
                Eliminating land fraud in Kenya through blockchain technology and AI verification. 
                Our mission is to provide every Kenyan with an immutable, secure, and authentic digital title deed.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Resources</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Ministry of Lands Integration</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Blockchain Whitepaper</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">AI Fraud Detection Docs</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Legal Framework</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Contact</h4>
              <ul className="space-y-4 text-sm">
                <li><i className="fa-solid fa-location-dot mr-2"></i> Ardhi House Annex, Nairobi</li>
                <li><i className="fa-solid fa-phone mr-2"></i> +254 700 000 000</li>
                <li><i className="fa-solid fa-envelope mr-2"></i> support@ardhichain.co.ke</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2024 ArdhiChain Kenya Limited. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
