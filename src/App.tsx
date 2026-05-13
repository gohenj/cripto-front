import { useState, useEffect } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(localStorage.getItem("nexus_token") || "");
  const [movements, setMovements] = useState<any[]>([]);
  const [isLoadingLedger, setIsLoadingLedger] = useState(true);
  const [swapFrom, setSwapFrom] = useState("BRL");
  const [swapTo, setSwapTo] = useState("BTC");
  const [swapAmount, setSwapAmount] = useState("");
  const [swapStatus, setSwapStatus] = useState({ type: "", message: "" });
  const [isSwapping, setIsSwapping] = useState(false);
  const [activeTab, setActiveTab] = useState("swap");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState({
    type: "",
    message: "",
  });
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authMessage, setAuthMessage] = useState({ type: "", text: "" });

  function getFriendlyName(type: string) {
    const dictionary: Record<string, string> = {
      DEPOSIT: "Depósito Inicial",
      WITHDRAWAL: "Saque para Conta",
      SWAP_IN: "Conversão (Recebido)",
      SWAP_OUT: "Conversão (Enviado)",
      SWAP_FEE: "Cotação",
    };
    return dictionary[type] || type;
  }
  useEffect(() => {
    if (!token) return;
    async function fetchLedger() {
      try {
        const response = await fetch(
          "https://cripto-back-26of.onrender.com/ledger",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();
        if (response.ok) {
          setMovements(result.data);
        }
      } catch (error) {
        console.error("Erro ao puxar o extrato:", error);
      } finally {
        setIsLoadingLedger(false);
      }
    }

    fetchLedger();
  }, [token]);
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setAuthMessage({ type: "", text: "" });

    try {
      // Lembre de usar a sua URL do Render aqui!
      const response = await fetch("https://cripto-back-26of.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar conta");
      }

      setAuthMessage({
        type: "success",
        text: "Conta criada com sucesso! Faça login.",
      });
      setTimeout(() => setIsRegisterMode(false), 2500);
    } catch (err) {
      if (err instanceof Error) {
        setAuthMessage({ type: "error", text: err.message });
      }
    }
  }
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "https://cripto-back-26of.onrender.com/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }
      localStorage.setItem("nexus_token", data.accessToken);
      setToken(data.accessToken);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao fazer login");
      }
    }
  }

  function handleLogout() {
    localStorage.removeItem("nexus_token");
    setToken("");
  }

  async function handleSwap(e: React.FormEvent) {
    e.preventDefault();
    setIsSwapping(true);
    setSwapStatus({ type: "", message: "" });

    try {
      const response = await fetch(
        "https://cripto-back-26of.onrender.com/swap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            from: swapFrom,
            to: swapTo,
            amount: Number(swapAmount),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao realizar swap");
      }

      setSwapStatus({
        type: "success",
        message: "Swap executado com sucesso!",
      });
      setSwapAmount("");

      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      if (err instanceof Error) {
        setSwapStatus({ type: "error", message: err.message });
      }
    } finally {
      setIsSwapping(false);
    }
  }

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    setIsWithdrawing(true);
    setWithdrawStatus({ type: "", message: "" });

    try {
      const response = await fetch(
        "https://cripto-back-26of.onrender.com/withdraw",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token: "BRL",
            amount: Number(withdrawAmount),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao realizar saque");
      }

      setWithdrawStatus({
        type: "success",
        message: "Saque executado com sucesso!",
      });
      setWithdrawAmount("");

      // Recarrega para atualizar os saldos
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      if (err instanceof Error) {
        setWithdrawStatus({ type: "error", message: err.message });
      }
    } finally {
      setIsWithdrawing(false);
    }
  }

  if (token) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans selection:bg-green-500/30 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <header className="max-w-7xl mx-auto flex justify-between items-center mb-10 relative z-10">
          <div>
            <h1 className="text-2xl font-bold tracking-widest drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">
              NEXUS <span className="text-green-400">CRIPTO</span>
            </h1>
            <p className="text-xs text-slate-500 tracking-widest uppercase mt-1">
              Terminal Central
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-xs font-bold tracking-wider uppercase bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]"
          >
            Desconectar
          </button>
        </header>

        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          <section className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
              <h2 className="text-sm text-slate-400 tracking-widest uppercase mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                Seus Ativos
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-green-400/50 transition-all group cursor-default shadow-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 group-hover:text-slate-400 transition-colors">
                    Real Brasileiro
                  </p>
                  <p className="text-2xl font-bold text-green-400 tracking-wide">
                    {Number(
                      movements.find((m) => m.token === "BRL")?.newBalance || 0,
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">BRL</p>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-orange-400/50 transition-all group cursor-default shadow-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 group-hover:text-slate-400 transition-colors">
                    Bitcoin
                  </p>
                  <p className="text-2xl font-bold text-orange-400 tracking-wide">
                    {Number(
                      movements.find((m) => m.token === "BTC")?.newBalance || 0,
                    ).toFixed(6)}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">BTC</p>
                </div>

                {/* Card ETH */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-blue-400/50 transition-all group cursor-default shadow-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 group-hover:text-slate-400 transition-colors">
                    Ethereum
                  </p>
                  <p className="text-2xl font-bold text-blue-400 tracking-wide">
                    {Number(
                      movements.find((m) => m.token === "ETH")?.newBalance || 0,
                    ).toFixed(6)}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">ETH</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {isLoadingLedger ? (
                <div className="flex items-center justify-center h-40 border border-dashed border-white/10 rounded-xl bg-black/20">
                  <p className="text-sm text-slate-500 tracking-widest uppercase animate-pulse">
                    Buscando blocos...
                  </p>
                </div>
              ) : movements.length === 0 ? (
                <div className="flex items-center justify-center h-40 border border-dashed border-white/10 rounded-xl bg-black/20">
                  <p className="text-sm text-slate-500 tracking-widest uppercase">
                    Nenhuma movimentação encontrada.
                  </p>
                </div>
              ) : (
                movements.map((mov) => (
                  <div
                    key={mov.id}
                    className="flex justify-between items-center p-4 bg-black/40 border border-white/5 rounded-xl hover:bg-black/60 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-2 h-2 rounded-full ${mov.type.includes("IN") || mov.type === "DEPOSIT" ? "bg-green-400" : "bg-red-400"}`}
                      ></div>
                      <div>
                        <p className="text-sm font-bold text-slate-200">
                          {getFriendlyName(mov.type)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(mov.createdAt).toLocaleDateString("pt-BR")}{" "}
                          - {mov.token}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold ${mov.type.includes("IN") || mov.type === "DEPOSIT" ? "text-green-400" : "text-red-400"}`}
                      >
                        {mov.type.includes("IN") || mov.type === "DEPOSIT"
                          ? "+"
                          : "-"}{" "}
                        {Number(mov.amount).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-slate-500">
                        Saldo:{" "}
                        {Number(mov.newBalance).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="space-y-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm text-slate-400 tracking-widest uppercase flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${activeTab === "swap" ? "bg-purple-400" : "bg-red-400"}`}
                  ></div>
                  Terminal
                </h2>

                <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                  <button
                    onClick={() => setActiveTab("swap")}
                    className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded-md transition-all ${activeTab === "swap" ? "bg-purple-600/80 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    Swap
                  </button>
                  <button
                    onClick={() => setActiveTab("saque")}
                    className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded-md transition-all ${activeTab === "saque" ? "bg-red-600/80 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    Saque
                  </button>
                </div>
              </div>
              {activeTab === "swap" ? (
                <form onSubmit={handleSwap} className="flex flex-col gap-5">
                  {swapStatus.message && (
                    <div
                      className={`p-3 text-sm text-center rounded-lg border backdrop-blur-md ${swapStatus.type === "success" ? "bg-green-500/10 border-green-500/50 text-green-400" : "bg-red-500/10 border-red-500/50 text-red-400"}`}
                    >
                      {swapStatus.message}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-xs text-slate-400 tracking-wider uppercase">
                        Origem
                      </label>
                      <select
                        value={swapFrom}
                        onChange={(e) => setSwapFrom(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all cursor-pointer"
                      >
                        <option value="BRL">BRL (Real)</option>
                        <option value="BTC">BTC (Bitcoin)</option>
                        <option value="ETH">ETH (Ethereum)</option>
                      </select>
                    </div>

                    <div className="flex items-end pb-3">
                      <span className="text-purple-400/50">➔</span>
                    </div>

                    <div className="flex-1 space-y-2">
                      <label className="text-xs text-slate-400 tracking-wider uppercase">
                        Destino
                      </label>
                      <select
                        value={swapTo}
                        onChange={(e) => setSwapTo(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all cursor-pointer"
                      >
                        <option value="BTC">BTC (Bitcoin)</option>
                        <option value="ETH">ETH (Ethereum)</option>
                        <option value="BRL">BRL (Real)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 tracking-wider uppercase">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                      placeholder="Ex: 100"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSwapping}
                    className="w-full mt-2 bg-purple-600 text-white font-bold tracking-widest uppercase py-3 rounded-lg hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSwapping ? "Autenticando Swap..." : "Executar Swap"}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={handleWithdraw}
                  className="flex flex-col gap-5 animate-fade-in"
                >
                  {withdrawStatus.message && (
                    <div
                      className={`p-3 text-sm text-center rounded-lg border backdrop-blur-md ${withdrawStatus.type === "success" ? "bg-green-500/10 border-green-500/50 text-green-400" : "bg-red-500/10 border-red-500/50 text-red-400"}`}
                    >
                      {withdrawStatus.message}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 tracking-wider uppercase">
                      Conta de Destino
                    </label>
                    <div className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-slate-500 flex justify-between items-center cursor-not-allowed">
                      <span>Conta Vinculada Padrão</span>
                      <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
                        FINAL 4321
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 text-right mt-1">
                      *O saque é restrito à conta de mesma titularidade.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 tracking-wider uppercase">
                      Valor do Saque (BRL)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all"
                      placeholder="R$ 0,00"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isWithdrawing}
                    className="w-full mt-2 bg-red-600/90 text-white font-bold tracking-widest uppercase py-3 rounded-lg hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isWithdrawing ? "Processando Saque..." : "Solicitar Saque"}
                  </button>
                </form>
              )}
            </div>
          </section>
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans selection:bg-green-500/30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-widest text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            NEXUS <span className="text-green-400">CRIPTO</span>
          </h1>
          <p className="text-slate-400 text-sm tracking-widest uppercase">
            Portal de Autenticação
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
          
          {authMessage.text && (
            <div className={`mb-6 p-3 text-sm text-center rounded-lg border backdrop-blur-md ${authMessage.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
              {authMessage.text}
            </div>
          )}

          {error && !authMessage.text && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 tracking-wider uppercase">
                Endereço de E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all"
                placeholder="usuario@nexuscripto.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 tracking-wider uppercase">
                {isRegisterMode ? 'Senha (mín. 8 caracteres, letras, números e símbolos)' : 'Chave de Segurança'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-green-500 text-slate-950 font-bold tracking-widest uppercase py-3 rounded-lg hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300"
            >
              {isRegisterMode ? 'Criar Nova Conta' : 'Iniciar Sessão'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-slate-500 text-xs">
            {isRegisterMode ? 'Já tem acesso? ' : 'Ainda não tem acesso? '}
            <span 
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setAuthMessage({ type: '', text: '' });
              }}
              className="text-green-400 hover:text-green-300 cursor-pointer transition-colors"
            >
              {isRegisterMode ? 'Iniciar Sessão.' : 'Solicitar registro.'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
