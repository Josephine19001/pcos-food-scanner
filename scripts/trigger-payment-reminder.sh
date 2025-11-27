#!/bin/bash

# Script to manually trigger payment reminder or use with external cron service
# Usage: ./scripts/trigger-payment-reminder.sh

# Load environment variables if .env exists
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | xargs)
fi

# Required environment variables:
# SUPABASE_URL - Your Supabase project URL
# SUPABASE_SERVICE_ROLE_KEY - Service role key (not anon key)

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"
  exit 1
fi

echo "Triggering payment reminder..."

curl -X POST "${SUPABASE_URL}/functions/v1/payment-reminder" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{}'

echo ""
echo "Done!"
