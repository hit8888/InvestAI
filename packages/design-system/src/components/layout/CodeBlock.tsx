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

  // Simple syntax highlighting function
  const highlightCode = (code: string, language: string) => {
    // Split code into lines for line numbers

    if (language === 'html') {
      const lines = code.split(' ');
      return lines.map((line, i) => {
        const startsWithAngleBracket = line.trim().startsWith('&lt;') || line.trim().startsWith('&gt;');
        const formattedLine = startsWithAngleBracket ? line : ` ${line}`;

        return (
          <div key={i} className="flex  whitespace-pre">
            {showLineNumbers && (
              <span className="mr-4 inline-block w-8 flex-shrink-0 select-none text-right text-gray-400">{i + 1}</span>
            )}
            <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
          </div>
        );
      });
    }

    const lines = code.split('\n');

    // For other languages, at least show line numbers
    return lines.map((line, i) => (
      <div key={i} className="flex">
        {showLineNumbers && <span className="mr-4 inline-block w-8 select-none text-right text-gray-400">{i + 1}</span>}
        <span>{line}</span>
      </div>
    ));
  };

  // Prepare code for display
  const preparedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');

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
        <pre className="text-green-600">{highlightCode(preparedCode, language)}</pre>
      </div>
    </div>
  );
};

export default CodeBlock;
