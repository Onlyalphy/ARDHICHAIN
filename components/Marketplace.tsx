
import React, { useState } from 'react';
import { LandRecord } from '../types';
import LandCard from './LandCard';

interface MarketplaceProps {
  lands: LandRecord[];
  onSelectLand: (land: LandRecord) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ lands, onSelectLand }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCounty, setFilterCounty] = useState('All Counties');

  const counties = ['All Counties', ...Array.from(new Set(lands.map(l => l.county)))];

  const filteredLands = lands.filter(land => {
    const matchesSearch = land.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         land.lrNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCounty = filterCounty === 'All Counties' || land.county === filterCounty;
    return matchesSearch && matchesCounty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Secure Kenyan Land Registry</h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Browse verified land listings protected by blockchain technology. Instant transfers, AI-driven dispute detection, and immutable title deeds.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-grow">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search by Location or LR Number..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm font-semibold text-slate-700"
          value={filterCounty}
          onChange={(e) => setFilterCounty(e.target.value)}
        >
          {counties.map(county => (
            <option key={county} value={county}>{county}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLands.map(land => (
          <LandCard key={land.id} land={land} onClick={onSelectLand} />
        ))}
        {filteredLands.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <i className="fa-solid fa-folder-open text-slate-200 text-6xl mb-4"></i>
            <p className="text-slate-500 text-xl font-medium">No land found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
