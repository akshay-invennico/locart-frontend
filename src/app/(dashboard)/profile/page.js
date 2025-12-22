"use client";

import PopupForm from "@/components/ui/popupform";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { changePasswordConfig } from "./config";

import {
  updateProfile,
  updatePassword
} from "@/state/user/userService";
import { useUserContext } from "@/hooks/useUserContext";

const ProfilePage = () => {
  const { user, setUser } = useUserContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("/noimage.png");
  const [photoFile, setPhotoFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || user.email_address || "");
      setProfilePhoto(user.profile_picture || user?.profile || "/noimage.png");
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
      setPhotoFile(file);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (photoFile) formData.append("profile_photo", photoFile);

      const res = await updateProfile(formData);

      setUser({
        ...user,
        name,
        profile_picture: res?.user?.profile_picture || res?.user?.profile || profilePhoto
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (data) => {
    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });

      toast.success("Password updated successfully!");
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white border border-[#E4E4E6] rounded-2xl shadow-md mt-6 font-sans">
      <h2 className="text-2xl font-semibold mb-2">My Profile</h2>
      <p className="text-sm text-gray-500 mb-6">
        Manage your personal information and update your account credentials securely.
      </p>

      <div className="border-b border-gray-300 mb-6"></div>

      <h3 className="text-xl font-semibold mb-8">Personal Information</h3>

      <div className="grid md:grid-cols-2 gap-4 mb-20">
        <div>
          <label className="block text-sm font-medium mb-1">Profile Photo</label>
          <p className="text-sm text-gray-500">Update your display image.</p>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative">
            <label className="relative cursor-pointer">
              <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-2 border-primary1">
                <Image
                  src={profilePhoto}
                  alt="Profile"
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 bg-primary1 text-white p-2 rounded-full cursor-pointer text-sm"
              >
                📸
              </label>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 items-center mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <p className="text-sm text-gray-500">Visible across your admin panels.</p>
        </div>
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 items-center mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <p className="text-sm text-gray-500">Used for login and notifications.</p>
        </div>
        <div>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 items-center mb-6">
        <div></div>
        <div>
          <button
            onClick={handleUpdateProfile}
            className="w-full bg-primary1 text-white px-4 py-2 rounded-lg hover:bg-primary1/80 transition"
          >
            Update Profile
          </button>
        </div>
      </div>

      <div className="border-b border-gray-300 mb-6"></div>

      <h3 className="text-xl font-semibold mb-4">Account Security</h3>

      <div className="grid md:grid-cols-2 gap-4 items-center mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Change Password</label>
          <p className="text-sm text-gray-500">
            Change your password to keep your account secure.
          </p>
        </div>
        <div>
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-primary1 text-white px-4 py-2 rounded-lg hover:bg-primary1/80 transition"
          >
            Change Password
          </button>
          {isOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
              onClick={() => setIsOpen(false)}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <PopupForm
                  config={changePasswordConfig}
                  width="600px"
                  onApply={handlePasswordUpdate}
                  onCancel={() => setIsOpen(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
