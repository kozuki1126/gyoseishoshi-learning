# Implementation Guide

行政書士試験対策オンライン学習システムの実装詳細について説明します。

## Architecture Overview

### System Architecture
```
Frontend (Next.js)
├── Pages (SSR/SSG)
├── Components (React)
├── API Routes (Server-side)
└── Static Assets

Backend Services
├── Content Management API
├── User Progress Tracking
├── Authentication Service
└── File Upload/Download
```

### Key Technologies
- **Framework**: Next.js 14.x
- **UI Library**: React 18.x
- **Styling**: Tailwind CSS 3.x
- **Icons**: Lucide React
- **State Management**: Built-in React state

## Component Structure

### Core Components

#### Header Component
ナビゲーションとユーザー関連機能を提供
```javascript
// Location: src/components/Header.js
export default function Header({ user, onLogout })
```

**Features:**
- Responsive navigation menu
- User authentication status display
- Mobile hamburger menu
- Login/logout functionality

#### SubjectsSection Component
科目一覧の表示とナビゲーション
```javascript
// Location: src/components/SubjectsSection.js
export default function SubjectsSection({ subjects })
```

**Features:**
- Accordion-style subject listing
- Progress indicators
- Responsive grid layout
- Subject-specific icons and colors

#### AudioPlayer Component
学習用音声の再生機能
```javascript
// Location: src/components/units/AudioPlayer.js
export default function AudioPlayer({ audioUrl, title })
```

**Features:**
- Play/pause controls
- Progress tracking
- Volume control
- Playback speed adjustment
- Seeking functionality

### Page Components

#### Home Page
```javascript
// Location: src/pages/index.js
export default function Home()
```

**Sections:**
- Hero section with CTA
- Features overview
- Subject summary
- Testimonials
- Footer with links

#### Subjects Page
```javascript
// Location: src/pages/subjects/index.js
export default function Subjects()
```

**Features:**
- Subject filtering and categorization
- Progress tracking per subject
- Study time estimation
- Difficulty indicators

#### Unit Detail Page
```javascript
// Location: src/pages/units/[id].js
export default function UnitDetail()
```

**Features:**
- Content rendering with sections
- Audio player integration
- Progress tracking
- Related units suggestions

## Data Management

### Subject Data Structure
```javascript
// Location: src/data/subjects.js
const subjects = [
  {
    id: 'constitutional-law',
    name: '憲法',
    description: '日本国憲法の基本原理',
    icon: ScaleIcon,
    color: 'bg-blue-500',
    category: 'law',
    difficulty: 'beginner',
    estimatedHours: 40,
    units: [...]
  }
];
```

### Unit Content Structure
```javascript
const unitContent = {
  introduction: 'ユニットの導入',
  sections: [
    {
      title: 'セクション名',
      content: 'セクション内容',
      subsections: [...]
    }
  ],
  keyPoints: ['重要ポイント1', '重要ポイント2'],
  conclusion: 'まとめ'
};
```

### Progress Tracking
```javascript
const userProgress = {
  overall: {
    totalUnits: 120,
    completedUnits: 45,
    averageScore: 82
  },
  bySubject: {
    'constitutional-law': {
      completed: 12,
      total: 15,
      score: 89
    }
  }
};
```

## API Implementation

### Content API Routes
```
/api/content/units          - Get all units
/api/content/unit?id=123    - Get specific unit
/api/content/subjects       - Get all subjects
/api/content/search?q=term  - Search content
/api/content/progress       - User progress
```

### API Response Format
```javascript
{
  success: true,
  data: {
    // Response data
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 100
  }
}
```

### Content Service
```javascript
// Location: src/lib/contentService.js
class ContentService {
  async getUnits(params);
  async getUnit(id);
  async updateProgress(data);
  async searchContent(query);
}
```

## File Organization

### Directory Structure
```
src/
├── components/
│   ├── common/           # 共通コンポーネント
│   ├── forms/           # フォーム関連
│   ├── layout/          # レイアウト関連
│   └── units/           # 学習ユニット関連
├── pages/
│   ├── api/             # API routes
│   ├── subjects/        # 科目関連ページ
│   ├── units/           # ユニット詳細ページ
│   └── admin/           # 管理者ページ
├── lib/                 # ユーティリティ
├── data/                # データ定義
├── styles/              # スタイル
└── hooks/               # カスタムフック
```

### Content Files
```
content/
├── units/
│   ├── 101.md           # ユニット内容
│   ├── 102.md
│   └── ...
└── metadata/            # メタデータ

public/
├── images/
│   └── features/        # 機能説明画像
├── audio/
│   └── units/           # 音声ファイル
└── pdf/
    └── downloads/       # PDFファイル
```

## Styling Implementation

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        }
      }
    }
  }
};
```

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid system
- Responsive typography

### Color System
- Primary: Blue shades for main actions
- Secondary: Gray shades for content
- Success: Green for completed items
- Warning: Yellow for attention items
- Error: Red for errors

## Performance Optimizations

### Code Splitting
- Automatic page-level splitting
- Dynamic imports for heavy components
- Lazy loading for non-critical features

### Image Optimization
- Next.js Image component
- WebP format when supported
- Responsive image loading
- Placeholder during loading

### Caching Strategy
- Static assets: Long-term caching
- API responses: Short-term caching
- Service worker for offline content

## Testing Strategy

### Unit Testing
```javascript
// Example: Button component test
import { render, screen } from '@testing-library/react';
import Button from '../Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

### Integration Testing
- API endpoint testing
- Component interaction testing
- User flow testing

### E2E Testing
```javascript
// Example: Cypress test
describe('Unit Learning Flow', () => {
  it('should complete unit successfully', () => {
    cy.visit('/units/101');
    cy.get('[data-cy=content]').should('be.visible');
    cy.get('[data-cy=complete-button]').click();
    // Assert completion state
  });
});
```

## Security Considerations

### Input Validation
- Server-side validation for all inputs
- Client-side validation for UX
- Sanitization of user content

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Session management

### File Upload Security
- File type validation
- Size limitations
- Virus scanning (planned)
- Secure storage

## Error Handling

### Client-side Error Handling
```javascript
// Error Boundary example
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### API Error Handling
```javascript
// Centralized error handling
const apiCall = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

## Deployment Guide

### Environment Setup
```bash
# Development environment
npm run dev

# Production build
npm run build

# Production server
npm start
```

### Environment Variables
```
NEXT_PUBLIC_API_URL=https://api.example.com
UPLOAD_MAX_SIZE=50485760
SESSION_SECRET=your-secret-key
```

### Build Optimization
- Bundle analysis with webpack-bundle-analyzer
- Tree shaking for unused code
- Minification and compression
- Asset optimization

## Monitoring & Analytics

### Error Tracking
- Client-side error reporting
- Server-side error logging
- Performance monitoring

### User Analytics
- Page view tracking
- User engagement metrics
- Learning progress analytics

### Performance Monitoring
- Core Web Vitals tracking
- API response time monitoring
- Resource usage monitoring

## Future Enhancements

### Planned Features
1. **Offline Support**
   - Service Worker implementation
   - Content caching strategy
   - Sync when online

2. **Advanced Analytics**
   - Learning pattern analysis
   - Personalized recommendations
   - Progress predictions

3. **Social Features**
   - Study groups
   - Progress sharing
   - Discussion forums

4. **AI Integration**
   - Content recommendations
   - Adaptive learning paths
   - Automated assessment

### Technical Improvements
1. **TypeScript Migration**
   - Gradual type introduction
   - Better IDE support
   - Runtime error reduction

2. **State Management**
   - Zustand or Redux integration
   - Global state optimization
   - Persistent state

3. **Testing Coverage**
   - Increase test coverage to 80%+
   - Visual regression testing
   - Performance testing

---

最終更新: 2024年5月19日
