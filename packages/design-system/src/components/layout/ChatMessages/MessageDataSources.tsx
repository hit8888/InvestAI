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
import { ViewType } from '@meaku/core/types/common';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

interface IProps {
  dataSources: DataSourceType[];
  viewType: ViewType;
}

function truncateToPercentage(number: number) {
  const value = Math.round(number * 100 * 10) / 10;
  return value % 1 === 0 ? value.toString() : value.toFixed(1).toString();
}

const MessageDataSources = (props: IProps) => {
  const { dataSources, viewType } = props;
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const totalDocuments = dataSources.length;

  const handleDataSourceClick = (doc: DataSourceType) => {
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DATA_SOURCE_CLICKED, {
      url: doc.url,
      title: doc.title || doc.data_source_name || doc.url,
    });
  };

  if (totalDocuments <= 0) {
    return null;
  }

  return (
    <div className="w-full rounded-xl border bg-primary-foreground bg-opacity-50 backdrop-blur-lg">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="sources" className="border-none px-3">
          <AccordionTrigger className={'text-customPrimaryText'}>Show sources:</AccordionTrigger>
          <AccordionContent className="w-full !pb-0">
            <div className="flex w-full flex-col gap-2 pb-2">
              {dataSources
                .filter((dataSource) => dataSource.url)
                .map((doc, idx) => (
                  <div
                    key={doc.id}
                    className={cn(
                      'flex w-full items-center gap-4 rounded-xl border bg-primary-foreground/50 px-2 py-2',
                    )}
                  >
                    <Badge variant={'outline'} className={'rounded-full text-customPrimaryText'}>
                      {idx + 1}
                    </Badge>
                    {!!doc.url && (
                      <div className="flex w-full items-center justify-between">
                        <a
                          href={doc.url}
                          target="_blank"
                          className={cn('line-clamp-1 max-w-[60%] text-primary underline', {
                            'max-w-[80%]': viewType === ViewType.DASHBOARD,
                          })}
                          title={doc.title || doc.data_source_name || doc.url}
                          onClick={() => handleDataSourceClick(doc)}
                        >
                          {doc.title || doc.data_source_name || doc.url}
                        </a>
                        <div className="flex items-center justify-start gap-2">
                          {!!doc.similarity_score && (
                            <p className="font-medium">
                              SS: <span className="text-primary">{truncateToPercentage(doc.similarity_score)}%</span>
                            </p>
                          )}
                          <FaviconImage url={doc.url} className="h-4 w-4" />
                        </div>
                      </div>
                    )}
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
