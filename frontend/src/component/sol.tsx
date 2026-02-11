import { useState } from "react";
import axios from "axios";
import nacl from "tweetnacl";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { useWalletStore } from "../store/create";

export function Sol() {
  const { seed } = useWalletStore();

  const [solPublicKey, setSolPublicKey] = useState<string[]>([]);
  const [walletIndex, setWalletIndex] = useState(0);
  const [balance, setBalance] = useState<Record<string, number | null>>({});
  const [copied, setCopied] = useState("");
  const [loading, setLoading] = useState(false);

  async function addSolWalletFn() {
    if (!seed) return;

    try {
      setLoading(true);

      const path = `m/44'/501'/${walletIndex}'/0'`;
      const derivedSeed = derivePath(path, seed).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();

      setSolPublicKey((prev) => [...prev, publicKey]);
      setWalletIndex((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  }

  async function showSolBalance(publicKey: string) {
    try {
      setLoading(true);

      const res = await axios.post(
        "https://solana-mainnet.g.alchemy.com/v2/I6bzuLk18JGZXv9spj7DF",
        {
          id: 1,
          jsonrpc: "2.0",
          method: "getBalance",
          params: [publicKey],
        }
      );

      const sol = res.data.result.value / 1_000_000_000;
      setBalance((prev) => ({ ...prev, [publicKey]: sol }));
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(pk: string) {
    navigator.clipboard.writeText(pk);
    setCopied(pk);
    setTimeout(() => setCopied(""), 1500);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-indigo-300">
          🟣 Solana Wallets
        </h2>

        <button
          onClick={addSolWalletFn}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.03] transition-transform font-medium shadow-lg disabled:opacity-50"
        >
          {loading ? "⏳ Adding..." : "➕ Add Wallet"}
        </button>
      </div>

      {/* Wallet list */}
      {solPublicKey.length === 0 && (
        <p className="text-sm text-white/60 text-center">
          No Solana wallets yet. Create your first one ✨
        </p>
      )}

      {solPublicKey.map((pk, i) => (
        <div
          key={pk}
          className="bg-black/40 backdrop-blur border border-indigo-700/60 rounded-xl p-4 shadow-inner"
        >
          <div className="text-xs text-indigo-400 mb-1">
            Wallet #{i + 1}
          </div>

          <div className="text-sm break-all text-white/90">
            {pk}
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => showSolBalance(pk)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-sm"
            >
              {balance[pk] ?? "Show balance"}
            </button>

            <button
              onClick={() => copyToClipboard(pk)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm"
            >
              {copied === pk ? "✅ Copied" : "📋 Copy address"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
