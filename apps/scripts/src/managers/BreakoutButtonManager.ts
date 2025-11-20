type BreakoutButtonManagerProps = {
  onButtonClick: (button: HTMLElement, message: string | null) => void;
};

export function BreakoutButtonManager({
  onButtonClick,
}: BreakoutButtonManagerProps) {
  const handleButtonClick = (e: Event): void => {
    const target = e.target as HTMLElement;
    const button = target.closest<HTMLElement>("[data-breakout-button]");

    if (!button) {
      return;
    }

    const message = button.getAttribute("data-breakout-message") || null;
    e.preventDefault();

    onButtonClick?.(button, message);
  };

  const setupButtonEventListeners = (): void => {
    window.addEventListener("click", handleButtonClick);
  };

  const removeButtonEventListeners = (): void => {
    window.removeEventListener("click", handleButtonClick);
  };

  return {
    setupButtonEventListeners,
    removeButtonEventListeners,
  };
}
