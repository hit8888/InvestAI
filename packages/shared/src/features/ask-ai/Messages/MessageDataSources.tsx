import { cn, LucideIcon, Accordion, AccordionContent, AccordionItem, AccordionTrigger, Typography } from '@neuraltrade/saral';
import { DataSourceType } from '@neuraltrade/core/types/webSocketData';
import NumberUtil from '@neuraltrade/core/utils/numberUtils';

interface IProps {
  dataSources: DataSourceType[];
}

const MessageDataSources = (props: IProps) => {
  const { dataSources } = props;

  const filteredDataSources = dataSources.filter((dataSource) => dataSource.url);

  if (filteredDataSources.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border bg-background/50 backdrop-blur-lg">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="sources" className="border-none px-3">
          <AccordionTrigger className="text-foreground">
            <Typography variant="body" fontWeight="medium">
              Show sources:
            </Typography>
          </AccordionTrigger>
          <AccordionContent className="w-full !pb-0">
            <div className="flex w-full flex-col gap-2 pb-2">
              {filteredDataSources.map((doc, idx) => (
                <div
                  key={doc.id}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-xl border border-border bg-background/50 px-2 py-2',
                  )}
                >
                  <Typography
                    variant="body-small"
                    fontWeight="medium"
                    as="div"
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-border shrink-0 text-foreground"
                  >
                    {idx + 1}
                  </Typography>
                  {!!doc.url && (
                    <div className="flex w-full items-center justify-between">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn('line-clamp-1 max-w-[60%] text-primary underline')}
                        title={doc.title || doc.data_source_name || doc.url}
                      >
                        <Typography variant="body" as="span" className="underline">
                          {doc.title || doc.data_source_name || doc.url}
                        </Typography>
                      </a>
                      <div className="flex items-center justify-start gap-2">
                        {!!doc.similarity_score && (
                          <Typography variant="body-small" fontWeight="medium" className="text-foreground">
                            SS:{' '}
                            <span className="text-primary">
                              {NumberUtil.truncateToPercentage(doc.similarity_score)}%
                            </span>
                          </Typography>
                        )}
                        <LucideIcon name="globe" className="h-4 w-4 text-foreground" />
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
