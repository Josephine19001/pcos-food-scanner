#!/bin/bash

echo "🚀 Google Cloud Vision API Setup Script"
echo "========================================"

echo ""
echo "📋 Setup Steps:"
echo "1. Go to Google Cloud Console: https://console.cloud.google.com/"
echo "2. Create or select a project"
echo "3. Enable the Vision API"
echo "4. Create an API key"
echo "5. Add the API key to your Supabase environment variables"

echo ""
echo "🔧 Required Environment Variable:"
echo "GOOGLE_AI_API_KEY=your_api_key_here"

echo ""
echo "💰 Pricing Information:"
echo "- TEXT_DETECTION: $1.50 per 1,000 images"
echo "- LABEL_DETECTION: $1.50 per 1,000 images"
echo "- LOGO_DETECTION: $1.50 per 1,000 images"
echo "- WEB_DETECTION: $3.50 per 1,000 images"
echo "- Free tier: 1,000 units per month for each feature"

echo ""
echo "🔍 Current Implementation Features:"
echo "✅ TEXT_DETECTION - Extract ingredient lists and product text"
echo "✅ LABEL_DETECTION - Identify product categories and types"
echo "✅ LOGO_DETECTION - Recognize brand logos and names"
echo "✅ WEB_DETECTION - Find matching products online"
echo "✅ OBJECT_LOCALIZATION - Detect and locate objects in images"

echo ""
echo "📚 Useful Links:"
echo "- Vision API Docs: https://cloud.google.com/vision/docs"
echo "- Pricing: https://cloud.google.com/vision/pricing"
echo "- Console: https://console.cloud.google.com/"

echo ""
echo "✨ Your app now has Google Lens-like capabilities!"
echo "The Vision API provides the same core technology that powers Google Lens." 