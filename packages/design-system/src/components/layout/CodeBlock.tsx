import { useState } from 'react';
import { Check, ClipboardCopy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  title?: string;
  maxHeight?: string;
}

const CodeBlock = ({ code, language = 'html', showLineNumbers = true, title, maxHeight = '500px' }: CodeBlockProps) => {
  const [isCopied, setIsCopied] = useState(false);

  // Function to handle copying code to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  // Function to render code with line numbers
  const renderCodeWithLineNumbers = (code: string) => {
    const lines = code.split('\n');

    return lines.map((line, index) => (
      <div key={index} className="flex">
        {showLineNumbers && (
          <span className="mr-4 inline-block w-8 flex-shrink-0 select-none text-right text-gray-400">{index + 1}</span>
        )}
        <span className="flex-1">{line}</span>
      </div>
    ));
  };

  return (
    <div className="mb-4 w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-200">
      {/* Header with language badge and copy button */}
      <div className="flex items-center justify-between border-b border-gray-300 bg-gray-200 px-4 py-2">
        <div className="flex items-center">
          {title && <span className="mr-2 text-black">{title}</span>}
          <span className="rounded bg-gray-200 px-2 py-1 font-mono text-xs text-black">{language}</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="rounded p-1 transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Copy code to clipboard"
        >
          {isCopied ? (
            <Check size={16} className="text-green-400" />
          ) : (
            <ClipboardCopy size={16} className="text-gray-400" />
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-auto p-4 font-mono text-sm" style={{ maxHeight }}>
        <pre className="text-green-600">
          <code>{renderCodeWithLineNumbers(code)}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
