/** QRDepositModal.secure.backend.jsx **/
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useTransactionStore } from "../store/useTransactionStore";

export default function QRDepositModal({ method, amount, onBack, onClose }) {
  const { authUser, createPassphrase, refreshUser } = useAuthStore();
  const {
    validatePassphrase,
    fetchDepositAddress,
    createDeposit,
    isDepositing,
  } = useTransactionStore();

  const [copied, setCopied] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false); // passphrase validated
  const [showAddress, setShowAddress] = useState(false);
  const [address, setAddress] = useState(null); // fetched from backend
  const [error, setError] = useState("");

  const methodName = method?.name || "unknown";

  // Reset states when method changes
  useEffect(() => {
    setPassphrase("");
    setValidated(false);
    setShowAddress(false);
    setAddress(null);
    setError("");
    refreshUser();
  }, [methodName, refreshUser]);

  // Copy handler
  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      setError("Copy failed. Make sure clipboard is available.", err);
    }
  };

  // create Transaction Phassphrase
  const handleCreatePassphrase = async () => {
    setLoading(true);
    try {
      await createPassphrase({ passphrase });
      setPassphrase("");
    } catch (err) {
      setError(err.message || "Failed to create passphrase");
    } finally {
      setLoading(false);
    }
  };

  // handle validate passphrase
  const handleValidatePassphrase = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await validatePassphrase({ passphrase });
      if (res.validate) {
        setValidated(true);
        setPassphrase("");
      }
    } catch (err) {
      setError(err.message || "Wrong passphrase");
    } finally {
      setLoading(false);
    }
  };

  // handle fetch deposit address

  const handleFetchAddress = async () => {
    setLoading(true);
    setError("");
    try {
      const addr = await fetchDepositAddress(method._id);
      setAddress(addr);
      setShowAddress(true);
    } catch (err) {
      setError(err.message || "Failed to fetch address");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDeposit = async () => {
    try {
      await createDeposit({
        amount,
        methodId: method._id,
      });

      onClose(); // close modal on success
    } catch (error) {
      setError(error.message || "Failed to deposit ");
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex items-center justify-center p-4 w-full h-full">
        <div className="bg-lightbg dark:bg-primary w-full h-full md:max-w-lg md:h-auto md:rounded-2xl shadow-lg flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <button onClick={onBack} aria-label="Back">
              ←
            </button>
            <h2 className="font-semibold">Deposit</h2>
            <button onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Deposit Amount */}
            <div className="bg-lightbg dark:bg-primary p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Deposit Amount</h3>
              <p className="text-2xl font-bold">{amount ?? "—"} USD</p>
              <p className="text-sm mt-2">Order: {Date.now()}</p>
            </div>

            {/* Payment Method */}
            <div className="bg-lightbg dark:bg-primary p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Payment Method</p>
              <p>{methodName}</p>
            </div>

            {/* Passphrase / Address Section */}
            <div className="bg-lightbg dark:bg-primary p-4 rounded-lg text-center">
              {/* 1️⃣ Create Passphrase if user has none */}
              {!authUser.hasTransactionPassphrase && (
                <>
                  <p className="text-sm text-gray-400 mb-2">
                    Set a transaction passphrase.{" "}
                    <span className="text-xs text-red-500">
                      {" "}
                      Keep save cause you can only set it once
                    </span>
                  </p>
                  <input
                    type="password"
                    placeholder="Enter new passphrase"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 mb-2 w-full"
                  />
                  <button
                    className="bg-secondary text-white px-3 py-2 rounded-lg w-full"
                    disabled={loading}
                    onClick={handleCreatePassphrase}
                  >
                    {loading ? "Saving..." : "Create Passphrase"}
                  </button>
                  {error && (
                    <div className="text-sm text-red-400 mt-2">{error}</div>
                  )}
                </>
              )}

              {/* 2️⃣ Validate Passphrase if user has one */}
              {authUser.hasTransactionPassphrase && !validated && (
                <>
                  <p className="text-sm text-gray-400 mb-2">
                    Enter your passphrase to unlock address, Note:{" "}
                    <span className="text-xs text-red-500">
                      {" "}
                      you have 5 mintues to use after validating{" "}
                    </span>
                  </p>
                  <input
                    type="password"
                    placeholder="Your passphrase"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 mb-2 w-full"
                  />
                  <button
                    className={`bg-secondary ${
                      authUser.passphraseLockUntil
                        ? "opacity-50"
                        : "opacity-100"
                    } text-white px-3 py-2 rounded-lg w-full`}
                    disabled={loading}
                    onClick={handleValidatePassphrase}
                  >
                    {loading ? "Validating..." : "Validate Passphrase"}
                  </button>
                  {error && (
                    <div className="text-sm text-red-400 mt-2">{error}</div>
                  )}
                </>
              )}

              {/* 3️⃣ Show Address Button */}
              {validated && !showAddress && (
                <button
                  className="bg-secondary text-white px-4 py-2 rounded-lg w-full"
                  onClick={handleFetchAddress}
                >
                  {loading ? "Fetching address..." : "Show Address"}
                </button>
              )}

              {/* 4️⃣ QR + Copy */}
              {showAddress && address && (
                <div className="text-center mt-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      address
                    )}`}
                    alt="QR Code"
                    className="mx-auto mb-2"
                  />
                  <p className="font-mono break-all max-w-full mb-2">
                    {address}
                  </p>

                  <button
                    className="bg-secondary px-4 py-1 rounded-full"
                    onClick={handleCopy}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              )}

              {error && (
                <div className="text-sm text-red-400 mt-2">{error}</div>
              )}
            </div>

            <div className="text-sm bg-lightbg dark:bg-primary p-3 rounded-lg text-gray-500">
              • Only deposit {methodName} to this address. Other tokens will be
              lost.
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 flex gap-3">
            <button className="flex-1 border border-secondary py-2 rounded-lg">
              Save QR
            </button>
            <button
              onClick={handleConfirmDeposit}
              disabled={isDepositing || !showAddress}
              className={`flex-2 ${
                isDepositing || !showAddress ? "opacity-50" : "opacity-100"
              } bg-secondary text-white py-2 rounded-lg`}
            >
              {isDepositing ? "Processing..." : "Deposit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
