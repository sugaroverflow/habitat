import type { InspirationRecord, ItemStatus, RoomId } from "@/lib/domain";
import { seedData, type SeedItem } from "@/lib/seed-data";

export const ROOM_COVERS: Record<RoomId, string> = {
  living_room: "/media/rooms/room-photo-001.jpeg",
  dining_area: "/media/rooms/room-photo-011.jpeg",
  bedroom: "/media/rooms/room-photo-007.jpeg",
  office: "/media/rooms/room-photo-009.jpeg",
  hallway: "/media/rooms/room-photo-005.jpeg",
  bathroom: "/media/rooms/room-photo-006.jpeg",
  kitchen: "/media/rooms/room-photo-003.jpeg",
};

export const ROOM_PALETTES: Record<RoomId, Array<{ name: string; value: string }>> = {
  living_room: [
    { name: "sage", value: "#879779" },
    { name: "faded blush", value: "#d7aaa4" },
    { name: "cream", value: "#eee4ce" },
    { name: "jade", value: "#4f8175" },
    { name: "soft blue", value: "#9bb7c8" },
  ],
  dining_area: [
    { name: "light pink", value: "#e4bbb2" },
    { name: "warm cream", value: "#eee4ce" },
    { name: "pale wood", value: "#c8a878" },
    { name: "honey", value: "#d7a85e" },
  ],
  bedroom: [
    { name: "lavender", value: "#b7acc8" },
    { name: "powder blue", value: "#abc2cf" },
    { name: "dusty rose", value: "#cf8f91" },
    { name: "cream", value: "#eee4ce" },
  ],
  office: [
    { name: "rose", value: "#c889a1" },
    { name: "cyan", value: "#78b9bd" },
    { name: "charcoal", value: "#4e4d4a" },
    { name: "lavender", value: "#aaa0c3" },
  ],
  hallway: [
    { name: "dusty sage", value: "#899985" },
    { name: "warm wood", value: "#a77a52" },
    { name: "butter", value: "#e2c886" },
    { name: "soft blue", value: "#a7bdca" },
  ],
  bathroom: [
    { name: "mineral green", value: "#52746d" },
    { name: "soft blue", value: "#8eafc4" },
    { name: "coral", value: "#ce8474" },
    { name: "charcoal", value: "#464743" },
  ],
  kitchen: [
    { name: "warm cream", value: "#eee4ce" },
    { name: "jade", value: "#4f8175" },
    { name: "pale wood", value: "#c8a878" },
    { name: "terracotta", value: "#bc7964" },
  ],
};

export function normalizeItemStatus(item: SeedItem): ItemStatus {
  if (item.purchase_status === "arrived" || item.ownership_status === "owned") {
    return "arrived";
  }
  if (
    ["ordered", "backordered", "ordered_or_confirmed"].includes(
      item.purchase_status,
    )
  ) {
    return "ordered";
  }

  const statusMap: Record<string, ItemStatus> = {
    favourite: "favourite",
    shortlist: "shortlisted",
    considering: "considering",
    rejected: "rejected",
    rejected_due_to_lead_time: "rejected",
    purchased: "ordered",
    already_owned: "arrived",
  };
  return statusMap[item.status] ?? "saved";
}

export const inspirationRecords: InspirationRecord[] = [
  {
    id: "insp_entry_storage",
    title: "Built-in entry storage with a soft landing spot",
    image: "/media/inspiration/entryway-003.webp",
    source: "personal-board",
    roomId: "hallway",
    tags: ["storage", "curves", "pale wood"],
    whatILike: ["rounded bench", "closed storage", "shelf for small objects"],
    notNecessarily: ["exact wood tone", "full-height cabinetry"],
    status: "reviewed",
  },
  {
    id: "insp_mughal_detail",
    title: "Painted floral panels",
    image: "/media/inspiration/entryway-009.webp",
    source: "personal-board",
    roomId: null,
    tags: ["Mughal", "botanical", "arch", "ornament"],
    whatILike: ["jade outlines", "dusty florals", "layered borders"],
    notNecessarily: ["literal mural", "full-room coverage"],
    status: "applied",
  },
  {
    id: "insp_tv_display",
    title: "TV wall as a layered display",
    image: "/media/inspiration/entryway-012.webp",
    source: "personal-board",
    roomId: "living_room",
    tags: ["gallery wall", "TV storage", "plants"],
    whatILike: ["TV treated as art", "asymmetric frames", "plants and objects"],
    notNecessarily: ["white walls", "exact prints"],
    status: "reviewed",
  },
  {
    id: "insp_bathroom",
    title: "Mineral green bathroom",
    image: "/media/inspiration/entryway-013.webp",
    source: "personal-board",
    roomId: "bathroom",
    tags: ["mineral green", "runner", "illustrated wallpaper"],
    whatILike: ["mineral green walls", "blue floral runner", "charcoal tile"],
    notNecessarily: ["red ceiling", "exact wall finish"],
    status: "applied",
  },
  {
    id: "insp_green_rug",
    title: "Sage floral rug with a deep border",
    image: "/media/inspiration/entryway-005.webp",
    source: "reference",
    roomId: "living_room",
    tags: ["rug", "sage", "floral"],
    whatILike: ["ornate border", "soft greens", "small blush details"],
    notNecessarily: ["exact scale"],
    status: "reviewed",
  },
  {
    id: "insp_palette",
    title: "Soft garden palette",
    image: "/media/inspiration/entryway-007.webp",
    source: "reference",
    roomId: null,
    tags: ["palette", "blush", "sage", "cream"],
    whatILike: ["muted saturation", "warm cream base", "soft contrast"],
    notNecessarily: ["all colors in one room"],
    status: "applied",
  },
  {
    id: "insp_hallway_bench",
    title: "Slatted hallway bench",
    image: "/media/inspiration/entryway-004.webp",
    source: "personal-board",
    roomId: "hallway",
    tags: ["hallway", "bench", "shoe storage"],
    whatILike: ["full-height mirror", "open shoe storage", "warm slatted wood"],
    notNecessarily: ["exact light fitting", "wall quote"],
    status: "reviewed",
  },
  {
    id: "insp_living_storage",
    title: "Low storage with open shelves",
    image: "/media/inspiration/entryway-002.webp",
    source: "personal-board",
    roomId: "living_room",
    tags: ["storage", "art", "living room"],
    whatILike: ["closed and open storage", "large art", "soft cream finish"],
    notNecessarily: ["exact modular system"],
    status: "reviewed",
  },
  {
    id: "insp_dining_art",
    title: "Dining wall with mixed art",
    image: "/media/inspiration/entryway-001.webp",
    source: "personal-board",
    roomId: "dining_area",
    tags: ["dining", "art", "paper light"],
    whatILike: ["loose gallery wall", "paper pendant", "pale wood storage"],
    notNecessarily: ["white wall", "exact chair mix"],
    status: "reviewed",
  },
  {
    id: "insp_bedroom_rug",
    title: "Blush floral rug",
    image: "/media/inspiration/entryway-006.webp",
    source: "personal-board",
    roomId: "bedroom",
    tags: ["bedroom", "rug", "blush"],
    whatILike: ["powdery pink ground", "blue-green leaves", "ornate border"],
    notNecessarily: ["exact pattern"],
    status: "reviewed",
  },
  {
    id: "insp_office_art",
    title: "Framed art above low storage",
    image: "/media/inspiration/entryway-001.webp",
    source: "personal-board",
    roomId: "office",
    tags: ["office", "art", "storage"],
    whatILike: ["asymmetric frames", "low storage", "warm wood with blue"],
    notNecessarily: ["exact desk layout"],
    status: "reviewed",
  },
  {
    id: "insp_bathroom_palette",
    title: "Fern, bluebell, and peony",
    image: "/media/inspiration/entryway-008.webp",
    source: "personal-board",
    roomId: "bathroom",
    tags: ["bathroom", "palette", "green"],
    whatILike: ["muted fern", "bluebell", "small coral accents"],
    notNecessarily: ["every color at equal strength"],
    status: "reviewed",
  },
];

const conversationSummaryById: Record<string, string> = {
  conv_sofa:
    "Compared the Auburn benchmark with softer, modular alternatives. Comfort and a supportive back remain the deciding factors.",
  conv_modular_sofa:
    "Settled on a three-seater with chaise and footstool rather than a larger four-seater layout.",
  conv_hallway:
    "Explored long console storage, a full-length mirror, and ways to keep the narrow passage useful.",
  conv_tv:
    "Developed a two-level storage and gallery-wall direction so the TV reads as part of the display.",
  conv_bathroom:
    "Mineral Green won over Tuscan Sky. The blue and coral runner keeps the room playful without retaining the red ceiling.",
  conv_office:
    "Prioritized the work backdrop and divider shelving while keeping the bedroom side calmer.",
  conv_measurements:
    "Captured the main room spans, windows, island, heater clearance, and bedroom sliding-wall dimensions.",
};

const conversationTopicsById: Record<string, string[]> = {
  conv_sofa: ["sofa", "boucle", "comfort"],
  conv_modular_sofa: ["modular", "sofa", "boucle"],
  conv_hallway: ["hallway", "storage", "mirror"],
  conv_tv: ["TV", "storage", "gallery wall"],
  conv_bathroom: ["bathroom", "runner", "color"],
  conv_office: ["bedroom", "office", "layout"],
  conv_measurements: ["floor plan", "measurements", "clearance"],
};

export const conversationPreviews = seedData.conversation_sources.map((source) => ({
  id: source.id,
  title: source.title,
  date: source.date,
  summary:
    conversationSummaryById[source.id] ??
    "Imported conversation summary.",
  topics: conversationTopicsById[source.id] ?? source.title.toLowerCase().split(/\s+/).slice(0, 3),
  importStatus: source.import_status as "summary_seed_only",
}));

export const pendingMeasurements = [
  { id: "pending_hallway_depth", label: "Hallway console useful depth", roomId: "hallway" },
  { id: "pending_shelving", label: "Living room shelving clearance", roomId: "living_room" },
  { id: "pending_bedside", label: "Bedroom bedside clearance", roomId: "bedroom" },
] as const;

export const appData = {
  ...seedData,
  inspiration: inspirationRecords,
  conversations: conversationPreviews,
};

export function getRoom(roomId: string) {
  return seedData.rooms.find((room) => room.id === roomId) ?? null;
}

export function roomPhotos(roomId: string) {
  return seedData.assets.photos.filter((photo) => photo.room_id === roomId);
}

export function roomItems(roomId: string) {
  return seedData.items.filter((item) => item.room_id === roomId);
}

export function roomNeeds(roomId: string) {
  return seedData.needs.filter((need) => need.room_id === roomId);
}

export function roomMeasurements(roomId: string) {
  return seedData.measurements.filter((measurement) => measurement.room_id === roomId);
}

export function roomDecisions(roomId: string) {
  return seedData.decisions.filter((decision) => decision.room_id === roomId);
}

export function roomInspiration(roomId: string) {
  return inspirationRecords.filter((record) => record.roomId === roomId || record.roomId === null);
}
