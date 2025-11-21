import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { getConversationalResponse } from "./services/grokService.js";
import type {
  RoutingRequest,
  RoutingResponse,
  Action,
  RouteStep,
  NavigationPathItem,
} from "./types.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // In production, specify your frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Status endpoint to check Grok configuration
app.get("/status", (req, res) => {
  res.json({
    grokConfigured: !!(process.env.GROK_API_KEY || process.env.GROQ_API_KEY),
    port: process.env.PORT || 8080,
    timestamp: new Date().toISOString(),
  });
});

// REST endpoint for conversational routing
app.post("/api/route", async (req, res) => {
  try {
    const { question } = req.body as RoutingRequest;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Try Groq for conversational response
    if (process.env.GROK_API_KEY || process.env.GROQ_API_KEY) {
      try {
        const grokResponse = await getConversationalResponse(question);

        const response: RoutingResponse = {
          textResponse: grokResponse.textResponse,
          navigationPath: grokResponse.navigationPath?.map((item) => ({
            label: item.label,
            type:
              item.type === "page" || item.type === "action"
                ? item.type
                : "page",
          })) as NavigationPathItem[],
          question,
        };

        // Add routes if available (supporting both single and multiple routes)
        if (grokResponse.routes && grokResponse.routes.length > 0) {
          const totalRoutes = grokResponse.routes.length;
          response.routes = grokResponse.routes.map((route, routeIndex) => {
            // Handle string routes (legacy format)
            if (typeof route === "string") {
              return {
                url: route,
                actions: [],
                description: `Step ${routeIndex + 1}: Navigate to ${route}`,
                ctaText: `Go to step ${routeIndex + 1}`,
                stepNumber: routeIndex + 1,
              };
            }

            // Handle route object
            const routeObj = route;
            const isLastRoute = routeIndex === totalRoutes - 1;
            const routeStep: RouteStep = {
              url: routeObj.url,
              actions: [],
              description: routeObj.description || `Step ${routeIndex + 1}`,
              ctaText: routeObj.ctaText || `Go to step ${routeIndex + 1}`,
              stepNumber: routeIndex + 1,
            };

            // Only process actions if this is the LAST route
            if (
              isLastRoute &&
              routeObj.actions &&
              Array.isArray(routeObj.actions)
            ) {
              let actionStepNumber = 1;
              routeStep.actions = routeObj.actions
                .filter(
                  (
                    action,
                  ): action is typeof action & {
                    type: "click" | "text_change";
                  } => action.type === "click" || action.type === "text_change",
                ) // Only allow click and text_change
                .map((action) => {
                  // Target is required for both action types
                  if (!action.target) {
                    console.warn(
                      `Action missing target field, skipping action: ${action.description}`,
                    );
                    return null;
                  }

                  const processedAction: Action = {
                    type: action.type as "click" | "text_change",
                    target: action.target,
                    description: action.description,
                    stepNumber: actionStepNumber++,
                  };

                  // For text_change actions, require value field
                  if (action.type === "text_change") {
                    if (action.value) {
                      processedAction.value = action.value;
                    } else {
                      console.warn(
                        `text_change action missing value field, skipping action: ${action.description}`,
                      );
                      return null;
                    }
                  }

                  return processedAction;
                })
                .filter((action): action is Action => action !== null); // Remove null actions
            }
            // Intermediate routes have empty actions array (no actions)

            return routeStep;
          });
        } else if (grokResponse.route) {
          // Legacy single route support (no actions, just navigation)
          response.routes = [
            {
              url: grokResponse.route,
              actions: [],
              description: `Navigate to ${grokResponse.route}`,
              ctaText: grokResponse.ctaText || "Go to page",
              stepNumber: 1,
            },
          ];
        }

        res.json(response);
        return;
      } catch (error) {
        console.error("Grok API failed:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        // Don't fall through to the generic message if we have the key
        // Instead, return a more helpful error
        res.status(500).json({
          error: "Failed to process request with Groq API",
          details: error instanceof Error ? error.message : "Unknown error",
          question,
        });
        return;
      }
    }

    // Fallback: provide basic response without route (only if no API key)
    const response: RoutingResponse = {
      textResponse:
        "I'm here to help! However, I need the Groq API key configured to provide detailed responses. Please configure GROK_API_KEY or GROQ_API_KEY in your environment.",
      question,
    };

    res.json(response);
  } catch (error) {
    console.error("Error processing routing request:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle routing requests via WebSocket
  socket.on("route:question", async (data: RoutingRequest) => {
    try {
      const { question } = data;

      if (!question) {
        socket.emit("route:error", { error: "Question is required" });
        return;
      }

      console.log(`Processing question: "${question}"`);

      // Try Grok for conversational response
      if (process.env.GROK_API_KEY) {
        try {
          const grokResponse = await getConversationalResponse(question);

          const response: RoutingResponse = {
            textResponse: grokResponse.textResponse,
            question,
          };

          // Add routes if available (supporting both single and multiple routes)
          if (grokResponse.routes && grokResponse.routes.length > 0) {
            const totalRoutes = grokResponse.routes.length;
            response.routes = grokResponse.routes.map((route, routeIndex) => {
              // Handle string routes (legacy format)
              if (typeof route === "string") {
                return {
                  url: route,
                  actions: [],
                  description: `Step ${routeIndex + 1}: Navigate to ${route}`,
                  ctaText: `Go to step ${routeIndex + 1}`,
                  stepNumber: routeIndex + 1,
                };
              }

              // Handle route object
              const routeObj = route;
              const isLastRoute = routeIndex === totalRoutes - 1;
              const routeStep: RouteStep = {
                url: routeObj.url,
                actions: [],
                description: routeObj.description || `Step ${routeIndex + 1}`,
                ctaText: routeObj.ctaText || `Go to step ${routeIndex + 1}`,
                stepNumber: routeIndex + 1,
              };

              // Only process actions if this is the LAST route
              if (
                isLastRoute &&
                routeObj.actions &&
                Array.isArray(routeObj.actions)
              ) {
                let actionStepNumber = 1;
                routeStep.actions = routeObj.actions
                  .filter(
                    (
                      action,
                    ): action is typeof action & {
                      type: "click" | "text_change";
                    } =>
                      action.type === "click" || action.type === "text_change",
                  ) // Only allow click and text_change
                  .map((action) => {
                    // Target is required for both action types
                    if (!action.target) {
                      console.warn(
                        `Action missing target field, skipping action: ${action.description}`,
                      );
                      return null;
                    }

                    const processedAction: Action = {
                      type: action.type as "click" | "text_change",
                      target: action.target,
                      description: action.description,
                      stepNumber: actionStepNumber++,
                    };

                    // For text_change actions, require value field
                    if (action.type === "text_change") {
                      if (action.value) {
                        processedAction.value = action.value;
                      } else {
                        console.warn(
                          `text_change action missing value field, skipping action: ${action.description}`,
                        );
                        return null;
                      }
                    }

                    return processedAction;
                  })
                  .filter((action): action is Action => action !== null); // Remove null actions
              }
              // Intermediate routes have empty actions array (no actions)

              return routeStep;
            });
          } else if (grokResponse.route) {
            // Legacy single route support (no UI actions, just navigation)
            response.routes = [
              {
                url: grokResponse.route,
                actions: [],
                description: `Navigate to ${grokResponse.route}`,
                ctaText: grokResponse.ctaText || "Go to page",
                stepNumber: 1,
              },
            ];
          }

          socket.emit("route:response", response);
          return;
        } catch (error) {
          console.error("Grok API failed:", error);
          if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
          }
          // Don't fall through to the generic message if we have the key
          socket.emit("route:error", {
            error: "Failed to process request with Groq API",
            details: error instanceof Error ? error.message : "Unknown error",
          });
          return;
        }
      }

      // Fallback: provide basic response (only if no API key)
      const response: RoutingResponse = {
        textResponse:
          "I'm here to help! However, I need the Grok API key configured to provide detailed responses.",
        question,
      };

      socket.emit("route:response", response);
    } catch (error) {
      console.error("Error processing routing request:", error);
      socket.emit("route:error", {
        error: error instanceof Error ? error.message : "Internal server error",
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`🚀 Routing server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
