import { useState } from "react";
import trxLogo from "../assets/images/crypto-logos/trx.png";
import usdtLogo from "../assets/images/crypto-logos/USDT-TRC20.png";
import WithdrawModal from "../components/WithdrawModal";
import Sidebar from "../components/Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { ScanLine, ClipboardPaste } from "lucide-react"; // ✅ import icons here

const coins = [
  { name: "TRX", icon: trxLogo, quota: 0.0, networks: [] },
  { name: "USDT", icon: usdtLogo, quota: 0.0, networks: ["TRC20", "BEP20"] },
  
];

export default function WithdrawPage() {
  const [selectedCoin, setSelectedCoin] = useState(coins[1]); // default USDT
  const [showModal, setShowModal] = useState(false);
  const [network, setNetwork] = useState("TRC20");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const availableAmount = 10000; // replace with actual balance
  const adminFee = 0;
  const receiptAmount = amount ? Math.max(0, parseFloat(amount) - adminFee) : 0;

  return (
    <div className="md:flex">
      {/* Sidebar for desktop */}
      <Sidebar />
      <main className="flex-1 p-4  dark:text-white text-black min-h-screen pt-20 md:px-[300px] md:pt-24">
        {/* Header */}
        <div className="dark:bg-primary bg-lightbg px-4 py-3 z-10 flex items-center justify-between mb-4 md:static md:hidden ">
          <button onClick={() => window.history.back()} className="text-xl">
            ←
          </button>
          <h2 className="text-lg font-semibold mx-auto">Crypto</h2>
          <span />
        </div>

        {/* Token Display */}
        <div className="dark:bg-primary bg-lightbg flex items-center justify-between p-3 rounded-lg mb-3">
          <div className="flex gap-2 items-center">
            <img
              src={selectedCoin.icon}
              alt={selectedCoin.name}
              className="w-8 h-8 rounded-md"
            />
            <span className="font-medium">{selectedCoin.name}</span>
          </div>
          <button onClick={() => setShowModal(true)} className="text-xl">
            ›
          </button>
        </div>

        {/* Withdrawal Form */}
        <div className="dark:bg-primary bg-lightbg p-3 rounded-lg mb-3">
          {/* Only show networks if coin has them */}
          {selectedCoin.networks?.length > 0 && (
            <div className="flex space-x-3 mb-5">
              {selectedCoin.networks.map((net) => (
                <button
                  key={net}
                  className={`px-4 py-1 rounded-md font-semibold text-md ${
                    network === net
                      ? "bg-secondary"
                      : "bg-[#2C2C2C] text-green-600"
                  }`}
                  onClick={() => setNetwork(net)}
                >
                  {net}
                </button>
              ))}
            </div>
          )}

          {/* Address */}
          <div className="mb-4">
            <label className="text-md mb-2 block">Withdrawal Address</label>
            <div className="dark:bg-tertiary bg-gray-300 px-4 py-5 rounded-lg flex items-center justify-between">
              <input
                type="text"
                placeholder="Please provide the address"
                className="bg-transparent text-md flex-1 focus:outline-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="flex space-x-2">
                <button title="Scan QR">
                  <ScanLine className="w-5 h-5" /> {/*  Lucide React */}
                </button>
                <button
                  title="Paste"
                  onClick={async () => {
                    const text = await navigator.clipboard.readText();
                    setAddress(text);
                  }}
                >
                  <ClipboardPaste className="w-5 h-5 " /> {/*  Lucide React */}
                </button>
              </div>
            </div>
            <p className="text-xs text-red-500 mt-3 leading-snug">
              * Please ensure that you only send {selectedCoin.name} to this
              address. Sending any other token will not be recoverable.
            </p>
          </div>

          {/* Amount */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-md font-medium">Withdrawal Amount</span>
            </div>
            <div className="dark:bg-tertiary bg-gray-300 px-4 py-5 rounded-lg flex items-center justify-between">
              <input
                type="number"
                placeholder="Enter the withdrawal amount"
                className="bg-transparent text-md flex-1 focus:outline-none"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button
                className="text-green-600 text-md font-medium"
                onClick={() => setAmount(availableAmount)}
              >
                All
              </button>
            </div>
            <div className="text-sm text-gray-400 mt-2">
              Available Amount: ${availableAmount.toFixed(2)} ≈ 0{" "}
              {selectedCoin.name}
            </div>
          </div>

          {/* Fee and Receipt */}
          <div className="space-y-2 text-md mb-6">
            <div className="flex justify-between">
              <span className="">Admin fee</span>
              <span>${adminFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="">Receipt Amount</span>
              <div className="text-right">
                <div>${receiptAmount}</div>
                <div className="text-sm text-gray-500">
                  ≈ {receiptAmount} {selectedCoin.name}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions + Confirm button (desktop inside here) */}
        <div className="dark:bg-primary bg-lightbg text-sm  p-4 rounded-lg leading-relaxed mb-[120px] md:mb-6">
          <div className="flex items-center text-orange-400 font-semibold mb-2">
            ⚠ Withdrawal Instructions:
          </div>
          <ol className="list-decimal list-inside space-y-1 mb-4">
            <li>
              The minimum withdrawal amount should be no less than{" "}
              <span className="text-white font-medium">$10</span>.
            </li>
            <li>
              Your cryptocurrency withdrawal limit is{" "}
              <span className="text-white font-medium">$0.00</span>
            </li>
            <li>
              You can withdraw cryptocurrencies up to the total amount initially
              deposited in cryptocurrencies (up to 100%). The initial deposits
              can be withdrawn in cryptocurrencies. Any amounts (profits) beyond
              the initial deposit can be withdrawn to other payment systems.
            </li>
          </ol>

          {/* Desktop confirm */}
          <div className="hidden md:block">
            <button className="bg-secondary font-semibold py-2 px-6 rounded-md text-sm">
              Confirm
            </button>
          </div>
        </div>

        {/* Mobile fixed confirm */}
        <div className="fixed bottom-0 left-0 right-0 p-5 dark:bg-primary bg-lightbg z-50 md:hidden">
          <button className="w-full bg-secondary font-semibold py-3 rounded-full">
            Confirm
          </button>
        </div>

        {/* Modal */}
        <AnimatePresence mode="wait">
          {showModal && (
            <motion.div
              key="withdraw"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <WithdrawModal
                coins={coins}
                selectedCoin={selectedCoin}
                onSelect={(coin) => {
                  setSelectedCoin(coin);
                  setNetwork(coin.networks[0] || ""); // reset network if coin has networks
                  setShowModal(false);
                }}
                onClose={() => setShowModal(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
