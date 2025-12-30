# 👨 Dad Advice App

A warm, interactive web app where you can get fatherly advice on various topics including home repairs, cars, technology, relationships, and life advice. Features multimodal support (text, images, video), text-to-speech responses, and helpful video tutorials.

## ✨ Features

- **6 Themed Topics**: Home Repairs, Cars, Technology, Relationships, Life Advice, and General Questions
- **Dad's Personality**: Witty, warm, and supportive with classic dad humor and real-life experiences
- **Multimodal Support**: Upload photos or videos to show Dad what you're dealing with
- **Text-to-Speech**: Dad's responses are read aloud in a warm, friendly voice
- **Video Suggestions**: Dad finds helpful YouTube tutorials when appropriate
- **Safety First**: Dad knows his limits and recommends professionals when needed
- **Session Storage**: Your conversations are saved locally (no backend required)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- API Keys for:
  - Anthropic Claude API
  - Google Cloud Text-to-Speech API
  - YouTube Data API v3

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dad-advice-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory (copy from `env.example`):
   ```bash
   cp env.example .env
   ```
   
   Then add your API keys to `.env`:
   ```
   ANTHROPIC_API_KEY=your_key_here
   GOOGLE_CLOUD_TTS_API_KEY=your_key_here
   YOUTUBE_API_KEY=your_key_here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 📦 Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🌐 Deploying to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `ANTHROPIC_API_KEY`
     - `GOOGLE_CLOUD_TTS_API_KEY`
     - `YOUTUBE_API_KEY`
   - Deploy!

### Vercel Environment Variables

In your Vercel project settings, add these as environment variables:

```
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_CLOUD_TTS_API_KEY=AIza...
YOUTUBE_API_KEY=AIza...
```

## 🔑 Getting API Keys

### Anthropic Claude API
1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

### Google Cloud TTS API
1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the "Cloud Text-to-Speech API"
4. Go to "APIs & Services" → "Credentials"
5. Create an API key
6. Restrict the key to "Cloud Text-to-Speech API" (recommended)

### YouTube Data API v3
1. In the same Google Cloud Console project
2. Enable the "YouTube Data API v3"
3. Use the same API key or create a new one
4. Restrict to "YouTube Data API v3" (recommended)

## 🏗️ Project Structure

```
dad-advice-app/
├── api/                      # Vercel serverless functions
│   ├── claude.ts            # Claude API integration
│   ├── tts.ts               # Google TTS integration
│   └── youtube.ts           # YouTube search
├── src/
│   ├── components/          # React components
│   │   ├── TopicSelector.tsx
│   │   ├── WorkshopEnvironment.tsx
│   │   ├── DadAvatar.tsx
│   │   ├── SpeechBubble.tsx
│   │   ├── MediaCapture.tsx
│   │   ├── VideoSuggestion.tsx
│   │   └── ProfessionalReferral.tsx
│   ├── services/            # API service wrappers
│   │   ├── claudeService.ts
│   │   ├── ttsService.ts
│   │   ├── videoService.ts
│   │   └── storageService.ts
│   ├── utils/               # Utilities and constants
│   │   ├── constants.ts
│   │   ├── dadPersonality.ts
│   │   └── imageProcessor.ts
│   ├── types.ts             # TypeScript type definitions
│   ├── App.tsx              # Main app component
│   └── index.css            # Global styles
├── tailwind.config.js       # Tailwind CSS configuration
├── vercel.json              # Vercel deployment config
└── package.json
```

## 🎨 Design Philosophy

- **Warm & Comforting**: The UI uses soft colors and rounded corners to create a friendly atmosphere
- **Dad's Personality**: Witty, humble, and genuinely helpful with classic dad humor
- **Safety First**: Always recommends professionals when needed
- **Mobile-First**: Designed to work great on phones (future iOS app target)

## 🧪 Technologies Used

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude 3.5 Sonnet (with vision)
- **TTS**: Google Cloud Text-to-Speech
- **Storage**: IndexedDB (via idb library)
- **Video**: YouTube Data API v3
- **Deployment**: Vercel (serverless functions)

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📝 License

MIT

## 🙏 Acknowledgments

Built with love for anyone who needs a little dad advice. 👨❤️

---

Made with ❤️ by a dad who wants to help
