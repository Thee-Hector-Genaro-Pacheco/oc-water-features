# Data Retention, Privacy & Compliance Policy

This document outlines data retention guidelines, privacy standards, PCI compliance boundaries, and security incident response protocols for **OC Water Features**.

---

## 1. Data Minimization Principles

OC Water Features collects only necessary business information required to perform water feature maintenance, repairs, and billing:
- **Collected Data**: Full Name, Phone Number, Email Address, City, Service Address, Property Type, Service Descriptions, and Customer Feedback.
- **Prohibited Data**: Never collect or store Social Security Numbers, driver's license numbers, or sensitive financial identifiers in standard database text fields.

---

## 2. Payment Data & PCI-DSS Boundaries

- **No Card Storage**: OC Water Features does **NOT** store, process, or transmit credit card numbers, CVVs, or bank account details in the database or server logs.
- All payment processing must be delegated to PCI-DSS Level 1 compliant third-party payment gateways (e.g., Stripe, Square) using hosted payment fields or invoice links.

---

## 3. Data Retention Schedules

- **Lost or Duplicate Leads (`status = 'lost' / 'spam'`)**: Automatically purged or archived after 90 days to maintain database cleanliness.
- **Active & Historic Customers**: Customer profile records and completed job contracts are retained for 7 years to support warranty claims, annual maintenance history, and accounting audits.
- **Review Tokens**: Expired or submitted single-use token hashes in `review_requests` are retained for 180 days for audit logging before purge.

---

## 4. Customer Data Removal & Privacy Requests (CCPA / CPRA)

Under California privacy regulations, customers have the right to request deletion or export of their personal information:
- **Data Export**: Administrators can export customer records, job history, and testimonials in structured JSON or CSV format via the admin portal.
- **Deletion Requests**: Upon receiving a verified request to `info@ocwaterfeatures.com`, administrators must delete or anonymize customer contact details in `customers` and `leads` while preserving non-identifiable financial totals for tax compliance.

---

## 5. Security Incident Response Protocol

In the event of a suspected security breach or compromised administrative credential:
1. **Immediately Revoke Credential**: Deactivate compromised `admin_profiles` record (`is_active = FALSE`).
2. **Rotate API Keys**: Re-generate Supabase JWT Secret, Anon Key, and Service-Role Key in the Supabase Dashboard.
3. **Audit Logs**: Inspect Supabase `auth.audit_log_entries` and application access logs.
4. **Notification**: Notify impacted customers within statutory timelines if personal data exposure occurred.
