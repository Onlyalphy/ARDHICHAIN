
import React from 'react';
import { LandRecord, LandStatus } from '../types';

interface LandCardProps {
  land: LandRecord;
  onClick: (land: LandRecord) => void;
}

const LandCard: React.FC<LandCardProps> = ({ land, onClick }) => {
  const getStatusColor = (status: LandStatus) => {
    switch (status) {
      case LandStatus.AVAILABLE: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case LandStatus.DISPUTED: return 'bg-red-100 text-red-700 border-red-200';
      case LandStatus.SOLD: return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div 
      onClick={() => onClick(land)}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={land.imageUrl} 
          alt={land.location} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold border ${getStatusColor(land.status)}`}>
          {land.status.replace('_', ' ')}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-slate-800">{land.location}, {land.county}</h3>
            <p className="text-slate-500 text-sm font-medium">{land.lrNumber}</p>
          </div>
          <p className="font-bold text-emerald-600">KSh {land.price.toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-4 mt-3 text-slate-600 text-sm">
          <span><i className="fa-solid fa-expand mr-1"></i> {land.size}</span>
          <span className="truncate"><i className="fa-solid fa-user-check mr-1"></i> {land.owner.name}</span>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
            HASH: {land.deedSignature.substring(0, 12)}...
          </span>
          <button className="text-emerald-600 text-sm font-semibold hover:underline">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandCard;
