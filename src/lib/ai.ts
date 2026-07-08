/**
 * Server-only AI service module for IdeaForge.
 * Uses Google Gemini to generate structured business content.
 * Never import this in client code.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface BusinessOutput {
  business_plan: {
    executive_summary: string;
    market_analysis: string;
    operations: string;
  };
  brand_identity: {
    name_suggestions: string[];
    tagline: string;
    color_palette: string[];
    brand_voice: string;
  };
  marketing_strategy: {
    channels: string[];
    content_plan: string;
    launch_tactics: string[];
  };
  financial_overview: {
    revenue_model: string;
    cost_estimates: string;
    break_even: string;
  };
  website_copy: {
    headline: string;
    subheadline: string;
    about_text: string;
  };
  competitive_analysis: {
    swot: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    differentiation: string;
  };
}

const SYSTEM_PROMPT = `You are an expert business consultant and strategist. Your task is to transform a user's business idea into a comprehensive, structured business output.

Given a business idea description and an optional focus area (tech, food, service, creative, etc.), generate a detailed JSON object with the following structure. Be specific, actionable, and realistic — avoid generic advice.

Return ONLY valid JSON with this exact structure:
{
  "business_plan": {
    "executive_summary": "2-3 sentence summary of the business concept and value proposition",
    "market_analysis": "Brief market analysis including target audience size and trends",
    "operations": "Key operational requirements and logistics"
  },
  "brand_identity": {
    "name_suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
    "tagline": "A compelling tagline",
    "color_palette": ["#HEX1", "#HEX2", "#HEX3"],
    "brand_voice": "Description of brand tone and voice"
  },
  "marketing_strategy": {
    "channels": ["channel 1", "channel 2", "channel 3"],
    "content_plan": "Brief content marketing approach",
    "launch_tactics": ["tactic 1", "tactic 2"]
  },
  "financial_overview": {
    "revenue_model": "How the business will make money",
    "cost_estimates": "Major cost categories and rough estimates",
    "break_even": "Estimated time to break even"
  },
  "website_copy": {
    "headline": "Hero headline for landing page",
    "subheadline": "Supporting subheadline",
    "about_text": "2-3 sentence about section"
  },
  "competitive_analysis": {
    "swot": {
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"],
      "opportunities": ["opportunity 1", "opportunity 2"],
      "threats": ["threat 1", "threat 2"]
    },
    "differentiation": "How this business stands out from competitors"
  }
}`;

/** Generate a complete business output from a user's idea description */
export async function generateBusiness(
  idea: string,
  focusArea?: string,
): Promise<BusinessOutput> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GOOGLE_API_KEY is not set — the AI business generator cannot run without it.",
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  });

  const userPrompt = focusArea
    ? `Business idea: "${idea}"\nFocus area: ${focusArea}\n\nGenerate a comprehensive business output for this idea.`
    : `Business idea: "${idea}"\n\nGenerate a comprehensive business output for this idea.`;

  const result = await model.generateContent([
    { text: SYSTEM_PROMPT },
    { text: userPrompt },
  ]);

  const response = result.response;
  const text = response.text();

  // Parse the JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response as JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]) as BusinessOutput;

  // Validate the structure
  if (!parsed.business_plan || !parsed.brand_identity || !parsed.marketing_strategy) {
    throw new Error("AI response missing required sections");
  }

  return parsed;
}

/** Save a generated business to the database (gracefully handles missing DB) */
export async function saveBusiness(
  userId: string,
  title: string,
  description: string,
  generatedData: BusinessOutput,
) {
  const { sql } = await import("~/db");
  try {
    const db = sql();
    const result = await db`
      INSERT INTO businesses (user_id, title, description, status, generated_data)
      VALUES (${userId}, ${title}, ${description}, 'complete', ${JSON.stringify(generatedData)})
      RETURNING id, created_at
    `;
    return { success: true, id: result[0].id, created_at: String(result[0].created_at) };
  } catch (err: any) {
    // Database might not be available
    return { success: false, error: err.message || "Database unavailable" };
  }
}

/** Get businesses for a user (gracefully handles missing DB) */
export async function getUserBusinesses(userId: string) {
  const { sql } = await import("~/db");
  try {
    const db = sql();
    const rows = await db`
      SELECT id, title, description, status, created_at
      FROM businesses
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    return rows.map((r: any) => ({
      ...r,
      created_at: String(r.created_at),
    }));
  } catch {
    return [];
  }
}