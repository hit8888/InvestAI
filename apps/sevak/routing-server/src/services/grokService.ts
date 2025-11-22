import axios from "axios";
import https from "https";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROK_API_KEY || process.env.GROQ_API_KEY;

// Read the routing prompt file
function getRoutingPrompt(): string {
  try {
    const promptPath = join(__dirname, "../../ROUTING_AGENT_PROMPT.txt");
    return readFileSync(promptPath, "utf-8");
  } catch (error) {
    console.error("Error reading routing prompt file:", error);
    return "";
  }
}

// Read the knowledge base file
function getKnowledgeBase(): string {
  try {
    const kbPath = join(__dirname, "../../DASHBOARD_KNOWLEDGE_BASE.md");
    return readFileSync(kbPath, "utf-8");
  } catch (error) {
    console.error("Error reading knowledge base file:", error);
    return "";
  }
}

// Read the feature mapping file
function getFeatureMapping(): string {
  try {
    const fmPath = join(__dirname, "../../FEATURE_MAPPING.md");
    return readFileSync(fmPath, "utf-8");
  } catch (error) {
    console.error("Error reading feature mapping file:", error);
    return "";
  }
}

interface GrokResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface GrokAction {
  type: "click" | "text_change";
  target?: string;
  description: string;
  cssSelector?: string;
  waitFor?: string;
  value?: string;
}

interface GrokRouteStep {
  url?: string;
  actions?: GrokAction[];
  description?: string;
  ctaText?: string;
}

interface GrokNavigationPathItem {
  label: string;
  type: "page" | "action";
}

interface GrokConversationResponse {
  textResponse: string;
  navigationPath?: GrokNavigationPathItem[]; // Array of navigation steps with type indicators
  route?: string;
  routes?: Array<string | GrokRouteStep>;
  ctaText?: string;
}

/**
 * Call Grok API to get both conversational response and routing information
 */
export async function getConversationalResponse(
  question: string,
): Promise<GrokConversationResponse> {
  if (!GROQ_API_KEY) {
    throw new Error(
      "GROK_API_KEY or GROQ_API_KEY environment variable is not set",
    );
  }

  const routingPrompt = getRoutingPrompt();
  const knowledgeBase = getKnowledgeBase();
  const featureMapping = getFeatureMapping();

  // Truncate prompts if they're too long (Grok has token limits)
  const maxKnowledgeBaseLength = 5000;
  const maxFeatureMappingLength = 3000;
  const maxRoutingPromptLength = 3000; // Increased to ensure block routing rules are included

  const truncatedKnowledgeBase =
    knowledgeBase.length > maxKnowledgeBaseLength
      ? knowledgeBase.substring(0, maxKnowledgeBaseLength) + "..."
      : knowledgeBase;
  const truncatedFeatureMapping =
    featureMapping.length > maxFeatureMappingLength
      ? featureMapping.substring(0, maxFeatureMappingLength) + "..."
      : featureMapping;
  const truncatedRoutingPrompt =
    routingPrompt.length > maxRoutingPromptLength
      ? routingPrompt.substring(0, maxRoutingPromptLength) + "..."
      : routingPrompt;

  const systemPrompt = `You are a professional, calm, and supportive conversational assistant for the Meaku Agent-Admin Dashboard. Your primary role is to:
1. Answer user questions conversationally and naturally with a professional, calm, and supportive tone
2. Provide helpful information about the dashboard features and capabilities
3. Ask clarifying follow-up questions when the user's intent is unclear or information is missing
4. Optionally suggest navigation routes and actions when they would be helpful to the user

CRITICAL BLOCK ROUTING RULE (MUST FOLLOW):
- When user mentions "Ask AI block", "Ask AI", "ask ai block", or "ask ai" → ALWAYS include route: {"url": "/blocks/1"} in the routes array
- When user mentions "Book Meeting block", "Book Meeting", "book meeting block", or "book meeting" → ALWAYS include route: {"url": "/blocks/2"} in the routes array
- When user mentions "Video Library block", "Video Library", "video library block", or "video library" → ALWAYS include route: {"url": "/blocks/3"} in the routes array
- When user mentions "Summarize block", "Summarize", "summarize block", or "summarize" → ALWAYS include route: {"url": "/blocks/4"} in the routes array
- DO NOT route to "/blocks" when user mentions a specific block - always use the specific block ID route

TONE GUIDELINES:
- Always maintain a professional, calm, and supportive demeanor
- Be patient and understanding with user questions
- Use clear, friendly language without being overly casual
- Avoid any aggressive, dismissive, or frustrated tones
- Express helpfulness and willingness to assist
- Keep responses concise but warm and approachable
- Use positive, encouraging language when appropriate
- Maintain professionalism even when users might be confused or asking repetitive questions

ASKING FOLLOW-UP QUESTIONS:
When the user's question is unclear or missing important information, ask polite, clarifying follow-up questions:
- If a user wants to update/change a field but hasn't specified the new value: "I'd be happy to help you update that! What value would you like to set it to?"
- If a user mentions something vague: "Could you clarify what you mean by [vague term]?"
- If a user wants to perform an action but the target is unclear: "I can help with that! Which [item/field/page] would you like to [action]?"
- Be specific and helpful in your follow-up questions
- Only ask ONE follow-up question at a time to avoid overwhelming the user
- CRITICAL: When asking follow-up questions, DO NOT include routes, navigationPath, or actions in your response - just ask the clarifying question
- After the user provides clarification, THEN proceed with the helpful response and optionally suggest routes

HANDLING MULTIPLE TASKS OR COMPLEX REQUESTS:
If the user asks for multiple tasks to perform at once, in sequence, or requests something too complex for the system to handle:
- Politely ask the user to focus on one task at a time
- Use a supportive and professional tone: "I'd be happy to help you with that! To make sure I can assist you effectively, could we focus on one task at a time? Which one would you like to start with?"
- Or: "I understand you have multiple things you'd like to do. Let's tackle them one at a time to ensure everything works smoothly. Which task would you like to start with?"
- Examples of complex requests that should trigger this:
  * "Update X, then Y, then Z"
  * "Update multiple fields at once"
  * "Do X and Y and Z all together"
  * Tasks that require complex multi-step workflows spanning multiple pages
- When asking to focus on one task, DO NOT include routes, navigationPath, or actions - just the polite request
- After the user provides a single task, THEN proceed with routes and actions for that one task

IMPORTANT: Navigation routes and actions are OPTIONAL suggestions. Users can:
- Follow the navigation suggestions if they want to perform the action
- Ignore the suggestions and continue chatting
- Ask follow-up questions without executing any routes

## Knowledge Base
${truncatedKnowledgeBase}

## Feature Mapping
${truncatedFeatureMapping}

## Routing Information
${truncatedRoutingPrompt}

## Response Format
You MUST respond with ONLY a valid JSON object. No markdown, no code blocks, just pure JSON:
{
  "textResponse": "Provide a natural, professional, calm, and supportive conversational response to the user's question. Maintain a helpful and approachable tone. If the user asks for multiple tasks or complex requests, politely ask them to focus on one task at a time (e.g., 'I'd be happy to help you with that! To make sure I can assist you effectively, could we focus on one task at a time? Which one would you like to start with?'). If the user's question is unclear or missing important information (e.g., they want to update a field but didn't specify the new value), ask a polite clarifying question. When asking follow-up questions or asking to focus on one task, DO NOT include routes or navigationPath - just ask the question or make the request. Examples: 'I'd be happy to help you update that! What value would you like to set it to?' or 'I can help with that! Which field would you like to update?' Only after the user provides clarification or focuses on a single task should you include routes. If navigation would be helpful and you have all required information, mention it as a friendly suggestion (e.g., 'I'd be happy to help you with that! If you'd like, I can guide you to the settings page where you can...' or 'You can find this in the datasets section. Would you like me to show you the way?'). You can also answer questions without providing routes - just be helpful, clear, and supportive in your response.",
  "navigationPath": [
    {"label": "Page Name 1", "type": "page"},
    {"label": "Page Name 2", "type": "page"},
    {"label": "Action Description 1", "type": "action"},
    {"label": "Action Description 2", "type": "action"}
  ],
  "routes": [
    {
      "url": "/intermediate-page",
      "description": "Brief description of this intermediate page",
      "ctaText": "Short action text like 'Go to Settings'"
      // NO actions array - intermediate routes only have URL for navigation
    },
    {
      "url": "/final-page",
      "description": "Brief description of the final destination page",
      "ctaText": "Short action text",
      "actions": [
        {
          "type": "click",
          "target": "CSS selector or id of element to click",
          "description": "Click on the button/element"
        },
        {
          "type": "text_change",
          "target": "CSS selector or id of input field",
          "value": "The final text to input into the field",
          "description": "Change the text in the input field"
        }
      ]
      // Actions array ONLY in the LAST route object
    }
  ]
}

CRITICAL RULES:
- ASK FOLLOW-UP QUESTIONS FIRST when information is missing or unclear (especially when users want to update fields without specifying values)
- When asking follow-up questions, DO NOT include routes, navigationPath, or actions in the response - just the clarifying question
- DO NOT provide routes or actions if you need to ask a clarifying question first
- HANDLE MULTIPLE/COMPLEX TASKS: If the user asks for multiple tasks or complex requests, politely ask them to focus on one task at a time - DO NOT include routes in this response
- After the user provides clarification or focuses on one task, then provide routes/actions if helpful
- Routes and actions are OPTIONAL - only include them if they would be helpful to the user and you have all necessary information
- You can answer questions conversationally without providing any routes at all
- If the user asks a general question, explanation, or follow-up, you may not need routes
- Only include routes when the user explicitly wants to perform a SINGLE, CLEAR action or navigate somewhere AND you have all required information (like values for text_change actions)
- Routes array contains sequential navigation steps (route-to-route transitions)
- Intermediate routes (all except the last one) should ONLY have: url, description, ctaText
- Intermediate routes should NOT have an "actions" array
- Only the LAST route object in the array should have an "actions" array
- Actions are UI actions performed only on the final destination page
- Use multiple routes when the user needs to navigate through multiple pages
- Use a single route with actions if the user only needs to go to one page and perform actions there

Action Types (UI actions only):
- "click": Click on an element (target should be CSS selector or id)
- "text_change": Change text in an input field (target should be CSS selector or id, value should be the final text to input)

Important: 
- Routes, navigationPath, and actions are ALL OPTIONAL
- Only include them when they would genuinely help the user
- For conversational questions, explanations, or general inquiries, you may omit routes entirely
- The "navigationPath" is an optional array of objects, each with "label" (string) and "type" ("page" or "action")
- Use type "page" for all page navigations (intermediate and final pages)
- Use type "action" for all UI actions (click, text_change)
- Include all intermediate pages, the final page, and all UI actions in sequence
- Use clear, user-friendly page names (e.g., "Datasets Page", "Documents Section", "Agent Controls")
- Use simple action descriptions (e.g., "Upload Button Click", "Enter Product Name", "Save Changes")
- Each item will be rendered as a chip with arrows between them, styled differently based on type
- Example navigationPath: [
    {"label": "Datasets Page", "type": "page"},
    {"label": "Documents Section", "type": "page"},
    {"label": "Upload Button Click", "type": "action"},
    {"label": "Enter Document Name", "type": "action"}
  ]
- The textResponse should be conversational and natural - it can explain what routes are available as suggestions, but doesn't require them
- If the user wants to update/change a field but hasn't specified the new value, ask: "What value would you like to set it to?" - and DO NOT include routes, navigationPath, or actions in that response
- When asking any follow-up question, omit routes, navigationPath, and actions entirely - just provide the clarifying question
- Only include routes if there are specific pages where the user can perform the action AND the user seems to want to do it AND you have all required information AND you are not asking a follow-up question
- Actions are UI interactions only - navigation happens via route-to-route transitions
- The "text_change" action must include a "value" field with the complete text to be entered - if the user hasn't provided this, ask for it first (without routes)
- Remember: Users can continue chatting and asking questions without following any suggested routes
- Always ask clarifying questions with a professional, calm, and supportive tone
- Follow-up questions should be standalone responses without routing information
- When asking users to focus on one task at a time, use a supportive and professional tone without routing information`;

  const userPrompt = `User question: "${question}"

Respond with ONLY a valid JSON object matching the format above.`;

  try {
    const response = await axios.post<GrokResponse>(
      GROQ_API_URL,
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false, // Allow self-signed certificates (for development)
        }),
      },
    );

    const content = response.data.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("No response returned from Grok API");
    }

    // Try to extract JSON from the response
    let jsonContent = content;

    // Remove markdown code blocks if present
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1];
    }

    try {
      const parsed = JSON.parse(jsonContent) as GrokConversationResponse;

      // Helper function to clean URL
      const cleanUrl = (url: string): string => {
        return url
          .replace(/^```[\w]*\n?/g, "")
          .replace(/```\n?$/g, "")
          .replace(/^`/g, "")
          .replace(/`$/g, "")
          .trim()
          .split("\n")[0]
          .trim();
      };

      // Handle legacy single route format and convert to routes array (no actions)
      if (parsed.route && typeof parsed.route === "string" && !parsed.routes) {
        const cleanRoute = cleanUrl(parsed.route);
        const finalUrl = cleanRoute.startsWith("/")
          ? cleanRoute
          : `/${cleanRoute}`;

        parsed.routes = [
          {
            url: finalUrl,
            actions: [],
            description: `Navigate to ${finalUrl}`,
            ctaText: parsed.ctaText || "Go to page",
          },
        ];
        delete parsed.route;
      }

      // Clean up routes array if provided
      if (parsed.routes && Array.isArray(parsed.routes)) {
        parsed.routes = parsed.routes.map((route, routeIndex) => {
          // Handle string routes (legacy format)
          if (typeof route === "string") {
            const cleanRoute = cleanUrl(route);
            const finalUrl = cleanRoute.startsWith("/")
              ? cleanRoute
              : `/${cleanRoute}`;

            return {
              url: finalUrl,
              actions: [],
              description: `Step ${routeIndex + 1}: Navigate to ${finalUrl}`,
              ctaText: `Go to step ${routeIndex + 1}`,
            };
          }

          // Handle route object
          const routeObj = route as GrokRouteStep;

          // Clean up URL if provided
          if (routeObj.url) {
            const cleanRoute = cleanUrl(routeObj.url);
            routeObj.url = cleanRoute.startsWith("/")
              ? cleanRoute
              : `/${cleanRoute}`;
          }

          // Process actions if provided - only allow click and text_change
          if (routeObj.actions && Array.isArray(routeObj.actions)) {
            routeObj.actions = routeObj.actions
              .filter(
                (action): action is GrokAction =>
                  action.type === "click" || action.type === "text_change",
              )
              .map((action) => {
                // Clean up targets
                if (action.target) {
                  action.target = cleanUrl(action.target);
                }

                return action;
              });
          } else {
            // Ensure actions array exists (empty if no actions provided)
            routeObj.actions = [];
          }

          // Set defaults
          routeObj.description =
            routeObj.description || `Step ${routeIndex + 1}`;
          routeObj.ctaText = routeObj.ctaText || `Go to step ${routeIndex + 1}`;

          return routeObj;
        });
      }

      // Ensure textResponse exists
      if (!parsed.textResponse) {
        parsed.textResponse = content;
      }

      return parsed;
    } catch (parseError) {
      // If JSON parsing fails, try to extract information from text
      console.warn(
        "Failed to parse JSON response, attempting text extraction:",
        parseError,
      );

      // Try to extract routes from text if they look like routes
      const routeMatches = content.match(/["']?(\/[^\s"']+)["']?/g);
      const routes:
        | Array<{ url: string; description: string; ctaText: string }>
        | undefined = routeMatches
        ? routeMatches.map((match, index) => {
            const routeUrl = match.replace(/["']/g, "");
            return {
              url: routeUrl,
              description: `Step ${index + 1}: Navigate to ${routeUrl}`,
              ctaText: `Go to step ${index + 1}`,
            };
          })
        : undefined;

      // Try to extract text response (everything before route mentions)
      let textResponse = content;
      if (routes && routes.length > 0) {
        routes.forEach((r) => {
          textResponse = textResponse.replace(
            new RegExp(
              `["']?${r.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']?`,
              "g",
            ),
            "",
          );
        });
        textResponse = textResponse.trim();
      }

      return {
        textResponse: textResponse || content,
        routes: routes && routes.length > 0 ? routes : undefined,
      };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      const errorMessage = errorData
        ? typeof errorData === "string"
          ? errorData
          : (errorData as { error?: { message?: string } })?.error?.message ||
            JSON.stringify(errorData)
        : error.message;

      console.error("Groq API error (getConversationalResponse):", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: JSON.stringify(errorData, null, 2),
        message: errorMessage,
        url: GROQ_API_URL,
      });

      throw new Error(`Groq API error: ${errorMessage}`);
    }
    throw error;
  }
}

/**
 * Call Grok API to determine the route for a user question (legacy function for fallback)
 */
export async function getRouteFromGrok(question: string): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error(
      "GROK_API_KEY or GROQ_API_KEY environment variable is not set",
    );
  }

  const systemPrompt = getRoutingPrompt();
  const userPrompt = `User question: "${question}"\n\nRespond with ONLY the URL path.`;

  try {
    const response = await axios.post<GrokResponse>(
      GROQ_API_URL,
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false, // Allow self-signed certificates (for development)
        }),
      },
    );

    const route = response.data.choices[0]?.message?.content?.trim();
    if (!route) {
      throw new Error("No route returned from Grok API");
    }

    // Clean up the response - remove any markdown formatting or extra text
    const cleanRoute = route
      .replace(/^```[\w]*\n?/g, "")
      .replace(/```\n?$/g, "")
      .replace(/^`/g, "")
      .replace(/`$/g, "")
      .trim()
      .split("\n")[0] // Take only the first line
      .trim();

    // Ensure it starts with /
    return cleanRoute.startsWith("/") ? cleanRoute : `/${cleanRoute}`;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Grok API error:", error.response?.data || error.message);
      throw new Error(
        `Grok API error: ${(error.response?.data as { error?: { message?: string } })?.error?.message || error.message}`,
      );
    }
    throw error;
  }
}
