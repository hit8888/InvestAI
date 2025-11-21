import type { RouteStep } from "../types.js";
import { getRouteFromGrok } from "../services/grokService.js";

/**
 * CSS Selector mappings for different pages
 * These selectors target actual page elements based on the real DOM structure
 * Uses heading text, generic containers, and page-specific classes
 */
const CSS_SELECTOR_MAP: Record<string, string[]> = {
  "/conversations": [
    'h1:contains("All Chats"), h2:contains("All Chats")',
    'div:has(> h1:contains("All Chats"))',
    "div.flex.w-full.flex-col",
  ],
  "/active-conversations": [
    'h1:contains("Live Chats"), h2:contains("Live Chats")',
    'div:has(> h1:contains("Live Chats"))',
    "div.flex.w-full.flex-col",
  ],
  "/active-conversations/assigned": [
    'h1:contains("Assigned"), h2:contains("Assigned")',
    'div:has(> h1:contains("Assigned"))',
    "div.flex.w-full.flex-col",
  ],
  "/active-conversations/pinned": [
    'h1:contains("Pinned"), h2:contains("Pinned")',
    'div:has(> h1:contains("Pinned"))',
    "div.flex.w-full.flex-col",
  ],
  "/conversations/leads": [
    'h1:contains("Leads"), h2:contains("Leads")',
    'div:has(> h1:contains("Leads"))',
    "div.flex.w-full.flex-col",
  ],
  "/conversations/link-clicks": [
    'h1:contains("Link Clicks"), h2:contains("Link Clicks")',
    'div:has(> h1:contains("Link Clicks"))',
    "div.flex.w-full.flex-col",
  ],
  "/agent/datasets": [
    'h1:contains("Datasets"), h2:contains("Datasets")',
    'div:has(> h1:contains("Datasets"))',
    "div.flex.w-full.flex-shrink-0.flex-col",
  ],
  "/agent/datasets/webpages": [
    'h1:contains("Webpages"), h2:contains("Webpages")',
    'div:has(> h1:contains("Webpages"))',
    "div.flex.w-full.flex-1",
  ],
  "/agent/datasets/documents": [
    'h1:contains("Documents"), h2:contains("Documents")',
    'div:has(> h1:contains("Documents"))',
    "div.flex.w-full.flex-1",
  ],
  "/agent/datasets/videos": [
    'h1:contains("Videos"), h2:contains("Videos")',
    'div:has(> h1:contains("Videos"))',
    "div.flex.w-full.flex-1",
  ],
  "/agent/datasets/slides": [
    'h1:contains("Slides"), h2:contains("Slides")',
    'div:has(> h1:contains("Slides"))',
    "div.flex.w-full.flex-1",
  ],
  "/agent/workflow": [
    'h1:contains("Workflow"), h2:contains("Workflow")',
    'div:has(> h1:contains("Workflow"))',
    "div.flex.w-full.flex-shrink-0.flex-col",
  ],
  "/agent/branding": [
    'h1:contains("Branding"), h2:contains("Branding")',
    'div:has(> h1:contains("Branding"))',
    "div.flex.w-full.flex-shrink-0.flex-col",
  ],
  "/agent/controls": [
    'h1:contains("Controls"), h2:contains("Controls")',
    'div:has(> h1:contains("Controls"))',
    "div.flex.w-full.flex-shrink-0.flex-col",
  ],
  "/training/playground": [
    'h1:contains("Playground"), h2:contains("Playground")',
    'div:has(> h1:contains("Playground"))',
    "div.flex.w-full.flex-col",
  ],
  "/training/playground/preview": [
    'h1:contains("Preview"), h2:contains("Preview")',
    'div:has(> h1:contains("Preview"))',
    "div.flex.w-full.flex-col",
  ],
  "/insights": [
    'h1:contains("Insights"), h2:contains("Insights")',
    'div:has(> h1:contains("Insights"))',
    "div.flex.w-full.flex-shrink-0.flex-col",
  ],
  "/accounts": [
    'h1:contains("Accounts"), h2:contains("Accounts")',
    'div:has(> h1:contains("Accounts"))',
    "div.flex.w-full.flex-col",
  ],
  "/contacts": [
    'h1:contains("Contacts"), h2:contains("Contacts")',
    'div:has(> h1:contains("Contacts"))',
    "div.flex.w-full.flex-col",
  ],
  "/icp": [
    'h1:contains("ICP"), h2:contains("ICP")',
    'div:has(> h1:contains("ICP"))',
    "div.flex.w-full.flex-col",
  ],
  "/blocks": [
    'h1:contains("Blocks"), h2:contains("Blocks")',
    'div:has(> h1:contains("Blocks"))',
    "div.flex.w-full.flex-col",
  ],
  "/settings/integrations": [
    'h1:contains("Integrations"), h2:contains("Integrations")',
    'div:has(> h1:contains("Integrations"))',
    "div.flex.w-full.flex-shrink-0.flex-col",
  ],
  "/settings/calendar": [
    'h1:contains("Calendar"), h2:contains("Calendar")',
    'div:has(> h1:contains("Calendar"))',
    "div.flex.w-full.flex-shrink-0.flex-col",
  ],
  "/settings/profile": [
    'h1:contains("Profile"), h2:contains("Profile")',
    'div:has(> h1:contains("Profile"))',
    "div.flex.w-full.flex-shrink-0.flex-col",
  ],
  "/settings/sdr-settings": [
    'h1:contains("SDR Settings"), h2:contains("SDR Settings")',
    'div:has(> h1:contains("SDR Settings"))',
    "div.flex.w-full.flex-shrink-0.flex-col",
  ],
  "/settings/members": [
    'h1:contains("Members"), h2:contains("Members")',
    'div:has(> h1:contains("Members"))',
    "div.flex.h-full.w-full.flex-1.flex-col",
  ],
  "/settings/embeddings": [
    'h1:contains("Embedding"), h2:contains("Embedding")',
    'div:has(> h1:contains("Embedding"))',
    "div.flex.w-full.flex-shrink-0.flex-col",
  ],
  "/config": [
    'h1:contains("Config"), h2:contains("Config")',
    'div:has(> h1:contains("Config"))',
    "div.flex.w-full.flex-col",
  ],
};

/**
 * Extract IDs from question (sessionID, blockId, documentID, webPageID)
 */
function extractIds(question: string): {
  sessionID?: string;
  blockId?: string;
  documentID?: string;
  webPageID?: string;
} {
  const sessionMatch = question.match(
    /(?:session|conversation|chat)[\s_-]*(?:id|#)?[\s_-]*([a-zA-Z0-9_-]+)/i,
  );
  const blockMatch = question.match(
    /(?:block)[\s_-]*(?:id|#)?[\s_-]*([0-9]+)/i,
  );
  const docMatch = question.match(
    /(?:document|doc)[\s_-]*(?:id|#)?[\s_-]*([a-zA-Z0-9_-]+)/i,
  );
  const webpageMatch = question.match(
    /(?:webpage|page)[\s_-]*(?:id|#)?[\s_-]*([a-zA-Z0-9_-]+)/i,
  );

  return {
    sessionID: sessionMatch?.[1],
    blockId: blockMatch?.[1],
    documentID: docMatch?.[1],
    webPageID: webpageMatch?.[1],
  };
}

/**
 * Determine route based on user question
 */
function determineRoute(question: string): string {
  const lowerQuestion = question.toLowerCase();
  const ids = extractIds(question);

  // Check for specific IDs first
  if (ids.sessionID) {
    if (lowerQuestion.includes("live") || lowerQuestion.includes("active")) {
      return `/active-conversations/live/${ids.sessionID}`;
    }
    if (lowerQuestion.includes("lead")) {
      return `/conversations/leads/${ids.sessionID}`;
    }
    if (lowerQuestion.includes("link")) {
      return `/conversations/link-clicks/${ids.sessionID}`;
    }
    return `/conversations/${ids.sessionID}`;
  }

  if (ids.blockId) {
    return `/blocks/${ids.blockId}`;
  }

  if (ids.documentID) {
    return `/agent/datasets/documents/${ids.documentID}`;
  }

  if (ids.webPageID) {
    return `/agent/datasets/webpages/${ids.webPageID}`;
  }

  // Conversation queries
  if (
    lowerQuestion.includes("all conversations") ||
    lowerQuestion.includes("chat history") ||
    lowerQuestion.includes("conversation list") ||
    lowerQuestion.includes("all chats")
  ) {
    return "/conversations";
  }

  if (
    lowerQuestion.includes("live chat") ||
    lowerQuestion.includes("active conversation") ||
    lowerQuestion.includes("ongoing") ||
    lowerQuestion.includes("happening now")
  ) {
    return "/active-conversations";
  }

  if (
    lowerQuestion.includes("assigned") ||
    lowerQuestion.includes("my assigned")
  ) {
    return "/active-conversations/assigned";
  }

  if (lowerQuestion.includes("pinned") || lowerQuestion.includes("important")) {
    return "/active-conversations/pinned";
  }

  if (
    lowerQuestion.includes("lead") ||
    lowerQuestion.includes("potential customer")
  ) {
    return "/conversations/leads";
  }

  if (lowerQuestion.includes("link click")) {
    return "/conversations/link-clicks";
  }

  // Agent training/knowledge
  if (
    lowerQuestion.includes("training data") ||
    lowerQuestion.includes("knowledge source") ||
    lowerQuestion.includes("dataset") ||
    lowerQuestion.includes("add training") ||
    lowerQuestion.includes("manage data")
  ) {
    if (
      lowerQuestion.includes("webpage") ||
      lowerQuestion.includes("web page")
    ) {
      return "/agent/datasets/webpages";
    }
    if (lowerQuestion.includes("document") || lowerQuestion.includes("pdf")) {
      return "/agent/datasets/documents";
    }
    if (lowerQuestion.includes("video")) {
      return "/agent/datasets/videos";
    }
    if (lowerQuestion.includes("slide")) {
      return "/agent/datasets/slides";
    }
    return "/agent/datasets";
  }

  // Agent appearance
  if (
    lowerQuestion.includes("customize agent") ||
    lowerQuestion.includes("agent appearance") ||
    lowerQuestion.includes("branding") ||
    lowerQuestion.includes("llm setting") ||
    lowerQuestion.includes("agent look")
  ) {
    return "/agent/branding";
  }

  // Agent behavior
  if (
    lowerQuestion.includes("product description") ||
    lowerQuestion.includes("customer persona") ||
    lowerQuestion.includes("icp") ||
    lowerQuestion.includes("ideal customer") ||
    lowerQuestion.includes("agent control")
  ) {
    return "/agent/controls";
  }

  // Workflow
  if (lowerQuestion.includes("workflow")) {
    return "/agent/workflow";
  }

  // Testing
  if (
    lowerQuestion.includes("test agent") ||
    lowerQuestion.includes("try agent") ||
    lowerQuestion.includes("preview") ||
    lowerQuestion.includes("playground")
  ) {
    if (lowerQuestion.includes("preview")) {
      return "/training/playground/preview";
    }
    return "/training/playground";
  }

  // Analytics
  if (
    lowerQuestion.includes("analytics") ||
    lowerQuestion.includes("metric") ||
    lowerQuestion.includes("statistic") ||
    lowerQuestion.includes("performance") ||
    lowerQuestion.includes("insight")
  ) {
    return "/insights";
  }

  // Company/visitor data
  if (lowerQuestion.includes("compan") || lowerQuestion.includes("account")) {
    return "/accounts";
  }

  if (lowerQuestion.includes("contact") || lowerQuestion.includes("visitor")) {
    return "/contacts";
  }

  if (
    lowerQuestion.includes("icp") ||
    lowerQuestion.includes("ideal customer profile")
  ) {
    return "/icp";
  }

  // AI features
  if (
    lowerQuestion.includes("block") ||
    lowerQuestion.includes("ai feature") ||
    lowerQuestion.includes("ask ai") ||
    lowerQuestion.includes("book meeting") ||
    lowerQuestion.includes("video library")
  ) {
    return "/blocks";
  }

  // Settings
  if (
    lowerQuestion.includes("integration") ||
    lowerQuestion.includes("connect service") ||
    lowerQuestion.includes("third-party")
  ) {
    return "/settings/integrations";
  }

  if (lowerQuestion.includes("calendar")) {
    return "/settings/calendar";
  }

  if (
    lowerQuestion.includes("profile") ||
    lowerQuestion.includes("my account")
  ) {
    return "/settings/profile";
  }

  if (lowerQuestion.includes("sdr setting")) {
    return "/settings/sdr-settings";
  }

  if (
    lowerQuestion.includes("team member") ||
    lowerQuestion.includes("add member") ||
    lowerQuestion.includes("user management") ||
    lowerQuestion.includes("member")
  ) {
    return "/settings/members";
  }

  if (
    lowerQuestion.includes("embedding code") ||
    lowerQuestion.includes("widget code") ||
    lowerQuestion.includes("installation") ||
    lowerQuestion.includes("embed script")
  ) {
    return "/settings/embeddings";
  }

  // Configuration
  if (lowerQuestion.includes("config") || lowerQuestion.includes("setting")) {
    return "/config";
  }

  // Default fallback
  return "/conversations";
}

/**
 * Get CSS selectors for a given route
 */
export function getCssSelectors(route: string): string[] {
  // Try exact match first
  if (CSS_SELECTOR_MAP[route]) {
    return CSS_SELECTOR_MAP[route];
  }

  // Try to match base path (e.g., /conversations/123 -> /conversations)
  const basePath = route.split("/").slice(0, 3).join("/");
  if (CSS_SELECTOR_MAP[basePath]) {
    return CSS_SELECTOR_MAP[basePath];
  }

  // Fallback to generic selectors that work with the actual page structure
  return [
    "div.flex.w-full.flex-col",
    "div.flex.w-full.flex-shrink-0.flex-col",
    "div.flex.h-full.w-full.flex-1.flex-col",
    "body > div#root > div > div > div",
  ];
}

/**
 * Process routing request and return steps using Grok AI
 * Falls back to rule-based routing if Grok is unavailable
 */
export async function processRoutingRequest(
  question: string,
): Promise<RouteStep[]> {
  let route: string;

  // Try Grok first if API key is available
  if (process.env.GROK_API_KEY) {
    try {
      route = await getRouteFromGrok(question);
      console.log(`Grok determined route: ${route}`);
    } catch (error) {
      console.warn(
        "Grok API failed, falling back to rule-based routing:",
        error,
      );
      route = determineRoute(question);
    }
  } else {
    // Use rule-based routing if no Grok API key
    console.log("No GROK_API_KEY found, using rule-based routing");
    route = determineRoute(question);
  }

  const cssSelectors = getCssSelectors(route);

  return [
    {
      url: route,
      cssSelectors,
      description: `Navigate to ${route}`,
    },
  ];
}
