# 🔍 Debugging Scan Crash Guide

## Steps to Debug

1. **Open your app** and go to the scan screen
2. **Take a photo** using the camera
3. **Try to analyze** it by tapping the analyze button
4. **Check the console logs** for these debug messages:

## Expected Log Flow

### 📷 Taking Picture

```
📷 Starting takePicture function
📸 Taking picture...
✅ Picture taken: {uri: "...", width: 1920, height: 1080}
✅ Switched to captured image mode
```

### 🔍 Starting Analysis

```
🔍 Starting cropAndAnalyze function
📸 Captured image details: {uri: "...", width: 1920, height: 1080, hasBase64: false}
📐 Crop area: {x: 64, y: 240, width: 256, height: 192}
📱 Screen dimensions: {screenWidth: 320, screenHeight: 640}
📊 Calculated crop ratios: {cropRatioX: 0.2, cropRatioY: 0.375, ...}
```

### ✂️ Image Processing

```
🔄 Starting image manipulation...
✅ Image manipulation complete: {uri: "...", width: 800, height: 600, hasBase64: true, base64Length: 45678}
💾 Updating captured image state...
🚀 Starting analysis...
📡 Calling analyzeScan.mutate with imageUrl length: 61234
✅ Analysis initiated successfully
```

### 🔄 Analysis Response

```
🔄 Analysis data effect triggered: {hasData: true, hasCapturedImage: true}
🔄 Converting to UI format...
✅ UI product created: {name: "...", brand: "...", ...}
✅ Modal shown
```

## Common Crash Points

### ❌ If you see these errors:

**1. Camera Issues:**

```
❌ Camera ref not available
❌ No photo data received
```

**Solution:** Restart the app, check camera permissions

**2. Image Processing Issues:**

```
❌ Missing image dimensions
❌ Invalid crop ratios
❌ Invalid crop dimensions
❌ No base64 data in cropped image
```

**Solution:** Retake the photo, adjust crop area

**3. Analysis Issues:**

```
❌ Invalid image URL format
💥 Error in cropAndAnalyze: [specific error]
```

**Solution:** Check network connection, API keys

**4. Data Conversion Issues:**

```
💥 Error converting analysis data: [specific error]
```

**Solution:** Check API response format

## Quick Fixes

### If the app crashes immediately:

1. **Check console logs** for the last debug message
2. **Restart the app**
3. **Try with a different image**
4. **Check network connection**

### If analysis fails:

1. **Check Supabase environment variables**
2. **Verify GOOGLE_AI_API_KEY is set**
3. **Verify OPENAI_API_KEY is set**
4. **Check Supabase function logs**

### If image processing fails:

1. **Try with a smaller image**
2. **Adjust the crop area**
3. **Retake the photo**

## Environment Check

Make sure these are set in your Supabase project:

- `GOOGLE_AI_API_KEY` - For Google Vision API
- `OPENAI_API_KEY` - For OpenAI analysis
- `SUPABASE_URL` - Your Supabase URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key

## Report the Issue

When reporting the crash, please include:

1. **The last debug message** you see in console
2. **Any error messages** (💥 lines)
3. **Device type** (iOS/Android)
4. **Image details** (size, format)
5. **Network status** (WiFi/cellular)

This will help identify exactly where the crash occurs!
