// Referenced from javascript_gemini blueprint
import { GoogleGenAI } from "@google/genai";

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateSocialMediaContent(
  topic: string,
  tone: string,
  platforms: string[]
): Promise<Record<string, string>> {
  const platformPrompts: Record<string, string> = {
    instagram: "Create an engaging Instagram post with emojis, relevant hashtags (5-10), and a call-to-action. Keep it under 2200 characters.",
    facebook: "Create a Facebook post that encourages engagement through questions or calls-to-action. Include relevant hashtags (3-5). Keep it under 5000 characters.",
    twitter: "Create a concise, impactful tweet with 1-2 relevant hashtags. Keep it under 280 characters.",
    pinterest: "Create a Pinterest pin description that's keyword-rich and includes a call-to-action. Include relevant hashtags (3-5). Keep it under 500 characters.",
    linkedin: "Create a professional LinkedIn post that provides value to your network. Use a professional tone and include 3-5 relevant hashtags. Keep it under 3000 characters.",
    youtube: "Create a YouTube video description with timestamps, relevant keywords, and a call-to-action. Include hashtags (3-5). Keep it under 5000 characters.",
    tiktok: "Create a short, catchy TikTok caption with trending hashtags (5-10) and emojis. Keep it under 2200 characters.",
    etsy: "Create an Etsy product description that's SEO-optimized with keywords, features, benefits, and uses. Keep it under 1000 characters."
  };

  const toneDescriptions: Record<string, string> = {
    professional: "professional and authoritative",
    casual: "casual, friendly, and conversational",
    enthusiastic: "enthusiastic and energetic",
    educational: "educational and informative",
    promotional: "promotional with a strong sales angle",
    inspirational: "inspirational and motivating"
  };

  const content: Record<string, string> = {};

  for (const platform of platforms) {
    const platformGuidelines = platformPrompts[platform] || platformPrompts.facebook;
    const toneDescription = toneDescriptions[tone] || "professional";

    const prompt = `You are a social media content expert. Create a ${toneDescription} post about: "${topic}"

${platformGuidelines}

Important:
- Write specifically for ${platform.charAt(0).toUpperCase() + platform.slice(1)}
- Use the ${tone} tone throughout
- Include platform-appropriate hashtags
- Add a clear call-to-action
- Make it engaging and shareable

Write only the post content, no explanations or meta-commentary.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt,
      });

      content[platform] = response.text || `Content for ${platform}:\n\n${topic}\n\n#${platform} #socialmedia`;
    } catch (error) {
      console.error(`Error generating content for ${platform}:`, error);
      content[platform] = `Content for ${platform}:\n\n${topic}\n\n#${platform} #socialmedia`;
    }
  }

  return content;
}
