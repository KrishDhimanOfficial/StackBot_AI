# StackBot AI - Premium Local AI Chatbot

StackBot AI is a modern, high-performance AI chat interface built with **Next.js 15**, **Tailwind CSS 4**, and **Framer Motion**. It provides a sleek, glassmorphic UI for interacting with locally hosted AI models via Ollama.

![StackBot AI Interface]
![alt text](<Screenshot 2026-02-25 at 5.01.03 PM.png>)

## ✨ Features

- 🎨 **Premium UI/UX**: Professional dark-mode design with glassmorphism effects and smooth micro-animations.
- ⚡ **Local LLM Integration**: Connects seamlessly to [Ollama](https://ollama.com) to run models like Gemini, Llama 3, or Mistral locally.
- 📝 **Markdown & Code Support**: Full support for Markdown rendering with professional syntax highlighting and "Click-to-Copy" functionality.
- 💾 **Persistence**: Your chat history is automatically saved to LocalStorage, so you never lose a conversation.
- ✏️ **Message Reuse**: Easily copy any previous prompt back into the input field for quick refinement.
- 🗑️ **Session Management**: One-click clear function to reset your workspace.
- 📱 **Mobile Responsive**: Perfectly optimized for all screen sizes.

## 🚀 Getting Started

### Prerequisites

1.  **Node.js**: Ensure you have Node.js (v18+) installed.
2.  **Ollama**: Install [Ollama](https://ollama.com) on your machine.
3.  **Local Model**: Pull the required model (currently configured for `gemini-3-flash-preview:latest`):
    ```bash
    ollama pull gemini-3-flash-preview:latest
    ```

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/ai-image-editor.git
    cd ai-image-editor
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev)
- **Markdown**: `react-markdown` + `remark-gfm`
- **Code Highlighting**: `react-syntax-highlighter` (Prism)
- **API**: [Axios](https://axios-http.com)

## 📁 Project Structure

```text
├── app/
│   ├── api/chat/route.ts  # Backend API bridge to Ollama
│   ├── globals.css        # Custom CSS & Tailwind layers
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main Chat Interface (Client Component)
├── public/                # Static assets
└── package.json           # Dependencies & scripts
```

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.
