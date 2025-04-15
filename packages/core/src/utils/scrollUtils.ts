export const scrollIntoViewWithOptions = (
  element: HTMLElement | null,
  options: ScrollIntoViewOptions = {
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest',
  },
) => {
  if (element) {
    element.scrollIntoView(options);
  }
};
