# Rapid Lightning — Supabase Schema
**SUPABASE_SCHEMA.md — Database Source of Truth**

**Last updated**: March 25, 2026  
**AGENTS.md last updated at commit**: a4fd11058880251ffd3c1096573bed9229fa068f

## 1. CURRENT LIVE SCHEMA (exported from Supabase — March 25, 2026)

| table_name | column_name           | data_type                | is_nullable | column_default |
| ---------- | --------------------- | ------------------------ | ----------- | -------------- |
| orders     | id                    | integer                  | NO          | nextval('orders_id_seq') |
| orders     | name                  | text                     | YES         | null |
| orders     | email                 | text                     | YES         | null |
| orders     | address               | text                     | YES         | null |
| orders     | quantity              | integer                  | YES         | null |
| orders     | total_cents           | integer                  | YES         | null |
| orders     | status                | text                     | YES         | 'pending' |
| orders     | created_at            | timestamp with time zone | YES         | now() |
| orders     | stripe_session_id     | text                     | YES         | null |
| orders     | phone                 | text                     | YES         | null |
| orders     | sms_opt_in            | boolean                  | YES         | false |
| orders     | delivery_instructions | text                     | YES         | null |
| orders     | delivery_fee_cents    | integer                  | YES         | 0 |
| orders     | distance_miles        | numeric                  | YES         | 0 |
| products   | id                    | integer                  | NO          | nextval('products_id_seq') |
| products   | name                  | text                     | NO          | 'Fresh Eggs - Dozen' |
| products   | price                 | integer                  | NO          | 700 |
| products   | stock                 | integer                  | YES         | 50 |
| products   | description           | text                     | YES         | 'Ungraded fresh eggs...' |
| profiles   | id                    | uuid                     | NO          | null |
| profiles   | full_name             | text                     | YES         | null |
| profiles   | phone                 | text                     | YES         | null |
| profiles   | email                 | text                     | YES         | null |
| profiles   | created_at            | timestamp with time zone | YES         | now() |