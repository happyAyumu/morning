/*
  # Add payment method to user profiles

  1. Changes
    - Add `stripe_customer_id` column to `user_profiles` table to store Stripe customer ID
    - Add `stripe_payment_method_id` column to `user_profiles` table to store default payment method
    - Add `payment_method_last4` column to store last 4 digits of card for display
    - Add `payment_method_brand` column to store card brand (visa, mastercard, etc)
    - Add `payment_method_exp_month` and `payment_method_exp_year` for card expiration
    
  2. Security
    - No changes to RLS policies needed - already secured by user_id
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN stripe_customer_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'stripe_payment_method_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN stripe_payment_method_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'payment_method_last4'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN payment_method_last4 text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'payment_method_brand'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN payment_method_brand text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'payment_method_exp_month'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN payment_method_exp_month integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'payment_method_exp_year'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN payment_method_exp_year integer;
  END IF;
END $$;