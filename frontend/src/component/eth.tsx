import { useState } from "react";
import { useWalletStore } from "../store/create";
import { Wallet, HDNodeWallet } from "ethers";

export function Eth() {
  const { seed } = useWalletStore();

  const [index, setIndex] = useState(0);
  const [address, setAddress] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function addWallet() {
    if (!seed) return;

    try {
      setLoading(true);

      const derivePath = `m/44'/60'/${index}'/0'`;
      const hdWallet = HDNodeWallet.fromSeed(seed);
      const child = hdWallet.derivePath(derivePath);

      const wallet = new Wallet(child.privateKey);

      setIndex((prev) => prev + 1);
      setAddress((prev) => [...prev, wallet.address]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-indigo-300">
          🟦 Ethereum Wallets
        </h2>

        <button
          onClick={addWallet}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.03] transition-transform font-medium shadow-lg disabled:opacity-50"
        >
          {loading ? "⏳ Adding..." : "➕ Add Wallet"}
        </button>
      </div>

      {/* Empty state */}
      {address.length === 0 && (
        <p className="text-sm text-white/60 text-center">
          No Ethereum wallets yet. Create your first one ✨
        </p>
      )}

      {/* Wallet list */}
      {address.map((add, i) => (
        <div
          key={add}
          className="bg-black/40 backdrop-blur border border-indigo-700/60 rounded-xl p-4 shadow-inner"
        >
          <div className="text-xs text-indigo-400 mb-1">
            Wallet #{i + 1}
          </div>

          <div className="text-sm break-all text-white/90">
            {add}
          </div>
        </div>
      ))}
    </div>
  );
}
