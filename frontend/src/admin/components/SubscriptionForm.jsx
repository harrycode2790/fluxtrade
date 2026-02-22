function Input({ label, placeholder, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
        {label}
      </label>

      <input
        {...props}
        placeholder={placeholder}
        className="
          w-full px-3 py-2.5 rounded-xl
          bg-gray-100 dark:bg-gray-800
          border border-transparent
          text-sm
          focus:outline-none focus:ring-2 focus:ring-secondary/40
          focus:border-secondary
          transition
        "
      />
    </div>
  );
}

function Textarea({ label, placeholder, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
        {label}
      </label>

      <textarea      
        {...props}
        placeholder={placeholder}
        rows={4}
        className="
          w-full px-3 py-2.5 rounded-xl
          bg-gray-100 dark:bg-gray-800
          border border-transparent
          text-sm resize-none
          focus:outline-none focus:ring-2 focus:ring-secondary/40
          focus:border-secondary
          transition
        "
      />
    </div>
  );
}


/* ----------- FORMS ----------- */

export function BotForm() {
  return (
    <div className="space-y-5">
      <Input
        label="Bot Name"
        placeholder="AlphaWave Bot"
      />

      <Textarea    
        label="Description"
        placeholder="Trend-following bot optimized for BTC and ETH"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Followers" type="number" placeholder="1200" />
        <Input label="ROI (%)" type="number" placeholder="42.5" />
        <Input label="Win Rate (%)" type="number" placeholder="68" />
        <Input label="Equity" type="number" placeholder="25000" />
      </div>

      <Input label="Price" type="number" placeholder="99" />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Exchange" placeholder="Binance" />
        <Input label="Strategy" placeholder="Trend Following" />
        <Input label="Risk Level" placeholder="Medium" />
      </div>
    </div>
  );
}


export function CopyTraderForm() {
  return (
    <div className="space-y-5">
      <Input
        label="Trader Name"
        placeholder="John Doe"
      />

      <Input
        label="Public Handle"
        placeholder="@johntrades"
      />

      <Textarea
        label="Description"
        placeholder="Experienced crypto trader with 5+ years in BTC scalping"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Followers" type="number" placeholder="5400" />
        <Input label="ROI (%)" type="number" placeholder="58.2" />
        <Input label="Win Rate (%)" type="number" placeholder="71" />
        <Input label="Equity" type="number" placeholder="100000" />
      </div>

      <Input label="Price" type="number" placeholder="149" />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Platform" placeholder="Bybit" />
        <Input label="Trading Style" placeholder="Scalping" />
        <Input label="Risk Level" placeholder="Low / Medium / High" />
      </div>
    </div>
  );
}


export function PackageForm() {
  return (
    <div className="space-y-5">
      <Input
        label="Package Name"
        placeholder="Pro Trader Package"
      />

      <Input
        label="Price"
        type="number"
        placeholder="299"
      />

      <Textarea
        label="Features"
        placeholder={`• Access to premium bots
• Weekly strategy updates
• Priority support`}
      />
    </div>
  );
}

