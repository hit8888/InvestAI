import { BlockType } from '@meaku/core/types/admin/api';
import { CalendarDays, MessageCircle, FileText, Users, Percent, TvMinimalPlay } from 'lucide-react';
import React from 'react';
import AskAiIcon from '../../../assets/askai-icon.png';

interface BlockUIConfig {
  icon: React.ReactNode;
  description: string;
  separatorColor: string; // Now stores hex color value
}

/**
 * Maps block types to their UI configurations
 * @param type - The block type
 * @returns UI configuration including icon and description
 */
export const getBlockUIConfig = (type: BlockType): BlockUIConfig => {
  const configs: Record<BlockType, BlockUIConfig> = {
    ASK_AI: {
      icon: <img alt="askai icon" src={AskAiIcon} className="h-14 w-14 object-cover" />,
      description: 'Core conversational AI block for customer interactions.',
      separatorColor: '#4E46DC', // breakout primary color
    },
    BOOK_MEETING: {
      icon: <CalendarDays className="h-6 w-6 text-gray-600" />,
      description: 'Let visitors schedule time with your team.',
      separatorColor: '#EC4A0A', // orange_sec-1000
    },
    SUMMARIZE: {
      icon: <FileText className="h-6 w-6 text-gray-600" />,
      description: 'Auto-generate summaries of page content.',
      separatorColor: '#DCADFC', // rose_sec-1000
    },
    VIDEO_LIBRARY: {
      icon: <TvMinimalPlay className="h-6 w-6 text-gray-600" />,
      description: 'Showcase videos to inform and convert.',
      separatorColor: '#DD2590', // pink_sec-1000
    },
    TALK_TO_HUMAN: {
      icon: <Users className="h-6 w-6 text-gray-600" />,
      description: 'Connect users with a live team member.',
      separatorColor: '#2E90FA', // blue_sec-1000
    },
    IFRAME: {
      icon: <Percent className="h-6 w-6 text-gray-600" />,
      description: 'Let users explore product features live.',
      separatorColor: '#12B76A', // positive-1000
    },
    DEMO_LIBRARY: {
      icon: <TvMinimalPlay className="h-6 w-6 text-gray-600" />,
      description: 'Showcase demos to inform and convert.',
      separatorColor: '#DD2590', // pink_sec-1000
    },
  };

  return (
    configs[type] || {
      icon: <MessageCircle className="h-6 w-6 text-blue-600" />,
      description: 'AI-powered block for customer engagement.',
      separatorColor: '#4E46DC', // default to primary color
    }
  );
};

/**
 * Converts block is_active status to card status
 * @param isActive - Whether the block is active
 * @returns Card status ('published' or 'unpublished')
 */
export const getBlockCardStatus = (isActive: boolean): 'published' | 'unpublished' => {
  return isActive ? 'published' : 'unpublished';
};

/**
 * Formats block type for display
 * @param type - The block type
 * @returns Human-readable block type
 */
export const formatBlockType = (type: BlockType): string => {
  return type
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export const BLOCK_ICONS: Record<BlockType, { icon: React.ReactNode }> = {
  ASK_AI: {
    icon: <img alt="askai icon" src={AskAiIcon} className="h-14 w-14 object-cover" />,
  },
  BOOK_MEETING: {
    icon: <CalendarDays className="h-6 w-6 text-gray-600" />,
  },
  SUMMARIZE: {
    icon: <FileText className="h-6 w-6 text-gray-600" />,
  },
  VIDEO_LIBRARY: {
    icon: <TvMinimalPlay className="h-6 w-6 text-gray-600" />,
  },
  TALK_TO_HUMAN: {
    icon: <Users className="h-6 w-6 text-gray-600" />,
  },
  IFRAME: {
    icon: <Percent className="h-6 w-6 text-gray-600" />,
  },
  DEMO_LIBRARY: {
    icon: <TvMinimalPlay className="h-6 w-6 text-gray-600" />,
  },
};

export const SECTION_READY_TO_DISPLAY_CONTENT = {
  VIDEO_LIBRARY: {
    pathToKnowledgeBase: 'agent/knowledge-base/videos',
    header: 'Videos ready to display',
    subHeader:
      'These videos will be shown to visitors in the Video Library block. To manage or edit your videos, go to the Knowledge Base.',
    chipLabel: 'Video',
    noVideosMessage: 'No videos uploaded yet',
    noVideosDescription:
      'To activate the Video Library block, you need to upload at least one video to your Knowledge Base.',
  },
  DEMO_LIBRARY: {
    pathToKnowledgeBase: 'agent/knowledge-base',
    header: 'Demos experiences ready to display',
    subHeader:
      'These interactive demos will be shown in the Demo Widget block. To manage or edit your demos, go to the Knowledge Base.',
    chipLabel: 'Interactive Demo',
    noVideosMessage: 'No demos found',
    noVideosDescription:
      'To activate this block, add at least one demo link to the Knowledge Base. Each demo should include a title and short description',
  },
};

// Types for CTA data structure
export interface CTAData {
  id: string;
  icon: string;
  name: string;
  action: 'trigger_form' | 'redirect_url' | '';
  formValue?: string; // For trigger_form action
  urlValue?: string; // For redirect_url action
}

export interface CTABlockPreview {
  icon: string;
  name: string;
}

export interface AskAICallToActionsSectionProps {
  initialData?: CTAData[] | undefined;
  onChange?: (data: CTAData[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

// Action options for the dropdown
export const ACTION_OPTIONS = [
  { value: 'trigger_form', label: 'Trigger a form' },
  { value: 'redirect_url', label: 'Redirect to URL' },
];

// Form options for trigger_form action
export const FORM_OPTIONS = [
  { value: 'contact_form', label: 'Contact Information form' },
  { value: 'demo_form', label: 'Demo Request form' },
  { value: 'support_form', label: 'Support form' },
];

// URL validation regex
export const URL_REGEX = /^https?:\/\/.+\..+/;

// Validation helper functions
export const isValidURL = (url: string): boolean => {
  if (!url || url.trim() === '') return false;
  return URL_REGEX.test(url);
};

export const isValidCTA = (cta: CTAData): boolean => {
  // Basic required fields
  if (!cta.name || cta.name.trim() === '') return false;
  if (!cta.action) return false;

  // Validate based on action type
  if (cta.action === 'trigger_form') {
    return !!cta.formValue && cta.formValue !== '';
  }

  if (cta.action === 'redirect_url') {
    return !!cta.urlValue && isValidURL(cta.urlValue);
  }

  return false;
};

// Individual CTA Item Component
export interface CTAItemProps {
  cta: CTAData;
  index: number;
  onUpdate: (id: string, updates: Partial<CTAData>) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}
