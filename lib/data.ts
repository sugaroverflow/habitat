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

const corePalette = {
  softSage: { name: "soft sage", value: "#99B4AA" },
  olive: { name: "olive", value: "#6B6D43" },
  gardenOchre: { name: "garden ochre", value: "#ABA66F" },
  fadedCoral: { name: "faded coral", value: "#CF7D65" },
  shellPink: { name: "shell pink", value: "#E1B8A2" },
  warmCream: { name: "warm cream", value: "#F2DEC7" },
} as const;

export const ROOM_PALETTES: Record<RoomId, Array<{ name: string; value: string }>> = {
  living_room: [
    corePalette.softSage,
    corePalette.olive,
    corePalette.gardenOchre,
    corePalette.fadedCoral,
    corePalette.shellPink,
    corePalette.warmCream,
  ],
  dining_area: [
    corePalette.warmCream,
    corePalette.shellPink,
    corePalette.fadedCoral,
    corePalette.gardenOchre,
    corePalette.softSage,
  ],
  bedroom: [
    corePalette.warmCream,
    corePalette.shellPink,
    corePalette.fadedCoral,
    corePalette.softSage,
    corePalette.olive,
  ],
  office: [
    corePalette.warmCream,
    corePalette.softSage,
    corePalette.shellPink,
    corePalette.fadedCoral,
    corePalette.olive,
  ],
  hallway: [
    corePalette.warmCream,
    corePalette.softSage,
    corePalette.olive,
    corePalette.gardenOchre,
    corePalette.shellPink,
  ],
  bathroom: [
    corePalette.olive,
    corePalette.softSage,
    corePalette.warmCream,
    corePalette.fadedCoral,
    corePalette.shellPink,
  ],
  kitchen: [
    corePalette.warmCream,
    corePalette.gardenOchre,
    corePalette.softSage,
    corePalette.olive,
    corePalette.fadedCoral,
  ],
};

export const ROOM_DESCRIPTIONS: Record<RoomId, string> = {
  living_room: "A soft, layered room for movie nights, books, plants, art, and one deliberately strange glowing object.",
  dining_area: "A distinct dining nook anchored by a round ornamental rug, pale sculptural furniture, and its own floral lighting moment.",
  bedroom: "A calm bedroom with romantic shapes, a pink-and-floral direction, and practical storage that does not crowd the king bed.",
  office: "The working and gaming layer of the bedroom, with cleaner storage around the white steel desk and a sharper graphic edge.",
  hallway: "A sage-and-warm-wood landing zone with separate places for coats, seating, closed storage, a playful mirror, and a washable runner.",
  bathroom: "A green-led bathroom with consistent hardware, soft contrast, and one strong botanical pattern.",
  kitchen: "Keep the existing kitchen quiet and warm, then add useful objects and small amounts of colour instead of a full restyle.",
};

export const ROOM_PLANS: Record<RoomId, string[]> = {
  living_room: ["two-level oak console", "gallery TV wall", "dining-side bookcase", "weird glowing lamp"],
  dining_area: ["Maru oak table", "cream and oak seating", "Adeline sage round rug", "pink floral pendant"],
  bedroom: ["pink Evelyn direction", "floral rug", "low bedroom storage", "coloured bedside tables"],
  office: ["white steel desk", "closed storage", "graphic art", "pink and cyan light"],
  hallway: ["sage coat zone", "sculptural bench", "painted BESTÅ hack", "wavy mirror and runner"],
  bathroom: ["mineral green", "blue floral runner", "pure-finish hardware", "wallpaper detail"],
  kitchen: ["warm cream", "pale wood", "jade accents", "clear worktops"],
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
    id: "pin_living_365002744825655216",
    title: "Built-in timber TV wall with books and objects",
    image: "/media/inspiration/pin-001.webp",
    source: "pinterest",
    sourceUrl: "https://www.pinterest.com/pin/365002744825655216/",
    roomId: "living_room",
    tags: ["TV wall", "timber", "built-in storage"],
    whatILike: [],
    notNecessarily: [],
    status: "inbox",
  },
  {
    id: "pin_living_365002744825655212",
    title: "Low timber TV cabinet with tall shelving",
    image: "/media/inspiration/pin-002.webp",
    source: "pinterest",
    sourceUrl: "https://www.pinterest.com/pin/365002744825655212/",
    roomId: "living_room",
    tags: ["TV storage", "low cabinet", "shelving"],
    whatILike: [],
    notNecessarily: [],
    status: "inbox",
  },
  {
    id: "pin_living_365002744825707388",
    title: "Art TV above layered vintage storage",
    image: "/media/inspiration/pin-003.webp",
    source: "pinterest",
    sourceUrl: "https://www.pinterest.com/pin/365002744825707388/",
    roomId: "living_room",
    tags: ["art TV", "vintage storage", "plants"],
    whatILike: [],
    notNecessarily: [],
    status: "inbox",
  },
  {
    id: "pin_living_365002744825601679",
    title: "Colourful gallery wall around a low TV unit",
    image: "/media/inspiration/pin-004.webp",
    source: "pinterest",
    sourceUrl: "https://www.pinterest.com/pin/365002744825601679/",
    roomId: "living_room",
    tags: ["gallery wall", "colour", "TV unit"],
    whatILike: [],
    notNecessarily: [],
    status: "inbox",
  },
  {
    id: "pin_living_direct_9d6249",
    title: "Layered gallery wall framing the television",
    image: "/media/inspiration/pin-005.webp",
    source: "pinterest",
    sourceUrl: "https://i.pinimg.com/1200x/9d/62/49/9d6249595a9db5f30c8a2ed2c1f1ea8e.jpg",
    roomId: "living_room",
    tags: ["gallery wall", "television", "plants"],
    whatILike: [],
    notNecessarily: [],
    status: "inbox",
  },
  {
    id: "pin_living_365002744825707396",
    title: "Art-led television wall with low modular storage",
    image: "/media/inspiration/pin-006.webp",
    source: "pinterest",
    sourceUrl: "https://www.pinterest.com/pin/365002744825707396/",
    roomId: "living_room",
    tags: ["art wall", "TV storage", "low furniture"],
    whatILike: [],
    notNecessarily: [],
    status: "inbox",
  },
  {
    id: "pin_living_365002744825447464",
    title: "Floral bordered rug reference",
    image: "/media/inspiration/pin-007.webp",
    source: "pinterest",
    sourceUrl: "https://www.pinterest.com/pin/365002744825447464/",
    roomId: "living_room",
    tags: ["rug", "floral border", "pastel"],
    whatILike: [],
    notNecessarily: [],
    status: "inbox",
  },
  {
    id: "pin_hallway_365002744825655245",
    title: "Entry bench with shoe storage and wall hooks",
    image: "/media/inspiration/pin-008.webp",
    source: "pinterest",
    sourceUrl: "https://www.pinterest.com/pin/365002744825655245/",
    roomId: "hallway",
    tags: ["entry bench", "shoe storage", "hooks"],
    whatILike: [],
    notNecessarily: [],
    status: "inbox",
  },
  {
    id: "pin_hallway_365002744825655289",
    title: "Minimal timber peg rail for an entryway",
    image: "/media/inspiration/pin-009.webp",
    source: "pinterest",
    sourceUrl: "https://www.pinterest.com/pin/365002744825655289/",
    roomId: "hallway",
    tags: ["peg rail", "entryway", "timber"],
    whatILike: [],
    notNecessarily: [],
    status: "inbox",
  },
  {
    id: "pin_hallway_365002744825589151",
    title: "Pale timber entry storage with open shoe cubbies",
    image: "/media/inspiration/pin-010.webp",
    source: "pinterest",
    sourceUrl: "https://www.pinterest.com/pin/365002744825589151/",
    roomId: "hallway",
    tags: ["shoe storage", "pale timber", "entryway"],
    whatILike: [],
    notNecessarily: [],
    status: "inbox",
  },
  {
    id: "pin_hallway_365002744825722825",
    title: "Blue entry console with art and warm lighting",
    image: "/media/inspiration/pin-011.webp",
    source: "pinterest",
    sourceUrl: "https://www.pinterest.com/pin/365002744825722825/",
    roomId: "hallway",
    tags: ["blue console", "entryway art", "warm lighting"],
    whatILike: [],
    notNecessarily: [],
    status: "inbox",
  },
  {
    id: "pin_dining_365002744825448071",
    title: "Dining nook with a soft pink rug",
    image: "/media/inspiration/pin-012.webp",
    source: "pinterest",
    sourceUrl: "https://www.pinterest.com/pin/365002744825448071/",
    roomId: "dining_area",
    tags: ["dining nook", "pink rug", "warm neutral"],
    whatILike: [],
    notNecessarily: [],
    status: "inbox",
  },
  {
    id: "pin_dining_365002744825722811",
    title: "Round dining table over a green rug",
    image: "/media/inspiration/pin-013.webp",
    source: "pinterest",
    sourceUrl: "https://www.pinterest.com/pin/365002744825722811/",
    roomId: "dining_area",
    tags: ["round table", "green rug", "dining nook"],
    whatILike: [],
    notNecessarily: [],
    status: "inbox",
  },
  {
    id: "pin_dining_365002744825588932",
    title: "Curved timber dining chair with a pale upholstered seat",
    image: "/media/inspiration/pin-014.webp",
    source: "pinterest",
    sourceUrl: "https://www.pinterest.com/pin/365002744825588932/",
    roomId: "dining_area",
    tags: ["dining chair", "curved timber", "upholstery"],
    whatILike: [],
    notNecessarily: [],
    status: "inbox",
  },
  {
    id: "pin_bedroom_365002744825448008",
    title: "Full-length arched timber mirror",
    image: "/media/inspiration/pin-015.webp",
    source: "pinterest",
    sourceUrl: "https://www.pinterest.com/pin/365002744825448008/",
    roomId: "bedroom",
    tags: ["full-length mirror", "arched mirror", "timber"],
    whatILike: [],
    notNecessarily: [],
    status: "inbox",
  },
  {
    id: "pin_bedroom_365002744825651855",
    title: "Calm upholstered bed with light layered curtains",
    image: "/media/inspiration/pin-016.webp",
    source: "pinterest",
    sourceUrl: "https://www.pinterest.com/pin/365002744825651855/",
    roomId: "bedroom",
    tags: ["upholstered bed", "layered curtains", "calm bedroom"],
    whatILike: [],
    notNecessarily: [],
    status: "inbox",
  },
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

export const pendingMeasurements: Array<{ id: string; label: string; roomId: string }> = [];

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
