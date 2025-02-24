# Hackeroso

Hackeroso is a modern Hacker News client with integrated task management, built with Next.js and TypeScript.

## Features

- 🚀 Real-time Hacker News feed
- 🔍 Advanced search functionality
- 📱 Responsive design for mobile and desktop
- 🌓 Dark mode support
- ✅ Integrated task management system
- 🔒 Client-side data persistence

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Vercel for deployment

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lpolish/hackeroso.git
   cd hackeroso
   ```

2. Install dependencies:

   ```bash
   pnpm i
   ```

3. Create a `.env.local` file in the root directory and add any necessary environment variables:

   ```
   NEXT_PUBLIC_API_URL=https://hacker-news.firebaseio.com/v0
   ```

### Running the Development Server

Build: (optional but really good practice if you deploy frequently):

```bash
pnpm build
```

Run the development server:

```bash
pnpm dev
```

Vercel: (optional but totally worth it):

Staging:

```bash
vercel
```

Prod:

```bash
vercel --prod
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `pnpm dev`: Runs the app in development mode
- `pnpm build`: Builds the app for production
- `pnpm lint`: Lints the codebase

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Hacker News API](https://github.com/HackerNews/API)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Vercel](https://vercel.com/)

