<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# SkillKart Backend API

## Overview
SkillKart is a Curated Learning Roadmap Builder backend built with NestJS, TypeORM, and PostgreSQL. It provides a comprehensive learning platform with role-based access control, personalized roadmaps, resource management, peer support, and gamification features.

## Features Complete ✅

### 1. Authentication & User Roles
- JWT authentication with access + refresh tokens
- Role-based access control (Learner/Admin)
- Password hashing with bcrypt
- **Endpoints:**
  - `POST /auth/register` - User registration
  - `POST /auth/login` - User login
  - `GET /auth/me` - Get current user
  - `PATCH /users/profile` - Update user profile (Learners only)

### 2. Personalized Roadmap Engine (Learners Only)
- Skill-based roadmap discovery
- Personal roadmap tracking with progress
- Step-by-step learning progress tracking
- **Endpoints:**
  - `GET /roadmaps/skill/:skillCategory` - Get roadmaps by skill
  - `POST /user-roadmaps` - Start a roadmap (Learners only)
  - `GET /user-roadmaps/:id` - Get roadmap with progress (Learners only)
  - `PATCH /user-roadmaps/:id/step-progress` - Update step progress (Learners only)

### 3. Resource Management (Admin Only)
- CRUD operations for learning resources
- Resource types: Video, Blog, Quiz
- Resources linked to roadmap steps
- **Endpoints:**
  - `POST /resources` - Create resource (Admin only)
  - `GET /resources/by-step/:stepId` - Get resources by step
  - `DELETE /resources/:id` - Delete resource (Admin only)

### 4. Peer Support (Learners Only)
- Discussion threads for roadmaps and steps
- Comment system for peer interaction
- **Endpoints:**
  - `POST /threads` - Create discussion thread (Learners only)
  - `GET /threads/roadmap/:roadmapId` - Get threads by roadmap (Learners only)
  - `POST /threads/:threadId/comments` - Create comment (Learners only)
  - `GET /comments/thread/:threadId` - Get comments by thread (Learners only)

### 5. Gamification (Learners Only)
- XP system (10 XP per completed step)
- Badge system with achievements
- Automatic badge awarding
- **Endpoints:**
  - `GET /xp` - Get user XP and logs (Learners only)
  - `GET /badges` - Get all available badges
  - `GET /user-badges` - Get user badges with earned status (Learners only)

## Database Schema

### Entities (11 total)
1. **User** - User accounts with roles
2. **Roadmap** - Learning roadmaps by skill category
3. **RoadmapStep** - Individual steps within roadmaps
4. **UserRoadmap** - User's enrolled roadmaps
5. **UserRoadmapProgress** - Progress tracking for each step
6. **Resource** - Learning resources (videos, blogs, quizzes)
7. **Thread** - Discussion threads
8. **Comment** - Comments on threads
9. **XPLog** - Experience point history
10. **Badge** - Available badges/achievements
11. **UserBadge** - User's earned badges

## Tech Stack
- **Framework:** NestJS with TypeScript
- **Database:** PostgreSQL with TypeORM
- **Authentication:** JWT with Passport
- **Validation:** class-validator & class-transformer
- **Password Hashing:** bcrypt

## Environment Configuration

Create a `.env` file:
```bash
# Database
DB_URL=postgresql://username:password@localhost:5432/skillkart

# JWT Secrets
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Server
PORT=3001
NODE_ENV=development
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL database and update .env**

3. **Run the application:**
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

## API Documentation

### Authentication
All protected endpoints require Bearer token:
```
Authorization: Bearer <jwt_token>
```

### Role-Based Access Control
- **Learners:** Can access learning features, roadmaps, progress tracking, discussions, gamification
- **Admins:** Can manage resources, view all data

### Response Format
All endpoints return consistent JSON responses with appropriate status codes.

## Default Data
The application automatically creates default badges on startup:
- **Getting Started** - Complete your first learning step
- **Roadmap Finisher** - Complete all steps in a roadmap  
- **Streak Master** - Log in for 5 consecutive days

## Architecture Highlights
- **Modular Design:** Feature-based modules (Auth, Users, Roadmaps, Resources, Threads, Gamification)
- **Type Safety:** Full TypeScript implementation with strict typing
- **Security:** Role guards, JWT strategy, input validation
- **Database Relations:** Properly structured relationships with TypeORM
- **Error Handling:** Comprehensive error handling with meaningful messages

## Build Status
✅ **Backend: 100% Complete**
- All 5 modules implemented
- All entities and relationships
- All required endpoints
- Zero compilation errors
- Ready for frontend integration

---

*Backend ready for production deployment and frontend development.*

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
