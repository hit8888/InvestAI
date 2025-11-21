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

# Test 11: Active conversations filtering
echo "Test 11: Active Conversations - Assigned"
echo "Question: 'Show me conversations assigned to me'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "Show me conversations assigned to me"}' | python3 -m json.tool
echo ""
echo ""

# Test 12: Pinned conversations
echo "Test 12: Pinned Conversations"
echo "Question: 'Where can I see my pinned conversations?'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "Where can I see my pinned conversations?"}' | python3 -m json.tool
echo ""
echo ""

# Test 13: Link clicks tracking
echo "Test 13: Link Clicks Tracking"
echo "Question: 'I need to analyze which links were clicked in conversations'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I need to analyze which links were clicked in conversations"}' | python3 -m json.tool
echo ""
echo ""

# Test 14: Video dataset management
echo "Test 14: Video Dataset Upload"
echo "Question: 'I want to upload a video file for training my agent'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I want to upload a video file for training my agent"}' | python3 -m json.tool
echo ""
echo ""

# Test 15: Slides dataset management
echo "Test 15: Slides Dataset Management"
echo "Question: 'How do I manage presentation slides for my agent?'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I manage presentation slides for my agent?"}' | python3 -m json.tool
echo ""
echo ""

# Test 16: Custom document creation
echo "Test 16: Custom Document Creation"
echo "Question: 'I need to create a custom document for training'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I need to create a custom document for training"}' | python3 -m json.tool
echo ""
echo ""

# Test 17: ICP configuration
echo "Test 17: Ideal Customer Persona Configuration"
echo "Question: 'I want to configure the ideal customer profile with roles and departments'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I want to configure the ideal customer profile with roles and departments"}' | python3 -m json.tool
echo ""
echo ""

# Test 18: Agent personality setup
echo "Test 18: Agent Personality Configuration"
echo "Question: 'How do I set the agent personality to be casual and fun?'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I set the agent personality to be casual and fun?"}' | python3 -m json.tool
echo ""
echo ""

# Test 19: Support configuration
echo "Test 19: Support Configuration"
echo "Question: 'I need to add support email and phone number for my agent'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I need to add support email and phone number for my agent"}' | python3 -m json.tool
echo ""
echo ""

# Test 20: Response length control
echo "Test 20: Response Length Configuration"
echo "Question: 'Where can I control how detailed the agent responses should be?'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "Where can I control how detailed the agent responses should be?"}' | python3 -m json.tool
echo ""
echo ""

# Test 21: Intro message customization
echo "Test 21: Intro Message Customization"
echo "Question: 'I want to change the welcome message for my agent'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I want to change the welcome message for my agent"}' | python3 -m json.tool
echo ""
echo ""

# Test 22: Agent orb configuration
echo "Test 22: Agent Orb Configuration"
echo "Question: 'How do I configure the floating agent icon?'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I configure the floating agent icon?"}' | python3 -m json.tool
echo ""
echo ""

# Test 23: Book Meeting block
echo "Test 23: Book Meeting Block Configuration"
echo "Question: 'I need to configure the Book Meeting block and set up meeting form fields'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I need to configure the Book Meeting block and set up meeting form fields"}' | python3 -m json.tool
echo ""
echo ""

# Test 24: Video Library block
echo "Test 24: Video Library Block Management"
echo "Question: 'Where can I add videos to the Video Library block?'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "Where can I add videos to the Video Library block?"}' | python3 -m json.tool
echo ""
echo ""

# Test 25: Block global settings
echo "Test 25: Block Global Settings"
echo "Question: 'I want to change the primary color and font style for all blocks'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I want to change the primary color and font style for all blocks"}' | python3 -m json.tool
echo ""
echo ""

# Test 26: Floating bottom bar toggle
echo "Test 26: Floating Bottom Bar Toggle"
echo "Question: 'How do I toggle the floating bottom bar for blocks?'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I toggle the floating bottom bar for blocks?"}' | python3 -m json.tool
echo ""
echo ""

# Test 27: Playground preview mode
echo "Test 27: Playground Preview Mode"
echo "Question: 'I want to preview how my agent appears to users'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I want to preview how my agent appears to users"}' | python3 -m json.tool
echo ""
echo ""

# Test 28: Buyer intent analytics
echo "Test 28: Buyer Intent Analytics"
echo "Question: 'Show me the buyer intent distribution in insights'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "Show me the buyer intent distribution in insights"}' | python3 -m json.tool
echo ""
echo ""

# Test 29: Hourly traffic patterns
echo "Test 29: Hourly Traffic Patterns"
echo "Question: 'I need to see peak hours analysis by weekday'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I need to see peak hours analysis by weekday"}' | python3 -m json.tool
echo ""
echo ""

# Test 30: Country distribution
echo "Test 30: Country Distribution Analytics"
echo "Question: 'Where can I see visitor distribution by country?'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "Where can I see visitor distribution by country?"}' | python3 -m json.tool
echo ""
echo ""

# Test 31: Product interest metrics
echo "Test 31: Product Interest Analytics"
echo "Question: 'I want to see which products users ask about most'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I want to see which products users ask about most"}' | python3 -m json.tool
echo ""
echo ""

# Test 32: Top questions clicked
echo "Test 32: Top Questions Clicked"
echo "Question: 'Show me which suggested questions users click the most'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "Show me which suggested questions users click the most"}' | python3 -m json.tool
echo ""
echo ""

# Test 33: Accounts/Companies view
echo "Test 33: Accounts/Companies View"
echo "Question: 'I need to view company account data and details'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I need to view company account data and details"}' | python3 -m json.tool
echo ""
echo ""

# Test 34: Contacts/Visitors management
echo "Test 34: Contacts/Visitors Management"
echo "Question: 'Where can I see visitor and contact information?'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "Where can I see visitor and contact information?"}' | python3 -m json.tool
echo ""
echo ""

# Test 35: ICP page
echo "Test 35: ICP Configuration Page"
echo "Question: 'I want to configure the ideal customer profile settings'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I want to configure the ideal customer profile settings"}' | python3 -m json.tool
echo ""
echo ""

# Test 36: Calendar event types
echo "Test 36: Calendar Event Types"
echo "Question: 'I need to create and configure event types for my calendar'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I need to create and configure event types for my calendar"}' | python3 -m json.tool
echo ""
echo ""

# Test 37: Calendar availability
echo "Test 37: Calendar Availability Settings"
echo "Question: 'How do I set working hours and availability schedule?'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I set working hours and availability schedule?"}' | python3 -m json.tool
echo ""
echo ""

# Test 38: Profile picture management
echo "Test 38: Profile Picture Management"
echo "Question: 'I want to upload or delete my profile picture'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I want to upload or delete my profile picture"}' | python3 -m json.tool
echo ""
echo ""

# Test 39: Password reset
echo "Test 39: Password Reset"
echo "Question: 'Where can I change my password?'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "Where can I change my password?"}' | python3 -m json.tool
echo ""
echo ""

# Test 40: SDR default intro message
echo "Test 40: SDR Default Intro Message"
echo "Question: 'I need to edit the default intro message for SDRs'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I need to edit the default intro message for SDRs"}' | python3 -m json.tool
echo ""
echo ""

# Test 41: Member role assignment
echo "Test 41: Member Role Assignment"
echo "Question: 'I want to set member access levels like admin or read-only'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I want to set member access levels like admin or read-only"}' | python3 -m json.tool
echo ""
echo ""

# Test 42: Embedding script installation
echo "Test 42: Embedding Script Installation"
echo "Question: 'I need to get the widget code for my website'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I need to get the widget code for my website"}' | python3 -m json.tool
echo ""
echo ""

# Test 43: Workflow automation
echo "Test 43: Workflow Automation"
echo "Question: 'How do I set up workflow automation rules?'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I set up workflow automation rules?"}' | python3 -m json.tool
echo ""
echo ""

# Test 44: Bulk operations on datasets
echo "Test 44: Bulk Dataset Operations"
echo "Question: 'I need to select multiple documents and re-embed them in bulk'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I need to select multiple documents and re-embed them in bulk"}' | python3 -m json.tool
echo ""
echo ""

# Test 45: Date range filtering in insights
echo "Test 45: Date Range Filtering in Insights"
echo "Question: 'I want to filter insights by a custom date range'"
echo "---"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"question": "I want to filter insights by a custom date range"}' | python3 -m json.tool
echo ""
echo ""

echo "=========================================="
echo "Testing Complete"
echo "=========================================="
