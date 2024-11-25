import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@breakout/design-system/components/layout/accordion';
import ChevronIcon from '@breakout/design-system/components/icons/chevron';
import { cn } from '@breakout/design-system/lib/cn';
import FaviconImage from '@breakout/design-system/components/layout/favicon-image';
import { DataSourceType } from '@meaku/core/types/chat';

interface IProps {
  documents: DataSourceType[];
}

const MessageSources = (props: IProps) => {
  const { documents } = props;

  const totalDocuments = documents.length;

  return (
    <div className="w-full">
      <Accordion type="single" collapsible>
        <AccordionItem value="sources" className="border-0 border-none">
          <AccordionTrigger className="w-full px-4 py-1 hover:no-underline [&[data-state=open]_svg]:!-rotate-0">
            <div className="flex w-full items-center justify-between">
              <h4 className="text-x[13px] font-medium text-gray-700">Show sources:</h4>
              <div className="flex items-center justify-center rounded-lg bg-primary/20 p-[1px] transition-colors duration-300 ease-in-out hover:bg-primary/30">
                <ChevronIcon className="h-7 w-7 rotate-180 transform text-primary transition-transform duration-300" />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="!pb-0">
            <div className="bg-primary/20">
              {documents.map((doc, idx) => (
                <div
                  key={doc.id}
                  className={cn('flex items-center gap-4 px-4 py-2', {
                    'border-b border-primary/30': idx !== totalDocuments - 1,
                  })}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white">
                    <p className="text-sm font-medium text-gray-700">{idx + 1}</p>
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    {!!doc.url && (
                      <>
                        <a
                          href={doc.url}
                          target="_blank"
                          className="block max-w-[18ch] overflow-hidden truncate overflow-ellipsis whitespace-nowrap text-primary underline md:max-w-[25ch] xl:max-w-[35ch]"
                          title={doc.title || doc.data_source_name || doc.url}
                        >
                          {doc.title || doc.data_source_name || doc.url}
                        </a>
                        <div className="flex items-center gap-3">
                          {!!doc.similarity_score && (
                            <p className="font-medium">
                              Similarity Score: <span className="text-primary">{doc.similarity_score}</span>
                            </p>
                          )}
                          <FaviconImage url={doc.url} className="h-4 w-4" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MessageSources;
