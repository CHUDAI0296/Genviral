# Genviral

A web-based AI image style transformation tool with Apple-inspired minimalist design and black & white color scheme.

## Features

- 🎨 **Smart Image Transformation**: Transform image styles through AI conversation
- 🖼️ **Drag & Drop Upload**: Support drag and drop image upload
- 💬 **Natural Conversation**: Interact with AI using natural language
- 📱 **Responsive Design**: Perfectly adapts to various devices
- 🎯 **Apple Style**: Minimalist and elegant black & white design

## API Integration

Genviral integrates with powerful AI APIs to provide advanced image generation and transformation capabilities:

### OpenRouter API
- Access to 400+ AI models through a unified API
- Default chat model: GPT-4.1 Nano (fast, efficient, low latency)
- Support for vision models like GPT-4 Turbo Vision, Claude 3 Opus, Qwen VL Max
- Used for image analysis and style transformation guidance
- Enhances prompt quality for better image generation

### OpenAI API
- DALL-E integration for high-quality image generation
- Image editing capabilities for style transformations
- Fallback to local processing when API is unavailable

## Supported Features

### Image Style Transformations
- Black & White Style
- Oil Painting Effect
- Vintage Retro Style
- Sci-Fi Future Style
- Watercolor Effect
- Custom Styles

### File Support
- Formats: JPG, PNG, WEBP
- Size: Max 10MB
- Drag & Drop Upload Support

## How to Use

1. **Configure APIs**: 
   - Click the API Settings button in the footer
   - Enter your OpenRouter API key for text and vision capabilities
   - Enter your OpenAI API key for image generation
   - Select preferred models for chat and vision tasks

2. **Upload Image**: Click or drag image to upload area

3. **Transform Existing Images**:
   - Upload an image
   - Describe desired style transformation in chat
   - AI will analyze and transform the image

4. **Generate New Images**:
   - Type a description for a new image in chat
   - AI will generate an image based on your description

5. **Download Results**: Click the download button to save processed images

## Project Structure

```
├── index.html          # Main application
├── demo.html           # Demo page
├── styles.css          # Stylesheet
├── script.js           # Interactive logic
└── README.md          # Project documentation
```

## Local Development

1. Download project files
2. Open `index.html` in browser
3. Configure API keys in settings
4. Start using AI image transformation features

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Notes

- API keys are stored locally in browser storage
- Fallback to local processing when APIs are unavailable
- Modern browsers recommended for best experience

## Future Plans

- [ ] Add more AI model options
- [ ] Implement image history gallery
- [ ] Support batch processing
- [ ] Add more advanced editing tools
- [ ] Support more image formats

## License

MIT License

---

**Let Genviral give wings to your creativity** ✨ 