import { Markdown } from '@neuraltrade/saral';

export const TextArtifact = ({ content }: { content: string }) => {
  if (!content) return null;

  return <Markdown markdown={content} />;
};
