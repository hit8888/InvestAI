import DOMPurify from 'dompurify';

/**
 * Checks for template injection patterns
 * @param input - The string to check
 * @returns true if template injection is detected
 */
const hasTemplateInjection = (input: string): boolean => {
  const templateInjectionPatterns = [
    /\{\{.*\}\}/, // Jinja2/Django templates
    /\$\{.*\}/, // JavaScript template literals
    /<%.*%>/, // PHP/ERB templates
    /\[\[.*\]\]/, // Handlebars/Mustache
    /__class__/, // Python class access
    /__mro__/, // Python method resolution order
    /__subclasses__/, // Python subclasses
    /__globals__/, // Python globals
    /__builtins__/, // Python builtins
    /__import__/, // Python import
    /eval\(/, // JavaScript eval
    /Function\(/, // JavaScript Function constructor
    /setTimeout\(/, // JavaScript setTimeout
    /setInterval\(/, // JavaScript setInterval
    /document\./, // DOM manipulation
    /window\./, // Window object access
    /process\./, // Node.js process
    /require\(/, // Node.js require
    /import\(/, // Dynamic import
    /new\s+Function/, // New Function constructor
    /\.constructor/, // Constructor access
    /\.prototype/, // Prototype access
  ];

  return templateInjectionPatterns.some((pattern) => pattern.test(input));
};

/**
 * Sanitizes a string to prevent XSS attacks and template injection
 * @param input - The string to sanitize
 * @returns The sanitized string
 */
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') {
    return input;
  }

  // Check for template injection first
  if (hasTemplateInjection(input)) {
    return ''; // Return empty string for malicious input
  }

  // Then sanitize with DOMPurify
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Remove all HTML tags
    ALLOWED_ATTR: [], // Remove all attributes
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'link'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onfocus', 'onblur'],
  });
};

/**
 * Sanitizes an object recursively to prevent XSS attacks and template injection
 * @param input - The object to sanitize
 * @returns The sanitized object
 */
export const sanitizeObject = <T>(input: T): T => {
  if (typeof input !== 'object' || input === null) {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeObject) as T;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
};

/**
 * Validates if a string contains only safe characters
 * @param input - The string to validate
 * @returns true if the string is safe
 */
export const isSafeString = (input: string): boolean => {
  if (typeof input !== 'string') {
    return true;
  }

  // Define a whitelist of safe characters
  const safePattern = /^[a-zA-Z0-9\s\-_.,!?@#$%^&*()+=:;'"<>/\\|{}[\]~`]+$/;

  return safePattern.test(input) && !hasTemplateInjection(input);
};
