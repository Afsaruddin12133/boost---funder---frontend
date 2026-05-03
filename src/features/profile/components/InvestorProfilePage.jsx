import React, { useState, useEffect } from 'react';
import { Edit3, MapPin } from 'lucide-react';
import { Button, Loader } from '@/shared/ui';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useVerificationStatus } from "@/features/verification/hooks/useVerification";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CheckCircle } from "lucide-react";
import { Badge } from '@/shared/ui/badge';

import ProfileView from './investor/ProfileView';
import ProfileForm from './investor/ProfileForm';
import AvatarUploader from './investor/AvatarUploader';

export default function InvestorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const { data: verStatus } = useVerificationStatus();
  const { user: authUser } = useAuth();
  const isVerified = verStatus?.status === "approved" && authUser?.isVerified === true;
  
  // For avatar upload
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      // Backend route /api/v1/users/me/investor-profile
      const res = await api.get('/api/v1/users/me/investor-profile');
      
      const profileData = res?.data?.user?.profile || res?.data || res;
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch profile', error);
      
      // If the profile simply doesn't exist yet, initialize an empty one
      if (error?.message?.toLowerCase().includes('not found')) {
        setProfile({});
        // Optionally force them into edit mode so they can create it
        setIsEditMode(true);
      } else {
        toast.error('Failed to load profile data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageSelect = (file) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async (formDataState) => {
    try {
      setIsSaving(true);
      const formData = new FormData();

      // Append text fields
      formData.append("firstName", formDataState.firstName);
      formData.append("lastName", formDataState.lastName);
      formData.append("email", formDataState.email);
      formData.append("location", formDataState.location);
      formData.append("bio", formDataState.bio);
      formData.append("phone", formDataState.phone);
      formData.append("website", formDataState.website);

      // Append nested objects (dot notation based on requirement)
      if (formDataState.socialLinks) {
        formData.append("socialLinks.linkedin", formDataState.socialLinks.linkedin);
        formData.append("socialLinks.twitter", formDataState.socialLinks.twitter);
        formData.append("socialLinks.facebook", formDataState.socialLinks.facebook);
        formData.append("socialLinks.github", formDataState.socialLinks.github);
      }

      if (formDataState.investmentPreferences) {
        formData.append("investmentPreferences.minInvestment", formDataState.investmentPreferences.minInvestment || 0);
        formData.append("investmentPreferences.maxInvestment", formDataState.investmentPreferences.maxInvestment || 0);
        
        formDataState.investmentPreferences.sectors.forEach(sector => {
          formData.append("investmentPreferences.sectors", sector);
        });
      }

      // Append image if selected
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      // PUT to backend
      const res = await api.put('/api/v1/users/me/investor-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Profile updated successfully");
      setIsEditMode(false);
      setImageFile(null);
      setPreviewUrl(null);
      await fetchProfile(); // Refresh the data
      
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setImageFile(null);
    setPreviewUrl(null);
  };

    return <Loader fullPage label="Loading profile..." />;

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDE (Profile Summary & Header) */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden">
            {/* Subtle top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#01F27B] to-transparent" />
            
            <div className="flex justify-center mb-6">
              {isEditMode ? (
                <AvatarUploader 
                  currentImage={profile?.profileImage} 
                  previewUrl={previewUrl}
                  onImageSelect={handleImageSelect} 
                />
              ) : (
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 bg-white/5">
                  {profile?.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-3xl font-bold bg-white/5">
                      {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-white">
                {profile?.firstName || profile?.lastName ? `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() : 'Your Name'}
              </h2>
              {isVerified && (
                <Badge className="bg-[#01F27B] text-black border-0 rounded-full text-[9px] font-bold px-2 py-0.5 flex items-center gap-1">
                  <CheckCircle className="w-2.5 h-2.5" /> Verified
                </Badge>
              )}
            </div>
            <p className="text-white/50 mb-4">{profile?.email || 'email@example.com'}</p>
            
            {profile?.location && !isEditMode && (
              <div className="flex items-center justify-center gap-2 text-white/70 mb-6 bg-white/5 w-max mx-auto px-4 py-1.5 rounded-full border border-white/5">
                <MapPin className="w-4 h-4 text-[#01F27B]" />
                <span className="text-sm font-medium">{profile.location}</span>
              </div>
            )}
            
            {!isEditMode && (
              <Button 
                onClick={() => setIsEditMode(true)}
                className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* RIGHT SIDE (Details Sections or Edit Form) */}
        <div className="w-full lg:w-2/3">
          <div className="transition-all duration-300">
            {isEditMode ? (
              <ProfileForm 
                initialData={profile || {}} 
                onSave={handleSave} 
                onCancel={handleCancel}
                isSaving={isSaving}
              />
            ) : (
              <ProfileView profile={profile || {}} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
