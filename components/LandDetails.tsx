
import React, { useState, useEffect } from 'react';
import { LandRecord, LandStatus, UserProfile } from '../types';
import { analyzeLandDispute, VerificationResult } from '../services/geminiService';

interface LandDetailsProps {
  land: LandRecord;
  currentUser: UserProfile;
  onBack: () => void;
  onTransfer: (landId: string) => void;
}

const LandDetails: React.FC<LandDetailsProps> = ({ land, currentUser, onBack, onTransfer }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const runAICheck = async () => {
    setIsChecking(true);
    const result = await analyzeLandDispute(land.lrNumber, land.description);
    setVerification(result);
    setIsChecking(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={onBack} className="mb-6 flex items-center text-slate-600 hover:text-emerald-600 transition-colors">
        <i className="fa-solid fa-arrow-left mr-2"></i> Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <img src={land.imageUrl} alt={land.location} className="w-full h-80 object-cover" />
            <div className="p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-1">{land.location}, {land.county}</h1>
                  <p className="text-lg text-slate-500 font-medium">LR NO: {land.lrNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-emerald-600">KSh {land.price.toLocaleString()}</p>
                  <p className="text-slate-400 text-sm">Immutable Blockchain Price</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Land Size</p>
                  <p className="text-lg font-semibold text-slate-800">{land.size}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Status</p>
                  <p className={`text-lg font-semibold ${land.status === LandStatus.AVAILABLE ? 'text-emerald-600' : 'text-red-500'}`}>
                    {land.status.replace('_', ' ')}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Cert Verified</p>
                  <p className="text-lg font-semibold text-emerald-600">YES <i className="fa-solid fa-circle-check ml-1"></i></p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Property Description</h2>
                <p className="text-slate-600 leading-relaxed">{land.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Ownership Provenance (Blockchain)</h2>
                <div className="space-y-4">
                  {land.history.map((tx, idx) => (
                    <div key={tx.id} className="flex gap-4 items-start">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200">
                          <i className="fa-solid fa-link text-xs"></i>
                        </div>
                        {idx < land.history.length - 1 && <div className="w-0.5 h-full bg-slate-100 my-1"></div>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{tx.type} - {tx.timestamp}</p>
                        <p className="text-xs text-slate-500">From: {tx.from} | To: {tx.to}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-1">TX Hash: {tx.hash}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Verification Center</h3>
            
            {verification ? (
              <div className={`p-4 rounded-xl border mb-4 ${verification.hasDispute ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <i className={`fa-solid ${verification.hasDispute ? 'fa-triangle-exclamation text-red-600' : 'fa-shield-check text-emerald-600'}`}></i>
                  <p className={`font-bold ${verification.hasDispute ? 'text-red-700' : 'text-emerald-700'}`}>
                    {verification.hasDispute ? 'Dispute Detected' : 'Clear Title'}
                  </p>
                </div>
                <p className="text-sm text-slate-600 mb-2">{verification.reasoning}</p>
                {verification.courtCaseRef && (
                  <p className="text-xs font-mono bg-white p-2 rounded border border-slate-200">
                    CASE REF: {verification.courtCaseRef}
                  </p>
                )}
                <div className="mt-3 text-xs text-slate-400">AI Confidence: {(verification.confidenceScore * 100).toFixed(1)}%</div>
              </div>
            ) : (
              <div className="mb-4">
                <p className="text-sm text-slate-500 mb-4">Run our ArdhiAI check to verify court cases and registry authenticity.</p>
                <button 
                  onClick={runAICheck}
                  disabled={isChecking}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {isChecking ? (
                    <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Analyzing...</>
                  ) : (
                    <><i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Run AI Dispute Check</>
                  )}
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-700 mb-2">Current Owner</h4>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <i className="fa-solid fa-user text-slate-400"></i>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{land.owner.name}</p>
                  <p className="text-xs text-slate-500 font-mono truncate w-32">{land.owner.walletAddress}</p>
                </div>
                {land.owner.identityVerified && (
                  <i className="fa-solid fa-circle-check text-emerald-500 text-xs" title="Identity Verified"></i>
                )}
              </div>

              {land.status === LandStatus.AVAILABLE && !verification?.hasDispute && (
                <>
                  {!showConfirm ? (
                    <button 
                      onClick={() => setShowConfirm(true)}
                      className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                    >
                      Instant Purchase
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 text-center font-medium">Confirm blockchain transfer for {land.price.toLocaleString()} KSh?</p>
                      <button 
                        onClick={() => onTransfer(land.id)}
                        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
                      >
                        Sign & Pay
                      </button>
                      <button 
                        onClick={() => setShowConfirm(false)}
                        className="w-full py-2 text-slate-500 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </>
              )}
              {verification?.hasDispute && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg text-center">
                  TRANSFER BLOCKED DUE TO DISPUTE
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-cube"></i> Blockchain Node
            </h3>
            <div className="space-y-3 text-xs font-mono opacity-80">
              <p>STATUS: SYNCED</p>
              <p>LAST_BLOCK: #984210</p>
              <p>HASH: {land.deedSignature}</p>
              <p>MINISTRY_APPROVAL: PENDING</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandDetails;
