"use client";

/**
 * Centralised icon exports - backed by @hugeicons/core-free-icons.
 * All icons accept the same props: size, className, strokeWidth, color.
 * `primaryColor` defaults to "currentColor" so Tailwind text-* classes
 * (which set the CSS `color` property) are inherited automatically.
 */

import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import {
  Home01Icon,
  Search01Icon,
  Bookmark01Icon,
  BookmarkCheck01Icon,
  Download01Icon,
  File01Icon,
  SlidersHorizontalIcon,
  Menu01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  UserIcon as UserIconData,
  Cancel01Icon,
  Tick01Icon,
  SparklesIcon as SparklesIconData,
  GridIcon,
  ChartUpIcon,
  LinkSquare01Icon,
  FilterIcon as FilterIconData,
  GridIcon as LayoutGridIconData,
  BookOpen01Icon,
  EyeIcon as EyeIconData,
} from "@hugeicons/core-free-icons";

type IconProps = Pick<
  HugeiconsIconProps,
  "size" | "className" | "strokeWidth" | "color"
>;

function make(iconData: HugeiconsIconProps["icon"]) {
  const Icon = ({ size = 16, className, strokeWidth = 1.75, color, ...rest }: IconProps) => (
    <HugeiconsIcon
      icon={iconData}
      size={size}
      strokeWidth={strokeWidth}
      primaryColor={color ?? "currentColor"}
      className={className}
      {...rest}
    />
  );
  return Icon;
}

export const Home        = make(Home01Icon);
export const Search      = make(Search01Icon);
export const Bookmark    = make(Bookmark01Icon);
export const BookmarkCheck = make(BookmarkCheck01Icon);
export const Download    = make(Download01Icon);
export const FileText    = make(File01Icon);
export const SlidersHorizontal = make(SlidersHorizontalIcon);
export const Menu        = make(Menu01Icon);
export const ArrowLeft   = make(ArrowLeft01Icon);
export const ArrowRight  = make(ArrowRight01Icon);
export const User        = make(UserIconData);
export const X           = make(Cancel01Icon);
export const Check       = make(Tick01Icon);
export const Sparkles    = make(SparklesIconData);
export const LayoutGrid  = make(GridIcon);
export const TrendingUp  = make(ChartUpIcon);
export const ExternalLink = make(LinkSquare01Icon);
export const Filter      = make(FilterIconData);
export const BookOpen    = make(BookOpen01Icon);
export const Eye         = make(EyeIconData);
