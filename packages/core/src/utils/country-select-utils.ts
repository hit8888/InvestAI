import * as RPNInput from 'react-phone-number-input';
type CountryEntry = { label: string; value: RPNInput.Country | undefined };
import countryAliases from './country-aliases.json';

const MIN_SEARCH_LENGTH_FOR_INCLUDES = 3;

const smartFilterCountries = (countryEntry: CountryEntry, search: string): boolean => {
  if (!search) return true;

  const searchLower = search.toLowerCase().trim();
  const { label: countryName, value: countryCode } = countryEntry;

  if (!countryCode || !countryName) return false;

  // Get calling code for this country
  let callingCode = '';

  // 1. Match country code directly (e.g., "US" matches United States)
  if (countryCode.toLowerCase() === searchLower) {
    return true;
  }

  // 2. Match calling code with or without + (e.g., "+91" or "91" matches India)
  // Also support prefix matching (e.g., "9" matches "+91")
  try {
    callingCode = RPNInput.getCountryCallingCode(countryCode);
    if (callingCode) {
      // Exact match with or without +
      if (searchLower === `+${callingCode}` || searchLower === callingCode) {
        return true;
      }
      // Prefix match without + (e.g., "9" matches "+91", "1" matches "+1")
      // Prefix match with + (e.g., "+9" matches "+91")
      const searchWithoutPlus = searchLower.startsWith('+') ? searchLower.slice(1) : searchLower;
      if (callingCode.startsWith(searchWithoutPlus)) {
        return true;
      }
    }
  } catch {
    /* empty */
  }

  // 3. Match aliases and abbreviations first (higher priority)
  const aliases = countryAliases[countryCode as keyof typeof countryAliases] || [];
  if (aliases.some((alias) => alias.toLowerCase().includes(searchLower))) {
    return true;
  }

  // 4. Match words at the beginning of country name words (e.g., "uni" matches "United States")
  const words = countryName.toLowerCase().split(' ');
  for (const word of words) {
    if (word.startsWith(searchLower)) {
      return true;
    }
  }

  // 5. Match anywhere in country name as last resort, but only for longer searches (3+ chars)
  if (searchLower.length >= MIN_SEARCH_LENGTH_FOR_INCLUDES && countryName.toLowerCase().includes(searchLower)) {
    return true;
  }

  return false;
};

export const filterCountries = (countryList: CountryEntry[]) => {
  const countryMap = new Map(countryList.map((entry) => [entry.label, entry]));

  return (value: string, search: string) => {
    // This function is called by the Command component
    // Find the actual country entry from the list to get the country code
    const countryEntry = countryMap.get(value);
    if (!countryEntry) return 0;

    return smartFilterCountries(countryEntry, search) ? 1 : 0;
  };
};
