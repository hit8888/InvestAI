import ReactMarkdown, { Components } from 'react-markdown';
import gfm from 'remark-gfm';

const MessageLink = (props: React.LinkHTMLAttributes<HTMLAnchorElement>) => (
  <a className="break-all text-blue_sec-1000" {...props} target="_blank" rel="noreferrer" />
);

const MessageStrong = (props: React.HTMLAttributes<HTMLElement>) => (
  <strong className="text-primary-textColor" {...props} />
);

const MessageListItem = (props: React.HTMLAttributes<HTMLLIElement>) => (
  <li className="my-1 ml-4 list-disc" {...props} />
);

const MessageUnorderedList = (props: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className="my-0 h-fit w-full" {...props} />
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
  blockquote: MessageBlockquote,
  table: MessageTable,
  thead: MessageThead,
  tbody: MessageTbody,
  tr: MessageTr,
  th: ({ children, ...props }) => (children ? <MessageTh {...props}>{children}</MessageTh> : null),
  td: ({ children, ...props }) => (children ? <MessageTd {...props}>{children}</MessageTd> : null),
};

const GithubMarkdownRenderer = ({ markdown }: { markdown: string }) => {
  return (
    <ReactMarkdown remarkPlugins={[gfm]} components={reactMarkdownComponents}>
      {markdown}
    </ReactMarkdown>
  );
};

export default GithubMarkdownRenderer;
