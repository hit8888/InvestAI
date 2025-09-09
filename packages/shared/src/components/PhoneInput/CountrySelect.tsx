import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { useMemo, useState } from 'react';
import { filterCountries } from '@meaku/core/utils/country-select-utils';

import {
  Button,
  cn,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from '@meaku/saral';
import { useShadowRoot } from '../../containers/ShadowRootProvider';

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

export const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const [searchValue, setSearchValue] = useState('');
  const { root: shadowRoot } = useShadowRoot();

  const selectedCountryCode = useMemo(() => {
    return RPNInput.getCountryCallingCode(countryList.find(({ value }) => value === selectedCountry)?.value ?? 'US');
  }, [countryList, selectedCountry]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="flex h-10 gap-2 rounded-e-none rounded-s-lg border-none bg-card hover:bg-card px-3"
          disabled={disabled}
        >
          <FlagComponent country={selectedCountry} countryName={selectedCountry} />
          <span className="text-sm text-[#9CA3AF] font-medium">{`+${selectedCountryCode}`}</span>
          <ChevronDownIcon
            className={cn('-mr-2 size-4 opacity-50 text-[#9CA3AF]', disabled ? 'hidden' : 'opacity-100')}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        portalContainer={shadowRoot}
        className="border-primary-300 relative left-8 w-[300px] rounded-lg border bg-white py-4"
      >
        <Command shouldFilter={true} filter={(value: string) => filterCountries(countryList)(value, searchValue)}>
          <CommandInput
            className="pl-2 py-1 focus:ring-2 focus:ring-gray-200"
            containerClassName="shadow-sm border-none px-1"
            showSearchIcon={false}
            placeholder="Search by country, code, or +code (e.g., US, UK, +91)..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>
                No country found. Try searching by country name, code (US, UK), or calling code (+91, +1).
              </CommandEmpty>
              <CommandGroup>
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={onChange}
                    />
                  ) : null,
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
}

const CountrySelectOption = ({ country, countryName, selectedCountry, onChange }: CountrySelectOptionProps) => {
  const isSelectedCountry = country === selectedCountry;

  return (
    <CommandItem
      value={countryName}
      className={`my-2 cursor-pointer gap-2 hover:!bg-[#E8E8E8] hover:!text-black data-[selected=true]:!bg-[#E8E8E8] data-[selected=true]:!text-black 
        ${isSelectedCountry ? '!bg-[#E8E8E8] !text-black' : ''}`}
      onSelect={() => onChange(country)}
    >
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <CheckIcon className={`ml-auto size-4 ${isSelectedCountry ? 'opacity-100' : 'opacity-0'}`} />
      <span
        className={`text-sm ${isSelectedCountry ? 'text-black' : 'text-foreground/50'}`}
      >{`+${RPNInput.getCountryCallingCode(country)}`}</span>
    </CommandItem>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
