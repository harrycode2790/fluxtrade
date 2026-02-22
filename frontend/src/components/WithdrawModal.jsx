export default function WithdrawModal({ coins, selectedCoin, onSelect, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center md:justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="dark:bg-primary bg-lightbg w-full md:max-w-md md:rounded-2xl p-4 rounded-t-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag bar for mobile */}
        <div className="flex justify-center mb-3 md:hidden">
          <div className="w-12 h-1.5 bg-gray-600 rounded-full"></div>
        </div>

        <h2 className="text-lg font-semibold mb-4 text-center">Choose a currency</h2>

        <div className="space-y-4">
          {coins.map((coin) => (
            <div
              key={coin.name}
              className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-700"
              onClick={() => onSelect(coin)}
            >
              <div className="flex items-center space-x-3">
                <img src={coin.icon} alt={coin.name} className="w-8 h-8 rounded-md" />
                <div>
                  <p className="font-medium">{coin.name}</p>
                  <p className="text-gray-400 text-md">Available quota: ${coin.quota.toFixed(2)}</p>
                </div>
              </div>
              {selectedCoin?.name === coin.name && (
                <span className="text-green-500 text-xl">✔</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
