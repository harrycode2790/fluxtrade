import { ChevronLeft } from "lucide-react";
import { useState } from "react";

export default function PersonalInfoModal({ onClose }) {
  const [nicknameOpen, setNicknameOpen] = useState(false);
  const [ageOpen, setAgeOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);

  const [nickname, setNickname] = useState("FmjQGRoF");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Not set");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Modal */}
      <div
        className="
          relative flex flex-col bg-gray-200 dark:bg-gray-900
          text-black dark:text-white w-full h-full
          md:w-[80%] md:h-[80%] md:max-w-2xl md:max-h-[85vh]
          md:rounded-2xl md:shadow-xl md:p-6
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-lightbg dark:bg-primary md:bg-transparent md:dark:bg-transparent p-4 md:p-1.5 border-b md:border-0 border-gray-300 dark:border-gray-700 sticky top-0">
          <button onClick={onClose}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg md:text-xl font-semibold">Personal Information</h2>
          <div className="w-6" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto divide-y dark:divide-gray-800 divide-gray-400 mt-2 md:mt-4">
          {/* Profile Picture */}
          <div
            onClick={() => document.getElementById("profilePictureInput")?.click()}
            className="bg-lightbg dark:bg-primary p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span>Profile Picture</span>
            <img
              id="profilePreview"
              src="assets/images/smaple-favicon.png"
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
          <input
            type="file"
            id="profilePictureInput"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                const fileURL = URL.createObjectURL(e.target.files[0]);
                document.getElementById("profilePreview").src = fileURL;
              }
            }}
          />

          {/* Nickname */}
          <div
            onClick={() => setNicknameOpen(true)}
            className="bg-lightbg dark:bg-primary p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span>Nickname</span>
            <span className="text-gray-400">{nickname}</span>
          </div>

          {/* Gender */}
          <div
            onClick={() => setGenderOpen(true)}
            className="bg-lightbg dark:bg-primary p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span>Gender</span>
            <span className="text-gray-400">{gender}</span>
          </div>

          {/* Age */}
          <div
            onClick={() => setAgeOpen(true)}
            className="bg-lightbg dark:bg-primary p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span>Age</span>
            <span className="text-gray-400">{age || "Not set"}</span>
          </div>
        </div>
      </div>

      {/* Nickname Modal */}
      {nicknameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setNicknameOpen(false)}
          />
          {/* Centered Card */}
          <div className="relative bg-lightbg dark:bg-primary text-black dark:text-white w-11/12 max-w-sm rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-center mb-6">Nickname</h2>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 focus:outline-none focus:border-white py-2 mb-8"
            />
            <button
              className="w-full bg-secondary py-3 rounded-full text-center font-medium text-lg"
              onClick={() => setNicknameOpen(false)}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Age Modal */}
      {ageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setAgeOpen(false)}
          />
          {/* Centered Card */}
          <div className="relative bg-lightbg dark:bg-primary text-black dark:text-white w-11/12 max-w-sm rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-center mb-6">Edit Age</h2>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 focus:outline-none focus:border-white py-2 mb-8"
            />
            <button
              className="w-full bg-secondary py-3 rounded-full text-center font-medium text-lg"
              onClick={() => setAgeOpen(false)}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Gender Modal */}
      {genderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setGenderOpen(false)}
          />
          {/* Centered Card */}
          <div className="relative bg-lightbg dark:bg-primary text-black dark:text-white w-11/12 max-w-sm rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-6 text-center">Select Gender</h2>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  setGender("Male");
                  setGenderOpen(false);
                }}
                className="w-full py-3 rounded-full font-medium text-lg hover:opacity-90"
              >
                Male
              </button>
              <button
                onClick={() => {
                  setGender("Female");
                  setGenderOpen(false);
                }}
                className="w-full py-3 rounded-full font-medium text-lg hover:opacity-90"
              >
                Female
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
