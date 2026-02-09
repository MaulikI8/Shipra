CONTRIBUTING TO B2B WAREHOUSE PLATFORM

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

PROJECT OVERVIEW

This is a full-stack B2B warehouse management platform designed to showcase modern web development practices. While it's primarily a portfolio project, quality contributions are welcome.

DEVELOPMENT SETUP

Prerequisites
  Node.js 18+ and pnpm
  Python 3.10+
  Git

Getting Started

1. Fork and clone the repository
   git clone https://github.com/your-username/B2B2.git
   cd B2B2

2. Install dependencies
   Frontend:
   pnpm install
   
   Backend:
   cd backend
   python -m venv venv
   
   Windows:
   venv\Scripts\activate
   
   macOS/Linux:
   source venv/bin/activate
   
   pip install -r requirements.txt
   python manage.py migrate

3. Start development servers
   Terminal 1 - Frontend:
   pnpm run dev
   
   Terminal 2 - Backend:  
   cd backend
   python manage.py runserver

CODE STYLE

Frontend (TypeScript/React)
  Use functional components with hooks
  Follow TypeScript best practices
  Use Tailwind CSS for styling
  Keep components small and focused
  Add meaningful comments for complex logic

Backend (Python/Django)
  Follow PEP 8 style guide
  Use type hints where appropriate
  Write docstrings for classes and functions
  Keep views and serializers clean

General
  Write meaningful commit messages
  Keep commits focused and atomic
  Update documentation when needed

TESTING

Before submitting a PR:

Frontend - Ensure build passes:
pnpm run build:nocheck
pnpm lint

Backend - Run tests:
cd backend
python manage.py test

PULL REQUEST PROCESS

1. Create a feature branch
   git checkout -b feature/your-feature-name

2. Make your changes
   Write clean, readable code
   Add comments where necessary
   Update README if adding features

3. Test your changes
   Test locally thoroughly
   Ensure the build passes
   Check for console errors

4. Commit your changes
   git add .
   git commit -m "feat: add your feature description"
   
   Use conventional commits:
   feat: - New feature
   fix: - Bug fix
   docs: - Documentation changes
   style: - Code style changes (formatting, etc.)
   refactor: - Code refactoring
   test: - Adding tests
   chore: - Maintenance tasks

5. Push and create PR
   git push origin feature/your-feature-name
   
   Then create a pull request on GitHub with:
   Clear title and description
   Screenshots/videos if UI changes
   Reference any related issues

FEATURE REQUESTS

Have an idea? Great! Please:

1. Check if it's already been suggested
2. Open an issue with the enhancement label
3. Describe the feature and its benefits
4. Wait for feedback before implementing

BUG REPORTS

Found a bug? Please:

1. Check if it's already reported
2. Open an issue with the bug label
3. Include:
   Steps to reproduce
   Expected behavior
   Actual behavior
   Screenshots if applicable
   Browser/OS information

DESIGN GUIDELINES

When contributing UI changes:

  Maintain the glassmorphic aesthetic
  Use the existing color palette (accent: #E31E24)
  Ensure responsive design (mobile, tablet, desktop)
  Add smooth animations with Framer Motion
  Follow accessibility best practices

DOCUMENTATION

When adding features:

  Update README.md if needed
  Add inline code comments
  Document new API endpoints
  Update DEPLOYMENT.md for config changes

QUESTIONS?

  Open a discussion on GitHub
  Check existing issues and PRs
  Review the README and documentation first

THANK YOU!

Every contribution, no matter how small, is appreciated. Whether it's:
  Fixing typos
  Improving documentation
  Adding features
  Reporting bugs
  Suggesting improvements

You're helping make this project better!

Note: This is primarily a portfolio/demonstration project. Not all PRs may be merged, but quality contributions will always be considered and appreciated.
