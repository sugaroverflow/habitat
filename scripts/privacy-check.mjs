import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([".git", ".next", "node_modules"]);
const textExtensions = new Set([
  ".css",
  ".example",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".sql",
  ".ts",
  ".tsx",
]);
const imageExtensions = new Set([".jpeg", ".jpg", ".png", ".webp"]);
const failures = [];

const contentRules = [
  ["UK postcode", /\b(?:GIR\s?0AA|(?:[A-PR-UWYZ][0-9][0-9A-HJKSTUW]?|[A-PR-UWYZ][A-HK-Y][0-9][0-9ABEHMNPRVWXY]?)\s?[0-9][ABD-HJLNP-UW-Z]{2})\b/i],
  ["precise coordinates", /\b-?(?:[1-8]?\d\.\d{4,}|90\.0+)\s*,\s*-?(?:1[0-7]\d\.\d{4,}|180\.0+|\d?\d\.\d{4,})\b/],
  ["numbered street address", /\b\d{1,5}[a-z]?(?!\s+(?:grid|flex)\s+place\b)\s+(?:[a-z][a-z'’-]*\s+){1,4}(?:street|road|lane|avenue|close|court|drive|gardens|place|square|yard)\b/i],
  ["numbered home unit", /\b(?:flat|apartment|unit)\s*(?:number|no\.?|#)?\s*[a-z]?\d+[a-z]?\b/i],
  ["email address", /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i],
];

const forbiddenJsonFields = /"(?:home_address|delivery_address|postcode|postal_code|latitude|longitude|coordinates)"\s*:/i;
const forbiddenSqlColumns = /^\s*(?:home_address|delivery_address|postcode|postal_code|latitude|longitude|coordinates)\s+[a-z]/im;
const unsafeDirectories = ["private", "raw", "unredacted", "chatgpt-export", "chatgpt-exports"];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignoredDirectories.has(entry.name)) return [];
    const absolute = join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

for (const unsafeDirectory of unsafeDirectories) {
  if (existsSync(join(root, unsafeDirectory))) {
    failures.push(`unsafe source directory: ${unsafeDirectory}`);
  }
}

for (const file of walk(root)) {
  const path = relative(root, file);
  const extension = extname(file).toLowerCase();
  const lowerPath = path.toLowerCase();

  if (/unredacted|delivery[-_ ]?screenshot|chatgpt[-_ ]?export/.test(lowerPath)) {
    failures.push(`unsafe filename: ${path}`);
  }

  if (textExtensions.has(extension) || path === ".env.example") {
    const content = readFileSync(file, "utf8");
    for (const [label, rule] of contentRules) {
      if (rule.test(content)) failures.push(`${label} found in ${path}`);
    }

    if (
      (extension === ".sql" && forbiddenSqlColumns.test(content))
      || (path.endsWith("seed.json") && forbiddenJsonFields.test(content))
    ) {
      failures.push(`forbidden home-location field found in ${path}`);
    }

    if (!path.endsWith(".example") && /\b(?:sk-proj-|sk-svcacct-|sb_secret_)[A-Za-z0-9_-]+/.test(content)) {
      failures.push(`secret-like value found in ${path}`);
    }
  }

  if (imageExtensions.has(extension)) {
    try {
      const metadata = execFileSync("identify", ["-verbose", file], { encoding: "utf8" });
      if (/^\s*(?:exif:|xmp:|iptc:|profile-exif|profile-xmp)/im.test(metadata)) {
        failures.push(`embedded metadata found in ${path}`);
      }
    } catch {
      failures.push(`image could not be inspected: ${path}`);
    }
  }
}

const publicMedia = join(root, "public", "media");
if (!existsSync(publicMedia) || !statSync(publicMedia).isDirectory()) {
  failures.push("public media directory is missing");
}

if (failures.length) {
  console.error("Privacy check failed:");
  for (const failure of [...new Set(failures)]) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Privacy check passed.");
