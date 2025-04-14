import { FormSubmissionConfigType, ProspectRequestData } from "../types";
import { submitProspect } from "./api";
import { hasEmail, hasName } from "./util";

interface ElementData {
  value: string | FileList | null;
  elementType: string;
}

interface FormMeta {
  id: string;
  name: string;
}

interface FormSubmissionData {
  formMeta: FormMeta;
  formData: Record<string, ElementData>;
}

export function initFormSubmissionDetection({
  track_form_submissions,
}: FormSubmissionConfigType) {
  if (track_form_submissions) {
    detectFormSubmissions();
    detectProgrammaticSubmissions();
    watchForNewForms();
  }
}

function detectFormSubmissions() {
  const forms = document.querySelectorAll("form");
  forms.forEach(attachFormListener);
}

function detectProgrammaticSubmissions() {
  const originalSubmit = HTMLFormElement.prototype.submit;

  HTMLFormElement.prototype.submit = function (this: HTMLFormElement): void {
    processFormSubmission(this);
    return originalSubmit.apply(this);
  };
}

function watchForNewForms() {
  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation: MutationRecord) => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node: Node) => {
          // if the added node is a form
          if (node instanceof HTMLFormElement) {
            attachFormListener(node);
          }

          // if the added node contains forms
          else if (node instanceof Element && node.querySelectorAll) {
            const newForms: NodeListOf<HTMLFormElement> =
              node.querySelectorAll("form");
            newForms.forEach(attachFormListener);
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function attachFormListener(form: HTMLFormElement) {
  form.addEventListener("submit", (event) => {
    // form submission may not actually happen
    // due to failing validations on form.
    // we are skipping capturing of such data
    if (event.defaultPrevented) {
      return;
    }

    processFormSubmission(form);
  });
}

function processFormSubmission(form: HTMLFormElement) {
  // form fields may not have names, hence it is ncessary to
  // iterate over all elements and collect form data
  const allFormData: Record<string, ElementData> = {};
  const formElements: NodeListOf<HTMLElement> = form.querySelectorAll(
    "input, select, textarea, button",
  );

  formElements.forEach((element: HTMLElement, formElementIndex: number) => {
    const acceptedFormElementKinds = [
      HTMLInputElement,
      HTMLSelectElement,
      HTMLTextAreaElement,
      HTMLButtonElement,
    ];

    if (
      !acceptedFormElementKinds.some(
        (elementKind) => element instanceof elementKind,
      )
    ) {
      return;
    }

    if (
      (element instanceof HTMLButtonElement && element.type !== "submit") ||
      (element instanceof HTMLInputElement && element.type === "button")
    ) {
      return;
    }

    // Use id, name, or generate an identifier
    let key: string =
      (element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)
        .name || element.id;
    if (!key) {
      const elementType: string =
        (element as HTMLInputElement).type || "default";
      key = `unnamed_element_${element.tagName.toLowerCase()}_${elementType}_${formElementIndex}`;
    }

    // Handle different types of form elements
    if (element instanceof HTMLInputElement) {
      if (
        (element.type === "checkbox" || element.type === "radio") &&
        !element.checked
      ) {
        return;
      } else if (element.type === "file" || element.type === "button") {
        return;
      } else if (element.type === "password") {
        allFormData[key] = {
          value: "*****",
          elementType: element.type,
        };
      } else {
        allFormData[key] = {
          value: element.value,
          elementType: element.type,
        };
      }
    } else if (element instanceof HTMLSelectElement) {
      allFormData[key] = {
        value: element.value,
        elementType: "select",
      };
    } else if (element instanceof HTMLTextAreaElement) {
      allFormData[key] = {
        value: element.value,
        elementType: "textarea",
      };
    }
  });

  const formMeta = {
    id: form.id,
    name: form.name,
  };

  const submissionData: FormSubmissionData = {
    formMeta,
    formData: allFormData,
  };

  handleFormSubmission(submissionData);
}

function handleFormSubmission(submissionData: FormSubmissionData) {
  const { formData, formMeta } = submissionData;
  const formDataKeys = Object.keys(formData);
  const emailField = formDataKeys.find(hasEmail);
  const nameField = formDataKeys.find(hasName);

  const requestData = {
    prospect_demographics: submissionData,
    external_id: formMeta.id || formMeta.name,
    origin: "WEB_FORM",
  } as ProspectRequestData;

  if (emailField) {
    requestData.email = formData[emailField].value as string;
  }

  if (nameField) {
    requestData.name = formData[nameField].value as string;
  }

  submitProspect(requestData);
}
