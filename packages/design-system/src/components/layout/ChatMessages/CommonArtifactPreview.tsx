import { ArtifactPreviewEnum } from '@neuraltrade/core/types/artifact';
import Typography from '../../Typography';
import { useTextTruncation } from '../../../hooks/useTextTruncation';
import TooltipWrapperDark from '../../Tooltip/TooltipWrapperDark';
import { ARTIFACT_CONFIG } from '../../../utils/constant';
import { AccessibleDiv } from '../../accessibility';

type CommonArtifactPreviewProps = {
  artifactType: keyof typeof ArtifactPreviewEnum;
  title?: string;
  isFetching: boolean;
  handleClick: () => void;
};

const CommonArtifactPreview = ({ title, isFetching, artifactType, handleClick }: CommonArtifactPreviewProps) => {
  const { header, icon: Icon } = ARTIFACT_CONFIG[artifactType];
  const { textRef, isTextTruncated } = useTextTruncation({
    text: title ?? '',
  });

  return (
    <AccessibleDiv
      onClick={handleClick}
      className="flex w-full max-w-[424px] items-center gap-2 rounded-lg border border-gray-300 bg-transparent_gray_3 p-2 pr-4 ring-system hover:bg-transparent_gray_6"
    >
      <div className="flex items-center justify-center rounded-lg bg-transparent_gray_3 p-1">
        <Icon className="text-gray-600" height={18} width={18} />
      </div>
      {isFetching ? (
        <div className="h-10 w-full animate-pulse rounded-lg bg-gray-400" />
      ) : (
        <div className="flex flex-1 items-center gap-2 text-left">
          <Typography variant="body-14" textColor="gray400">{`${header}: `}</Typography>
          <TooltipWrapperDark
            tooltipSide="top"
            tooltipAlign="end"
            tooltipSideOffsetValue={15}
            tooltipAlignOffsetValue={-50}
            showArrow={false}
            trigger={
              <>
                {title && (
                  <Typography
                    ref={textRef}
                    className="2xl:text-md line-clamp-1 break-all"
                    variant="label-14-medium"
                    textColor="textPrimary"
                  >
                    {title}
                  </Typography>
                )}
              </>
            }
            showTooltip={isTextTruncated}
            content={<p>{title}</p>}
          />
        </div>
      )}
    </AccessibleDiv>
  );
};

export default CommonArtifactPreview;
