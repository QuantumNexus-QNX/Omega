# Trivector.AI

A Next.js-powered web application featuring advanced data visualization, 3D graphics, and machine learning capabilities.

## Features

- **Modern Stack**: Built with Next.js 14, React 18, and TypeScript
- **Data Visualization**: D3.js for powerful data visualizations
- **3D Graphics**: Three.js with React Three Fiber for immersive 3D experiences
- **Machine Learning**: Integrated ML capabilities with ml-matrix
- **Type-Safe Environment**: Zod-validated environment variables
- **Production-Ready**: Comprehensive security headers and multi-region deployment
- **CI/CD Pipeline**: Automated testing, linting, and deployment with GitHub Actions

## Quick Start

### Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd trivector-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration. See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed instructions.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Project Structure

```
trivector-ai/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── page.tsx      # Homepage
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   └── lib/              # Utility functions and configurations
│       └── env.ts        # Environment variable validation
├── public/               # Static assets
├── .github/              # GitHub Actions workflows
├── .env.example          # Environment variables template
├── vercel.json           # Vercel deployment configuration
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
└── package.json          # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests with Jest
- `npm run lint` - Run ESLint

## Environment Configuration

This project uses type-safe environment variables validated with Zod.

**Required variables:**
- `NEXT_PUBLIC_APP_URL` - Your application URL
- `NEXT_PUBLIC_API_URL` - Your API base URL

**Optional but recommended:**
- AI provider API keys (Anthropic, OpenAI, Google, HuggingFace)
- Vercel KV database credentials
- Analytics and monitoring tools

For complete environment setup instructions, see **[ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)**.

## Deployment

### Vercel (Recommended)

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically deploy:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

**Multi-region deployment** is enabled for:
- US East (Virginia) - `iad1`
- US West (San Francisco) - `sfo1`
- Europe (London) - `lhr1`

### Docker

Build and run with Docker:

```bash
# Build the image
docker build -t trivector-ai .

# Run the container
docker run -p 3000:3000 --env-file .env.local trivector-ai
```

Or use Docker Compose:

```bash
docker-compose up
```

## CI/CD Pipeline

Automated workflows run on every push and pull request:

- **Linting & Type Checking**: ESLint and TypeScript validation
- **Testing**: Jest tests with coverage reporting
- **Building**: Production build verification
- **Security Audit**: Dependency vulnerability scanning
- **Deployment**: Automatic deployment to Vercel

See [.github/workflows/README.md](../.github/workflows/README.md) for workflow configuration.

## Technology Stack

### Core
- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript 5.6](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)

### Visualization & Graphics
- **Data Viz**: [D3.js](https://d3js.org/)
- **3D Graphics**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
- **3D Helpers**: [@react-three/drei](https://github.com/pmndrs/drei)

### Machine Learning
- **Matrix Operations**: [ml-matrix](https://github.com/mljs/matrix)

### Development
- **Validation**: [Zod](https://zod.dev/)
- **Testing**: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/react)
- **Utilities**: [clsx](https://github.com/lukeed/clsx)

## Security Features

The application includes production-ready security headers:
- HTTPS enforcement (HSTS)
- XSS protection
- Clickjacking prevention (X-Frame-Options)
- Content type sniffing prevention
- Referrer policy
- Permissions policy

CORS is configured to allow only trusted origins. Update in `vercel.json` for your domain.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

All PRs automatically get preview deployments for testing.

## Documentation

- [Environment Setup Guide](./ENVIRONMENT_SETUP.md) - Detailed environment configuration
- [GitHub Actions Workflows](../.github/workflows/README.md) - CI/CD documentation
- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [Vercel Documentation](https://vercel.com/docs) - Deployment documentation

## Support

For issues, questions, or suggestions:
1. Check existing [GitHub Issues](https://github.com/QuantumNexus-QNX/Omega/issues)
2. Review the [Environment Setup Guide](./ENVIRONMENT_SETUP.md)
3. Create a new issue with detailed information

## License

This project is private and proprietary.

## Acknowledgments

Built with [Next.js](https://nextjs.org), deployed on [Vercel](https://vercel.com).
