import SourcesUrlLinkIcon from '@breakout/design-system/components/icons/sources-url-link-icon';
import Input from '@breakout/design-system/components/layout/input';
import { cn } from '@breakout/design-system/lib/cn';

type URLLinkInputProps = {
  inputValue: string;
  classname?: string;
  placeholder?: string;
  error?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onInputFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const URLLinkInput = ({
  inputValue,
  onInputChange,
  onInputBlur,
  onInputFocus,
  onKeyDown,
  classname,
  error,
  placeholder = 'Enter video URL and press Enter',
}: URLLinkInputProps) => {
  return (
    <div className="relative w-full">
      <SourcesUrlLinkIcon width="16" height="16" className="absolute left-4 top-3.5 text-gray-400" />
      <Input
        className={cn(
          'h-11 w-full flex-1 rounded-lg border py-3 pl-10 pr-4 text-blue_sec-1000 outline-none transition-all',
          error
            ? 'border-destructive-600 bg-destructive-25 focus:border-destructive-600 focus:ring-4 focus:ring-red-100'
            : 'border-gray-300 bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-200',
          classname,
        )}
        value={inputValue}
        onChange={onInputChange}
        onBlur={onInputBlur}
        onFocus={onInputFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? 'url-error' : undefined}
      />
      {error && (
        <p id="url-error" className="mt-1.5 text-sm text-destructive-1000" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default URLLinkInput;
