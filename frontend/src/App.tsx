import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [mnuemonics, setMnuemonics] = useState("");
  const [addWallet, setAddwallet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  async function getMnuemocis() {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/seed");
      setMnuemonics(res.data.mnemonic);
    } finally {
      setLoading(false);
    }
  }

  async function addWalletFn() {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/createwallet");
      setAddwallet((prev) => [...prev, res.data.publicKey]);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(pk) {
    navigator.clipboard.writeText(pk);
    setCopied(pk);
    setTimeout(() => setCopied(""), 1500);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-indigo-800 flex justify-center items-center p-4">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white shadow-xl">
        
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-4">
          🚀 My First Crypto Wallet
        </h1>

        {/* Mnemonic Box */}
        {mnuemonics && (
          <div className="mb-4 p-4 rounded-lg bg-black/40 border border-indigo-400 text-sm break-words">
            <p className="text-indigo-300 font-semibold mb-1">
              Recovery Phrase
            </p>
            {mnuemonics}
          </div>
        )}

        {/* Button */}
        <button
          onClick={!mnuemonics ? getMnuemocis : addWalletFn}
          disabled={loading}
          className="w-full py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition font-semibold disabled:opacity-50"
        >
          {loading
            ? "⏳ Processing..."
            : mnuemonics
            ? "➕ Add Wallet"
            : "🔐 Create Wallet"}
        </button>

        {/* Wallet List */}
        {addWallet.length > 0 && (
          <div className="mt-6 space-y-3">
            <h2 className="text-lg font-semibold text-indigo-300">
              Your Wallets
            </h2>

            {addWallet.map((pk, i) => (
              <div
                key={pk}
                className="flex items-center justify-between bg-black/40 border border-indigo-700 rounded-lg p-3"
              >
                <div className="text-sm break-all">
                  <span className="text-indigo-400 mr-2">
                    #{i + 1}
                  </span>
                  {pk}
                </div>

                <button
                  onClick={() => copyToClipboard(pk)}
                  className="ml-3 px-2 py-1 text-xs rounded bg-indigo-600 hover:bg-indigo-700"
                >
                  {copied === pk ? "✅ Copied" : "📋 Copy"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
