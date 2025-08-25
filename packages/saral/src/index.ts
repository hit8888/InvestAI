// Export all components
export { Button, buttonVariants } from './button';
export type { ButtonProps } from './button';

// Export input component
export { Input } from './input';
export type { InputProps } from './input';

// Export popover components
export { Popover, PopoverTrigger, PopoverContent } from './popover';

// Export dropdown components
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
} from './dropdown';

// Export command components
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command';

// Export dialog components
export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from './dialog';
export type { DialogProps } from './dialog';

// Export tooltip components
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipArrow } from './tooltip';

// Export scroll area components
export { ScrollArea, ScrollBar } from './scroll-area';

// Export custom icons
export { KatyIcon } from './custom-Icons/Katy';
// Export form components
export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, useForm } from './form';
export type { UseFormReturnType } from './form';

// Export select components
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './select';

// Export inline select components
export {
  InlineSelect,
  InlineSelectTrigger,
  InlineSelectValue,
  InlineSelectContent,
  InlineSelectItem,
} from './inline-select';

// Export label components
export { default as Label } from './label';

// Export card components
export * from './card-blocks';

// Export typography components
export { default as Typography } from './typography';
export { typographyVariants } from './typography';

// Export video artifact component
export { VideoArtifact } from './video-artifact';
export type { VideoArtifactProps } from './video-artifact';

// Export image artifact component
export { ImageArtifact } from './image-artifact';
export type { ImageArtifactProps } from './image-artifact';

// Export side drawer component
export { default as SideDrawer } from './side-drawer';
export type { SideDrawerProps, SideDrawerPosition } from './side-drawer';

// Export custom icons
export * from './custom-Icons';

// Export all Lucide React icons as a namespace
import * as LucideIcons from 'lucide-react';
export const Icons = LucideIcons;

// Also export individual icons for direct import
export {
  Wand,
  PhoneCall,
  Video,
  Calendar,
  FileText,
  MessageCircle,
  Phone,
  Settings,
  Plus,
  X,
  Search,
  Menu,
  Home,
  User,
  Heart,
  Star,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Download,
  Upload,
  Trash2,
  Edit,
  Copy,
  Check,
  AlertCircle,
  Info,
} from 'lucide-react';

// Export utilities
export { cn, cva } from './utils';

// Export types
export type { AvatarComponentProps } from './types';

// Export markdown component
export { default as Markdown } from './markdown';

// Export all avatar components
export {
  Avatar1,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
  Avatar6,
  Avatar7,
  Avatar8,
  Avatar9,
  Avatar10,
  Avatar11,
  Avatar12,
  Avatar13,
  Avatar14,
  Avatar15,
  Avatar16,
  Avatar17,
  Avatar18,
  Avatar19,
} from './avatars';
