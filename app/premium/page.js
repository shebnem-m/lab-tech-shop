"use client";

import { useState, useEffect } from "react";

export default function PremiumPage() {
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [date, setDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("monthly"); 
  const [status, setStatus] = useState("");
  const [error, setError] = useState(""); 

  useEffect(() => {
    const savedPremiumStatus = localStorage.getItem('isPremium');
    if (savedPremiumStatus === 'true') {
      setStatus('success');
    }
  }, []);

  const handlePayment = (e) => {
    e.preventDefault();
    setError("");

    if (cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Card number must be exactly 16 digits!");
      return;
    }

    setStatus('loading');

    setTimeout(() => {
      setStatus('success');
      localStorage.setItem('isPremium', 'true');
      localStorage.setItem('premiumPlan', plan);
      window.dispatchEvent(new Event("storage_update")); 
    }, 1500);
  };

  const handleCancelPremium = () => {
    localStorage.removeItem('isPremium');
    localStorage.removeItem('premiumPlan');
    setStatus('');
    setName('');
    setCardNumber('');
    setDate('');
    setCvc('');
    setEmail('');
    window.dispatchEvent(new Event("storage_update"));
  };
 
  const handleCardNumberChange = (e) => {
  const input = e.target.value.replace(/\D/g, ""); 
  const formatted = input.match(/.{1,4}/g)?.join(" ") || "";
  setCardNumber(formatted);
};

const handleDateChange = (e) => {
  const input = e.target.value.replace(/\D/g, ""); 
  if (input.length <= 4) {
    const formatted = input.length > 2 ? `${input.slice(0, 2)}/${input.slice(2)}` : input;
    setDate(formatted);
  }
};
  return (
    <div className="mx-auto my-12 max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-black/40">
      <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-black dark:text-white">
        Premium Subscription
      </h2>
      
      {status === 'success' ? (
        <div className="text-center py-4">
          <div className="mb-3 text-5xl">✅</div>
          <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            Payment complete, ads removed!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Thank you for subscribing to our <strong className="capitalize">{localStorage.getItem('premiumPlan') || plan}</strong> plan.
          </p>
          <button 
            onClick={handleCancelPremium}
            className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500"
          >
            Cancel Premium & Restore Ads
          </button>
        </div>
      ) : (
        <form onSubmit={handlePayment} className="flex flex-col gap-5">
          
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-500/20">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Select Plan:
            </label>
            <div className="flex gap-4">
              <label className={`flex flex-1 items-center justify-center p-3 rounded-xl border cursor-pointer text-sm font-medium transition-all ${
                plan === 'monthly' 
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400' 
                  : 'border-black/10 text-gray-600 dark:border-white/10 dark:text-gray-400 hover:bg-gray-50'
              }`}>
                <input type="radio" name="plan" value="monthly" checked={plan === 'monthly'} onChange={() => setPlan('monthly')} className="mr-2 accent-indigo-600" />
                Monthly ($4.99)
              </label>
              <label className={`flex flex-1 items-center justify-center p-3 rounded-xl border cursor-pointer text-sm font-medium transition-all ${
                plan === 'lifetime' 
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400' 
                  : 'border-black/10 text-gray-600 dark:border-white/10 dark:text-gray-400 hover:bg-gray-50'
              }`}>
                <input type="radio" name="plan" value="lifetime" checked={plan === 'lifetime'} onChange={() => setPlan('lifetime')} className="mr-2 accent-indigo-600" />
                Lifetime ($29.99)
              </label>
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-600 dark:border-white/10 dark:focus:border-indigo-500" placeholder="example@mail.com" />
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">Cardholder Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-600 dark:border-white/10 dark:focus:border-indigo-500" placeholder="John Doe" />
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">Card Number</label>
            <input type="text" required maxLength="19" value={cardNumber} onChange={handleCardNumberChange} className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-600 dark:border-white/10 dark:focus:border-indigo-500" placeholder="1234 5678 1234 5678" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">Expiration (MM/YY)</label>
              <input type="text" required maxLength="5" value={date} onChange={handleDateChange} className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-600 dark:border-white/10 dark:focus:border-indigo-500" placeholder="12/29" />
            </div>
            <div className="flex-1">
              <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">CVC</label>
              <input type="password" required maxLength="3" value={cvc} onChange={(e) => setCvc(e.target.value)} className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-600 dark:border-white/10 dark:focus:border-indigo-500" placeholder="123" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status === 'loading'} 
            className="mt-2 rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:bg-indigo-400"
          >
            {status === 'loading' ? 'Processing...' : `Pay for ${plan === 'monthly' ? 'Monthly' : 'Lifetime'}`}
          </button>
        </form>
      )}
    </div>
  );
}