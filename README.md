<p align="center">
  <a href="https://ng-alain.com">
    <img width="100" src="https://ng-alain.com/assets/img/logo-color.svg">
  </a>
</p>

<h1 align="center">NG-ALAIN</h1>

<div align="center">
  Enterprise-grade Angular 20 application built on ng-alain framework.<br>
  Featuring Git-like branching model, Supabase integration, and modern development standards.

  [![CI](https://github.com/ng-alain/ng-alain-gighub/actions/workflows/ci.yml/badge.svg)](https://github.com/ng-alain/ng-alain-gighub/actions/workflows/ci.yml)
  [![Dependency Status](https://david-dm.org/ng-alain/ng-alain-gighub/status.svg?style=flat-square)](https://david-dm.org/ng-alain/ng-alain-gighub)
  [![GitHub Release Date](https://img.shields.io/github/release-date/ng-alain/ng-alain-gighub.svg?style=flat-square)](https://github.com/ng-alain/ng-alain-gighub/releases)
  [![NPM version](https://img.shields.io/npm/v/ng-alain.svg?style=flat-square)](https://www.npmjs.com/package/ng-alain)
  [![prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
  [![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/ng-alain/ng-alain-gighub/blob/master/LICENSE)
  [![Gitter](https://img.shields.io/gitter/room/ng-alain/ng-alain.svg?style=flat-square)](https://gitter.im/ng-alain/ng-alain)
  [![ng-zorro-vscode](https://img.shields.io/badge/ng--zorro-VSCODE-brightgreen.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=cipchk.ng-zorro-vscode)
  [![ng-alain-vscode](https://img.shields.io/badge/ng--alain-VSCODE-brightgreen.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=cipchk.ng-alain-vscode)

</div>

English | [简体中文](README-zh_CN.md)

## Project Vision

This is an **Enterprise Construction Site Management System** built on Angular 20 and Supabase, implementing a **Git-like branching model** for project collaboration. The system provides a comprehensive solution for managing construction projects, tasks, quality control, and team collaboration.

### Core Vision

- **Git-like Branching Model**: Main branches (owner-controlled) and organization branches (collaborator-controlled) with PR workflow
- **51 Database Tables**: Organized into 11 business modules covering all aspects of construction management
- **Enterprise Standards**: Following SRP principles, five-layer architecture, and comprehensive development guidelines
- **Modern Technology Stack**: Angular 20 with Signals, Supabase real-time capabilities, and MCP toolchain integration

For detailed architecture understanding, see:
- [System Architecture Mind Map](./docs/01-系統架構思維導圖.mermaid.md) - Complete system architecture overview
- [Complete Architecture Flowchart](./docs/20-完整架構流程圖.mermaid.md) - Git-like branching model and data flow

## Quickstart

- [Getting Started Guide](./docs/25-快速開始指南.md) - Project-specific setup guide
- [ng-alain Documentation](https://ng-alain.com/docs/getting-started) - Framework documentation

## Documentation Index

### 🚀 Getting Started
- [Quick Start Guide](./docs/25-快速開始指南.md) - Environment setup and getting started
- [Complete Documentation Index](./docs/README.md) - Full documentation navigation

### 📐 Architecture & Design

#### Core Architecture Documents
- [System Architecture Mind Map](./docs/01-系統架構思維導圖.mermaid.md) ⭐⭐⭐⭐⭐ - Complete system architecture overview
- [Complete Architecture Flowchart](./docs/20-完整架構流程圖.mermaid.md) ⭐⭐⭐⭐⭐ - Git-like branching model and data flow
- [Project Structure Flowchart](./docs/02-專案結構流程圖.mermaid.md) - Project structure overview
- [System Context Diagram](./docs/03-系統上下文圖.mermaid.md) - System context and boundaries
- [Container Diagram](./docs/10-容器圖.mermaid.md) - Container architecture
- [Component Module View](./docs/11-元件模組視圖.mermaid.md) - Component module structure
- [Component Module View (Supplement)](./docs/12-元件模組視圖-補充.md) - Additional component details

#### Business Flow & Data
- [Business Flowchart](./docs/04-業務流程圖.mermaid.md) - Business process flows
- [Account Layer Flowchart](./docs/05-帳戶層流程圖.mermaid.md) - Account and identity system
- [Entity Relationship Diagram](./docs/06-實體關係圖.mermaid.md) - Database ER diagram
- [Data Lifecycle ETL Flowchart](./docs/07-資料生命週期-ETL-流程圖.mermaid.md) - Data lifecycle and ETL processes
- [Storage Bucket Structure](./docs/08-Storage-Bucket結構視圖.mermaid.md) - Storage architecture
- [Sequence Diagram](./docs/13-序列圖.mermaid.md) - Sequence diagrams
- [State Diagram](./docs/14-狀態圖.mermaid.md) - State transitions
- [Domain Event Timeline](./docs/15-領域事件時間軸圖.mermaid.md) - Domain events timeline
- [API Interface Mapping](./docs/16-API-介面映射圖.mermaid.md) - API interface mapping

#### Infrastructure & Deployment
- [Supabase Architecture Flowchart](./docs/17-Supabase架構流程圖.mermaid.md) - Supabase architecture
- [Deployment Infrastructure](./docs/18-部署基礎設施視圖.mermaid.md) - Deployment infrastructure
- [Observability & CI/CD Pipeline](./docs/19-可觀測性與CI-CD管道圖.mermaid.md) - Monitoring and CI/CD

### 📋 Development Standards

#### Core Principles
- [SRP (Single Responsibility Principle)](./docs/00-SRP.md) ⭐⭐⭐⭐⭐ - Single Responsibility Principle and 10 Enterprise Architecture Principles
- [Architecture Governance](./docs/00-架構治理規範.md) ⭐⭐⭐⭐⭐ - Architecture governance standards
- [Consistency Standards](./docs/00-一致性規範.md) - Code consistency requirements
- [Composability Standards](./docs/00-可組合性規範.md) - Component composability guidelines
- [Maintainability Standards](./docs/00-可維護性規範.md) - Code maintainability requirements

#### Technical Standards
- [Modern Syntax Standards](./docs/00-現代化語法規範.md) - Angular 20 modern syntax
- [API Standards](./docs/00-API規範.md) - API design standards
- [Component Standards](./docs/00-Component規範.md) - Component development standards
- [State Management Standards](./docs/00-State規範.md) - State management with Signals
- [Naming Standards](./docs/00-命名標準化規範.md) - Naming conventions
- [Testing Standards](./docs/00-測試規範.md) - Testing requirements and coverage
- [Performance Standards](./docs/00-性能規範.md) - Performance optimization guidelines
- [Security Standards](./docs/00-安全規範.md) - Security requirements
- [DevOps Standards](./docs/00-DevOps規範.md) - DevOps and deployment standards

### 🔒 Security & Permissions
- [Security & RLS Permission Matrix](./docs/09-安全與-RLS-權限矩陣.md) ⭐⭐⭐⭐⭐ - Row Level Security policies

### 📚 Additional Resources
- [Development Best Practices](./docs/42-開發最佳實踐指南.md) ⭐ - Coding guidelines and examples
- [Workspace Context Feature Overview](./docs/58-工作區上下文功能總覽.md) ⭐⭐⭐⭐⭐ - Complete workspace context system (User/Organization/Team contexts)
- [SQL Table Definitions](./docs/22-完整SQL表結構定義.md) ⭐⭐⭐⭐⭐ - Complete database schema (51 tables)
- [Complete Documentation Index](./docs/README.md) - Full documentation navigation

### Framework Documentation
- [ng-alain Documentation](https://ng-alain.com) ([Surge Mirror](https://ng-alain-doc.surge.sh))
- [@delon Source](https://github.com/ng-alain/delon)
- [DEMO](https://ng-alain.surge.sh) ([国内镜像](https://ng-alain.gitee.io/))

## Features

### Core Framework Features
+ **Angular 20.3.x** - Latest Angular with Standalone Components & Signals
+ **NG-ZORRO 20.3.x** - Enterprise UI component library
+ **ng-alain 20.1.x** - Out-of-box admin solution
+ **TypeScript 5.9.x** - Strict mode with full type safety
+ **Supabase** - PostgreSQL database with real-time capabilities

### Modern Angular Features
+ **Standalone Components** - No NgModules, cleaner architecture
+ **Angular Signals** - Reactive state management
+ **Typed Forms** - Type-safe form handling
+ **Modern Control Flow** - `@if`, `@for`, `@switch` syntax
+ **Deferrable Views** - Progressive lazy loading

### Architecture & Development
+ **Five-Layer Architecture** - Types → Repositories → Models → Services → Facades → Routes
+ **Git-like Branching Model** - Main branches, organization branches, PR workflow
+ **Workspace Context System** - User/Organization/Team three-context switching (see [Workspace Context Feature Overview](./docs/58-工作區上下文功能總覽.md))
+ **Repository Pattern** - Clean data access layer
+ **Facade Pattern** - Unified state management interface
+ **SRP Principles** - Single Responsibility Principle throughout

### Database & Backend
+ **51 Database Tables** - Organized into 11 business modules
+ **Supabase Integration** - Real-time subscriptions, RLS policies
+ **Type-Safe Queries** - Auto-generated TypeScript types
+ **Row Level Security** - Database-level permission control

### Developer Experience
+ **MCP Toolchain Integration** - Sequential Thinking, Software Planning, Supabase MCP
+ **Enterprise Standards** - Comprehensive development guidelines
+ **Code Quality Tools** - ESLint, Prettier, Stylelint, Husky
+ **Comprehensive Documentation** - 50+ documentation files
+ **AI Assistant Support** - Cursor IDE, GitHub Copilot integration

### UI/UX Features
+ Responsive Layout
+ Internationalization (i18n)
+ Customizable Theme
+ RTL Support
+ Lazy Load Assets
+ UI Router States
+ Less Preprocessor

## Tech Stack

### Frontend
- **Framework**: Angular 20.3.x (Standalone Components)
- **UI Library**: NG-ZORRO 20.3.x + ng-alain 20.1.x
- **State Management**: Angular Signals + RxJS 7.8.x
- **Language**: TypeScript 5.9.x (strict mode)
- **Styling**: Less + ng-alain theme system

### Backend & Database
- **Database**: Supabase (PostgreSQL 15+)
- **Real-time**: Supabase Realtime subscriptions
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

### Development Tools
- **Package Manager**: Yarn 4.9.2 (Plug'n'Play)
- **Code Quality**: ESLint 9.x, Prettier, Stylelint
- **Testing**: Karma + Jasmine
- **Git Hooks**: Husky + lint-staged
- **MCP Tools**: Sequential Thinking, Software Planning, Supabase MCP

## Architecture

> 📐 **Architecture Overview**: This system implements a **five-layer architecture** following **SRP principles** and **enterprise architecture standards**. For complete architecture understanding, see [System Architecture Mind Map](./docs/01-系統架構思維導圖.mermaid.md) and [Complete Architecture Flowchart](./docs/20-完整架構流程圖.mermaid.md).

### Five-Layer Architecture

```
Routes (Business Layer)
  ↓ depends on
Shared (Shared Layer)
  ↓ depends on
Core (Infrastructure Layer)
  ├─ Facades (State & UI Communication)
  ├─ Services (Business Logic)
  ├─ Repositories (Data Access)
  └─ SupabaseService (Database Client)
```

**Design Principles** (see [SRP Standards](./docs/00-SRP.md) and [Architecture Governance](./docs/00-架構治理規範.md)):
- **Single Responsibility Principle (SRP)** - Each layer has one clear responsibility
- **Dependency Direction** - Strict unidirectional dependencies (see [Architecture Governance](./docs/00-架構治理規範.md))
- **Repository Pattern** - Clean data access abstraction
- **Facade Pattern** - Unified interface for components
- **Consistency** - Unified code style, API format, and naming (see [Consistency Standards](./docs/00-一致性規範.md))
- **Composability** - Small, focused components that can be freely combined (see [Composability Standards](./docs/00-可組合性規範.md))
- **Maintainability** - Strict typing, linting, and clear file structure (see [Maintainability Standards](./docs/00-可維護性規範.md))

### Git-like Branching Model

The system implements a **Git-like branching model** for project management (see [Complete Architecture Flowchart](./docs/20-完整架構流程圖.mermaid.md) for detailed flow):

- **Main Branch (blueprints)** - Owner controls task structure completely
- **Organization Branches (blueprint_branches)** - Collaborators can only fill assignment fields (1:1 contract relationship)
- **Pull Request Workflow** - Submit execution data → Owner review → Merge update to main branch
- **Fork Mechanism** - Organizations can fork tasks from main branch for collaboration

This model ensures clear ownership boundaries and controlled collaboration, similar to Git's branch and PR workflow.

### Workspace Context System

The system implements a **three-context workspace model** for different user roles and use cases (see [Workspace Context Feature Overview](./docs/58-工作區上下文功能總覽.md) for complete details):

- **User Context** - Lightweight personal productivity center (15 pages, 6 modules)
  - Personal data aggregation across all organizations and teams
  - Quick access to most frequently used features
  - Cross-context data views
  
- **Organization Context** - Full-featured organization management center (70+ pages, 9 modules)
  - Complete Git-like branching model support
  - Full management capabilities (members, teams, blueprints, tasks, quality, issues)
  - Comprehensive analytics and reporting
  
- **Team Context** - Team collaboration and task execution center (20 pages, 5 modules)
  - Focused on task execution and progress updates
  - Simplified management features
  - Team communication and collaboration

**Context Switching**: Users can seamlessly switch between contexts based on their current role and task requirements.

### Database Architecture

- **51 Database Tables** organized into 11 modules (see [Entity Relationship Diagram](./docs/06-實體關係圖.mermaid.md) and [Complete SQL Table Definitions](./docs/22-完整SQL表結構定義.md)):
  - 🔐 Account & Identity System (4 tables) - Unified identity abstraction (User, Bot, Organization)
  - 🤝 Organization Collaboration (3 tables) - Cross-organization collaboration
  - 🔒 Permission System (5 tables) - Row Level Security (RLS) policies (see [Security & RLS Permission Matrix](./docs/09-安全與-RLS-權限矩陣.md))
  - 🎯 Blueprint/Project System (5 tables) - Git-like branching model implementation
  - 📋 Task Execution System (9 tables) - Task management and execution tracking
  - ✅ Quality Acceptance (4 tables) - Quality control and acceptance workflows
  - ⚠️ Issue Tracking (4 tables) - Issue tracking and resolution
  - 💬 Collaboration Communication (6 tables) - Team communication and collaboration
  - 📊 Data Analytics (6 tables) - Analytics and reporting
  - 🤖 Robot System (3 tables) - Bot and automation system
  - ⚙️ System Management (2 tables) - System configuration and management

**Security**: All database operations are protected by **Row Level Security (RLS)** policies. See [Security & RLS Permission Matrix](./docs/09-安全與-RLS-權限矩陣.md) for detailed permission configuration.

![Architecture](https://raw.githubusercontent.com/ng-alain/delon/master/_screenshot/architecture.png)

> [delon](https://github.com/ng-alain/delon) is a production-ready solution for admin business components packages, Built on the design principles developed by Ant Design.

## Development Standards

> 📋 **Development Standards**: This project follows **enterprise-grade development standards** with comprehensive guidelines. All developers must follow these standards to ensure code quality and maintainability.

### Core Development Principles

1. **Common Practices** - Follow Angular/TypeScript/ng-alain best practices (see [Modern Syntax Standards](./docs/00-現代化語法規範.md))
2. **Enterprise Standards** - Clear code structure, separation of concerns, error handling (see [SRP Standards](./docs/00-SRP.md))
3. **Logical Consistency** - Clear data flow, semantic naming, reasonable conditions (see [Consistency Standards](./docs/00-一致性規範.md))
4. **Common Sense** - Functional features, user experience first, avoid over-engineering

### Development Workflow

**Five-Layer Development Order** (see [Architecture Governance](./docs/00-架構治理規範.md)):
1. **Types Layer** - Database types, business types
2. **Repositories Layer** - Data access (inherits BaseRepository)
3. **Models Layer** - Business models (can parallel with Repositories)
4. **Services Layer** - Business logic with Signals (see [State Management Standards](./docs/00-State規範.md))
5. **Facades Layer** - State & UI communication
6. **Routes/Components Layer** - UI components (see [Component Standards](./docs/00-Component規範.md))
7. **Testing & Documentation** - Unit tests, documentation (see [Testing Standards](./docs/00-測試規範.md))

### Code Quality Standards

- **Type Safety**: TypeScript strict mode, no `any` types (see [Maintainability Standards](./docs/00-可維護性規範.md))
- **Linting**: ESLint + Prettier + Stylelint
- **Testing**: ≥80% coverage for Services/Facades, 100% for critical logic (see [Testing Standards](./docs/00-測試規範.md))
- **Architecture**: Strict dependency direction, no circular dependencies (see [Architecture Governance](./docs/00-架構治理規範.md))
- **Performance**: Follow performance optimization guidelines (see [Performance Standards](./docs/00-性能規範.md))
- **Security**: Follow security requirements (see [Security Standards](./docs/00-安全規範.md))
- **API Design**: Follow API design standards (see [API Standards](./docs/00-API規範.md))
- **Naming**: Follow naming conventions (see [Naming Standards](./docs/00-命名標準化規範.md))

### Additional Resources

For detailed development guidelines, see:
- [Development Best Practices](./docs/42-開發最佳實踐指南.md) ⭐ - Coding guidelines and examples
- [SRP Standards](./docs/00-SRP.md) ⭐⭐⭐⭐⭐ - Single Responsibility Principle and 10 Enterprise Architecture Principles
- [Architecture Governance](./docs/00-架構治理規範.md) ⭐⭐⭐⭐⭐ - Architecture governance standards
- [Complete Architecture Flowchart](./docs/20-完整架構流程圖.mermaid.md) - System architecture

## App Shots

![desktop](https://raw.githubusercontent.com/ng-alain/delon/master/_screenshot/desktop.png)
![ipad](https://raw.githubusercontent.com/ng-alain/delon/master/_screenshot/ipad.png)
![iphone](https://raw.githubusercontent.com/ng-alain/delon/master/_screenshot/iphone.png)

## Contributing

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/ng-alain/ng-alain-gighub/pulls)

We welcome all contributions. Please read our [CONTRIBUTING.md](https://github.com/ng-alain/ng-alain-gighub/blob/master/CONTRIBUTING.md) first. You can submit any ideas as [pull requests](https://github.com/ng-alain/ng-alain-gighub/pulls) or as [GitHub issues](https://github.com/ng-alain/ng-alain-gighub/issues).

> If you're new to posting issues, we ask that you read [*How To Ask Questions The Smart Way*](http://www.catb.org/~esr/faqs/smart-questions.html) (**This guide does not provide actual support services for this project!**), [How to Ask a Question in Open Source Community](https://github.com/seajs/seajs/issues/545) and [How to Report Bugs Effectively](http://www.chiark.greenend.org.uk/~sgtatham/bugs.html) prior to posting. Well written bug reports help us help you!

## Donation

ng-alain is an MIT-licensed open source project. In order to achieve better and sustainable development of the project, we expect to gain more backers. You can support us in any of the following ways:

- [patreon](https://www.patreon.com/cipchk)
- [opencollective](https://opencollective.com/ng-alain)
- [paypal](https://www.paypal.me/cipchk)
- [支付宝或微信](https://ng-alain.com/assets/donate.png)

Or purchasing our [business theme](https://e.ng-alain.com/).

## Backers

Thank you to all our backers! 🙏

<a href="https://opencollective.com/ng-alain#backers" target="_blank"><img src="https://opencollective.com/ng-alain/backers.svg?width=890"></a>

### License

The MIT License (see the [LICENSE](https://github.com/ng-alain/ng-alain-gighub/blob/master/LICENSE) file for the full text)
