import { ChevronLeft, IdCard, FileImage } from "lucide-react";
import { useState } from "react";

export default function VerificationModal({ onClose, onSuccess }) {
  const [docType, setDocType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFile = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!docType || !selectedFile) return;
    onSuccess()
    onClose();

  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative flex flex-col bg-gray-200 dark:bg-gray-900
          text-black dark:text-white w-full h-full
          md:w-[80%] md:h-[85%] md:max-w-2xl md:max-h-[85vh]
          md:rounded-2xl md:shadow-xl md:p-6
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-lightbg dark:bg-primary md:bg-transparent md:dark:bg-transparent p-4 md:p-0 border-b md:border-0 border-gray-300 dark:border-gray-700 sticky top-0">
          <button onClick={onClose}>
            <ChevronLeft className="w-6 h-6" />
          </button>

          <h2 className="text-lg md:text-xl font-semibold">
            Identity Verification
          </h2>

          <div className="w-6" />
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-4 pt-6 space-y-6"
          encType="multipart/form-data"
        >
          {/* Document Type */}
          <div>
            <label className="block mb-2 text-lg font-medium">Document Type</label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDocType("passport")}
                className={`
                  flex items-center justify-center gap-2 p-4 rounded-lg border
                  ${docType === "passport"
                    ? "border-secondary bg-secondary/10"
                    : "border-gray-300 dark:border-gray-700"
                  }
                `}
              >
                <IdCard className="w-5 h-5" />
                Passport
              </button>

              <button
                type="button"
                onClick={() => setDocType("id_card")}
                className={`
                  flex items-center justify-center gap-2 p-4 rounded-lg border
                  ${docType === "id_card"
                    ? "border-secondary bg-secondary/10"
                    : "border-gray-300 dark:border-gray-700"
                  }
                `}
              >
                <IdCard className="w-5 h-5" />
                ID Card
              </button>
            </div>
          </div>

          {/* Upload Section */}
          <div>
            <label className="block mb-2 text-lg font-medium">
              Upload Document
            </label>

            <label className="
              w-24 h-24 border-2 border-dashed rounded-md
              flex flex-col items-center justify-center cursor-pointer
              text-gray-400 gap-1
            ">
              {selectedFile ? (
                <FileImage className="w-8 h-8" />
              ) : (
                <span className="text-3xl">+</span>
              )}

              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFile}
              />
            </label>

            {selectedFile && (
              <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                {selectedFile.name}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className={`
                w-full py-3 rounded-full transition text-center
                ${!docType || !selectedFile
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-secondary text-white hover:opacity-90"
                }
              `}
              disabled={!docType || !selectedFile}
            >
              Submit Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
