# CVInsight

**CVInsight** is an intelligent, AI-powered placement assistant designed to bridge the gap between student resumes and corporate requirements. By leveraging **Google Gemini AI** and a proprietary database of 80+ company chronicles, it offers real-time resume scoring, gap analysis, and personalized improvement suggestions.

---

## Key Features

* **AI Resume Scoring**: Upload your PDF resume and get an instant score (0-100) based on industry standards, with detailed strengths and weaknesses.
* **Target Company Match**: Select a specific target company (e.g., Amazon, Google) to benchmark your resume against their specific role requirements and past interview patterns.
* **Placement Database**: Access a rich repository of **80+ company profiles**, including eligible branches, CGPA cutoffs, stipends, and real student interview experiences.
* **Context-Aware Analysis**: Our "Multi-Mode" engine switches prompts dynamically—performing a general audit for standard uploads or a strict gap analysis when a target job is selected.
* **Student Dashboard**: Track your scan history, view progress over time, and revisit past analyses.
* **Secure Authentication**: Seamless and secure login via Google OAuth (NextAuth.js).
* **Admin Ingestion Pipeline**: Specialized admin tools to ingest bulk placement data from CSV/PDFs directly into MongoDB.

---

## Tech Stack

* **Frontend**: [Next.js 14 (App Router)](https://nextjs.org/), React, Tailwind CSS, Lucide React (Icons)
* **Backend**: Next.js Server Actions & API Routes (Node.js)
* **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
* **AI Engine**: [Google Gemini API](https://ai.google.dev/) (Gemini 1.5 Flash)
* **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Google Provider)
* **Data Processing**: `pdf2json` (PDF Parsing), `papaparse` (CSV Ingestion)

---

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn
* MongoDB URI (Local or Atlas)
* Google Cloud Console Project (for OAuth)
* Google AI Studio Key (for Gemini)

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/cvinsight.git](https://github.com/yourusername/cvinsight.git)
    cd cvinsight
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory and add the following:
    ```env
    # Database
    MONGODB_URI=your_mongodb_connection_string

    # Authentication (NextAuth)
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_random_secret_string
    
    # Google OAuth
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    # AI Model
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run the application**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```bash
├── app/
│   ├── admin/             # Admin ingestion panel
│   ├── api/               # Backend API routes (Auth, Extract, Companies)
│   ├── dashboard/         # User dashboard (History & Upload)
│   ├── layout.jsx         # Root layout & Metadata
│   └── page.jsx           # Landing page
├── components/
│   ├── Navbar.jsx         # Navigation bar
│   ├── UploadForm.jsx     # Main Resume Upload & Analysis UI
│   └── Provider.jsx       # Session Provider
├── config/
│   └── database.js        # MongoDB connection logic
├── models/
│   ├── User.js            # User schema
│   ├── Company.js         # Placement data schema
│   └── Analysis.js        # Analysis history schema
└── public/                # Static assets
