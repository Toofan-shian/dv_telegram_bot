# SabteDV Telegram Bot

A Telegram bot for lottery registration with dynamic images and interactive buttons.

## 🚀 Deployment on Liara

### Prerequisites
- Liara account
- Docker installed locally (for testing)
- Telegram bot token

### Steps to Deploy on Liara

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Docker support for Liara deployment"
   git push origin main
   ```

2. **Deploy on Liara**
   - Go to [Liara Console](https://console.liara.ir)
   - Create a new app
   - Choose "Docker" as platform
   - Connect your GitHub repository
   - Set environment variables:
     - `TELEGRAM_TOKEN`: Your bot token from @BotFather

3. **Liara will automatically**
   - Build your Docker image
   - Deploy your application
   - Provide a public URL

## 🐳 Local Docker Testing

### Build and run locally
```bash
# Build the Docker image
docker build -t sabtedv-bot .

# Run the container
docker run -e TELEGRAM_TOKEN=your_bot_token -p 3000:3000 sabtedv-bot
```

### Using Docker Compose
```bash
# Set your token in .env file
echo "TELEGRAM_TOKEN=your_bot_token" > .env

# Run with docker-compose
docker-compose up -d
```

## 📁 Project Structure
```
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Local development
├── .dockerignore          # Docker ignore file
├── package.json           # Node.js dependencies
├── index.js              # Main bot code
├── images/               # Bot images
│   ├── welcome.jpg
│   ├── trust.jpg
│   ├── contact.jpg
│   ├── about.jpg
│   └── terms.jpg
└── README.md
```

## 🔧 Environment Variables
- `TELEGRAM_TOKEN`: Your Telegram bot token (required)

## 📱 Bot Features
- Welcome message with image
- Interactive inline buttons
- Dynamic image switching
- HTML formatting support
- Efficient file handling with Telegram file IDs
- Error handling and fallbacks

## 🛠️ Development
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## 📞 Support
For support, contact: @toofan_shafian

