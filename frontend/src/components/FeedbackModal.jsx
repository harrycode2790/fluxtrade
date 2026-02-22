import { ChevronLeft, Mail } from "lucide-react";

export default function FeedbackModal({ onClose }) {
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
          <h2 className="text-lg md:text-xl font-semibold">Feedback</h2>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Scrollable Form */}
        <form
          className="flex-1 overflow-y-auto px-4 pt-6 space-y-6"
          method="POST"
          encType="multipart/form-data"
          action="/submit-feedback"
        >
          {/* Feedback Input */}
          <div>
            <label className="block mb-2 text-lg font-medium">
              Please enter your feedback
            </label>
            <textarea
              name="feedback"
              required
              className="w-full bg-lightbg dark:bg-primary border border-gray-300 dark:border-gray-700 rounded-md p-4 h-40 text-base focus:outline-none"
              placeholder="Please leave us with a detailed explanation to help us solve the problem quickly"
            />
          </div>

          {/* Upload Picture */}
          <div>
            <label className="block mb-2 text-lg font-medium">
              Choose Picture:
            </label>
            <label className="w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer text-2xl text-gray-400">
              +
              <input type="file" name="screenshot" accept="image/*" className="hidden" />
            </label>
          </div>

          {/* Contact Email */}
          <div>
            <label className="block mb-2 text-lg font-medium">
              Contact details:
            </label>
            <div className="flex items-center bg-lightbg dark:bg-primary px-4 py-3 rounded-md space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="contact"
                defaultValue="123@gmail.com"
                className="bg-transparent w-full focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-secondary text-white text-center rounded-full hover:opacity-90 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
