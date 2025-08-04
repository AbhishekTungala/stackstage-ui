# StackStage - Complete Folder Structure Documentation

## 📁 **ROOT DIRECTORY STRUCTURE**

```
StackStage/
├── 📂 client/                          # Frontend React application
├── 📂 server/                          # Backend Express.js server
├── 📂 shared/                          # Shared types and schemas
├── 📂 attached_assets/                 # User-uploaded assets and files
├── 📂 node_modules/                    # NPM dependencies (auto-generated)
├── 📂 .cache/                          # Replit cache files
├── 📂 .config/                         # NPM configuration
├── 📂 .git/                            # Git version control
├── 📂 .local/                          # Local state and agent data
├── 📂 .upm/                            # Universal Package Manager data
├── 📄 package.json                     # Project dependencies and scripts
├── 📄 package-lock.json                # Dependency lock file
├── 📄 tsconfig.json                    # TypeScript configuration
├── 📄 vite.config.ts                   # Vite build configuration
├── 📄 tailwind.config.ts               # Tailwind CSS configuration
├── 📄 postcss.config.js                # PostCSS configuration
├── 📄 components.json                  # shadcn/ui components configuration
├── 📄 drizzle.config.ts                # Drizzle ORM configuration
├── 📄 replit.md                        # Project documentation and preferences
├── 📄 FRONTEND_SUMMARY.md              # Comprehensive frontend documentation
├── 📄 PAGE_WISE_DETAILED_FEATURES.md   # Detailed page-by-page features
└── 📄 .replit                          # Replit configuration file
```

---

## 🖥️ **CLIENT DIRECTORY** (`/client/`)

### **Root Level Files**
```
client/
├── 📄 index.html                       # Main HTML entry point
└── 📂 src/                             # Source code directory
    └── 📂 public/                      # Static assets
```

### **Public Assets** (`/client/public/`)
```
public/
├── 📄 favicon.ico                      # Website favicon
├── 📄 placeholder.svg                  # Default placeholder image
└── 📄 robots.txt                       # Search engine crawler instructions
```

### **Source Code** (`/client/src/`)
```
src/
├── 📄 App.tsx                          # Main React application component
├── 📄 App.css                          # Application-specific styles
├── 📄 main.tsx                         # React application entry point
├── 📄 index.css                        # Global CSS styles and Tailwind imports
├── 📄 vite-env.d.ts                    # Vite environment type definitions
├── 📂 components/                      # React components
├── 📂 pages/                           # Application pages/routes
├── 📂 hooks/                           # Custom React hooks
└── 📂 lib/                             # Utility functions and configurations
```

---

## 🧩 **COMPONENTS DIRECTORY** (`/client/src/components/`)

### **Layout Components** (`/components/layout/`)
```
layout/
├── 📄 Header.tsx                       # Navigation header with menu, logo, theme toggle
└── 📄 Footer.tsx                       # Footer with links, social media, company info
```

**Header.tsx Features:**
- Fixed navigation with glass morphism effect
- Logo with gradient Zap icon and "StackStage" branding
- Navigation menu: Analyze, Features, AI Assistant, Docs, Pricing
- Actions: Theme toggle (dark/light), Login, Try Free CTA
- Mobile responsive hamburger menu

**Footer.tsx Features:**
- Premium glass design with gradient overlays
- Organized sections: Product, Company, Resources, Legal
- Trust indicators and compliance badges
- Contact information and social links
- Operational status indicators

### **Section Components** (`/components/sections/`)
```
sections/
├── 📄 Hero.tsx                         # Landing page hero section
└── 📄 Features.tsx                     # Interactive features showcase
```

**Hero.tsx Features:**
- Aurora animated background with fade transitions
- TrueFocus animated "Build with Confidence" headline
- Value proposition and platform description
- CTA buttons: "Start Analysis" and "Sign In"
- Statistics cards: 99.9% security, 30% cost savings, 2x performance

**Features.tsx Features:**
- 6 interactive feature cards with detailed modals
- Security Analysis, Cost Optimization, Performance Insights
- Scalability Planning, Visual Architecture, Team Collaboration
- Each modal includes detailed statistics and feature lists

### **UI Components** (`/components/ui/`)
**Complete shadcn/ui Library + Custom Components (58 files, 5,671 total lines)**

#### **Custom Components:**
```
ui/
├── 📄 aurora.tsx                       # (147 lines) Animated gradient background
├── 📄 true-focus.tsx                   # (152 lines) Word-by-word text animation
├── 📄 AnimatedList.tsx                 # (199 lines) Staggered list animations
├── 📄 animated-list.tsx                # (119 lines) Alternative animated list
├── 📄 magic-bento.tsx                  # (104 lines) Bento grid layout component
├── 📄 tilted-card.tsx                  # (102 lines) 3D tilted card effects
└── 📄 dock.tsx                         # (99 lines) macOS-style dock component
```

#### **Form & Input Components:**
```
├── 📄 form.tsx                         # (176 lines) Form wrapper with validation
├── 📄 input.tsx                        # (22 lines) Text input field
├── 📄 textarea.tsx                     # (24 lines) Multi-line text input
├── 📄 input-otp.tsx                    # (69 lines) One-time password input
├── 📄 checkbox.tsx                     # (28 lines) Checkbox input
├── 📄 radio-group.tsx                  # (42 lines) Radio button group
├── 📄 switch.tsx                       # (27 lines) Toggle switch
├── 📄 slider.tsx                       # (26 lines) Range slider
├── 📄 select.tsx                       # (158 lines) Dropdown select
└── 📄 label.tsx                        # (24 lines) Form labels
```

#### **Layout & Container Components:**
```
├── 📄 card.tsx                         # (79 lines) Content cards
├── 📄 separator.tsx                    # (29 lines) Divider lines
├── 📄 tabs.tsx                         # (53 lines) Tabbed content
├── 📄 accordion.tsx                    # (56 lines) Collapsible content
├── 📄 collapsible.tsx                  # (9 lines) Simple collapsible
├── 📄 resizable.tsx                    # (43 lines) Resizable panels
├── 📄 scroll-area.tsx                  # (46 lines) Custom scrollbars
└── 📄 aspect-ratio.tsx                 # (5 lines) Aspect ratio container
```

#### **Navigation & Menu Components:**
```
├── 📄 navigation-menu.tsx              # (128 lines) Complex navigation menus
├── 📄 menubar.tsx                      # (234 lines) Desktop application menubar
├── 📄 dropdown-menu.tsx                # (198 lines) Context dropdown menus
├── 📄 context-menu.tsx                 # (198 lines) Right-click context menus
├── 📄 command.tsx                      # (153 lines) Command palette/search
├── 📄 breadcrumb.tsx                   # (115 lines) Navigation breadcrumbs
└── 📄 pagination.tsx                   # (117 lines) Page navigation
```

#### **Overlay & Modal Components:**
```
├── 📄 dialog.tsx                       # (120 lines) Modal dialogs
├── 📄 alert-dialog.tsx                 # (139 lines) Confirmation dialogs
├── 📄 sheet.tsx                        # (131 lines) Slide-out panels
├── 📄 drawer.tsx                       # (116 lines) Bottom drawer
├── 📄 popover.tsx                      # (29 lines) Floating content
├── 📄 hover-card.tsx                   # (27 lines) Hover-triggered cards
└── 📄 tooltip.tsx                      # (28 lines) Hover tooltips
```

#### **Feedback & Status Components:**
```
├── 📄 alert.tsx                        # (59 lines) Status alerts
├── 📄 toast.tsx                        # (127 lines) Toast notifications
├── 📄 toaster.tsx                      # (33 lines) Toast container
├── 📄 sonner.tsx                       # (29 lines) Sonner toast implementation
├── 📄 progress.tsx                     # (26 lines) Progress bars
├── 📄 skeleton.tsx                     # (15 lines) Loading placeholders
└── 📄 badge.tsx                        # (36 lines) Status badges
```

#### **Data Display Components:**
```
├── 📄 table.tsx                        # (117 lines) Data tables
├── 📄 chart.tsx                        # (363 lines) Chart and graph components
├── 📄 calendar.tsx                     # (64 lines) Date picker calendar
├── 📄 avatar.tsx                       # (48 lines) User profile images
├── 📄 carousel.tsx                     # (260 lines) Image/content carousel
└── 📄 sidebar.tsx                      # (761 lines) Complex sidebar layouts
```

#### **Interactive Components:**
```
├── 📄 button.tsx                       # (60 lines) Action buttons
├── 📄 toggle.tsx                       # (43 lines) Toggle buttons
├── 📄 toggle-group.tsx                 # (59 lines) Toggle button groups
└── 📄 use-toast.ts                     # Toast hook utility
```

---

## 📄 **PAGES DIRECTORY** (`/client/src/pages/`)

### **Page Files by Size (21 files, 8,516 total lines):**
```
pages/
├── 📄 Analyze.tsx                      # (852 lines) Cloud infrastructure analysis workflow
├── 📄 Docs.tsx                         # (741 lines) Comprehensive documentation system
├── 📄 Assistant.tsx                    # (711 lines) Premium AI-powered chat interface
├── 📄 Community.tsx                    # (534 lines) Developer community and forums
├── 📄 Support.tsx                      # (530 lines) Help center and support resources
├── 📄 Changelog.tsx                    # (530 lines) Version history and release notes
├── 📄 Status.tsx                       # (492 lines) System status and monitoring
├── 📄 About.tsx                        # (472 lines) Company information and team
├── 📄 Privacy.tsx                      # (453 lines) Privacy policy and data handling
├── 📄 Signup.tsx                       # (434 lines) User registration with plan selection
├── 📄 Terms.tsx                        # (408 lines) Terms of service and legal
├── 📄 Fixes.tsx                        # (376 lines) Detailed remediation guides
├── 📄 Share.tsx                        # (349 lines) Collaboration and sharing features
├── 📄 Login.tsx                        # (344 lines) User authentication
├── 📄 Diagram.tsx                      # (339 lines) Architecture visualization
├── 📄 Enterprise.tsx                   # (337 lines) Enterprise features and sales
├── 📄 Results.tsx                      # (314 lines) Analysis results display
├── 📄 Pricing.tsx                      # (241 lines) 3-tier SaaS pricing plans
├── 📄 NotFound.tsx                     # (27 lines) 404 error page
├── 📄 Landing.tsx                      # (18 lines) Homepage composition
└── 📄 Index.tsx                        # (14 lines) Index redirect
```

### **Page Categories & Features:**

#### **🏠 Core Application Pages:**
- **Landing.tsx**: Hero + Features sections composition
- **Analyze.tsx**: File upload, cloud connect, text input, real-time analysis
- **Assistant.tsx**: AI chat interface with templates and quick actions
- **Results.tsx**: Analysis summary with export options
- **Fixes.tsx**: Step-by-step remediation instructions
- **Diagram.tsx**: Interactive architecture visualizations
- **Share.tsx**: Team collaboration and report sharing

#### **📚 Information & Documentation:**
- **Docs.tsx**: Searchable documentation with categories and articles
- **Pricing.tsx**: Professional 3-tier pricing with feature comparison
- **About.tsx**: Company story, team profiles, values and mission
- **Enterprise.tsx**: Advanced features and enterprise sales

#### **🔐 User Management:**
- **Login.tsx**: Split-screen authentication with social login
- **Signup.tsx**: Multi-step registration with plan selection

#### **🤝 Support & Community:**
- **Support.tsx**: Help center, knowledge base, contact options
- **Community.tsx**: Forums, events, user groups, beta programs
- **Status.tsx**: Real-time system monitoring and incident history
- **Changelog.tsx**: Release notes and feature updates

#### **📜 Legal & Compliance:**
- **Privacy.tsx**: GDPR/CCPA compliant privacy policy
- **Terms.tsx**: Terms of service and acceptable use policies

#### **🔧 Utility Pages:**
- **NotFound.tsx**: 404 error handling
- **Index.tsx**: Root redirect logic

---

## 🪝 **HOOKS DIRECTORY** (`/client/src/hooks/`)

```
hooks/
├── 📄 use-theme.tsx                    # Dark/light theme management
├── 📄 use-toast.ts                     # Toast notification system
└── 📄 use-mobile.tsx                   # Mobile device detection
```

**Hook Features:**
- **use-theme.tsx**: Theme state management with localStorage persistence
- **use-toast.ts**: Toast notification queue and display logic
- **use-mobile.tsx**: Responsive design helper for mobile detection

---

## 🛠️ **LIB DIRECTORY** (`/client/src/lib/`)

```
lib/
└── 📄 utils.ts                         # Utility functions and helpers
```

**Utils Features:**
- Tailwind CSS class merging utilities
- Common helper functions
- Type utilities and validators

---

## 🖥️ **SERVER DIRECTORY** (`/server/`)

```
server/
├── 📄 index.ts                         # Express server entry point
├── 📄 routes.ts                        # API route definitions
├── 📄 storage.ts                       # Data storage interface
└── 📄 vite.ts                          # Vite development server integration
```

**Server Features:**
- **index.ts**: Express server setup with middleware and session management
- **routes.ts**: RESTful API endpoints for data operations
- **storage.ts**: In-memory storage implementation with CRUD operations
- **vite.ts**: Development server integration with hot module replacement

---

## 🔗 **SHARED DIRECTORY** (`/shared/`)

```
shared/
└── 📄 schema.ts                        # Shared type definitions and schemas
```

**Schema Features:**
- Zod validation schemas
- Drizzle ORM table definitions
- TypeScript type exports
- Insert/select type definitions

---

## 📎 **ATTACHED ASSETS** (`/attached_assets/`)

```
attached_assets/
├── 📄 Pasted--Enhance-StackStage-s-Homepage-*.txt
├── 📄 Pasted--Enhance-StackStage-s-homepage-*.txt
├── 📄 Pasted-Refine-the-Aurora-background-*.txt
└── 📄 Pasted-import-React-useRef-useState-*.txt
```

**Asset Features:**
- User-uploaded design specifications
- Code snippets and enhancement requests
- Development notes and requirements

---

## ⚙️ **CONFIGURATION FILES**

### **Package Management:**
```
├── 📄 package.json                     # Dependencies, scripts, project metadata
└── 📄 package-lock.json                # Exact dependency versions
```

### **TypeScript Configuration:**
```
└── 📄 tsconfig.json                    # TypeScript compiler options and paths
```

### **Build Tools:**
```
├── 📄 vite.config.ts                   # Vite bundler configuration
├── 📄 postcss.config.js                # PostCSS processor setup
└── 📄 tailwind.config.ts               # Tailwind CSS customization
```

### **UI Framework:**
```
└── 📄 components.json                  # shadcn/ui component configuration
```

### **Database:**
```
└── 📄 drizzle.config.ts                # Drizzle ORM database configuration
```

### **Documentation:**
```
├── 📄 replit.md                        # Project documentation and user preferences
├── 📄 FRONTEND_SUMMARY.md              # Technical architecture summary
└── 📄 PAGE_WISE_DETAILED_FEATURES.md   # Feature breakdown by page
```

---

## 📊 **PROJECT STATISTICS**

### **File Count by Type:**
- **TypeScript/TSX Files**: 95 files
- **React Components**: 58 UI components + 2 layout + 2 sections = 62 components
- **Pages**: 21 application pages
- **Configuration Files**: 8 config files
- **Documentation**: 3 comprehensive documentation files

### **Lines of Code:**
- **Total UI Components**: 5,671 lines
- **Total Pages**: 8,516 lines
- **Largest Components**: Sidebar (761), Chart (363), Carousel (260)
- **Largest Pages**: Analyze (852), Docs (741), Assistant (711)

### **Key Dependencies:**
- **Frontend**: React 18.3.1, TypeScript 5.7.2, Vite 5.4.19
- **Styling**: Tailwind CSS 3.4.17, shadcn/ui components
- **Backend**: Express.js, Node.js with TypeScript
- **Database**: Drizzle ORM with PostgreSQL support
- **Routing**: Wouter 3.7.1 (Replit-optimized)

### **Architecture Highlights:**
- **Modern React**: Hooks, concurrent features, TypeScript
- **Professional Design**: Glass morphism, Aurora backgrounds, gradient text
- **Component Library**: Complete shadcn/ui implementation
- **Responsive**: Mobile-first design with desktop optimization
- **Performance**: Optimized builds, lazy loading, efficient rendering
- **Accessibility**: WCAG compliant, keyboard navigation, screen reader support

This folder structure represents a comprehensive, enterprise-ready cloud architecture analysis platform with professional design, full-featured functionality, and modern development practices.