import { hasEmail, hasName } from './util';
import type { UpdateProspectPayload } from '../../../types/api/update_prospect_request';

export function detectFormSubmissions(onSubmit: (requestData: UpdateProspectPayload) => void) {
  const listeners = new Map<HTMLFormElement, (event: Event) => void>();

  const forms = document.querySelectorAll('form');
  forms.forEach((form) => attachFormListener(form, onSubmit, listeners));

  // Return cleanup function
  return () => {
    listeners.forEach((handler, form) => {
      form.removeEventListener('submit', handler);
    });
    listeners.clear();
  };
}

// function detectProgrammaticSubmissions() {
//   const originalSubmit = HTMLFormElement.prototype.submit;

//   HTMLFormElement.prototype.submit = function (this: HTMLFormElement): void {
//     processFormSubmission(this);
//     return originalSubmit.apply(this);
//   };
// }

export function watchForNewForms(onSubmit: (requestData: UpdateProspectPayload) => void) {
  const listeners = new Map<HTMLFormElement, (event: Event) => void>();

  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation: MutationRecord) => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node: Node) => {
          // if the added node is a form
          if (node instanceof HTMLFormElement) {
            attachFormListener(node, onSubmit, listeners);
          }

          // if the added node contains forms
          else if (node instanceof Element && node.querySelectorAll) {
            const newForms: NodeListOf<HTMLFormElement> = node.querySelectorAll('form');
            newForms.forEach((form) => attachFormListener(form, onSubmit, listeners));
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Return cleanup function
  return () => {
    observer.disconnect();
    listeners.forEach((handler, form) => {
      form.removeEventListener('submit', handler);
    });
    listeners.clear();
  };
}

function attachFormListener(
  form: HTMLFormElement,
  onSubmit: (requestData: UpdateProspectPayload) => void,
  listeners: Map<HTMLFormElement, (event: Event) => void>,
) {
  // Create the submit handler
  const submitHandler = (event: Event) => {
    // form submission may not actually happen
    // due to failing validations on form.
    // we are skipping capturing of such data
    if (event.defaultPrevented) {
      return;
    }

    processFormSubmission(form, onSubmit);
  };

  // Store the listener reference for cleanup
  listeners.set(form, submitHandler);

  form.addEventListener('submit', submitHandler);
}

function processFormSubmission(form: HTMLFormElement, onSubmit: (requestData: UpdateProspectPayload) => void) {
  // form fields may not have names, hence it is ncessary to
  // iterate over all elements and collect form data
  const allFormData: Record<string, string> = {};
  const formElements: NodeListOf<HTMLElement> = form.querySelectorAll('input, select, textarea, button');

  formElements.forEach((element: HTMLElement, formElementIndex: number) => {
    const acceptedFormElementKinds = [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement, HTMLButtonElement];

    if (!acceptedFormElementKinds.some((elementKind) => element instanceof elementKind)) {
      return;
    }

    if (
      (element instanceof HTMLButtonElement && element.type !== 'submit') ||
      (element instanceof HTMLInputElement && element.type === 'button') ||
      (element instanceof HTMLInputElement && element.type === 'hidden')
    ) {
      return;
    }

    // Use id, name, or generate an identifier
    let key: string = (element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).name || element.id;
    if (!key) {
      const elementType: string = (element as HTMLInputElement).type || 'default';
      key = `unknown_element_${element.tagName.toLowerCase()}_${elementType}_${formElementIndex}`;
    }

    // Handle different types of form elements
    if (element instanceof HTMLInputElement) {
      if ((element.type === 'checkbox' || element.type === 'radio') && !element.checked) {
        return;
      } else if (element.type === 'file' || element.type === 'button') {
        return;
      } else if (element.type === 'password') {
        allFormData[key] = '*****';
      } else {
        allFormData[key] = element.value;
      }
    } else if (element instanceof HTMLSelectElement) {
      allFormData[key] = element.value;
    } else if (element instanceof HTMLTextAreaElement) {
      allFormData[key] = element.value;
    }
  });
  handleFormSubmission(allFormData, onSubmit);
}

function handleFormSubmission(
  allFormData: Record<string, string>,
  onSubmit: (requestData: UpdateProspectPayload) => void,
) {
  const formDataKeys = Object.keys(allFormData);
  const emailField = formDataKeys.find(hasEmail);
  const nameField = formDataKeys.find(hasName);

  const requestData = {
    // origin: 'WEB_FORM',
  } as UpdateProspectPayload;

  if (allFormData) {
    requestData.prospect_demographics = allFormData;
  }

  if (emailField) {
    requestData.email = allFormData[emailField] as string;
  }

  if (nameField) {
    requestData.name = allFormData[nameField] as string;
  }
  onSubmit(requestData);
}
