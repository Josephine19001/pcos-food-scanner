# Database Population Script

This script populates your Supabase `scanned_products` table with data from `mock/products.json`.

## Prerequisites

1. **Supabase Environment Variables**: Make sure you have the following environment variables set in your `.env.local` file:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Service Role Key**: You need the service role key (not the anon key) to perform database inserts. You can find this in your Supabase dashboard under Settings > API.

## Table Schema

The script expects your `scanned_products` table to have the following columns:

- `id` (text/uuid)
- `name` (text)
- `brand` (text)
- `category` (text)
- `safety_score` (integer)
- `image_url` (text)
- `ingredients` (jsonb)
- `key_ingredients` (jsonb)
- `scanned_at` (timestamp)
- `user_id` (uuid)

## Running the Script

1. **Install dependencies** (if not already installed):

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the population script**:
   ```bash
   npm run populate-db
   # or
   yarn populate-db
   ```

## What the Script Does

1. **Reads** the `mock/products.json` file
2. **Transforms** each product into the format expected by your database:
   - Calculates safety scores based on ingredients
   - Extracts key ingredients (top 5)
   - Generates random scan dates within the last 30 days
   - Sets a default user_id (you'll need to update this)
3. **Inserts** data in batches of 10 to avoid overwhelming the database
4. **Logs** progress and any errors

## Important Notes

- **User IDs**: The script uses a default UUID for `user_id`. You should update this to use actual user IDs from your auth system.
- **Safety Scores**: The script calculates safety scores based on simple ingredient analysis. You may want to adjust the algorithm.
- **Batch Processing**: Data is inserted in batches to prevent timeouts and rate limiting.
- **Error Handling**: If one batch fails, the script continues with the next batch.

## Customization

You can modify the script to:

- Change the safety score calculation algorithm
- Adjust the key ingredients extraction logic
- Use different user IDs
- Modify the batch size
- Add additional data transformations

## Troubleshooting

- **Environment Variables**: Make sure your Supabase URL and service role key are correct
- **Table Schema**: Ensure your database table matches the expected schema
- **Permissions**: The service role key should have insert permissions on the table
- **Network**: Check your internet connection and Supabase project status
