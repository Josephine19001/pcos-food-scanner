# Google Cloud Vision API Setup Guide

## 🚀 Overview

Our app uses Google Cloud Vision API (the technology behind Google Lens) for product identification and text extraction. This provides the same powerful image recognition capabilities as Google Lens.

## 📋 Setup Steps

### 1. Google Cloud Console Setup

1. **Go to Google Cloud Console**

   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select Project**

   - Create a new project or select existing one
   - Note your Project ID

3. **Enable Vision API**

   - Go to `APIs & Services` > `Library`
   - Search for "Cloud Vision API"
   - Click on "Cloud Vision API"
   - Click "Enable"

4. **Create API Key**
   - Go to `APIs & Services` > `Credentials`
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key
   - (Optional) Restrict the key to Vision API only for security

### 2. Environment Configuration

Add to your Supabase Edge Function environment variables:

```bash
GOOGLE_AI_API_KEY=your_api_key_here
```

### 3. Current Implementation Features

Our implementation uses these Vision API features:

#### **TEXT_DETECTION**

- Extracts all visible text from product labels
- Gets ingredient lists, product names, descriptions
- OCR capability for any text in the image

#### **LABEL_DETECTION**

- Identifies product categories (cosmetics, skincare, etc.)
- Detects product types and attributes
- Provides confidence scores

#### **LOGO_DETECTION**

- Recognizes brand logos and names
- Identifies manufacturer information
- Brand verification

#### **WEB_DETECTION**

- Finds similar products online
- Web entities matching the product
- Product verification through web matching

## 🔧 API Usage in Our Code

### Current Endpoint

```typescript
const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
```

### Request Structure

```typescript
const body = {
  requests: [
    {
      image: {
        content: base64Content, // for base64 images
        // OR
        source: { imageUri: imageUrl }, // for URLs
      },
      features: [
        { type: 'TEXT_DETECTION', maxResults: 1 },
        { type: 'LABEL_DETECTION', maxResults: 10 },
        { type: 'LOGO_DETECTION', maxResults: 5 },
        { type: 'WEB_DETECTION', maxResults: 10 },
      ],
    },
  ],
};
```

## 💰 Pricing Information

### Vision API Pricing (as of 2024)

- **TEXT_DETECTION**: $1.50 per 1,000 images
- **LABEL_DETECTION**: $1.50 per 1,000 images
- **LOGO_DETECTION**: $1.50 per 1,000 images
- **WEB_DETECTION**: $3.50 per 1,000 images

### Free Tier

- 1,000 units per month free for each feature
- Perfect for development and testing

## 🛡️ Security Best Practices

### API Key Security

1. **Restrict API Key**

   - Limit to Vision API only
   - Add HTTP referrer restrictions if needed
   - Use IP restrictions for server-side usage

2. **Environment Variables**
   - Never commit API keys to version control
   - Use Supabase environment variables
   - Rotate keys regularly

### Rate Limiting

- Vision API has generous rate limits
- Implement client-side rate limiting if needed
- Handle quota exceeded errors gracefully

## 🔍 Alternative Options

### Google Lens Alternatives

1. **Amazon Rekognition**

   - Similar image recognition capabilities
   - Text detection and label detection
   - Different pricing model

2. **Microsoft Computer Vision**

   - OCR and object detection
   - Product recognition capabilities
   - Azure-based solution

3. **Clarifai**
   - Custom model training
   - Product recognition models
   - Good for specialized use cases

## 📊 Performance Optimization

### Image Optimization

- Resize images to max 4MB before sending
- Use JPEG format for better compression
- Crop to focus on product labels

### Batch Processing

- Process multiple features in single request
- Combine TEXT_DETECTION with other features
- Reduces API calls and costs

### Caching

- Cache results for identical images
- Store common product identifications
- Reduce redundant API calls

## 🐛 Troubleshooting

### Common Issues

1. **API Key Invalid**

   - Check key is correctly set in environment
   - Verify API is enabled in Google Cloud Console

2. **Quota Exceeded**

   - Check usage in Google Cloud Console
   - Implement proper error handling
   - Consider upgrading plan

3. **Image Too Large**
   - Resize images before processing
   - Use proper compression
   - Check file size limits (20MB max)

### Error Handling

Our implementation handles these errors:

- Invalid API key
- Quota exceeded
- Image processing failures
- Network timeouts

## 🚀 Next Steps

### Enhancements

1. **Custom Models**

   - Train custom product recognition models
   - Improve accuracy for specific product types
   - Use AutoML Vision for specialized recognition

2. **Additional Features**

   - SAFE_SEARCH_DETECTION for content filtering
   - FACE_DETECTION if needed for product demos
   - CROP_HINTS for better image cropping

3. **Performance Monitoring**
   - Track API usage and costs
   - Monitor response times
   - Implement analytics for accuracy

## 📚 Resources

- [Google Cloud Vision API Documentation](https://cloud.google.com/vision/docs)
- [Vision API Pricing](https://cloud.google.com/vision/pricing)
- [Best Practices Guide](https://cloud.google.com/vision/docs/best-practices)
- [API Reference](https://cloud.google.com/vision/docs/reference/rest)
