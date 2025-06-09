# MealMate - Recipe and Grocery Helper

## Description

An app to simplify storing recipes, buying ingredients, and a marketplace for recipe books.

## Tech Stack

- Frontend
  - React
  - Next.js
  - TypeScript
  - Material UI
- Backend
  - Node.js
  - Express.js
  - MongoDB
  - Vercel Serverless Functions

## Feature List

- [x] User authentication
- [x] All recipes page
  - [x] individual recipes page
    - [x] checklist for cooking
- [x] Store Section
  - [x] recipe packs
  - [x] premium plans
- [x] Grocery Mode
  - [x] Shop for certain recipe books

## Getting Started

### Dependencies

- Node.js 20+
- npm/yarn

### Installing/Development mode

```
- cd mn_1/frontend
- npm install
- cd ../backend
- npm install
- create .env file with mongoDB specifications
- npm run dev:all
```

### Deployment on Vercel

The application is configured to deploy on Vercel with serverless functionality:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Vercel will automatically detect the configuration in `vercel.json`
4. Set the following environment variables in Vercel:
   - `MONGODB_URI`: Your MongoDB connection string
   - Any other environment variables needed by your application

Vercel will automatically build and deploy both the frontend and the serverless API functions.

### Api Endpoints

#### Recipes

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| GET    | /api/recipes     | Get all recipes       |
| GET    | /api/recipes/:id | Get a recipe by ID    |
| POST   | /api/recipes     | Create a new recipe   |
| PUT    | /api/recipes/:id | Update a recipe by ID |
| DELETE | /api/recipes/:id | Delete a recipe by ID |

#### Users

| Method | Endpoint               | Description                              |
| ------ | ---------------------- | ---------------------------------------- |
| POST   | /api/users/register    | Register a new user                      |
| POST   | /api/users/login       | Login a user                             |
| GET    | /api/users/:id         | Get user by ID                           |
| PUT    | /api/users/:id         | Update user by ID                        |
| DELETE | /api/users/:id         | Delete user by ID                        |
| GET    | /api/users/:id/recipes | Get all recipes for a user               |
| POST   | /api/users/:id/recipes | Add a recipe to a user's collection      |
| DELETE | /api/users/:id/recipes | Remove a recipe from a user's collection |

#### Store/Market

| Method | Endpoint       | Description               |
| ------ | -------------- | ------------------------- |
| GET    | /api/store     | Get all store items       |
| GET    | /api/store/:id | Get a store item by ID    |
| POST   | /api/store     | Create a new store item   |
| PUT    | /api/store/:id | Update a store item by ID |
| DELETE | /api/store/:id | Delete a store item by ID |

#### Serverless API Endpoints

| Method | Endpoint   | Description      |
| ------ | ---------- | ---------------- |
| GET    | /api       | API health check |
| GET    | /api/meals | Get all meals    |

## Authors

- Cai Chen

  - [@Cai Chen](https://github.com/achen2304)

- Megan Chng

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
