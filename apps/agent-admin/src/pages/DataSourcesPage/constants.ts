export const KNOWLEDGE_SOURCES_TITLE = 'Knowledge Sources';
export const ARTIFACTS_SOURCES_TITLE = 'Artifacts';
export const DEMO_ASSETS_SOURCES_TITLE = 'Demo Assets';

export const WEBPAGES_TITLE = 'Webpages';
export const DOCUMENTS_TITLE = 'Documents';
export const VIDEO_TITLE = 'Videos';
export const SLIDES_TITLE = 'Slides';
export const FEATURES_TITLE = 'Features';

export enum SourcesCardTypes {
  WEBPAGES = 'webpages',
  DOCUMENTS = 'documents',
  VIDEOS = 'videos',
  SLIDES = 'slides',
  FEATURES = 'features',
}

export enum SourcesUploadStatus {
  UPLOADED = 'UPLOADED',
  UPLOAD_IN_PROGRESS = 'UPLOAD_IN_PROGRESS',
}

export const SOURCES_DIALOG_DESCRIPTION_MAPPED_OBJECT = {
  [SourcesCardTypes.WEBPAGES]:
    'Drop in the top-level link on your website — website, blog, help center, whatever you’ve got. We’ll grab all the sub-links along with the content.',
  [SourcesCardTypes.DOCUMENTS]:
    'Upload one or more documents to use them as data sources for your assistant. Supported file types include text, spreadsheets, presentations, and more',
  [SourcesCardTypes.VIDEOS]: 'Upload one or more videos to use them as visual guides or demos inside your assistant.',
  [SourcesCardTypes.SLIDES]:
    'Upload one or more slides to use them as visual materials or presentations inside your assistant.',
};

export const DIALOG_LOADING_MESSAGE_MAPPED_OBJECT = {
  [SourcesCardTypes.WEBPAGES]: 'Crawling your website… This may take a few moments depending on the number of pages.',
  [SourcesCardTypes.DOCUMENTS]: 'Please wait while we process your files. It’ll only take a moment.',
  [SourcesCardTypes.VIDEOS]: 'This may take a few moments depending on the file size and number of uploads.',
  [SourcesCardTypes.SLIDES]: 'Processing your slides… This may take a few moments depending on the number of pages.',
};

export const DIALOG_DEFAULT_MESSAGE_MAPPED_OBJECT = {
  [SourcesCardTypes.WEBPAGES]:
    'Once you enter a valid URL and start fetching, all discovered links will appear here automatically.',
  [SourcesCardTypes.DOCUMENTS]: 'Accepted formats: PDF',
  [SourcesCardTypes.VIDEOS]: 'Accepted formats: MP4, MOV, WebM',
  [SourcesCardTypes.SLIDES]: 'Accepted formats: PDF, PPTX, PNG',
};

export const DATA_SOURCES_ACCEPTED_FILE_TYPES = {
  [SourcesCardTypes.DOCUMENTS]: {
    'application/pdf': ['.pdf'], // TODO: can keep the comment for future reference
    // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    // 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    // 'text/plain': ['.txt'],
    // 'text/csv': ['.csv'],
  },
  [SourcesCardTypes.VIDEOS]: {
    'video/mp4': ['.mp4'],
    'video/quicktime': ['.mov'],
    'video/webm': ['.webm'],
  },
  [SourcesCardTypes.SLIDES]: {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    'image/png': ['.png'],
  },
};

export const FILE_TYPES_NOT_ACCEPTED_ERROR_TOAST_MESSAGE = {
  [SourcesCardTypes.DOCUMENTS]:
    'This file format isn’t supported. Please upload a Document in PDF, DOCX, XLSX, PPTX, TXT, CSV format.',
  [SourcesCardTypes.VIDEOS]: 'This file format isn’t supported. Please upload a video in MP4, MOV, or WebM format.',
  [SourcesCardTypes.SLIDES]: 'This file format isn’t supported. Please upload a slide in PDF or PPTX format.',
};

export const DATA_SOURCES_WEBPAGES_COLUMN_LISTS = ['url', 'title', 'status', 'updated_on'];

export const DATA_SOURCES_WEBPAGES_COLUMN_HEADER_LABEL_MAPPING = {
  url: 'Page URL',
  title: 'Title',
  updated_on: 'Last Updated',
  status: 'Status',
};

export const enum DATA_SOURCE_STATUS {
  PENDING = 'PENDING',
  CRAWLING = 'CRAWLING',
  CRAWLED = 'CRAWLED',
  CLEANING = 'CLEANING',
  CLEANED = 'CLEANED',
  VECTORIZED = 'VECTORIZED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  AI_LABELING_SCHEDULED = 'AI_LABELING_SCHEDULED',
  IMAGE_ANALYSIS_IN_PROGRESS = 'IMAGE_ANALYSIS_IN_PROGRESS',
  TRANSCRIBING_VIDEO = 'TRANSCRIBING_VIDEO',
  VIDEO_TRANSCRIBED = 'VIDEO_TRANSCRIBED',
  VIDEO_TEXT_ANALYSIS_IN_PROGRESS = 'VIDEO_TEXT_ANALYSIS_IN_PROGRESS',
  LABELLED = 'LABELLED',
  VECTORIZATION_SCHEDULED = 'VECTORIZATION_SCHEDULED',
  VECTORIZING = 'VECTORIZING',
}

export const DATA_SOURCES_DOCUMENTS_COLUMN_LISTS = [
  'name',
  'data_source_type',
  'status',
  'updated_on',
  // 'source_url',
];

export const DATA_SOURCES_DOCUMENTS_COLUMN_HEADER_LABEL_MAPPING = {
  name: 'Documents',
  data_source_type: 'File Type',
  updated_on: 'Last Updated',
  status: 'Status',
  source_url: 'Source URL',
};

export const DATA_SOURCES_VIDEOS_COLUMN_LISTS = ['asset', 'data', 'duration', 'status', 'updated_on'];

export const DATA_SOURCES_VIDEOS_COLUMN_HEADER_LABEL_MAPPING = {
  asset: 'Videos',
  data: 'Description',
  duration: 'Duration',
  status: 'Status',
  updated_on: 'Last Updated',
};

export const DATA_SOURCES_SLIDES_COLUMN_LISTS = ['asset', 'data', 'status', 'updated_on'];

export const DATA_SOURCES_SLIDES_COLUMN_HEADER_LABEL_MAPPING = {
  asset: 'Slides',
  data: 'Description',
  status: 'Status',
  updated_on: 'Last Updated',
};

export const DATA_SOURCES_COMMON_COLUMN_LISTS = {
  webpages: DATA_SOURCES_WEBPAGES_COLUMN_LISTS,
  documents: DATA_SOURCES_DOCUMENTS_COLUMN_LISTS,
  videos: DATA_SOURCES_VIDEOS_COLUMN_LISTS,
  slides: DATA_SOURCES_SLIDES_COLUMN_LISTS,
};

export const DATA_SOURCES_COMMON_COLUMN_HEADER_LABEL_MAPPING = {
  webpages: DATA_SOURCES_WEBPAGES_COLUMN_HEADER_LABEL_MAPPING,
  documents: DATA_SOURCES_DOCUMENTS_COLUMN_HEADER_LABEL_MAPPING,
  videos: DATA_SOURCES_VIDEOS_COLUMN_HEADER_LABEL_MAPPING,
  slides: DATA_SOURCES_SLIDES_COLUMN_HEADER_LABEL_MAPPING,
};
