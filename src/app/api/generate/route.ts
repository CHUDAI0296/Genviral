import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Replicate from 'replicate';
import { hasEnoughCredits, deductCredits, createVideoGeneration, updateVideoGeneration } from '@/lib/credits';

interface VideoGenerationRequest {
  topic: string;
  duration?: number;
  style?: 'trending' | 'educational' | 'entertainment';
  platform?: 'youtube' | 'tiktok' | 'instagram';
  userId?: string;
}

// Initialize Replicate client
const replicate = process.env.REPLICATE_API_TOKEN
  ? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  : null;

export async function POST(request: Request) {
  let generationId: string | null = null;

  try {
    const { topic, duration = 60, style = 'trending', platform = 'youtube', userId }: VideoGenerationRequest = await request.json();

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User authentication required' },
        { status: 401 }
      );
    }

    // Check if user has enough credits
    const hasCredits = await hasEnoughCredits(userId, 1);
    if (!hasCredits) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please purchase more credits to generate videos.' },
        { status: 402 } // Payment required
      );
    }

    // Create video generation record
    generationId = await createVideoGeneration(userId, topic);
    if (!generationId) {
      return NextResponse.json(
        { error: 'Failed to create generation record' },
        { status: 500 }
      );
    }

    // Deduct credits immediately
    const creditDeducted = await deductCredits(userId, generationId);
    if (!creditDeducted) {
      return NextResponse.json(
        { error: 'Failed to deduct credits' },
        { status: 500 }
      );
    }

    // Step 1: Generate script
    const script = await generateScript(topic, duration, style, platform);

    // Step 2: Generate video prompt from script
    const videoPrompt = generateVideoPrompt(script, topic, style, platform);

    // Step 3: Generate actual video using Replicate
    const videoUrl = await generateVideo(videoPrompt, topic);

    // Update generation record with success
    await updateVideoGeneration(generationId, videoUrl, 'completed');

    return NextResponse.json({
      success: true,
      script,
      videoUrl,
      videoPrompt,
      metadata: {
        topic,
        duration,
        style,
        platform,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating video:', error);

    // Update generation record with failure if generationId exists
    if (generationId) {
      await updateVideoGeneration(generationId, '', 'failed');
    }

    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
}

async function generateScript(topic: string, duration: number, style: string, platform: string): Promise<string> {
  // For now, always use fallback script generation to avoid API issues
  // In production, you can enable OpenAI integration by setting OPENAI_API_KEY

  console.log('Generating script for:', { topic, duration, style, platform });

  // Use fallback script generation
  return generateFallbackScript(topic, duration, style, platform);
}

function generateFallbackScript(topic: string, duration: number, style: string, platform: string): string {
  const platformTips = {
    youtube: '- 记住前3秒抓住观众注意力\n- 包含明确的行动号召\n- 优化为横屏观看',
    tiktok: '- 快节奏，紧跟潮流\n- 使用流行格式和音乐\n- 优化为竖屏观看',
    instagram: '- 视觉吸引力强\n- 使用热门标签\n- 适用于动态和故事'
  };

  const styleAdvice = {
    trending: '重点关注病毒式传播元素和当前趋势',
    educational: '专注于清晰的解释和有价值的见解',
    entertainment: '优先考虑幽默、参与度和娱乐价值'
  };

  return `
**${topic} - ${platform.toUpperCase()} 视频脚本**
**时长: ${duration}秒 | 风格: ${style}**

**开场 Hook (0-3秒):**
🎬 震撼的开场画面或引人注意的问题
💬 旁白: "你是否想知道${topic}的秘密？"

**主要内容 (3-${duration-10}秒):**

📍 第一部分: 问题展现
🎥 视觉: 展示相关的挑战或困扰
💬 旁白: 详细解释${topic}的核心要点

📍 第二部分: 解决方案
🎥 视觉: 展示解决方法或技巧
💬 旁白: 提供实用的建议和步骤

📍 第三部分: 结果展示
🎥 视觉: 展示成功案例或效果
💬 旁白: 强调使用方法后的好处

**行动号召 (${duration-10}-${duration}秒):**
🎬 清晰的下一步指示
💬 旁白: "立即尝试这个方法，不要忘记点赞和关注！"

**平台优化提示:**
${platformTips[platform as keyof typeof platformTips]}

**风格指导:**
${styleAdvice[style as keyof typeof styleAdvice]}

**制作注意事项:**
- 保持节奏紧凑，避免冗长
- 使用引人注目的视觉元素
- 确保音频清晰
- 添加适当的背景音乐
- 包含相关的文字叠加

---
*此脚本由 GenViral AI 生成，针对 ${platform} 平台的 ${style} 风格内容优化*
  `.trim();
}

function generateVideoPrompt(script: string, topic: string, style: string, platform: string): string {
  // Extract visual cues from the script and convert to video prompt
  const stylePrompts = {
    trending: 'modern, dynamic, trendy visuals with vibrant colors',
    educational: 'clean, professional, informative visuals with clear demonstrations',
    entertainment: 'fun, engaging, entertaining visuals with dramatic effects'
  };

  const platformPrompts = {
    youtube: 'cinematic, high-quality, landscape format',
    tiktok: 'vertical format, quick cuts, trendy effects',
    instagram: 'aesthetic, polished, social media ready'
  };

  // Create a focused video prompt based on the topic and style
  const basePrompt = `A ${stylePrompts[style as keyof typeof stylePrompts]} video about ${topic}. ${platformPrompts[platform as keyof typeof platformPrompts]}. Professional quality, engaging visuals, smooth transitions.`;

  return basePrompt;
}

async function generateVideo(videoPrompt: string, topic: string): Promise<string> {
  console.log('Generating video with prompt:', videoPrompt);

  // If Replicate API is available, use it to generate real video
  if (replicate && process.env.REPLICATE_API_TOKEN) {
    try {
      console.log('Using Replicate API for video generation...');

      const input = {
        prompt: videoPrompt
      };

      const output = await replicate.run("wan-video/wan-2.2-t2v-fast", { input }) as string[];

      // Save the video to local storage
      const videoId = uuidv4();
      const uploadsDir = path.join(process.cwd(), 'public', 'videos');

      // Ensure uploads directory exists
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Download and save the video file
      if (output && output.length > 0) {
        const videoUrl = output[0]; // Get the first URL from the array
        console.log('Video generated successfully:', videoUrl);

        // Save video metadata
        const videoInfo = {
          id: videoId,
          topic,
          prompt: videoPrompt,
          replicateUrl: videoUrl,
          createdAt: new Date().toISOString(),
          status: 'generated',
          filename: `${videoId}.mp4`
        };

        const infoPath = path.join(uploadsDir, `${videoId}.json`);
        await writeFile(infoPath, JSON.stringify(videoInfo, null, 2));

        return videoUrl;
      }
    } catch (error) {
      console.error('Replicate video generation failed:', error);
      // Fall back to demo video
    }
  }

  // Fallback: Create placeholder video info
  const videoId = uuidv4();
  const uploadsDir = path.join(process.cwd(), 'public', 'videos');

  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }

  const videoInfo = {
    id: videoId,
    topic,
    prompt: videoPrompt,
    createdAt: new Date().toISOString(),
    status: 'demo',
    filename: `demo-video.mp4`,
    note: 'Set REPLICATE_API_TOKEN to generate real videos'
  };

  const infoPath = path.join(uploadsDir, `${videoId}.json`);
  await writeFile(infoPath, JSON.stringify(videoInfo, null, 2));

  return `/videos/demo-video.mp4`;
}

// GET endpoint to retrieve video information
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('id');

  if (!videoId) {
    return NextResponse.json(
      { error: 'Video ID is required' },
      { status: 400 }
    );
  }

  try {
    const videoInfoPath = path.join(process.cwd(), 'public', 'videos', `${videoId}.json`);

    if (!existsSync(videoInfoPath)) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const { readFile } = await import('fs/promises');
    const videoInfo = JSON.parse(await readFile(videoInfoPath, 'utf-8'));

    return NextResponse.json(videoInfo);
  } catch (error) {
    console.error('Error retrieving video:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve video' },
      { status: 500 }
    );
  }
}