#!/bin/bash

# Test script for routing server with complex questions

BASE_URL="http://localhost:8080/api/route"

echo "=========================================="
echo "Testing Routing Server with Complex Questions"
echo "=========================================="
echo ""

# Test 1: Simple navigation
echo "Test 1: Simple Navigation"
echo "Question: 'Show me my conversations'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "Show me my conversations"}' | python3 -m json.tool
echo ""
echo ""

# Test 2: Multi-step navigation
echo "Test 2: Multi-step Navigation"
echo "Question: 'I want to upload a document to train my agent'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I want to upload a document to train my agent"}' | python3 -m json.tool
echo ""
echo ""

# Test 3: Complex workflow with actions
echo "Test 3: Complex Workflow"
echo "Question: 'How do I add a new product description in the agent controls?'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I add a new product description in the agent controls?"}' | python3 -m json.tool
echo ""
echo ""

# Test 4: Configuration workflow
echo "Test 4: Configuration Workflow"
echo "Question: 'I need to change the primary color of my agent and then generate the llms.txt file'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I need to change the primary color of my agent and then generate the llms.txt file"}' | python3 -m json.tool
echo ""
echo ""

# Test 5: Settings and integrations
echo "Test 5: Settings and Integrations"
echo "Question: 'How do I connect Google Calendar and then add a new team member?'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I connect Google Calendar and then add a new team member?"}' | python3 -m json.tool
echo ""
echo ""

# Test 6: Blocks configuration
echo "Test 6: Blocks Configuration"
echo "Question: 'I want to configure the Ask AI block and set its visibility to specific pages'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I want to configure the Ask AI block and set its visibility to specific pages"}' | python3 -m json.tool
echo ""
echo ""

# Test 7: Analytics and insights
echo "Test 7: Analytics Query"
echo "Question: 'Show me the top questions asked by users in the insights page'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "Show me the top questions asked by users in the insights page"}' | python3 -m json.tool
echo ""
echo ""

# Test 8: Dataset management
echo "Test 8: Dataset Management"
echo "Question: 'I need to re-embed all my webpages because I updated the content'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I need to re-embed all my webpages because I updated the content"}' | python3 -m json.tool
echo ""
echo ""

# Test 9: Complex multi-page workflow
echo "Test 9: Complex Multi-page Workflow"
echo "Question: 'I want to view my leads, then check the insights to see buyer intent, and finally configure the agent controls'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I want to view my leads, then check the insights to see buyer intent, and finally configure the agent controls"}' | python3 -m json.tool
echo ""
echo ""

# Test 10: Informational question
echo "Test 10: Informational Question"
echo "Question: 'What is llms.txt and how does it help with SEO?'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is llms.txt and how does it help with SEO?"}' | python3 -m json.tool
echo ""
echo ""

echo "=========================================="
echo "Testing Complete"
echo "=========================================="
