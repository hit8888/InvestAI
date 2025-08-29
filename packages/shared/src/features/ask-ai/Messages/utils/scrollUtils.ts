export const checkScrollPosition = (
  scrollContainer: HTMLDivElement | null,
  setShowDownArrow: (show: boolean) => void,
): void => {
  if (!scrollContainer) return;

  const scrollTop = scrollContainer.scrollTop;
  const scrollHeight = scrollContainer.scrollHeight;
  const clientHeight = scrollContainer.clientHeight;

  // Show arrow if there's more content below (within 2px threshold for very responsive detection)
  const hasMoreContent = scrollTop + clientHeight < scrollHeight - 2;
  setShowDownArrow(hasMoreContent);
};

export const scrollToBottom = (scrollContainer: HTMLDivElement | null): void => {
  if (!scrollContainer) return;

  scrollContainer.scrollTo({
    top: scrollContainer.scrollHeight,
    behavior: 'smooth',
  });
};

export const scrollToElement = (
  scrollContainer: HTMLDivElement | null,
  selector: string,
  block: ScrollLogicalPosition = 'start',
): void => {
  if (!scrollContainer) return;

  const element = scrollContainer.querySelector(selector);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block,
    });
  }
};
