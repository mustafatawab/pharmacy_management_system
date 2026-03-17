# Pharmacy Management System - Application Flow

This document outlines the end-to-end user journey and technical flow of the multi-tenant Pharmacy Management System.

## 1. Onboarding & Multi-Tenancy Flow
The system is built on a multi-tenant architecture where each pharmacy is a "Tenant."

1.  **User Registration**: A new user registers via `/auth/register`. The first user is automatically assigned the `admin` role.
2.  **Pharmacy Setup (Tenant Creation)**: After login, the Admin is directed to the onboarding process to create a Pharmacy (Tenant) via `/tenant/setup`.
3.  **Tenant Linking**: The backend creates the Tenant record and links the Admin's `tenant_id` to it.
4.  **Security Funnel**: All subsequent requests pass through the `require_admin_with_tenant` dependency, ensuring strict data isolation.

## 2. Catalog & Inventory Management
Before transactions can occur, the pharmacy's catalog must be established.

1.  **Suppliers**: Admin adds vendors via `/supplier`. These are unique to the pharmacy's `tenant_id`.
2.  **Categories**: Admin organizes products (e.g., "Antibiotics", "OTC", "Vaccines") via `/category`.
3.  **Medicine Catalog**: Admin defines products via `/medicine`. Each product tracks name, unit (tablet/bottle), and pricing.

## 3. Procurement & Stocking (FIFO Logic)
Stock is managed through batches to track expiration and costs accurately.

1.  **Purchase Orders**: Admin records stock arrivals from Suppliers.
2.  **Batch Creation**: Each stock arrival creates a `ProductBatch` with a unique Batch Number and Expiry Date.
3.  **Inventory Calculation**: The total available stock for a medicine is the sum of all its active batches.

## 4. Point of Sale (POS) Flow
The primary daily workflow for pharmacists and staff.

1.  **Staff Access**: Admin creates "Staff" accounts via `/user`. Staff can view inventory and process sales but cannot manage pharmacy settings.
2.  **Product Search**: The POS interface allows searching for medicines by name or category.
3.  **Cart Management**: Items are added to a cart with real-time stock validation.
4.  **Transaction Processing**:
    *   **Stock Deduction**: Uses FIFO (First-In-First-Out) logic to deduct from the oldest batches first.
    *   **Sales Record**: A transaction is created, linking the items sold to the `tenant_id`.
    *   **Receipt Generation**: A digital summary of the sale is provided.

## 5. Management & Analytics
High-level overview for the Pharmacy Admin.

1.  **Dashboard**: Real-time stats on daily sales, low stock alerts, and expiring products.
2.  **Reporting**: Generation of Profit/Loss and Inventory Valuation reports, filtered by `tenant_id`.
3.  **User Management**: Admin can activate/deactivate staff accounts and update their roles.
