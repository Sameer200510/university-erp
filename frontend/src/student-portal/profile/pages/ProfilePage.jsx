import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { profileService } from "../services/profile.service";
import { Save, Camera } from "lucide-react";

const ProfilePage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await profileService.getProfile();
        if (data) {
          // Format date for the input field
          if (data.dob) {
            data.dob = new Date(data.dob).toISOString().split("T")[0];
            setPhotoUrl(data.photoUrl || "");
          }
          reset(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setMessage("");
      await profileService.updateProfile(data);
      setMessage("Profile saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploadingPhoto(true);

      const response = await profileService.uploadPhoto(file);

      setPhotoUrl(response.photoUrl);

      setMessage("Profile photo updated successfully");
    } catch (error) {
      console.error(error);

      setMessage("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">
          Personal Information
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Update your personal details and contact information.
        </p>
      </div>

      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col items-center">
          <img
            src={
              photoUrl
                ? `http://localhost:5050${photoUrl}`
                : "https://ui-avatars.com/api/?name=Student"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
          />

          <label className="mt-4 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <Camera size={16} />

              {uploadingPhoto ? "Uploading..." : "Change Photo"}
            </div>
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              {...register("firstName", { required: "First name is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              {...register("lastName", { required: "Last name is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              {...register("dob")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              {...register("phone")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              {...register("address")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Applied For
            </label>
            <input
              {...register("course")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. B.Tech Computer Science"
            />
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm font-medium ${message.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
          >
            {message}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
