# ⚡ Nexus Cripto - Web (Frontend)

Interface web da plataforma Nexus Cripto. O projeto foi desenhado fugindo de bibliotecas de componentes genéricos, adotando uma identidade visual **Neobrutalista** customizada, com animações em gradiente e foco total em uma experiência de usuário moderna e fluida.

---

## 🛠️ Tecnologias Utilizadas

* **React** + **Vite**
* **TypeScript**
* **Tailwind CSS** (Estilização utilitária e design neobrutalista)
* **React Router DOM** (Navegação SPA)
* **Axios** (Comunicação com a API)

---

## ✨ Principais Funcionalidades

### 📊 Dashboard Interativo

Visualização do saldo total e balanço individual das carteiras (BRL, BTC, ETH).

### 🎨 UI/UX Neobrutalista

Componentes criados do zero, garantindo uma identidade única com contrastes fortes e feedback visual imediato.

### ⚡ Swap em Tempo Real

Interface fluida para simulação e efetivação de conversão entre moedas, comunicando-se com as cotações ao vivo do backend blindado.

### 🔐 Proteção de Rotas

Telas internas acessíveis apenas com token JWT válido.

---

## 🚀 Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/gohenj/nexus-frontend.git
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Crie o arquivo `.env`

Na raiz do projeto:

```env
VITE_API_URL="http://localhost:3333"
```

### 4. Inicie o servidor

```bash
npm run dev
```

---

## 🌐 Acesso Local

Abra no navegador:

```bash
http://localhost:5173
```

---

## 🚀 Deploy

O frontend está configurado para deploy contínuo na **Vercel**, com regras de reescrita de rotas (SPA fallback) devidamente configuradas no arquivo:

```bash
vercel.json
```
