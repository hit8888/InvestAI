import ReactMarkdown, { Components, Options } from 'react-markdown';
import gfm from 'remark-gfm';

const MessageLink = (props: React.LinkHTMLAttributes<HTMLAnchorElement>) => (
  <a className="text-link break-all underline" {...props} target="_blank" rel="noreferrer" />
);

const MessageStrong = (props: React.HTMLAttributes<HTMLElement>) => (
  <strong className="font-semibold text-foreground" {...props} />
);

const MessageListItem = (props: React.HTMLAttributes<HTMLLIElement>) => (
  <li className="font-inherit mb-2 text-inherit [&:only-child]:mb-0" {...props} />
);

const MessageUnorderedList = (props: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className="my-0 h-fit w-full list-disc pl-6" {...props} />
);

const MessageParagraph = (props: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className="mb-2 text-inherit [&:empty]:mb-0 [&:last-child]:mb-0 [&:only-child]:mb-0" {...props} />
);

const MessageBlockquote = (props: React.HTMLAttributes<HTMLQuoteElement>) => (
  <blockquote
    className="my-3 rounded-md border-l-4 border-gray-300 bg-gray-50 px-4 py-3 italic text-gray-700"
    {...props}
  />
);

const MessageTable = (props: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="my-3 w-full overflow-x-auto">
    <table className="w-full table-auto border-collapse text-left text-sm" {...props} />
  </div>
);

const MessageThead = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className="bg-gray-100 text-gray-900" {...props} />
);

const MessageTbody = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className="divide-y divide-gray-200" {...props} />
);

const MessageTr = (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr className="even:bg-gray-50" {...props} />;

const MessageTh = (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className="border border-gray-200 px-3 py-2 font-semibold" {...props} />
);

const MessageTd = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className="border border-gray-200 px-3 py-2 align-top text-gray-800" {...props} />
);

const reactMarkdownComponents: Partial<Components> = {
  a: MessageLink,
  strong: MessageStrong,
  li: MessageListItem,
  ul: MessageUnorderedList,
  p: MessageParagraph,
  blockquote: MessageBlockquote,
  table: MessageTable,
  thead: MessageThead,
  tbody: MessageTbody,
  tr: MessageTr,
  th: ({ children, ...props }) => (children != null ? <MessageTh {...props}>{children}</MessageTh> : null),
  td: ({ children, ...props }) => (children != null ? <MessageTd {...props}>{children}</MessageTd> : null),
};

interface MarkdownProps extends Options {
  markdown: string;
}

const Markdown = ({ markdown, ...props }: MarkdownProps) => {
  return (
    <ReactMarkdown remarkPlugins={[gfm]} components={reactMarkdownComponents} {...props}>
      {markdown}
    </ReactMarkdown>
  );
};

export default Markdown;
