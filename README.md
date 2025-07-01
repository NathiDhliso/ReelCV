# ReelCV - Dynamic Candidate Profiles

Professional candidate profile management and public CV generation platform.

## 🌟 Features

### 👤 Profile Management
- **Dynamic Profile Builder** - Create comprehensive professional profiles
- **Skills Showcase** - Highlight technical and soft skills with proficiency levels
- **Experience Timeline** - Chronological work history with achievements
- **Education & Certifications** - Academic background and professional certifications
- **Portfolio Integration** - Link projects from ReelProjects seamlessly

### 🌐 Public CV Generation
- **Shareable CV Links** - Generate public URLs for your professional profile
- **SEO Optimized** - Search engine friendly candidate profiles
- **Professional Templates** - Multiple CV layouts and designs
- **PDF Export** - Download CV as professional PDF document
- **QR Code Generation** - Easy sharing via QR codes

### 🎯 ReelPass System
- **Government Verification** - South African ID and qualification verification
- **Trust Score** - Credibility rating based on verified information
- **Verification Badges** - Visual indicators of verified credentials
- **Background Checks** - Automated verification processes
- **Compliance Tracking** - POPIA and employment law compliance

### 📊 Recruiter Scorecard
- **Skill Assessment** - Detailed evaluation of candidate competencies
- **Cultural Fit Analysis** - Personality and team compatibility scoring
- **Performance Predictions** - AI-powered role suitability analysis
- **Interview Recommendations** - Suggested questions and focus areas
- **Comparison Tools** - Side-by-side candidate evaluations

### 📈 Analytics & Insights
- **Profile Views** - Track who's viewing your profile
- **Search Visibility** - Monitor profile appearance in recruiter searches
- **Engagement Metrics** - Measure profile interaction and interest
- **Market Insights** - Industry trends and salary benchmarks
- **Optimization Tips** - AI-powered profile improvement suggestions

## 🎯 Target Users

### 👤 Candidates
- **Job Seekers** - Create professional profiles to attract recruiters
- **Career Changers** - Showcase transferable skills and experience
- **Fresh Graduates** - Build compelling entry-level profiles
- **Freelancers** - Professional portfolio and credential verification
- **Remote Workers** - Global profile visibility and verification

### 🎯 Recruiters (View Access)
- **Talent Acquisition** - Search and evaluate candidate profiles
- **Background Verification** - Access verified candidate information
- **Skill Assessment** - Use scorecard system for candidate evaluation
- **Pipeline Management** - Track and manage candidate interactions
- **Compliance Checking** - Ensure candidate eligibility and verification

## 🏗️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Authentication**: Supabase Auth + SSO
- **Database**: PostgreSQL (Supabase)
- **Styling**: Tailwind CSS + CSS Modules
- **PDF Generation**: jsPDF + html2canvas
- **QR Codes**: qrcode.js
- **File Upload**: Supabase Storage
- **Deployment**: AWS Amplify

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- South African government API access (for verification)

### Installation
```bash
git clone https://github.com/your-org/reelcv-reelapps.git
cd reelcv-reelapps
npm install
```

### Environment Setup
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_HOME_URL=https://www.reelapps.co.za
VITE_APP_URL=https://reelcv.reelapps.co.za
VITE_SSO_ENABLED=true
VITE_MAIN_DOMAIN=reelapps.co.za
VITE_SA_GOVERNMENT_API_KEY=your_gov_api_key
```

### Development
```bash
npm run dev
# App runs on http://localhost:5176
```

## 📋 Key Features Breakdown

### Profile Builder
- **Personal Information** - Contact details, location, availability
- **Professional Summary** - Compelling career overview
- **Skills Matrix** - Technical and soft skills with proficiency ratings
- **Work Experience** - Detailed employment history with achievements
- **Education** - Academic qualifications and ongoing learning
- **Certifications** - Professional certifications and licenses
- **Languages** - Language proficiency levels
- **References** - Professional references and recommendations

### ReelPass Verification
- **ID Verification** - South African ID document validation
- **Qualification Verification** - Academic and professional qualification checks
- **Employment History** - Previous employment verification
- **Criminal Background** - Basic criminal record checks (with consent)
- **Credit Checks** - Financial background verification (for relevant roles)
- **Professional References** - Automated reference checking

### Public CV Features
- **Custom URLs** - Personalized profile URLs (e.g., reelcv.reelapps.co.za/john-smith)
- **SEO Optimization** - Meta tags, structured data, social media cards
- **Analytics** - Profile view tracking and visitor insights
- **Social Sharing** - LinkedIn, Twitter, WhatsApp sharing integration
- **Print Optimization** - CSS optimized for professional printing

### Recruiter Tools
- **Advanced Search** - Filter candidates by skills, experience, location
- **Bulk Actions** - Shortlist, contact, or export multiple candidates
- **Notes & Tags** - Private recruiter notes and candidate categorization
- **Interview Scheduling** - Integration with calendar systems
- **Compliance Dashboard** - Track verification status and compliance requirements

## 🔐 Security & Privacy

- **POPIA Compliance** - South African data protection compliance
- **Consent Management** - Granular privacy controls
- **Data Encryption** - End-to-end encryption for sensitive data
- **Access Controls** - Role-based access to candidate information
- **Audit Logging** - Complete audit trail of profile access and changes

## 🌍 Localization

- **Multi-language Support** - English, Afrikaans, Zulu, Xhosa
- **Local Compliance** - South African employment law compliance
- **Currency Formatting** - ZAR salary expectations and formatting
- **Date Formats** - Local date and time formatting
- **Regional Settings** - Province-specific information and requirements

## 📱 Mobile Experience

- **Responsive Design** - Optimized for all device sizes
- **Progressive Web App** - App-like experience on mobile devices
- **Offline Capability** - Basic functionality without internet connection
- **Touch Optimization** - Mobile-friendly interactions and navigation
- **Fast Loading** - Optimized for mobile networks

## 🔗 Integrations

- **ReelProjects** - Automatic project portfolio integration
- **ReelSkills** - Skills verification and showcase integration
- **ReelHunter** - Recruiter platform integration
- **LinkedIn** - Profile import and sync capabilities
- **Government APIs** - ID and qualification verification services
- **Payment Gateways** - Premium features and verification payments

## 📊 Analytics Dashboard

- **Profile Performance** - Views, searches, and engagement metrics
- **Market Insights** - Industry trends and competitive analysis
- **Optimization Score** - Profile completeness and optimization rating
- **Verification Status** - Track verification progress and requirements
- **Activity Timeline** - Recent profile activities and updates

## 🎨 Customization Options

- **Profile Themes** - Multiple professional design templates
- **Color Schemes** - Customizable brand colors and styling
- **Layout Options** - Different profile layout configurations
- **Privacy Settings** - Granular control over information visibility
- **Notification Preferences** - Customizable alert and update settings

## 🛠 Development

### Prerequisites
- Node.js 18+
- Supabase project for link management

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Configure your environment variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation & Running
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🏗 Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for development and building
- **Zustand** for state management

### Backend Services
- **Supabase** for authentication and link management
- **ReelSkills API** for verified skills data
- **ReelProjects API** for project portfolio data

### Database Schema
- `public_cv_links` - Shareable portfolio links and analytics
- `profiles` - Basic user profile information
- External APIs for skills and projects data

## 🔗 Integration with ReelApps Ecosystem

### Data Flow
1. **ReelSkills** → Verified skills, assessments, endorsements
2. **ReelProjects** → Completed projects, impact metrics, technologies
3. **ReelCV** → Generates public portfolio showcasing both

### Cross-Platform Navigation
- **ReelHunter**: Job matching and recruitment
- **ReelSkills**: Skills assessment and verification
- **ReelProjects**: Project documentation and showcase
- **Unified Authentication**: Single sign-on across platforms

## 🌐 Public Portfolio Features

### Skills Showcase
- Verified skill levels and categories
- Endorsement counts and validation badges
- Industry-specific skill groupings
- Proficiency indicators

### Projects Display
- Project titles and descriptions
- Technology stacks used
- Measurable impact and outcomes
- Links to code repositories (when available)

### Professional Presentation
- Clean, modern design
- Employer-friendly layout
- Contact information and social links
- Mobile-responsive design

## 📊 Analytics & Insights

### Portfolio Performance
- Total portfolio views
- Link sharing statistics
- Engagement metrics
- View source tracking

### Professional Metrics
- Skills verification count
- Project completion rate
- Portfolio completeness score
- Industry benchmark positioning

## 🚀 Deployment

This repository is configured for deployment to `reelcv.reelapp.co.za`

### Production Environment
- **CDN**: Global content delivery
- **SSL**: Secure HTTPS for all portfolio links
- **Analytics**: Portfolio view tracking
- **Uptime**: 99.9% availability guarantee

## 🔒 Security & Privacy

### Data Protection
- **No Data Storage**: ReelCV doesn't store skills or project data
- **API Integration**: Real-time data fetching from source platforms
- **Secure Links**: Portfolio links with optional expiration
- **Privacy Controls**: User-controlled visibility settings

### Link Management
- **Revocable Links**: Users can revoke access anytime
- **Expiration Options**: Configurable link lifespans
- **View Tracking**: Anonymous analytics only
- **Secure Sharing**: HTTPS-only portfolio access

## 🎯 Target Audience

### For Candidates
- Professionals wanting to showcase verified skills
- Developers with proven project portfolios
- Anyone moving beyond traditional resume formats
- Talent seeking modern portfolio presentation

### For Employers
- Recruiters wanting to see real skills and projects
- Hiring managers seeking verified talent
- Companies valuing proven experience over formatted resumes
- Organizations embracing modern hiring practices

## 📈 Future Roadmap

### Enhanced Features
- Custom portfolio themes and branding
- Industry-specific portfolio templates
- Advanced analytics and insights
- Integration with additional ReelApps services

### Platform Expansion
- API for third-party integrations
- White-label portfolio solutions
- Enterprise team portfolio management
- Advanced sharing and collaboration features

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Focus on the core mission: simple, effective portfolio generation
4. Submit a pull request

## 📄 License

MIT - Part of ReelApps ecosystem

## 🆘 Support

For technical support or integration questions:
- Check the [ReelApps Documentation](https://docs.reelapp.co.za)
- Contact: support@reelapp.co.za
- GitHub Issues for bug reports

---

**ReelCV** - Your skills, proven and showcased. No resumes required.

## Environment Setup

1. Create a `.env.local` file in the root directory:

```env
# Use the project where the function was deployed
VITE_SUPABASE_URL=https://gozcqptfjwdofwqowxwb.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Get your anon key from the Supabase dashboard:
   - Go to https://supabase.com/dashboard/project/gozcqptfjwdofwqowxwb/settings/api
   - Copy the "anon public" key

## Development

```bash
npm install
npm run dev
```

## Deployed Functions

- ✅ `generate-cv-link` - Deployed to project `gozcqptfjwdofwqowxwb`

## Database Tables

The following tables are expected but will gracefully handle missing data:
- `public_cv_links` ✅ (exists)
- `portfolio_settings` ✅ (exists) 
- `profiles` ✅ (exists)
- `candidate_skills` ⚠️ (optional - will use empty data if missing)
- `candidate_projects` ⚠️ (optional - will use empty data if missing)