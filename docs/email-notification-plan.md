# Email Notification System Plan

## Overview

The application features a clean server-side email notification abstraction layer in `src/lib/email/`:
- `sendLeadNotification.ts`: Dispatches lead details to `BUSINESS_NOTIFICATION_EMAIL` and `ADMIN_NOTIFICATION_EMAIL`.
- `sendReviewRequest.ts`: Dispatches review request invitations to customer email addresses.

## Production Integration Guide

To connect an email provider (such as Resend, AWS SES, or SendGrid):
1. Install provider SDK (e.g. `npm install resend`).
2. Add API key environment variable (e.g. `RESEND_API_KEY=`).
3. Replace placeholder `console.log` methods in `src/lib/email/` with SDK dispatch calls.
4. Ensure domain SPF/DKIM records are verified for `ocwaterfeatures.com`.
