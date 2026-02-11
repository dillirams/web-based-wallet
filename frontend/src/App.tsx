import "./App.css";
import { useState } from "react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { useWalletStore } from "./store/create";
import { Sol } from "./component/sol";
import { Eth } from "./component/eth";

export default function App() {
  const { mnuemonics, setMnuemonics, setSeed } = useWalletStore();
  const [network, setNetwork] = useState<"sol" | "eth" | null>(null);

  function createWallet() {
    const mnemonic = generateMnemonic();
    const seed = mnemonicToSeedSync(mnemonic);

    setMnuemonics(mnemonic);
    setSeed(seed);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-black to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 text-white">
        
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-6 tracking-wide">
          🚀 My Crypto Wallet
        </h1>

        {!mnuemonics ? (
          <button
            onClick={createWallet}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.02] transition-transform font-semibold shadow-lg"
          >
            🔐 Create Wallet
          </button>
        ) : (
          <>
            {/* Mnemonic Vault */}
            <div className="mb-6 p-4 rounded-xl bg-black/40 border border-indigo-400 text-sm break-words shadow-inner">
              <p className="text-indigo-300 font-semibold mb-2">
                Recovery Phrase (keep it safe)
              </p>
              <div className="leading-relaxed text-white/90">
                {mnuemonics}
              </div>
            </div>

            {/* Network Selector */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setNetwork("sol")}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  network === "sol"
                    ? "bg-indigo-600 shadow-md"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                🟣 Solana
              </button>

              <button
                onClick={() => setNetwork("eth")}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  network === "eth"
                    ? "bg-indigo-600 shadow-md"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                🟦 Ethereum
              </button>
            </div>

            {/* Wallet Area */}
            <div className="mt-4">
              {network === "sol" && <Sol />}
              {network === "eth" && <Eth />}
              {!network && (
                <p className="text-center text-white/60 text-sm">
                  Select a network to continue
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
