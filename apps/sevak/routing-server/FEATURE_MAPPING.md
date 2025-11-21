# Feature Mapping for Agent-Admin Dashboard

This document maps each URL with all sub-features and actions that can be performed on that page.

## `/conversations` - All Conversations

**Features:**

- View all conversation history
- Filter conversations by date, status, or other criteria
- Search conversations
- View conversation details
- See prospect information
- View SDR assignments
- Export conversation data

## `/active-conversations` - Live Conversations

**Features:**

- View active/ongoing conversations in real-time
- Monitor live chat sessions
- See which conversations are happening now
- View real-time visitor activity

## `/active-conversations/assigned` - Assigned Conversations

**Features:**

- View conversations assigned to you
- Manage your assigned leads
- Filter by assignment status

## `/active-conversations/pinned` - Pinned Conversations

**Features:**

- View pinned/important conversations
- Manage priority conversations
- Quick access to important leads

## `/conversations/leads` - Leads

**Features:**

- View captured leads from conversations
- Filter and search leads
- Export lead data
- View lead details and contact information
- Manage lead status
- Assign leads to team members

## `/conversations/link-clicks` - Link Clicks

**Features:**

- View link click tracking data
- See which links were clicked in conversations
- Analyze click patterns
- Track engagement metrics

## `/agent/datasets` - Datasets Overview

**Features:**

- View overview of all knowledge sources
- See statistics for webpages, documents, videos, and slides
- Navigate to specific dataset types
- View upload status and processing information
- Configure agent controls (product description, ICP, customer persona)

## `/agent/datasets/webpages` - Webpages Management

**Features:**

- Upload new webpages via URL
- View list of all webpages
- Edit webpage details
- Delete webpages
- Re-embed webpages (reprocess for training)
- Bulk operations (select multiple, delete, re-embed)
- View webpage processing status
- See webpage statistics (pages processed, last updated)
- Filter and search webpages

## `/agent/datasets/documents` - Documents Management

**Features:**

- Upload PDF documents (drag & drop or file picker)
- Create custom documents
- View list of all documents
- Edit document details
- Delete documents
- Re-embed documents (reprocess for training)
- Bulk operations (select multiple, delete, re-embed)
- View document processing status
- See document statistics
- Filter and search documents

## `/agent/datasets/videos` - Videos Management

**Features:**

- Upload video files
- View list of all videos
- Edit video details
- Delete videos
- Re-embed videos (reprocess for training)
- Bulk operations (select multiple, delete, re-embed)
- View video processing status
- See video statistics (frames count, last updated)
- Filter and search videos

## `/agent/datasets/slides` - Slides Management

**Features:**

- Upload slide files
- View list of all slides
- Edit slide details
- Delete slides
- Re-embed slides (reprocess for training)
- Bulk operations (select multiple, delete, re-embed)
- View slide processing status
- See slide statistics
- Filter and search slides

## `/agent/workflow` - Workflow Configuration

**Features:**

- Configure agent workflow settings
- Set up workflow automation rules
- Manage workflow steps and conditions

## `/agent/branding` - Branding & Appearance

**Features:**

- **LLMs.txt Generation:**
  - Generate llms.txt files for web data sources
  - Select data source from dropdown
  - Download generated llms.txt files
  - View generation status (in progress, completed, error)
  - Regenerate llms.txt files
  - See last updated timestamp
- **Primary Color:** (Currently commented out but available)
  - Change primary color of agent
  - Color picker input
- **Secondary Color:** (Currently commented out but available)
  - Change secondary color of agent
- **Font Style:** (Currently commented out but available)
  - Select font family from dropdown
  - Apply custom fonts
- **Agent Logo:** (Currently commented out but available)
  - Upload agent logo
  - Change agent name
- **Agent Orb:** (Currently commented out but available)
  - Configure orb appearance
  - Show/hide orb
- **Intro Message:** (Currently commented out but available)
  - Set welcome/intro message
  - Add emojis to message
  - Customize greeting text

## `/agent/controls` - Agent Controls & Behavior

**Features:**

- **Product Description:**
  - Add/edit product names and descriptions
  - Add multiple products
  - Remove products
  - Configure product details to help agent understand offerings
- **Ideal Customer Persona (ICP):**
  - Configure target customer profile
  - Set seniorities/roles
  - Select job functions/departments
  - Choose locations
  - Set max contacts per company
  - Configure targeting criteria for SDRs
- **Ideal Company Persona:**
  - Set ideal company personas to target
  - Configure industry targeting
  - Set ATS preferences
  - Configure company size/job openings criteria
- **Agent Personality:**
  - Define agent personality traits
  - Set interaction style (casual/formal, fun/serious)
  - Configure how agent should interact with users
- **Instructions:**
  - Add custom instructions in plain English
  - Set rules to guide assistant behavior
  - Configure general directives
- **Response Length:**
  - Define ideal response length
  - Control conciseness vs detailed answers
- **Support Configuration:**
  - Configure support handling
  - Set website URL for help page
  - Add support email address
  - Add support phone number
  - Choose which support methods to enable

## `/training/playground` - Playground

**Features:**

- Test agent responses
- Preview agent behavior
- Try different questions
- See real-time agent responses
- Test agent configuration changes

## `/training/playground/preview` - Playground Preview

**Features:**

- Preview mode for testing
- See how agent appears to users
- Test agent in preview environment

## `/insights` - Analytics & Insights

**Features:**

- **Summary Metrics:**
  - View overall statistics
  - See key performance indicators
- **Date Range Selection:**
  - Filter insights by date range
  - Use preset ranges (Last 7 days, Last 30 days, etc.)
  - Custom date range selection
- **Daily Session Insight:**
  - View daily conversation patterns
  - See session trends over time
- **Weekly Conversation Pattern:**
  - View weekly patterns
  - Select specific day of week to analyze
  - See conversation distribution by weekday
- **Hourly Traffic by Weekday:**
  - View hourly traffic patterns
  - Filter by day of week
  - See peak hours analysis
- **Frequent Sources:**
  - See most frequent traffic sources
  - Analyze where visitors come from
- **Top Questions Asked by Users:**
  - View most common user questions
  - Analyze question patterns
- **Top Questions Clicked by Users:**
  - See which suggested questions users click
  - Analyze engagement with suggestions
- **Buyer Intent Distribution:**
  - View buyer intent analysis
  - See intent distribution charts
- **Country Distribution:**
  - View visitor distribution by country
  - Analyze geographic patterns
- **Product Interest Distribution:**
  - See product interest metrics
  - Analyze which products users ask about
- **Conversation Processing Time Log:** (Staff only)
  - View processing time metrics
  - Analyze performance metrics

## `/accounts` - Accounts/Companies

**Features:**

- View company/account data
- See company details
- Filter and search companies
- View company information
- Analyze company data

## `/contacts` - Contacts/Visitors

**Features:**

- View contact/visitor data
- See visitor information
- Filter and search contacts
- View contact details
- Manage contact information

## `/icp` - Ideal Customer Profile

**Features:**

- Configure ICP settings
- Set target customer criteria
- Manage ideal customer profile configuration

## `/blocks` - AI Blocks Management

**Features:**

- **View All Blocks:**
  - See list of all AI blocks (Ask AI, Book Meeting, Video Library, Summarize)
  - View block status (published/unpublished)
  - Click to configure individual blocks
- **Preview:**
  - Preview all blocks together
  - See how blocks appear to users
- **Global Settings:**
  - **Primary Color:** Change primary color for all blocks
  - **Font Style:** Set font family for blocks
  - **Floating Bottom Bar:** Toggle show/hide floating bottom bar
  - **Instructions:** Edit agent instructions (navigates to Ask AI block instructions)

## `/blocks/:blockId` - Individual Block Configuration

**Features (varies by block type):**

### Ask AI Block:

- **Block Visibility:**
  - Enable/disable block
  - Set block title
  - Set block description
  - Upload block icon
- **Page Visibility:**
  - Configure which pages block appears on
  - Set page-level visibility rules
- **Instructions Settings:**
  - Configure agent instructions
  - Set custom prompts
- **Call to Actions:**
  - Add/edit CTAs
  - Configure button labels
  - Set CTA behavior

### Book Meeting Block:

- **Block Visibility:**
  - Enable/disable block
  - Set block title
  - Set block description
  - Upload block icon
- **Page Visibility:**
  - Configure which pages block appears on
  - Set page-level visibility rules
- **Form Configuration:**
  - Configure meeting form fields
  - Set CTA label

### Video Library Block:

- **Block Visibility:**
  - Enable/disable block
  - Set block title
  - Set block description
  - Upload block icon
- **Page Visibility:**
  - Configure which pages block appears on
  - Set page-level visibility rules
- **Video Management:**
  - Add/edit videos
  - Configure video library

### Summarize Block:

- **Block Visibility:**
  - Enable/disable block
  - Set block title
  - Set block description
  - Upload block icon
- **Page Visibility:**
  - Configure which pages block appears on
  - Set page-level visibility rules

## `/settings/integrations` - Integrations

**Features:**

- View all available integrations
- Connect third-party services
- Disconnect integrations
- Toggle integration status
- Configure integration settings
- View integration connection status
- Manage OAuth connections
- Fill integration forms for setup

## `/settings/calendar` - Calendar Management

**Features:**

- **Calendar List:**
  - View all calendars
  - Add new calendar
  - Edit calendar details
  - Delete calendar
  - See calendar connection status
- **Add Calendar:**
  - Create new calendar
  - Connect Cal.com calendar
  - Configure calendar settings
- **Calendar Configuration:**
  - **Availability:**
    - Set working hours
    - Configure availability schedule
    - Set timezone
  - **Event Types:**
    - Create event types
    - Edit event types
    - Delete event types
    - Configure event duration
    - Set event descriptions
- **Google Connect:**
  - Connect Google Calendar
  - OAuth authentication
  - Manage Google Calendar sync

## `/settings/profile` - User Profile

**Features:**

- View user profile information
- Edit profile details
- Update account settings
- Change user information

## `/settings/sdr-settings` - SDR Settings

**Features:**

- Configure SDR (Sales Development Representative) settings
- Set SDR preferences
- Manage SDR configuration
- Configure sales development tools

## `/settings/members` - Team Members

**Features:**

- View all team members
- Add new team member
- Edit member details
- Delete member
- Manage member permissions
- Set member roles
- View member information
- Filter and search members
- Export member list

## `/settings/embeddings` - Embedding Scripts

**Features:**

- View embedding code/widget code
- Copy installation script
- Get embed code for website
- Configure embedding settings
- View installation instructions

## `/config` - General Configuration

**Features:**

- General system configuration
- Configure system settings
- Manage app-wide settings
