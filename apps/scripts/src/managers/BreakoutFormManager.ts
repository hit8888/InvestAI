type BreakoutFormManagerProps = {
  onFormSubmit: (formId: string, message: string) => void;
};

export function BreakoutFormManager({
  onFormSubmit,
}: BreakoutFormManagerProps) {
  const handleFormSubmit = (e: Event): void => {
    const form = e.target as HTMLFormElement;
    if (!form.hasAttribute("data-breakout-form")) {
      return;
    }
    e.preventDefault();

    const input = form.querySelector<HTMLInputElement>('input[type="text"]');
    if (!input) {
      return;
    }
    const message = input.value.trim();

    if (message) {
      onFormSubmit?.(form.id, message);
    }
    input.value = "";
  };

  const setupFormEventListeners = (): void => {
    window.addEventListener("submit", handleFormSubmit);
  };

  const removeFormEventListeners = (): void => {
    window.removeEventListener("submit", handleFormSubmit);
  };

  return {
    setupFormEventListeners,
    removeFormEventListeners,
  };
}
