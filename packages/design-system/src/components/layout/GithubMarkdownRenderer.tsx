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

const reactMarkdownComponents: Partial<Components> = {
  a: MessageLink,
  strong: MessageStrong,
  li: MessageListItem,
  ul: MessageUnorderedList,
};

const GithubMarkdownRenderer = ({ markdown }: { markdown: string }) => {
  return (
    <ReactMarkdown remarkPlugins={[gfm]} components={reactMarkdownComponents}>
      {markdown}
    </ReactMarkdown>
  );
};

export default GithubMarkdownRenderer;
