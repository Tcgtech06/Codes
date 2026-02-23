# Manual Cleanup Commands for KnitInfo Restructuring

## Navigate to project root
cd D:\Freelancing\KnitInfo

## Step 1: Delete old backend folder
rmdir /s /q KnitInfo_Backend

## Step 2: Delete old frontend folder
rmdir /s /q KnitInfo_Frontend

## Step 3: Delete duplicate file from root
del DATABASE_OPERATIONS_USER_STORIES.txt

## Step 4: Install dependencies
npm install

## Step 5: Test the application
npm run dev

## Step 6: Verify structure
dir /b

## Expected structure after cleanup:
# database/
# docs/
# public/
# scripts/
# src/
# .env.example
# .env.local
# .gitignore
# .nvmrc
# .watchmanconfig
# CHECK_DATABASE_SCHEMA.sql
# Dyes & Chemicals.xlsx
# eslint.config.mjs
# FIX_AND_RUN.bat
# netlify.toml
# next.config.ts
# package.json
# package-lock.json
# postcss.config.mjs
# README.md
# RESTRUCTURING_PLAN.md
# RESTRUCTURING_SUMMARY.md
# tsconfig.json

## Optional: Clean up restructuring docs after verification
# del RESTRUCTURING_PLAN.md
# del RESTRUCTURING_SUMMARY.md
