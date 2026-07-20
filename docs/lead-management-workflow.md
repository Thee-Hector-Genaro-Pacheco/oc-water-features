# Lead Management & Conversion Workflow

## Lead Lifecycle Stages

1. **`new`**: Public estimate request received via `/api/leads`.
2. **`contacted`**: Admin has called or emailed customer.
3. **`estimate_scheduled`**: On-site or phone consultation appointment booked.
4. **`estimate_sent`**: Formal quote provided.
5. **`won`**: Client accepts quote. Eligible for conversion to a `Customer` record.
6. **`active_client`**: Client created and job added to pipeline.
7. **`completed`**: Job contracts finished.
8. **`lost` / `spam` / `duplicate`**: Closed or invalid leads.

## Converting Won Leads to Customers
When an administrator clicks **Convert Won Lead to Customer** on `/admin/leads/[id]`:
- A new record is inserted into `customers` with `original_lead_id`.
- The lead status is updated to `won`.
- An audit entry is recorded in `lead_activities`.
- Administrator is redirected to `/admin/customers/[id]` to log jobs.
