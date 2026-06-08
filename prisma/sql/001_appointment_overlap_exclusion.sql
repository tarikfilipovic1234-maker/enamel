-- Hard, DB-level guarantee against double-booking a dentist.
-- Prevents two APPROVED appointments for the same staff member from
-- overlapping in time. Application code also checks this, but the
-- constraint closes the race-condition window.
--
-- Run once against your Neon database (the application path also enforces
-- overlaps transactionally, so this is an extra safety net):
--   psql "$DIRECT_URL" -f prisma/sql/001_appointment_overlap_exclusion.sql

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Appointment"
  ADD CONSTRAINT appointment_no_overlap
  EXCLUDE USING gist (
    "staffId" WITH =,
    tstzrange("start", "end") WITH &&
  )
  WHERE (status = 'APPROVED' AND "staffId" IS NOT NULL);
