export type RoomId =
  | "living_room"
  | "dining_area"
  | "bedroom"
  | "office"
  | "hallway"
  | "bathroom"
  | "kitchen";

export type ItemStatus =
  | "saved"
  | "considering"
  | "shortlisted"
  | "favourite"
  | "ordered"
  | "shipped"
  | "arrived"
  | "returned"
  | "rejected";

export type MeasurementConfidence = "measured" | "approximate" | "needed";

export interface InspirationRecord {
  id: string;
  title: string;
  image: string;
  source: "personal-board" | "pinterest" | "reference";
  sourceUrl?: string;
  roomId: RoomId | null;
  tags: string[];
  whatILike: string[];
  notNecessarily: string[];
  status: "inbox" | "reviewed" | "applied";
}

export interface ConversationPreview {
  id: string;
  title: string;
  date: string;
  summary: string;
  topics: string[];
  importStatus: "summary_seed_only" | "sanitized";
}

export interface NavItem {
  label: string;
  href: string;
}
