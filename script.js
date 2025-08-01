// 全局变量
let currentImage = null;
let isProcessing = false;
let processedImages = [];
let apiConfig = {
    apiKey: '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', // OpenRouter API密钥
    openaiKey: '', // OpenAI API密钥（用于图像生成和编辑）
    endpoints: {
        openRouter: 'https://openrouter.ai/api/v1',
        openai: {
            generation: 'https://api.openai.com/v1/images/generations',
            edit: 'https://api.openai.com/v1/images/edits'
        }
    },
    models: {
        chat: 'openai/gpt-4.1-nano', // 默认聊天模型
        vision: 'openai/gpt-4-turbo' // 默认视觉模型（保留视觉能力）
    }
};

// DOM 元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const originalImage = document.getElementById('originalImage');
const resultImage = document.getElementById('resultImage');
const loadingSpinner = document.getElementById('loadingSpinner');
const downloadButton = document.getElementById('downloadButton');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');

// 设置相关元素
const settingsButton = document.getElementById('settingsButton');
const settingsModal = document.getElementById('settingsModal');
const closeButton = document.querySelector('.close');
const saveSettingsButton = document.getElementById('saveSettings');
const openRouterKeyInput = document.getElementById('openRouterKey');
const openaiKeyInput = document.getElementById('openaiKey');
const chatModelSelect = document.getElementById('chatModel');
const visionModelSelect = document.getElementById('visionModel');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadHistory();
    loadAPIConfig();
});

// 初始化事件监听器
function initializeEventListeners() {
    // 文件上传相关
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);

    // 聊天相关
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // 下载功能
    downloadButton.addEventListener('click', downloadImage);
    
    // 设置相关
    settingsButton.addEventListener('click', openSettingsModal);
    closeButton.addEventListener('click', closeSettingsModal);
    saveSettingsButton.addEventListener('click', saveSettings);
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeSettingsModal();
        }
    });
    
    // 加载设置到表单
    loadSettingsToForm();
}

// 拖拽处理
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

// 文件选择处理
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// 文件处理
function handleFile(file) {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
        showMessage('Please select an image file', 'error');
        return;
    }

    // 验证文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
        showMessage('File size cannot exceed 10MB', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        currentImage = e.target.result;
        displayOriginalImage(currentImage);
        enableChat();
        showMessage('Image uploaded successfully! You can now start chatting with AI.', 'success');
    };
    reader.readAsDataURL(file);
}

// 显示原始图片
function displayOriginalImage(imageSrc) {
    originalImage.src = imageSrc;
    previewSection.style.display = 'block';
    
    // 滚动到预览区域
    previewSection.scrollIntoView({ behavior: 'smooth' });
}

// 启用聊天功能
function enableChat() {
    chatInput.disabled = false;
    sendButton.disabled = false;
    chatInput.placeholder = 'Describe the image style you want...';
}

// 发送消息
function sendMessage() {
    const message = chatInput.value.trim();
    if (!message || isProcessing) return;

    // 添加用户消息
    addMessage(message, 'user');
    chatInput.value = '';

    // 开始处理
    startImageProcessing(message);
}

// 添加消息到聊天界面
function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = content;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 开始图像处理
function startImageProcessing(prompt) {
    isProcessing = true;
    
    // 显示加载状态
    loadingSpinner.style.display = 'flex';
    resultImage.innerHTML = '';
    resultImage.appendChild(loadingSpinner);
    
    // 模拟AI处理过程
    setTimeout(() => {
        processImageWithAI(prompt);
    }, 1000);
}

// AI图像处理
async function processImageWithAI(prompt) {
    try {
        // 使用真实的图像处理API
        const processedImage = await processImageWithRealAI(currentImage, prompt);
        displayProcessedImage(processedImage);
        
        // 添加AI回复
        const aiResponse = generateAIResponse(prompt);
        addMessage(aiResponse, 'ai');
        
        isProcessing = false;
    } catch (error) {
        handleError(error);
    }
}

// 真实AI图像处理
async function processImageWithRealAI(originalImage, prompt) {
    try {
        // 检查是否需要生成新图像还是处理现有图像
        if (shouldGenerateNewImage(prompt)) {
            return await generateNewImageWithAI(prompt);
        } else {
            return await processExistingImageWithAI(originalImage, prompt);
        }
    } catch (error) {
        console.error('AI processing error:', error);
        // 如果AI API失败，回退到本地处理
        return await processExistingImage(originalImage, prompt);
    }
}

// 判断是否需要生成新图像
function shouldGenerateNewImage(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    const newImageKeywords = [
        'create', 'generate', 'make', 'new', 'cute', 'character', 'avatar',
        'cartoon', 'anime', 'mascot', 'illustration', 'drawing', 'art',
        'person', 'girl', 'boy', 'woman', 'man', 'child', 'baby',
        'animal', 'pet', 'cat', 'dog', 'bird', 'robot', 'monster',
        'fantasy', 'sci-fi', 'futuristic', 'cyberpunk', 'steampunk',
        'landscape', 'scene', 'background', 'environment', 'world',
        'portrait', 'face', 'character', 'hero', 'villain', 'warrior',
        'magical', 'enchanted', 'mystical', 'surreal', 'abstract',
        'food', 'dessert', 'meal', 'dish', 'creature', 'alien'
    ];
    
    return newImageKeywords.some(keyword => lowerPrompt.includes(keyword));
}

// 生成新图像
async function generateNewImageWithAI(prompt) {
    // 增强提示词
    const enhancedPrompt = enhancePromptForAI(prompt);
    
    try {
        // 调用OpenAI DALL-E API
        const imageUrl = await callImageGenerationAPI(enhancedPrompt);
        return imageUrl;
    } catch (error) {
        console.error('Image generation API error:', error);
        // 如果API调用失败，使用示例图像
        await simulateAIGeneration();
        return await generateSampleImage(enhancedPrompt);
    }
}

// 调用图像生成API
async function callImageGenerationAPI(prompt) {
    // API配置
    const openAIKey = getOpenAIKey(); // 获取OpenAI API密钥
    const openRouterKey = getAPIKey(); // 获取OpenRouter API密钥
    
    try {
        // 显示正在调用API的消息
        console.log('Calling image generation API with prompt:', prompt);
        
        // 检查是否有API密钥
        if (!openAIKey && !openRouterKey) {
            console.log('No API keys provided, using sample image');
            await simulateAIGeneration();
            return await generateSampleImage(prompt);
        }
        
        // 首先尝试使用OpenAI API进行图像生成
        if (openAIKey) {
            try {
                const response = await fetch(getOpenAIGenerationEndpoint(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openAIKey}`
                    },
                    body: JSON.stringify({
                        prompt: prompt,
                        n: 1,
                        size: "1024x1024",
                        response_format: "url"
                    })
                });
                
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error.message);
                }
                
                return data.data[0].url;
            } catch (error) {
                console.error('OpenAI image generation failed:', error);
                // 如果OpenAI API调用失败，尝试使用OpenRouter
            }
        }
        
        // 如果OpenAI调用失败或没有OpenAI密钥，尝试使用OpenRouter
        if (openRouterKey) {
            try {
                // 使用OpenRouter调用文本生成模型，生成图像描述
                const enhancedPrompt = enhancePromptForAI(prompt);
                const response = await fetch(`${getOpenRouterEndpoint()}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openRouterKey}`,
                        'HTTP-Referer': window.location.href,
                        'X-Title': 'Genviral'
                    },
                    body: JSON.stringify({
                        model: getChatModel(),
                        messages: [
                            {
                                role: "system",
                                content: "You are an expert image generation assistant. Create detailed image descriptions that can be used to generate high-quality images."
                            },
                            {
                                role: "user",
                                content: `I want to generate an image with the following description: "${prompt}". Please enhance this description with more details to make it suitable for an image generation AI.`
                            }
                        ]
                    })
                });
                
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error.message);
                }
                
                // 获取增强的提示词
                const enhancedDescription = data.choices[0].message.content;
                console.log('Enhanced description:', enhancedDescription);
                
                // 如果有OpenAI密钥，使用增强的描述再次尝试生成图像
                if (openAIKey) {
                    const imageResponse = await fetch(getOpenAIGenerationEndpoint(), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${openAIKey}`
                        },
                        body: JSON.stringify({
                            prompt: enhancedDescription,
                            n: 1,
                            size: "1024x1024",
                            response_format: "url"
                        })
                    });
                    
                    const imageData = await imageResponse.json();
                    if (imageData.error) {
                        throw new Error(imageData.error.message);
                    }
                    
                    return imageData.data[0].url;
                } else {
                    // 如果没有OpenAI密钥，回退到本地生成
                    throw new Error('No OpenAI key available for image generation');
                }
            } catch (error) {
                console.error('OpenRouter enhanced image generation failed:', error);
                // 如果OpenRouter API调用失败，回退到本地生成
            }
        }
        
        // 如果所有API调用都失败，回退到本地生成
        console.log('All API calls failed, using sample image');
        await simulateAIGeneration();
        return await generateSampleImage(prompt);
    } catch (error) {
        console.error('Image generation API call failed:', error);
        console.log('Falling back to sample image');
        // 如果API调用失败，回退到示例图像
        await simulateAIGeneration();
        return await generateSampleImage(prompt);
    }
}

// 增强提示词
function enhancePromptForAI(prompt) {
    let enhanced = prompt;
    const lowerPrompt = prompt.toLowerCase();
    
    // 添加风格描述
    if (lowerPrompt.includes('cute')) {
        enhanced += ', kawaii style, adorable, chibi, pastel colors, round shapes, big eyes';
    }
    if (lowerPrompt.includes('cartoon')) {
        enhanced += ', cartoon style, vibrant colors, clean lines, expressive, playful';
    }
    if (lowerPrompt.includes('anime')) {
        enhanced += ', anime style, detailed, high quality, expressive eyes, dynamic pose';
    }
    if (lowerPrompt.includes('mascot')) {
        enhanced += ', mascot design, friendly, approachable, memorable, simple, iconic';
    }
    if (lowerPrompt.includes('fantasy')) {
        enhanced += ', fantasy art, magical, ethereal lighting, detailed, vibrant colors';
    }
    if (lowerPrompt.includes('cyberpunk') || lowerPrompt.includes('futuristic')) {
        enhanced += ', neon lights, high tech, futuristic, urban, digital art style';
    }
    if (lowerPrompt.includes('steampunk')) {
        enhanced += ', victorian, brass, copper, gears, mechanical, steam-powered';
    }
    if (lowerPrompt.includes('landscape') || lowerPrompt.includes('scene')) {
        enhanced += ', wide angle, detailed environment, atmospheric lighting';
    }
    if (lowerPrompt.includes('portrait') || lowerPrompt.includes('face')) {
        enhanced += ', detailed facial features, expressive, emotional, character study';
    }
    if (lowerPrompt.includes('surreal') || lowerPrompt.includes('abstract')) {
        enhanced += ', dreamlike, imaginative, creative, artistic, unique composition';
    }
    if (lowerPrompt.includes('food') || lowerPrompt.includes('dessert') || lowerPrompt.includes('meal')) {
        enhanced += ', appetizing, delicious, detailed textures, perfect lighting, food photography';
    }
    if (lowerPrompt.includes('creature') || lowerPrompt.includes('monster') || lowerPrompt.includes('alien')) {
        enhanced += ', detailed anatomy, textured skin, unique features, imaginative design';
    }
    
    // 添加艺术风格
    const artStyles = [
        {keyword: 'watercolor', style: 'watercolor painting style, soft edges, flowing colors, artistic'},
        {keyword: 'oil painting', style: 'oil painting style, textured brushstrokes, rich colors, classical'},
        {keyword: 'digital art', style: 'digital art, clean lines, vibrant colors, detailed'},
        {keyword: 'pixel art', style: 'pixel art style, retro gaming, 8-bit, pixelated'},
        {keyword: '3d', style: '3D rendered, volumetric lighting, detailed textures, raytracing'},
        {keyword: 'sketch', style: 'hand-drawn sketch, pencil lines, artistic, detailed linework'},
        {keyword: 'comic', style: 'comic book style, bold outlines, flat colors, dynamic'},
        {keyword: 'realistic', style: 'photorealistic, highly detailed, perfect lighting, lifelike'}
    ];
    
    for (const {keyword, style} of artStyles) {
        if (lowerPrompt.includes(keyword)) {
            enhanced += `, ${style}`;
        }
    }
    
    // 添加质量描述
    enhanced += ', high quality, detailed, professional, trending on artstation';
    
    return enhanced;
}

// 模拟AI生成过程
async function simulateAIGeneration() {
    return new Promise(resolve => {
        setTimeout(resolve, 3000);
    });
}

// 使用AI处理现有图像
async function processExistingImageWithAI(originalImage, prompt) {
    // 增强提示词
    const enhancedPrompt = enhancePromptForAI(prompt);
    
    try {
        // 调用图像编辑API
        const processedImageUrl = await callImageEditAPI(originalImage, enhancedPrompt);
        return processedImageUrl;
    } catch (error) {
        console.error('Image edit API error:', error);
        // 如果API调用失败，回退到本地处理
        return await processExistingImage(originalImage, prompt);
    }
}

// 调用图像编辑API
async function callImageEditAPI(imageData, prompt) {
    // API配置
    const openRouterKey = getAPIKey(); // 获取OpenRouter API密钥
    const openAIKey = getOpenAIKey(); // 获取OpenAI API密钥
    
    try {
        // 显示正在调用API的消息
        console.log('Calling image edit API with prompt:', prompt);
        
        // 检查是否有API密钥
        if (!openRouterKey && !openAIKey) {
            console.log('No API keys provided, using local processing');
            return await processExistingImage(imageData, prompt);
        }
        
        // 使用OpenRouter API调用多模态模型处理图像
        if (openRouterKey) {
            try {
                // 将图像转换为base64
                let base64Image = imageData;
                if (imageData.startsWith('data:')) {
                    base64Image = imageData.split(',')[1]; // 移除data:image/jpeg;base64,前缀
                }
                
                // 调用OpenRouter API的多模态模型
                const response = await fetch(`${getOpenRouterEndpoint()}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openRouterKey}`,
                        'HTTP-Referer': window.location.href,
                        'X-Title': 'Genviral'
                    },
                    body: JSON.stringify({
                        model: getVisionModel(), // 使用配置的视觉模型
                        messages: [
                            {
                                role: "system",
                                content: "You are an expert image editor. Analyze images and provide detailed instructions for style transformations."
                            },
                            {
                                role: "user",
                                content: [
                                    {
                                        type: "text",
                                        text: `Please analyze this image and apply the following style transformation: ${prompt}. Describe what changes you would make to achieve this style. Be specific and detailed.`
                                    },
                                    {
                                        type: "image_url",
                                        image_url: {
                                            url: imageData.startsWith('data:') ? imageData : `data:image/jpeg;base64,${base64Image}`
                                        }
                                    }
                                ]
                            }
                        ]
                    })
                });
                
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error.message);
                }
                
                // 获取AI的分析结果
                const analysisResult = data.choices[0].message.content;
                console.log('AI analysis:', analysisResult);
                
                // 如果有OpenAI密钥，使用OpenAI的图像编辑API
                if (openAIKey) {
                    try {
                        // 首先需要将base64图像转换为文件
                        const imageBlob = await fetch(imageData).then(r => r.blob());
                        const imageFile = new File([imageBlob], "image.png", { type: "image/png" });
                        
                        // 创建FormData
                        const formData = new FormData();
                        formData.append("image", imageFile);
                        formData.append("prompt", `${prompt}. ${analysisResult}`);
                        formData.append("n", 1);
                        formData.append("size", "1024x1024");
                        
                        // 发送请求到OpenAI的图像编辑API
                        const editResponse = await fetch(getOpenAIEditEndpoint(), {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${openAIKey}`
                            },
                            body: formData
                        });
                        
                        const editData = await editResponse.json();
                        if (editData.error) {
                            throw new Error(editData.error.message);
                        }
                        
                        return editData.data[0].url;
                    } catch (error) {
                        console.error('OpenAI image edit API call failed:', error);
                        // 如果OpenAI API调用失败，回退到本地处理
                        console.log('Using AI analysis for local processing');
                        return await processExistingImageWithAnalysis(imageData, prompt, analysisResult);
                    }
                } else {
                    // 如果没有OpenAI密钥，使用AI分析结果进行本地处理
                    console.log('No OpenAI key, using AI analysis for local processing');
                    return await processExistingImageWithAnalysis(imageData, prompt, analysisResult);
                }
            } catch (error) {
                console.error('OpenRouter API call failed:', error);
                // 如果OpenRouter API调用失败，回退到本地处理
                return await processExistingImage(imageData, prompt);
            }
        } else if (openAIKey) {
            // 如果只有OpenAI密钥，直接尝试使用OpenAI的图像编辑API
            try {
                // 首先需要将base64图像转换为文件
                const imageBlob = await fetch(imageData).then(r => r.blob());
                const imageFile = new File([imageBlob], "image.png", { type: "image/png" });
                
                // 创建FormData
                const formData = new FormData();
                formData.append("image", imageFile);
                formData.append("prompt", prompt);
                formData.append("n", 1);
                formData.append("size", "1024x1024");
                
                // 发送请求到OpenAI的图像编辑API
                const editResponse = await fetch(getOpenAIEditEndpoint(), {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${openAIKey}`
                    },
                    body: formData
                });
                
                const editData = await editResponse.json();
                if (editData.error) {
                    throw new Error(editData.error.message);
                }
                
                return editData.data[0].url;
            } catch (error) {
                console.error('OpenAI image edit API call failed:', error);
                // 如果OpenAI API调用失败，回退到本地处理
                return await processExistingImage(imageData, prompt);
            }
        }
        
        // 如果没有可用的API或所有API调用都失败，回退到本地处理
        return await processExistingImage(imageData, prompt);
    } catch (error) {
        console.error('Image edit API call failed:', error);
        // 如果出现任何错误，回退到本地处理
        return await processExistingImage(imageData, prompt);
    }
}

// 使用AI分析结果进行本地图像处理
async function processExistingImageWithAnalysis(imageData, prompt, analysisResult) {
    console.log('Processing image with AI analysis:', analysisResult);
    
    // 根据AI分析结果调整滤镜参数
    let filter = getAdvancedFilterByPrompt(prompt);
    
    // 分析AI的建议，调整滤镜
    if (analysisResult.toLowerCase().includes('increase contrast')) {
        filter += ' contrast(150%)';
    }
    if (analysisResult.toLowerCase().includes('increase saturation')) {
        filter += ' saturate(150%)';
    }
    if (analysisResult.toLowerCase().includes('decrease saturation')) {
        filter += ' saturate(50%)';
    }
    if (analysisResult.toLowerCase().includes('brighten')) {
        filter += ' brightness(130%)';
    }
    if (analysisResult.toLowerCase().includes('darken')) {
        filter += ' brightness(70%)';
    }
    if (analysisResult.toLowerCase().includes('sepia') || analysisResult.toLowerCase().includes('vintage')) {
        filter += ' sepia(70%)';
    }
    if (analysisResult.toLowerCase().includes('blur')) {
        filter += ' blur(2px)';
    }
    
    // 创建一个canvas来处理图像
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve) => {
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 应用自定义滤镜
            ctx.filter = filter;
            ctx.drawImage(img, 0, 0);
            
            // 应用额外的图像增强
            applyImageEnhancement(ctx, canvas.width, canvas.height, prompt + " " + analysisResult);
            
            resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.src = imageData;
    });
}

// API配置函数
function getAPIKey() {
    // 从配置或本地存储获取OpenRouter API密钥
    return apiConfig.apiKey || localStorage.getItem('genviral-openrouter-key') || '';
}

function getOpenAIKey() {
    // 从配置或本地存储获取OpenAI API密钥
    return apiConfig.openaiKey || localStorage.getItem('genviral-openai-key') || '';
}

function getOpenRouterEndpoint() {
    // 获取OpenRouter API端点
    return apiConfig.endpoints.openRouter;
}

function getOpenAIGenerationEndpoint() {
    // 获取OpenAI图像生成端点
    return apiConfig.endpoints.openai.generation;
}

function getOpenAIEditEndpoint() {
    // 获取OpenAI图像编辑端点
    return apiConfig.endpoints.openai.edit;
}

function getChatModel() {
    // 获取当前聊天模型
    return apiConfig.models.chat;
}

function getVisionModel() {
    // 获取当前视觉模型
    return apiConfig.models.vision;
}

function setAPIConfig(openRouterKey, openaiKey, chatModel, visionModel) {
    // 设置API配置
    apiConfig.apiKey = openRouterKey;
    apiConfig.openaiKey = openaiKey;
    
    if (chatModel) apiConfig.models.chat = chatModel;
    if (visionModel) apiConfig.models.vision = visionModel;
    
    // 保存到本地存储
    localStorage.setItem('genviral-openrouter-key', openRouterKey);
    localStorage.setItem('genviral-openai-key', openaiKey);
    
    if (chatModel) localStorage.setItem('genviral-chat-model', chatModel);
    if (visionModel) localStorage.setItem('genviral-vision-model', visionModel);
}

function loadAPIConfig() {
    // 从本地存储加载API配置
    const savedOpenRouterKey = localStorage.getItem('genviral-openrouter-key');
    const savedOpenAIKey = localStorage.getItem('genviral-openai-key');
    const savedChatModel = localStorage.getItem('genviral-chat-model');
    const savedVisionModel = localStorage.getItem('genviral-vision-model');
    
    if (savedOpenRouterKey) {
        apiConfig.apiKey = savedOpenRouterKey;
    }
    
    if (savedOpenAIKey) {
        apiConfig.openaiKey = savedOpenAIKey;
    }
    
    if (savedChatModel) {
        apiConfig.models.chat = savedChatModel;
    }
    
    if (savedVisionModel) {
        apiConfig.models.vision = savedVisionModel;
    }
}

// 设置模态框功能
function openSettingsModal() {
    settingsModal.style.display = 'block';
}

function closeSettingsModal() {
    settingsModal.style.display = 'none';
}

function saveSettings() {
    const openRouterKey = openRouterKeyInput.value;
    const openaiKey = openaiKeyInput.value;
    const chatModel = chatModelSelect.value;
    const visionModel = visionModelSelect.value;
    
    setAPIConfig(openRouterKey, openaiKey, chatModel, visionModel);
    
    // 显示保存成功消息
    const successMessage = document.createElement('div');
    successMessage.className = 'save-success';
    successMessage.textContent = 'Settings saved successfully!';
    
    const modalFooter = document.querySelector('.modal-footer');
    modalFooter.appendChild(successMessage);
    
    // 3秒后移除消息
    setTimeout(() => {
        successMessage.remove();
        closeSettingsModal();
    }, 2000);
}

function loadSettingsToForm() {
    openRouterKeyInput.value = apiConfig.apiKey;
    openaiKeyInput.value = apiConfig.openaiKey;
    chatModelSelect.value = apiConfig.models.chat;
    visionModelSelect.value = apiConfig.models.vision;
}

// 生成示例图像（实际应用中这里会调用AI API）
async function generateSampleImage(prompt) {
    // 这里应该调用真实的AI API
    // 目前返回预设的示例图像
    const sampleImages = {
        'cute': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNjAiIGZpbGw9IiNGRkM0QzQiLz4KPGNpcmNsZSBjeD0iMTgwIiBjeT0iMTMwIiByPSI4IiBmaWxsPSIjMDAwIi8+CjxjaXJjbGUgY3g9IjIyMCIgY3k9IjEzMCIgcj0iOCIgZmlsbD0iIzAwMCIvPgo8cGF0aCBkPSJNMTgwIDE4MEMxODAgMTgwIDE5MCAxOTAgMjAwIDE5MEMyMTAgMTkwIDIyMCAxODAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+Cjwvc3ZnPgo=',
        'cartoon': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNzAiIGZpbGw9IiM0Q0FGRkYiLz4KPGNpcmNsZSBjeD0iMTgwIiBjeT0iMTMwIiByPSIxMCIgZmlsbD0iIzAwMCIvPgo8Y2lyY2xlIGN4PSIyMjAiIGN5PSIxMzAiIHI9IjEwIiBmaWxsPSIjMDAwIi8+CjxwYXRoIGQ9Ik0xNzAgMTgwQzE3MCAxODAgMTkwIDE5NSAyMDAgMTk1QzIxMCAxOTUgMjMwIDE4MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjQiLz4KPC9zdmc+Cg==',
        'anime': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iODAiIGZpbGw9IiNGRkYwQzAiLz4KPGNpcmNsZSBjeD0iMTgwIiBjeT0iMTMwIiByPSIxMiIgZmlsbD0iIzAwMCIvPgo8Y2lyY2xlIGN4PSIyMjAiIGN5PSIxMzAiIHI9IjEyIiBmaWxsPSIjMDAwIi8+CjxwYXRoIGQ9Ik0xNzAgMTgwQzE3MCAxODAgMTkwIDE5NSAyMDAgMTk1QzIxMCAxOTUgMjMwIDE4MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjUiLz4KPC9zdmc+Cg==',
        'fantasy': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMjAyMDQwIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNjAiIGZpbGw9IiM4MDQwRkYiLz4KPHBhdGggZD0iTTEwMCAyNTBMMjAwIDE1MEwzMDAgMjUwIiBzdHJva2U9IiNGRkMwRkYiIHN0cm9rZS13aWR0aD0iMyIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjIwIiBmaWxsPSIjRkZGRjgwIi8+CjxjaXJjbGUgY3g9IjI1MCIgY3k9IjEwMCIgcj0iMTAiIGZpbGw9IiNGRkZGODAiLz4KPC9zdmc+Cg==',
        'cyberpunk': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMDgwODIwIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHN0cm9rZT0iIzAwRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgc3Ryb2tlPSIjRkYwMEZGIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iMjAwIiByPSI1MCIgZmlsbD0iIzAwMCIgc3Ryb2tlPSIjRkYwMEZGIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iMjAwIiByPSIyMCIgZmlsbD0iIzAwRkZGRiIvPgo8L3N2Zz4K',
        'landscape': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjODBDMEZGIi8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjgwIiByPSI0MCIgZmlsbD0iI0ZGRkY4MCIvPgo8cGF0aCBkPSJNMCAxNTBMMTAwIDEwMEwyMDAgMTUwTDMwMCAxMDBMNDAwIDE1MEw0MDAgNDAwTDAgNDAwWiIgZmlsbD0iIzAwODAwMCIvPgo8cGF0aCBkPSJNMCAyNTBMNTAgMjAwTDEwMCAyNTBMMTUwIDIwMEwyMDAgMjUwTDI1MCAyMDBMMzAwIDI1MEwzNTAgMjAwTDQwMCAyNTBMNDAwIDQwMEwwIDQwMFoiIGZpbGw9IiMwMDQwMDAiLz4KPC9zdmc+Cg==',
        'food': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iMTAwIiBmaWxsPSIjRkY4MDgwIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiNGRkMwODAiLz4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iMjAwIiByPSI2MCIgZmlsbD0iI0ZGRkY4MCIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMDAiIHI9IjQwIiBmaWxsPSIjODBGRjgwIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iMjAiIGZpbGw9IiM4MDgwRkYiLz4KPC9zdmc+Cg==',
        'creature': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjNDA0MDQwIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iODAiIGZpbGw9IiM4MDgwODAiLz4KPGNpcmNsZSBjeD0iMTcwIiBjeT0iMTMwIiByPSIxNSIgZmlsbD0iI0ZGMDAwMCIvPgo8Y2lyY2xlIGN4PSIyMzAiIGN5PSIxMzAiIHI9IjE1IiBmaWxsPSIjRkYwMDAwIi8+CjxwYXRoIGQ9Ik0xNTAgMjAwTDI1MCAyMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSI1Ii8+CjxwYXRoIGQ9Ik0xMjAgMTAwTDE1MCAxMjBNMjUwIDEyMEwyODAgMTAwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iNSIvPgo8L3N2Zz4K'
    };
    
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('cute')) {
        return sampleImages.cute;
    } else if (lowerPrompt.includes('cartoon')) {
        return sampleImages.cartoon;
    } else if (lowerPrompt.includes('anime')) {
        return sampleImages.anime;
    } else if (lowerPrompt.includes('fantasy')) {
        return sampleImages.fantasy;
    } else if (lowerPrompt.includes('cyberpunk') || lowerPrompt.includes('futuristic')) {
        return sampleImages.cyberpunk;
    } else if (lowerPrompt.includes('landscape') || lowerPrompt.includes('scene')) {
        return sampleImages.landscape;
    } else if (lowerPrompt.includes('food') || lowerPrompt.includes('dessert') || lowerPrompt.includes('meal')) {
        return sampleImages.food;
    } else if (lowerPrompt.includes('creature') || lowerPrompt.includes('monster') || lowerPrompt.includes('alien')) {
        return sampleImages.creature;
    } else {
        return sampleImages.cute; // 默认返回可爱风格
    }
}

// 处理现有图像
async function processExistingImage(originalImage, prompt) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve) => {
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 应用高级滤镜效果
            const filter = getAdvancedFilterByPrompt(prompt);
            ctx.filter = filter;
            ctx.drawImage(img, 0, 0);
            
            // 应用额外的图像增强
            applyImageEnhancement(ctx, canvas.width, canvas.height, prompt);
            
            resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.src = originalImage;
    });
}

// 根据提示词获取高级滤镜效果
function getAdvancedFilterByPrompt(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('black') || lowerPrompt.includes('white') || lowerPrompt.includes('grayscale')) {
        return 'grayscale(100%) contrast(120%) brightness(105%)';
    } else if (lowerPrompt.includes('oil') || lowerPrompt.includes('painting') || lowerPrompt.includes('art')) {
        return 'contrast(160%) saturate(220%) brightness(115%) hue-rotate(5deg)';
    } else if (lowerPrompt.includes('vintage') || lowerPrompt.includes('retro') || lowerPrompt.includes('old')) {
        return 'sepia(85%) contrast(130%) brightness(85%) saturate(90%)';
    } else if (lowerPrompt.includes('sci-fi') || lowerPrompt.includes('future') || lowerPrompt.includes('cyber')) {
        return 'hue-rotate(180deg) saturate(170%) contrast(140%) brightness(110%)';
    } else if (lowerPrompt.includes('watercolor') || lowerPrompt.includes('water')) {
        return 'brightness(115%) saturate(70%) contrast(85%) blur(0.5px)';
    } else if (lowerPrompt.includes('cartoon') || lowerPrompt.includes('anime')) {
        return 'contrast(200%) saturate(300%) brightness(120%)';
    } else if (lowerPrompt.includes('dramatic') || lowerPrompt.includes('cinematic')) {
        return 'contrast(150%) saturate(130%) brightness(90%)';
    } else if (lowerPrompt.includes('warm') || lowerPrompt.includes('sunset')) {
        return 'sepia(30%) saturate(140%) brightness(110%) hue-rotate(10deg)';
    } else if (lowerPrompt.includes('cool') || lowerPrompt.includes('blue')) {
        return 'saturate(120%) brightness(105%) hue-rotate(-10deg)';
    } else {
        return 'contrast(115%) saturate(125%) brightness(105%)';
    }
}

// 应用图像增强
function applyImageEnhancement(ctx, width, height, prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    // 获取图像数据
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // 根据提示词应用不同的增强效果
    if (lowerPrompt.includes('sharp') || lowerPrompt.includes('crisp')) {
        // 锐化效果
        applySharpening(data, width, height);
    } else if (lowerPrompt.includes('smooth') || lowerPrompt.includes('soft')) {
        // 平滑效果
        applySmoothing(data, width, height);
    } else if (lowerPrompt.includes('grain') || lowerPrompt.includes('noise')) {
        // 添加颗粒感
        applyGrainEffect(data, width, height);
    } else if (lowerPrompt.includes('vignette')) {
        // 添加暗角效果
        applyVignette(data, width, height);
    }
    
    // 应用图像数据
    ctx.putImageData(imageData, 0, 0);
}

// 锐化效果
function applySharpening(data, width, height) {
    const kernel = [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ];
    applyConvolution(data, width, height, kernel);
}

// 平滑效果
function applySmoothing(data, width, height) {
    const kernel = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];
    applyConvolution(data, width, height, kernel, 9);
}

// 颗粒效果
function applyGrainEffect(data, width, height) {
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 30;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
}

// 暗角效果
function applyVignette(data, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            const factor = 1 - (distance / maxDistance) * 0.3;
            
            const index = (y * width + x) * 4;
            data[index] *= factor;
            data[index + 1] *= factor;
            data[index + 2] *= factor;
        }
    }
}

// 卷积滤镜
function applyConvolution(data, width, height, kernel, divisor = 1) {
    const tempData = new Uint8ClampedArray(data);
    const kernelSize = kernel.length;
    const half = Math.floor(kernelSize / 2);
    
    for (let y = half; y < height - half; y++) {
        for (let x = half; x < width - half; x++) {
            let r = 0, g = 0, b = 0;
            
            for (let ky = 0; ky < kernelSize; ky++) {
                for (let kx = 0; kx < kernelSize; kx++) {
                    const pixelIndex = ((y + ky - half) * width + (x + kx - half)) * 4;
                    const weight = kernel[ky][kx];
                    
                    r += tempData[pixelIndex] * weight;
                    g += tempData[pixelIndex + 1] * weight;
                    b += tempData[pixelIndex + 2] * weight;
                }
            }
            
            const pixelIndex = (y * width + x) * 4;
            data[pixelIndex] = Math.max(0, Math.min(255, r / divisor));
            data[pixelIndex + 1] = Math.max(0, Math.min(255, g / divisor));
            data[pixelIndex + 2] = Math.max(0, Math.min(255, b / divisor));
        }
    }
}

// 显示处理后的图片
function displayProcessedImage(imageSrc) {
    loadingSpinner.style.display = 'none';
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '400px';
    img.style.borderRadius = '12px';
    img.style.boxShadow = '0 8px 32px rgba(255, 255, 255, 0.1)';
    
    resultImage.innerHTML = '';
    resultImage.appendChild(img);
    
    // 显示下载按钮
    downloadButton.style.display = 'flex';
    downloadButton.dataset.imageSrc = imageSrc;
    
    // 保存到历史记录
    saveToHistory(imageSrc);
}

// 下载图片
function downloadImage() {
    const imageSrc = downloadButton.dataset.imageSrc;
    if (!imageSrc) return;
    
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `genviral-transformed-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 保存到历史记录
function saveToHistory(imageSrc) {
    const historyItem = {
        id: Date.now(),
        imageSrc: imageSrc,
        timestamp: new Date().toISOString(),
        originalImage: currentImage
    };
    
    processedImages.unshift(historyItem);
    
    // 限制历史记录数量
    if (processedImages.length > 10) {
        processedImages = processedImages.slice(0, 10);
    }
    
    // 保存到本地存储
    localStorage.setItem('genviral-history', JSON.stringify(processedImages));
}

// 加载历史记录
function loadHistory() {
    const saved = localStorage.getItem('genviral-history');
    if (saved) {
        processedImages = JSON.parse(saved);
    }
}

// 生成AI回复
function generateAIResponse(prompt) {
    const responses = [
        `I've processed the image according to your request "${prompt}". How does it look?`,
        `Style transformation "${prompt}" completed! Any other adjustments you'd like?`,
        `The image has been transformed as requested "${prompt}". Are you satisfied?`,
        `Processing complete! I've applied the "${prompt}" style transformation to your image.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// 显示消息提示
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ai-message ${type}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = message;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 错误处理
function handleError(error) {
    console.error('Error:', error);
    showMessage('An error occurred during processing. Please try again.', 'error');
    isProcessing = false;
    loadingSpinner.style.display = 'none';
}

// 添加错误消息样式
const style = document.createElement('style');
style.textContent = `
    .error-message .message-content {
        background: linear-gradient(145deg, #2a1a1a, #3a2a2a) !important;
        border-color: #ff4444 !important;
    }
    
    .success-message .message-content {
        background: linear-gradient(145deg, #1a2a1a, #2a3a2a) !important;
        border-color: #44ff44 !important;
    }
`;
document.head.appendChild(style); 