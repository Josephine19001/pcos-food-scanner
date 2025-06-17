✅ Serper.dev: Extraction Layer
Serper's /lens endpoint should handle everything related to visual understanding, such as:

1. Product identification via visual search
2. Collecting product links (top 2–3 matches)
3. Extracting visible text (e.g., ingredients, product label text, claims)
4. Returning structured metadata like:
   _ visual_matches: links, thumbnails, titles
   _ text_detections: raw OCR output
   You can also clean this data client/server-side before sending to GPT.

✅ GPT-4: Reasoning & Analysis Layer
GPT-4 is responsible for interpreting the structured and textual data from Serper. Its job is to:

1. Identify the product name, brand, and category based on:
   - Titles of links
   - Text snippets
   - Extracted text
2. Infer ingredients from extracted_text
3. Determine key ingredients and classify as:
   - beneficial, harmful, or neutral
4. Generate safetyScore (e.g., 0–10)
5. Generate a user-friendly analysis in the ScannedProductUI format
   GPT should not receive the image or do visual interpretation. That’s Serper’s job.

🔁 Final Flow Recap:
Step Tool Responsibility
1 User Upload Captures product photo
2 Supabase Stores image and returns public URL
3 Serper Uses image URL to return: links + OCR text
4 App Server Extracts product links + ingredient text
5 GPT-4 Analyzes the above data → returns analysis
6 DB Stores ScannedProductUI record
