# Customer Review Request Workflow & Security Model

## Token Generation & Security Hashing

To ensure secure review links without exposing database IDs:
1. Administrator triggers review request generation on `/admin/reviews`.
2. Server generates a cryptographically random token using `crypto.randomBytes(32).toString('hex')`.
3. Server computes SHA-256 hash of the token: `crypto.createHash('sha256').update(token).digest('hex')`.
4. Only the hash is saved in `review_requests(token_hash)`.
5. Link `${NEXT_PUBLIC_SITE_URL}/review/${rawToken}` is delivered to customer.

## Review Submission & Ungated Google Review Option

1. Customer opens `/review/[token]`. Server updates status to `opened`.
2. Customer completes rating (1–5 stars), feedback text, name, city, and optional publish permission checkbox.
3. Upon submission, record is inserted into `testimonials` (pending admin approval).
4. Thank-you screen displays direct button to `GOOGLE_REVIEW_URL`. No review gating is applied.
