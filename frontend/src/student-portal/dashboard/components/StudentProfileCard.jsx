import React from "react";
import { UserCircle } from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const StudentProfileCard = ({ profile, onDownloadId }) => {
  const cardRef = useRef();

  // Profile load hone tak
  if (!profile) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col items-center">
          <UserCircle size={80} className="text-gray-400" />
          <p className="mt-3 text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  const hasPhoto =
    profile.photoUrl && profile.photoUrl !== "/uploads/profile-images/";

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
    >
      <div className="flex flex-col items-center">
        {hasPhoto ? (
          <img
            src={`http://localhost:5050${profile.photoUrl}`}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover"
          />
        ) : (
          <UserCircle size={80} className="text-blue-500" />
        )}

        <h3 className="mt-4 text-lg font-semibold text-gray-800">
          {profile.firstName || "N/A"} {profile.lastName || ""}
        </h3>

        <p className="text-sm text-gray-500">
          {profile.user?.loginId || "N/A"}
        </p>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Course</span>
          <span className="font-medium">{profile.course || "N/A"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Phone</span>
          <span className="font-medium">{profile.phone || "N/A"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Email</span>
          <span className="font-medium">{profile.user?.email || "N/A"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span className="text-green-600 font-medium">Active</span>
        </div>
        <button
          onClick={onDownloadId}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Download Student ID
        </button>
      </div>
    </div>
  );
};

export default StudentProfileCard;
