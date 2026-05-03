import React, { useState } from 'react';
import { Card, Button, Loader } from '@/shared/ui';
import { X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileForm({ initialData, onSave, onCancel, isSaving }) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    location: initialData?.location || "",
    bio: initialData?.bio || "",
    phone: initialData?.phone || "",
    website: initialData?.website || "",
    socialLinks: {
      linkedin: initialData?.socialLinks?.linkedin || "",
      twitter: initialData?.socialLinks?.twitter || "",
      facebook: initialData?.socialLinks?.facebook || "",
      github: initialData?.socialLinks?.github || ""
    },
    investmentPreferences: {
      sectors: initialData?.investmentPreferences?.sectors || [],
      minInvestment: initialData?.investmentPreferences?.minInvestment || "",
      maxInvestment: initialData?.investmentPreferences?.maxInvestment || ""
    }
  });

  const [sectorInput, setSectorInput] = useState("");

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleAddSector = (e) => {
    e.preventDefault();
    const val = sectorInput.trim();
    if (val && !formData.investmentPreferences.sectors.includes(val)) {
      handleNestedChange('investmentPreferences', 'sectors', [...formData.investmentPreferences.sectors, val]);
      setSectorInput("");
    }
  };

  const removeSector = (sector) => {
    handleNestedChange(
      'investmentPreferences', 
      'sectors', 
      formData.investmentPreferences.sectors.filter(s => s !== sector)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const minVal = Number(formData.investmentPreferences.minInvestment) || 0;
    const maxVal = Number(formData.investmentPreferences.maxInvestment) || 0;

    if (maxVal > 0 && maxVal < minVal) {
      toast.error("Max investment must be greater than Min investment");
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-[#0c0c0c] border-white/10 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#01F27B] rounded-full"></span>
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium">First Name</label>
            <input 
              type="text" 
              value={formData.firstName} 
              onChange={e => handleChange('firstName', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#01F27B] transition-colors"
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium">Last Name</label>
            <input 
              type="text" 
              value={formData.lastName} 
              onChange={e => handleChange('lastName', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#01F27B] transition-colors"
              placeholder="Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium">Phone Number</label>
            <input 
              type="tel" 
              value={formData.phone} 
              onChange={e => handleChange('phone', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#01F27B] transition-colors"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium">Location</label>
            <input 
              type="text" 
              value={formData.location} 
              onChange={e => handleChange('location', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#01F27B] transition-colors"
              placeholder="San Francisco, CA"
            />
          </div>
        </div>
      </Card>

      <Card className="bg-[#0c0c0c] border-white/10 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#01F27B] rounded-full"></span>
          About Summary
        </h3>
        <div className="space-y-2">
          <label className="text-sm text-white/70 font-medium">Bio</label>
          <textarea 
            value={formData.bio} 
            onChange={e => handleChange('bio', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#01F27B] transition-colors min-h-[120px] resize-y"
            placeholder="Tell founders about your background, expertise, and what you look for in a team..."
            maxLength={1000}
          />
          <div className="text-right text-xs text-white/40">
            {formData.bio.length} / 1000
          </div>
        </div>
      </Card>

      <Card className="bg-[#0c0c0c] border-white/10 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#01F27B] rounded-full"></span>
          Investment Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium">Min Investment ($)</label>
            <input 
              type="number" 
              value={formData.investmentPreferences.minInvestment} 
              onChange={e => handleNestedChange('investmentPreferences', 'minInvestment', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#01F27B] transition-colors"
              placeholder="e.g. 10000"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium">Max Investment ($)</label>
            <input 
              type="number" 
              value={formData.investmentPreferences.maxInvestment} 
              onChange={e => handleNestedChange('investmentPreferences', 'maxInvestment', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#01F27B] transition-colors"
              placeholder="e.g. 500000"
              min="0"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm text-white/70 font-medium">Target Sectors</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={sectorInput} 
              onChange={e => setSectorInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddSector(e)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#01F27B] transition-colors"
              placeholder="Add a sector (e.g. FinTech, AI) and press Enter"
            />
            <Button type="button" onClick={handleAddSector} variant="outline" className="border-white/20">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {formData.investmentPreferences.sectors.map((sector, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 bg-[#01F27B]/10 text-[#01F27B] border border-[#01F27B]/20 py-1 pl-3 pr-2 rounded-full text-sm font-medium">
                {sector}
                <button 
                  type="button" 
                  onClick={() => removeSector(sector)}
                  className="hover:bg-[#01F27B]/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {formData.investmentPreferences.sectors.length === 0 && (
              <p className="text-white/30 text-sm italic">No sectors added.</p>
            )}
          </div>
        </div>
      </Card>

      <Card className="bg-[#0c0c0c] border-white/10 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#01F27B] rounded-full"></span>
          Online Presence
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium">Website</label>
            <input 
              type="url" 
              value={formData.website} 
              onChange={e => handleChange('website', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#01F27B] transition-colors"
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium">LinkedIn</label>
            <input 
              type="url" 
              value={formData.socialLinks.linkedin} 
              onChange={e => handleNestedChange('socialLinks', 'linkedin', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#01F27B] transition-colors"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium">Twitter / X</label>
            <input 
              type="url" 
              value={formData.socialLinks.twitter} 
              onChange={e => handleNestedChange('socialLinks', 'twitter', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#01F27B] transition-colors"
              placeholder="https://twitter.com/username"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium">GitHub</label>
            <input 
              type="url" 
              value={formData.socialLinks.github} 
              onChange={e => handleNestedChange('socialLinks', 'github', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#01F27B] transition-colors"
              placeholder="https://github.com/username"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSaving}
          className="border-white/20 hover:bg-white/5"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSaving}
          className="bg-[#01F27B] text-black hover:bg-[#01F27B]/90 font-semibold min-w-[120px]"
        >
          {isSaving ? <Loader size="sm" className="mr-2" /> : null}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
