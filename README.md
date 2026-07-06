# Congnivia AI 🧠 

An AI-powered intelligent learning and document management platform that transforms your study materials into interactive learning experiences.

## 🌟 Features

### Core Capabilities
- **Smart Document Upload & OCR** - Extract text from PDFs, images, and documents using advanced OCR technology
- **AI-Powered Summarization** - Automatic intelligent text summarization with multiple summary types (detailed, brief, key-points)
- **Flashcard Generation** - Create study flashcards automatically from document content
- **Quiz Generation** - Generate interactive quizzes to test your knowledge
- **Revision Planner** - Smart scheduling system for efficient study planning
- **Real-time Chat** - Interactive chat interface powered by AI for learning support
- **User Authentication** - Secure authentication system with email verification
- **Dashboard Analytics** - Track your learning progress and statistics
- **Marketplace Features** - Buy/Sell and Lost/Found community sections

## 🏗️ Project Structure

```
Congnivia AI/
â”œâ”€â”€ frontend/           # React 19 + Vite UI application
â”œâ”€â”€ backend/            # Node.js/Express API server
â”œâ”€â”€ ocr/                # Python OCR service
â”œâ”€â”€ summarizer/         # Python text summarization service
â””â”€â”€ render.yaml         # Render deployment configuration
```

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite for lightning-fast development
- **Tailwind CSS** for responsive UI
- **Socket.io Client** for real-time communication
- **Firebase** for authentication and storage
- **Framer Motion** for smooth animations
- **ReCharts** for data visualization
- **React Flow & XY Flow** for mind mapping

### Backend
- **Node.js/Express 5** RESTful API server
- **Socket.io** for real-time features
- **Sequelize & Mongoose** for database ORM
- **JWT** for secure authentication
- **Multer** for file uploads
- **Cloudinary** for cloud storage
- **Nodemailer** for email services
- **PostgreSQL (Neon)** for primary database
- **MongoDB** for flexible data storage

### Python Services
- **OCR Service** - Uses Tesseract.js, PDF2Image, PyPDF, and PdfPlumber for text extraction
- **Summarizer Service** - Leverages Hugging Face Transformers for AI-powered text summarization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Tesseract OCR installed
- Environment variables configured (.env file)

### Installation

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### OCR Service
```bash
cd ocr
pip install -r requirements.txt
python ocr_service.py
```

#### Summarizer Service
```bash
cd summarizer
pip install -r requirements.txt
python summarizer_service.py
```

## 📋 Project Specifications

### Key Features Breakdown

#### 1. **Authentication & User Management**
   - User registration and login
   - Email verification
   - JWT-based session management
   - Password reset functionality
   - User profile management

#### 2. **Document Processing**
   - Upload PDFs and images
   - Automatic OCR text extraction
   - Multiple file type support
   - Cloud storage integration (Cloudinary)

#### 3. **Content Generation**
   - AI-powered text summarization
   - Automatic flashcard creation with customizable card counts
   - Interactive quiz generation
   - Content categorization

#### 4. **Learning Features**
   - Revision schedule planning
   - Progress tracking
   - Performance analytics
   - Interactive study sessions

#### 5. **Real-time Communication**
   - Socket.io powered chat
   - Real-time notifications
   - Collaborative learning potential

#### 6. **Social Features**
   - Buy/Sell marketplace
   - Lost & Found section
   - Leaderboard system
   - Community engagement

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=your_postgres_url
MONGODB_URI=your_mongodb_url

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Cloud Services
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret

# Email
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_email
SMTP_PASS=your_password

# Firebase
FIREBASE_API_KEY=your_firebase_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id

# Server
PORT=5000
NODE_ENV=development
```

## 📁 Module Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [OCR Service Documentation](./ocr/README.md)
- [Summarizer Service Documentation](./summarizer/README.md)

## 🚢 Deployment

The project is configured for deployment on **Render.com** using the `render.yaml` configuration file.

### Build Process
- Frontend: Built with Vite to static assets
- Backend: Node.js server with health check endpoint
- Python Services: Containerized Flask applications

## 📊 Database Schema

The application uses multiple database systems:

### PostgreSQL (Main Database)
- Users
- Files
- Flashcards
- Quizzes
- Summaries
- Notes
- Planner entries

### MongoDB
- Session data
- Flexible content storage

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Environment variable management
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 📝 Development Guidelines

### File Structure Convention
- Controllers: Handle request/response logic
- Services: Business logic and external service integration
- Models: Database schema definitions
- Routes: API endpoint definitions
- Middlewares: Authentication and logging

### Code Standards
- Use async/await for asynchronous operations
- Implement proper error handling
- Follow RESTful API conventions
- Add comments for complex logic
- Use consistent naming conventions

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Ensure all environment variables are set
- Check database connection strings
- Verify Node.js version compatibility

**OCR not extracting text:**
- Install Tesseract separately on your system
- Check file format compatibility
- Verify PDF accessibility

**Summarizer service errors:**
- Ensure sufficient disk space for model downloads
- Check Python virtual environment activation
- Verify CUDA installation for GPU support

## 🤝 Contributing

This project is owned and maintained by the author. For modifications or improvements, please maintain the existing code structure and follow the development guidelines.

## 📄 License

This project is licensed under a proprietary license. All rights reserved. See the [LICENSE](./LICENSE) file for details.

## 📞 Support

For issues, questions, or suggestions regarding Congnivia AI, please refer to the documentation in each module or contact the development team.

## Future Enhancements

- [ ] Advanced ML model integration
- [ ] Multi-language support
- [ ] Mobile application
- [ ] Collaborative study groups
- [ ] Advanced analytics dashboard
- [ ] API rate limiting
- [ ] Payment gateway integration
- [ ] Video content support

---

**Congnivia AI** - Empowering learners with AI-driven intelligence.
