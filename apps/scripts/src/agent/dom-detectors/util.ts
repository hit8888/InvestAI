export const hasEmail = (str: string) => {
  return /email/i.test(str);
};

export const hasName = (str: string) => {
  return /name/i.test(str);
};
