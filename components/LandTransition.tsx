
import React, { useState } from 'react';
import { verifyTitleDeedDocument, VerificationResult } from '../services/geminiService';

interface LandTransitionProps {
  onComplete: () => void;
}

const LandTransition: React.FC<LandTransitionProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [formData, setFormData] = useState({
    lrNumber: '',
    ownerName: '',
    idNumber: '',
    location: '',
    size: ''
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVerifying(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      try {
        const result = await verifyTitleDeedDocument(base64String);
        setVerificationResult(result);
        if (result.isAuthentic) {
          setStep(2);
        }
      } catch (error) {
        alert("Error verifying document. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate final submission to registry
    setStep(3);
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            <i className="fa-solid fa-file-shield"></i>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Transition Land to Blockchain</h2>
          <p className="text-slate-500">Secure your ownership against fraud and grabbers permanently.</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center">
              <i className="fa-solid fa-cloud-arrow-up text-4xl text-slate-300 mb-4"></i>
              <h3 className="font-bold text-slate-800 mb-2">Upload Digital Title Deed</h3>
              <p className="text-slate-500 text-sm mb-6">Scan or photo of your original Ministry of Lands title deed.</p>
              <input 
                type="file" 
                id="deed-upload" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileUpload}
              />
              <label 
                htmlFor="deed-upload"
                className={`inline-block px-8 py-3 rounded-xl font-bold cursor-pointer transition-all ${isVerifying ? 'bg-slate-200 text-slate-500' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              >
                {isVerifying ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Verifying with AI...</> : 'Select File'}
              </label>
            </div>
            {verificationResult && !verificationResult.isAuthentic && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex gap-3">
                <i className="fa-solid fa-triangle-exclamation mt-1"></i>
                <p className="text-sm font-medium">{verificationResult.reasoning}</p>
              </div>
            )}
            <div className="flex items-center gap-4 text-slate-400 text-xs font-medium">
              <span className="flex-grow h-px bg-slate-200"></span>
              <span>VERIFICATION POWERED BY ARDHI-AI</span>
              <span className="flex-grow h-px bg-slate-200"></span>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 mb-6">
              <i className="fa-solid fa-circle-check text-emerald-600"></i>
              <p className="text-emerald-800 font-bold text-sm">Title Deed Verified Successfully!</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Owner Name (As per Deed)</label>
                <input 
                  type="text" required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.ownerName}
                  onChange={e => setFormData({...formData, ownerName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">LR Number</label>
                <input 
                  type="text" required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.lrNumber}
                  onChange={e => setFormData({...formData, lrNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ID/Passport Number</label>
                <input 
                  type="text" required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.idNumber}
                  onChange={e => setFormData({...formData, idNumber: e.target.value})}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all mt-6"
            >
              Sign & Commit to Blockchain
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-10">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-emerald-600 text-3xl">
                <i className="fa-solid fa-link"></i>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Hashing to Ledger...</h3>
            <p className="text-slate-500">We are generating your unique digital signature and invalidating the legacy entry in the Ministry of Lands database.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandTransition;
