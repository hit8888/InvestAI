import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { ChatMessage } from "../types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chat history storage directory
const HISTORY_DIR = join(__dirname, "../../chat-history");

// Ensure history directory exists
if (!existsSync(HISTORY_DIR)) {
  mkdirSync(HISTORY_DIR, { recursive: true });
}

interface StoredChatHistory {
  sessionId: string;
  messages: ChatMessage[];
  lastUpdated: string;
}

/**
 * Get file path for a session's chat history
 */
function getHistoryFilePath(sessionId: string): string {
  return join(HISTORY_DIR, `${sessionId}.json`);
}

/**
 * Save chat message to history
 */
export function saveChatMessage(sessionId: string, message: ChatMessage): void {
  try {
    const filePath = getHistoryFilePath(sessionId);
    let history: StoredChatHistory;

    // Load existing history if file exists
    if (existsSync(filePath)) {
      try {
        const fileContent = readFileSync(filePath, "utf-8");
        history = JSON.parse(fileContent);
      } catch (error) {
        console.error(`Error reading history file for ${sessionId}:`, error);
        history = {
          sessionId,
          messages: [],
          lastUpdated: new Date().toISOString(),
        };
      }
    } else {
      // Create new history
      history = {
        sessionId,
        messages: [],
        lastUpdated: new Date().toISOString(),
      };
    }

    // Add new message
    history.messages.push(message);
    history.lastUpdated = new Date().toISOString();

    // Limit to last 100 messages to prevent file from growing too large
    if (history.messages.length > 100) {
      history.messages = history.messages.slice(-100);
    }

    // Save to file
    writeFileSync(filePath, JSON.stringify(history, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error saving chat message for ${sessionId}:`, error);
  }
}

/**
 * Get chat history for a session
 */
export function getChatHistory(sessionId: string): ChatMessage[] {
  try {
    const filePath = getHistoryFilePath(sessionId);

    if (!existsSync(filePath)) {
      return [];
    }

    const fileContent = readFileSync(filePath, "utf-8");
    const history: StoredChatHistory = JSON.parse(fileContent);
    return history.messages || [];
  } catch (error) {
    console.error(`Error reading chat history for ${sessionId}:`, error);
    return [];
  }
}

/**
 * Clear chat history for a session
 */
export function clearChatHistory(sessionId: string): void {
  try {
    const filePath = getHistoryFilePath(sessionId);
    if (existsSync(filePath)) {
      writeFileSync(
        filePath,
        JSON.stringify(
          {
            sessionId,
            messages: [],
            lastUpdated: new Date().toISOString(),
          },
          null,
          2,
        ),
        "utf-8",
      );
    }
  } catch (error) {
    console.error(`Error clearing chat history for ${sessionId}:`, error);
  }
}
