-- Migration: 20260902_waitlist_lawyer_fields.sql
-- Description: Add lawyer verification and contact fields to public.waitlist with safe backfill

ALTER TABLE public.waitlist 
  ADD COLUMN IF NOT EXISTS user_type TEXT CHECK (user_type IN ('individual', 'lawyer') OR user_type IS NULL),
  ADD COLUMN IF NOT EXISTS mobile TEXT,
  ADD COLUMN IF NOT EXISTS bar_council_state TEXT,
  ADD COLUMN IF NOT EXISTS enrollment_number TEXT,
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';

-- Backfill existing records safely
UPDATE public.waitlist 
SET user_type = CASE 
  WHEN role = 'lawyer' THEN 'lawyer' 
  ELSE 'individual' 
END 
WHERE user_type IS NULL;

UPDATE public.waitlist 
SET verification_status = 'pending' 
WHERE verification_status IS NULL;

-- Helpful query indexes
CREATE INDEX IF NOT EXISTS waitlist_user_type_idx ON public.waitlist(user_type);
CREATE INDEX IF NOT EXISTS waitlist_verification_status_idx ON public.waitlist(verification_status);
