import ReactMarkdown, { Components, Options } from 'react-markdown';
import gfm from 'remark-gfm';

export const MessageH1 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1 className="mb-2 text-2xl font-semibold text-foreground" {...props} />
);

export const MessageH2 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className="mb-2 text-xl font-semibold text-foreground" {...props} />
);

export const MessageH3 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className="mb-2 text-lg font-semibold text-foreground" {...props} />
);

export const MessageH4 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h4 className="mb-2 text-base font-semibold text-foreground" {...props} />
);

export const MessageH5 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h5 className="mb-2 text-sm font-semibold text-foreground" {...props} />
);

export const MessageH6 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h6 className="mb-2 text-xs font-semibold text-foreground" {...props} />
);

export const MessageLink = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a className="text-link break-all underline" target="_blank" rel="noreferrer" {...props} />
);

export const MessageStrong = (props: React.HTMLAttributes<HTMLElement>) => (
  <strong className="font-semibold text-foreground" {...props} />
);

export const MessageListItem = (props: React.HTMLAttributes<HTMLLIElement>) => (
  <li className="font-inherit mb-2 text-inherit [&:only-child]:mb-0" {...props} />
);

export const MessageUnorderedList = (props: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className="my-0 h-fit w-full list-disc pl-6" {...props} />
);

export const MessageParagraph = (props: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className="mb-2 text-inherit [&:empty]:mb-0 [&:last-child]:mb-0 [&:only-child]:mb-0" {...props} />
);

export const MessageBlockquote = (props: React.HTMLAttributes<HTMLQuoteElement>) => (
  <blockquote
    className="my-3 rounded-md border-l-4 border-gray-300 bg-gray-50 px-4 py-3 italic text-gray-700"
    {...props}
  />
);

export const MessageTable = (props: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="my-3 w-full overflow-x-auto">
    <table className="w-full table-auto border-collapse text-left text-sm" {...props} />
  </div>
);

export const MessageThead = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className="bg-gray-100 text-gray-900" {...props} />
);

export const MessageTbody = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className="divide-y divide-gray-200" {...props} />
);

export const MessageTr = (props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className="even:bg-gray-50" {...props} />
);

export const MessageTh = (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className="border border-gray-200 px-3 py-2 font-semibold" {...props} />
);

export const MessageTd = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className="border border-gray-200 px-3 py-2 align-top text-gray-800" {...props} />
);

export const DEFAULT_REACT_MARKDOWN_COMPONENTS: Partial<Components> = {
  h1: MessageH1,
  h2: MessageH2,
  h3: MessageH3,
  h4: MessageH4,
  h5: MessageH5,
  h6: MessageH6,
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
  img: () => null,
};

interface MarkdownProps extends Options {
  markdown: string;
}

const Markdown = ({ markdown, ...props }: MarkdownProps) => {
  return (
    <ReactMarkdown remarkPlugins={[gfm]} components={DEFAULT_REACT_MARKDOWN_COMPONENTS} {...props}>
      {markdown}
    </ReactMarkdown>
  );
};

export default Markdown;
