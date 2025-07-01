import { getFonts } from '@meaku/core/adminHttp/api';
import { useEffect, useState } from 'react';

// TODO: Remove this once we have a proper font family list coming from api
// Top 20 most popular fonts - provided by Sachin - https://linear.app/breakout-ai/issue/ENG-2362
export const FONT_FAMILY_LIST = [
  'Roboto',
  'Open Sans',
  'Lato',
  'Noto Sans JP',
  'Montserrat',
  'Roboto Condensed',
  'Oswald',
  'Poppins',
  'Raleway',
  'Material Icons',
  'Source Sans Pro',
  'Nunito',
  'PT Sans',
  'Merriweather',
  'Playfair Display',
  'Inter',
  'Noto Sans',
  'Roboto Slab',
  'Mulish',
  'Ubuntu',
];

type FontFileSchema = {
  [key: string]: string;
};

type FontSchemaResponse = {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: FontFileSchema;
  category: string;
  kind: string;
  menu: string;
};

export const useFetchFontStyleOptions = () => {
  const [fonts, setFonts] = useState<string[]>([]);

  useEffect(() => {
    const fetchFonts = async () => {
      const fontsResponse = await getFonts({ sort: 'popularity' });
      setFonts(fontsResponse.data.items.map((font: FontSchemaResponse) => font.family));
    };
    fetchFonts();
  }, []);

  return fonts;
};
