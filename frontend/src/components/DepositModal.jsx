

export default function DepositModal({ method, amount, setAmount, onClose, onConfirm }) {
  const presets = [100, 500, 1000, 10, 50];
  const rate = 1; // Example: 1 USD = 1 USDT

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative bg-lightbg dark:bg-primary dark:text-white text-black w-full h-full md:max-w-lg md:h-auto md:rounded-2xl shadow-lg flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <button onClick={onClose}>←</button>
          <h2 className="font-semibold">Deposit</h2>
          <button className="text-gray-400">🎧</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Payment Channel */}
          <div className="flex items-center justify-between bg-dark p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <img
                src={method?.icon}
                alt={method?.name}
                className="w-8 h-8"
              />
              <span className="font-medium">{method?.name}</span>
            </div>
            <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center  text-sm">✔</span>
          </div>

          {/* Amount Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Amount</span>
              <div className="flex gap-1 text-xs">
                <button className="px-3 py-1 bg-green-600  rounded-l-md">USD</button>
                <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-r-md">USDT</button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {presets.map((p, i) => (
                <button
                  key={i}
                  className={`p-4 rounded-lg font-semibold relative ${
                    amount == p
                      ? "border-2 border-green-500"
                      : "bg-dark "
                  }`}
                  onClick={() => setAmount(p)}
                >
                  {i === 0 && (
                    <span className="absolute -top-2 -left-2 bg-red-500  text-[10px] px-1 rounded">
                      HOT
                    </span>
                  )}
                  ${p}
                </button>
              ))}
              <button
                className="bg-dark p-4 rounded-lg"
                onClick={() => setAmount("")}
              >
                Others
              </button>
            </div>
          </div>

          {/* Input */}
          <div>
            <label className="block text-sm mb-1">Enter Your Deposit Amount</label>
            <div className="flex items-center bg-dark rounded-lg px-3 py-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-lg"
                placeholder="0"
              />
              <span className="text-gray-400">USD</span>
            </div>
          </div>

          {/* Exchange rate + received */}
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Exchange rate:</span>
              <span>1 USD = {rate} USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Actual amount received:</span>
              <span className="font-semibold">${amount || 0}</span>
            </div>
          </div>

          {/* Attention */}
          <div className="text-xs text-gray-400 bg-dark p-3 rounded-lg leading-relaxed">
            <p>① Make your transfer using only TRC20 network. Sending your crypto with any other network will result in the loss of your crypto.</p>
            <p className="mt-2">② Only transfer USDT. Transferring any other crypto will result in the loss of your asset.</p>
          </div>
        </div>

        {/* Footer bar */}
        <div className="p-4 border-t border-gray-700 flex justify-between items-center">
          <div>
            <div className="font-semibold">{amount || 0} USDT</div>
            <div className="text-gray-400">{amount || 0} USD (Amount in $)</div>
          </div>
          <button
            onClick={onConfirm}
            className="bg-green-600 px-5 py-2 rounded-full"
          >
            Deposit
          </button>
        </div>
      </div>
    </div>
  );
}
