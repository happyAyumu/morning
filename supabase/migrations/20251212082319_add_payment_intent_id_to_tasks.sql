/*
  # Add payment intent ID to tasks table

  1. Changes
    - Add `payment_intent_id` column to `tasks` table
      - Stores Stripe Payment Intent ID for tracking payment status
      - Nullable to support tasks without payment setup
    - Add `payment_status` column to track payment state
      - Values: 'pending', 'authorized', 'captured', 'canceled'
      - Default to 'pending'
  
  2. Notes
    - Payment Intent is created when task is created
    - Payment is captured only when task deadline is missed
    - Payment can be canceled when task is completed successfully
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'payment_intent_id'
  ) THEN
    ALTER TABLE tasks ADD COLUMN payment_intent_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE tasks ADD COLUMN payment_status text DEFAULT 'pending';
  END IF;
END $$;