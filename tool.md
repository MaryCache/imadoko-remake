# 開発環境・使用ツール

## Backend

*   **Java:** 17 (LTS)
*   **Framework:** Spring Boot 3.2.3
*   **Build Tool:** Maven 3.9
*   **Database (Prod):** PostgreSQL 16
*   **Database (Test):** H2 Database
*   **ORM:** Spring Data JPA + Hibernate
*   **Migration:** Flyway
*   **Validation:** Spring Boot Starter Validation (Bean Validation)
*   **Monitoring:** Spring Boot Actuator
*   **Code Generation:** OpenAPI Generator Maven Plugin 7.1.0
*   **Code Formatter:** Spotless (Google Java Format 1.17.0)
*   **Utilities:** Lombok
*   **API Spec:** OpenAPI 3.0 / Swagger Annotations 2.2.19

## Frontend

*   **Framework:** Next.js 16.0.3 (App Router)
*   **Runtime:** Node.js 18+
*   **Language:** TypeScript 5
*   **UI Library:** React 19.2.0
*   **Styling:** Tailwind CSS 4
*   **Component Library:** Headless UI 2.2.9
*   **Icons:** Heroicons 2.2.0, Lucide React 0.554.0
*   **HTTP Client:** Axios 1.13.2
*   **Drag & Drop:** @dnd-kit 6.3.1 (core, sortable, modifiers, utilities)
*   **Animation:** Framer Motion 12.23.24
*   **Utilities:** clsx 2.1.1
*   **Code Generation:** openapi-typescript 7.10.1

## Testing

*   **Unit Testing:** Jest 30.2.0 + jest-environment-jsdom
*   **Component Testing:** Testing Library (React 16.3.0, Jest DOM 6.9.1, User Event 14.6.1)
*   **E2E Testing:** Playwright 1.56.1 + @playwright/test
*   **Visual Testing:** Storybook 10.0.8 (@storybook/nextjs-vite)
*   **Coverage:** @vitest/coverage-v8 4.0.13

## Code Quality

*   **Linter:** ESLint 9 + eslint-config-next
*   **Formatter:** Prettier 3.2.5 + eslint-config-prettier
*   **Type Checker:** TypeScript 5 (Strict Mode)

## DevOps & Infrastructure

*   **Containerization:** Docker + Docker Compose 3.8
*   **Base Images:** 
    - PostgreSQL 16 Alpine
    - Eclipse Temurin 17 JRE Alpine (Backend)
    - Node.js 18 Alpine (Frontend)
*   **API Documentation:** Swagger UI (swaggerapi/swagger-ui:latest)
*   **Performance Analysis:** @next/bundle-analyzer

## Development Tools

*   **Package Manager (Backend):** Maven
*   **Package Manager (Frontend):** npm
*   **Hot Reload (Backend):** Spring Boot DevTools
*   **Hot Reload (Frontend):** Next.js Fast Refresh + Webpack
*   **Environment Variables:** .env.local (Frontend), application.properties (Backend)
*   **Cross Platform:** cross-env 10.1.0
