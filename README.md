# SkillKart 🚀

**Master New Skills with Personalized Learning Roadmaps**

SkillKart is a comprehensive learning management platform that creates personalized learning paths for various skills including Web Development, UI/UX Design, Data Science, and more. Track your progress, access curated resources, and connect with a community of learners.

## ✨ Features

### For Learners
- **Personalized Roadmaps**: Get customized learning paths based on your available time and goals
- **Progress Tracking**: Monitor your completion status across all learning steps
- **Resource Management**: Access videos, blogs, and quizzes for each learning step
- **Week-by-Week Planning**: Organized learning schedule with time estimates
- **Gamification**: Earn XP and badges for completing steps and roadmaps
- **Discussion Forums**: Ask questions and engage with other learners

### For Admins
- **Roadmap Creation**: Build comprehensive learning roadmaps with multiple steps
- **Resource Management**: Add videos, blogs, and quizzes to learning steps
- **Content Overview**: Preview roadmaps with detailed step information

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe backend development
- **PostgreSQL** - Robust relational database
- **TypeORM** - Database ORM with entity relationships
- **JWT** - Secure authentication
- **Passport** - Authentication middleware
- **bcrypt** - Password hashing

## 📁 Project Structure

```
SkillKart/
├── skillkart-fe/          # Frontend (Next.js)
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable UI components
│   │   └── lib/           # Utility functions
│   └── package.json
├── skillkart-be/          # Backend (NestJS)
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── entities/      # Database entities
│   │   ├── roadmaps/      # Roadmap management
│   │   ├── resources/     # Resource management
│   │   ├── users/         # User management
│   │   ├── threads/       # Discussion forums
│   │   └── gamification/  # XP and badges
│   └── package.json
└── README.md
```


```

## 🎯 Usage

### Getting Started

1. **Visit the Application**: Open https://skiil-kart.vercel.app in your browser

2. **Create an Account**: 
   - Click "Sign Up"
   - Choose your role (Learner or Admin)
   - Fill in your details including interests and available weekly hours

3. **For Learners**:
   - Browse available roadmaps
   - Start a roadmap to begin learning
   - Track your progress through personalized weekly schedules
   - Access resources for each step
   - Participate in discussions

4. **For Admins**:
   - Access the admin dashboard
   - Create new roadmaps with steps
   - Add resources (videos, blogs, quizzes) to steps
   - View detailed roadmap previews
   - Manage content and user progress

### Key Features Usage

#### Personalized Learning
- Set your available weekly hours during registration
- Roadmaps automatically calculate personalized timelines
- Steps are distributed across weeks based on your availability

#### Resource Management
- **Available Resources**: Clickable buttons that open in new tabs
- **Coming Soon Resources**: Grayed out with "Coming Soon" badge
- **No Resources**: Clear messaging when resources are being prepared

#### Progress Tracking
- Click the circle icon next to any step to mark as complete
- Progress bars show overall completion percentage
- Weekly view shows your current focus areas

#### Discussion Forums
- Ask questions about specific roadmaps or steps
- Get help from the community
- Share insights and experiences

## 🔐 Authentication & Roles

### User Roles
- **Learner**: Can view roadmaps, track progress, access resources, participate in discussions
- **Admin**: Full access including roadmap creation, resource management

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based route protection
- Secure API endpoints

## 🎮 Gamification System

### XP (Experience Points)
- Earn XP for completing learning steps
- Track your learning progress with points
- View XP history and achievements

### Badges
- Unlock badges for various achievements
- Display your accomplishments
- Motivate continued learning



