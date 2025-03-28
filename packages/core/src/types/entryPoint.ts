import { z } from 'zod';

export const EntryPointAlignment = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
} as const;

export const EntryPointAlignmentSchema = z.enum([
  EntryPointAlignment.LEFT,
  EntryPointAlignment.CENTER,
  EntryPointAlignment.RIGHT,
]);

export type EntryPointAlignmentType = z.infer<typeof EntryPointAlignmentSchema>;
