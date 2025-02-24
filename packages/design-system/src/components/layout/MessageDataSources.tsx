import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@breakout/design-system/components/layout/accordion';
import { cn } from '@breakout/design-system/lib/cn';
import FaviconImage from '@breakout/design-system/components/layout/favicon-image';
import { DataSourceType } from '@meaku/core/types/webSocketData';
import { Badge } from '@breakout/design-system/components/layout/badge';

interface IProps {
  dataSources: DataSourceType[];
}

function truncateToPercentage(number: number) {
  return (Math.floor(number * 10000) / 100).toString();
}

const MessageDataSources = (props: IProps) => {
  const { dataSources } = props;

  const totalDocuments = dataSources.length;

  if (totalDocuments <= 0) {
    return null;
  }

  return (
    <div className="my-2 w-full rounded-xl border bg-primary-foreground bg-opacity-50 backdrop-blur-lg">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="sources" className="border-none">
          <AccordionTrigger className={'px-3 py-2 text-primary-textColor'}>Show sources:</AccordionTrigger>
          <AccordionContent className="!pb-0">
            <div>
              {dataSources
                .filter((dataSource) => dataSource.url)
                .map((doc, idx) => (
                  <div
                    key={doc.id}
                    className={cn(
                      'mx-3 my-1 flex items-center gap-4 rounded-xl border bg-primary-foreground/50 px-2 py-2',
                    )}
                  >
                    <Badge variant={'outline'} className={'rounded-full text-primary-textColor'}>
                      {idx + 1}
                    </Badge>
                    <div className="flex flex-1 items-center justify-between">
                      {!!doc.url && (
                        <>
                          <a
                            href={doc.url}
                            target="_blank"
                            className="block max-w-[8ch] overflow-hidden truncate overflow-ellipsis text-primary underline 2xl:max-w-[20ch]"
                            title={doc.title || doc.data_source_name || doc.url}
                          >
                            {doc.title || doc.data_source_name || doc.url}
                          </a>
                          <div className="flex items-center gap-3">
                            {!!doc.similarity_score && (
                              <p className="font-medium">
                                SS: <span className="text-primary">{truncateToPercentage(doc.similarity_score)}%</span>
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

export default MessageDataSources;
