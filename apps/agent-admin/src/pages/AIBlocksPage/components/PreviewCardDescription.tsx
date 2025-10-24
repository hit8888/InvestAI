import GithubMarkdownRenderer from '@breakout/design-system/components/layout/GithubMarkdownRenderer';

const PreviewCardDescription = ({ description }: { description: string }) => {
  // Handle newlines appropriately:
  // - Single newlines become markdown line breaks (two spaces + newline)
  // - Multiple newlines (paragraph breaks) are preserved
  const processedDescription = description
    .replace(/\n{2,}/g, '\n\n') // Normalize multiple newlines to double newlines
    .split('\n\n') // Split by paragraph breaks
    .map(
      (paragraph) =>
        paragraph
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .join('  \n'), // Two spaces + newline for markdown line breaks within paragraphs
    )
    .filter((paragraph) => paragraph.length > 0)
    .join('\n\n'); // Rejoin paragraphs with double newlines

  return (
    <div className="flex w-full flex-col items-start gap-2 px-4 text-sm">
      <GithubMarkdownRenderer markdown={processedDescription} />
    </div>
  );
};

export default PreviewCardDescription;
