type CustomPageHeaderProps = {
  headerTitle: string;
  headerIcon?: JSX.Element;
};

const CustomPageHeader = ({ headerTitle, headerIcon }: CustomPageHeaderProps) => {
  return (
    <div className="flex flex-col items-start gap-4 self-stretch">
      <div className="flex h-[51px] items-center gap-4">
        <div className="flex h-[46px] w-[46px] items-center justify-center gap-2.5 rounded-lg bg-[#F6F6FD]">
          {headerIcon}
        </div>
        <p className="font-inter text-[38px] font-semibold leading-normal tracking-[0.38px] text-[#101828]">
          {headerTitle}
        </p>
      </div>
      <div className="h-[2px] w-full bg-[#EDECFB]"></div>
    </div>
  );
};

export default CustomPageHeader;
