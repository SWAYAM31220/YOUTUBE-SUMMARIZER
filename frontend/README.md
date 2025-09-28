# Frontend (UI/Polling)

## Overview
The frontend is responsible for providing a user interface for the YouTube AI Summarizer. It allows users to input a YouTube URL, select the summary type (Short or Detailed), and view the generated summary.

## Key Features
- Input field for YouTube URL.
- Dropdown/Toggle for selecting summary type.
- Progress indicator for task status.
- Polling mechanism to query the API Gateway for job status.

## Technology Stack
- **Framework:** Next.js
- **Hosting:** Vercel

## Folder Structure
```
frontend/
├── components/    # Reusable UI components
├── pages/         # Next.js pages
├── public/        # Static assets
└── styles/        # CSS/SCSS files
```