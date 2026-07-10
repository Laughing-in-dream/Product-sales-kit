const catalog = window.CATALOG || { productLines: [] };
let product = catalog.productLines.find((item) => item.id === "adplus20");

const LANGS = ["zh", "en"];
const KEPT_SCENARIO_POSITIONS = new Set([1, 3, 9, 10, 11, 12]);
const CUSTOM_SCENARIO_ID = "scenario-custom";
const CUSTOM_FAMILY_ID = "custom";

const UI = {
  zh: null,
  en: {
    docTitle: "AD Plus 2.0 Solution Builder",
    heroEyebrow: "AD Plus 2.0 Wizard",
    heroTitle: "Build an AD Plus 2.0 solution step by step",
    heroIntro: "Focus on one product, guide sales or customers through the selection flow, and generate a complete list automatically.",
    heroHighlights: [
      "Show only the decision needed at the current step",
      "Auto-include required cables and related items",
      "Export a ready-to-share list at the end",
    ],
    homeCompareTitle: "Exploded Solution Preview",
    homeCompareIntro: "Below are two sample approaches based on the first home-page solution: a fully rebuilt modular version on the left and an original-image overlay version on the right.",
    homeCompareRebuild: "Option A: rebuilt modular version",
    homeCompareOverlay: "Option B: original image overlay",
    homeCompareRebuildNote: "Each module is independent, so it can be added, replaced, or reconnected later.",
    homeCompareOverlayNote: "Keeps the original visual style and highlights key modules with overlays.",
    heroNoteLabel: "What This Does",
    heroNoteTitle: "A customer-facing AD Plus 2.0 configurator",
    heroNoteBody: "This is not an internal material spreadsheet. It turns a complex sellable list into a guided selection flow.",
    prev: "Previous",
    next: "Next",
    stay: "Stay on summary",
    exportCsv: "Export CSV",
    exportJson: "Export JSON",
    summaryStep: "Summary",
    summaryTitle: "Current Build List",
    stepLabel: "STEP",
    emptyPreview: "No preview available",
    noPartNumber: "No part number",
    noneSelected: "Not selected",
    notNeeded: "No extension cable",
    installImpact: "The system matches one extension cable by default. Removing it may affect installation.",
    lockedCable: "This item requires the cable and it has been locked automatically.",
    chooseLength: "Choose based on installation distance",
    locked: "Locked automatically",
    lengthAndPart: "Cable length / part number",
    cameraRuleTitle: "Camera quantity rule",
    summaryNoteVideo: "Note: when an external camera or screen is selected, one video output cable is mandatory and will be added automatically.",
    rightBlank: "The complete list will build itself on the right as selections are made.",
    noItems: "No items selected yet.",
    reviewTitle: "Build Summary",
    reviewHint: "The list on the right is ready to export. It can also be extended later for quotation or ordering templates.",
    confirmRemoveCable: "Are you sure you want to remove the extension cable? This may affect installation.",
    summaryFields: {
      product: "Product",
      scenario: "Entry",
      solution: "Solution",
      package: "Core kit",
      host: "Host",
      powerBox: "Power box",
      wiring: "Wiring",
      wiringNote: "Wiring note",
      videoCombo: "Video combo",
      optionals: "Optional items",
      itemCount: "Selected items",
    },
    presetSteps: [
      { id: 1, title: "Choose Entry", description: "Start from an existing solution or build from scratch." },
      { id: 2, title: "Choose Core Kit", description: "Pick one core kit from the current solution as the main SKU." },
      { id: 3, title: "Add Cables & Extras", description: "Add accessories based on installation, vehicle type, and function." },
      { id: 4, title: "Review & Export", description: "Check the final combination and export the selected SKU list." },
    ],
    m1nSteps: [
      { id: 1, title: "Confirm Base Kit", description: "Start with the fixed M1N 2.0 base kit before selecting additional items." },
      { id: 2, title: "Choose Wiring", description: "Select the required signal cables, adapter cables, and base access wiring first." },
      { id: 3, title: "Choose Cameras", description: "Select the cameras for DMS, ADAS, BSD, or rear-view scenarios, together with their matching extension cables." },
      { id: 4, title: "Choose Accessories", description: "Add screen, speaker, storage, alarm, and other accessories." },
      { id: 5, title: "Review & Export", description: "Check the full M1N 2.0 list and export the selected SKU list." },
    ],
    customSteps: [
      { id: 1, title: "Choose Entry", description: "Start from an existing solution or build from scratch." },
      { id: 2, title: "Choose Host", description: "Decide whether the customer needs a single-lens or dual-lens host." },
      { id: 3, title: "Choose Power Box", description: "Select Standard Power Box, Power Box Plus, or Power Box Max." },
      { id: 4, title: "Choose Wiring", description: "Choose loose wire, 9PIN, or 16PIN based on vehicle and installation." },
      { id: 5, title: "Choose Video Combo", description: "Select the required cameras and screen. Matching cables are added automatically." },
      { id: 6, title: "Choose Optional Items", description: "Add R-Watch, B2, B3, and other optional items based on the power box." },
      { id: 7, title: "Review & Export", description: "Check the final combination and export the selected SKU list." },
    ],
    customScenario: {
      familyLabel: "Custom",
      title: "Not sure, build from scratch",
      note: "Skip preset system combinations and build step by step from host, power box, and wiring.",
    },
    familyPrefix: "Plan",
    resourceLabels: { spec: "Spec", manual: "Manual" },
    hosts: {
      dual: {
        short: "Dual-lens",
        title: "Dual-lens host",
        detail: "Best for projects that need dual-path base video capability.",
      },
      single: {
        short: "Single-lens",
        title: "Single-lens host",
        detail: "Best for projects that only need a single-path host and may add accessories later.",
      },
    },
    powerBoxes: {
      standard: {
        title: "Standard Power Box",
        badge: "Standard Power Box",
        detail: "Base solution for standard deployments.",
        note: "Start here when the customer only needs a basic project.",
      },
      plus: {
        title: "Power Box Plus",
        badge: "Power Box Plus",
        detail: "With ECU parsing cability, suitable for mid-level projects.",
        note: "Includes 16PIN by default and can also add 9PIN or loose wire.",
      },
      max: {
        title: "Power Box Max",
        badge: "Power Box Max",
        detail: "Extra 4 channels expansion. Highest expandability for more complex alarm and linkage setups.",
        note: "Prefer this tier when future expansion is likely.",
      },
    },
    wiringModes: {
      loose: {
        title: "Loose wire",
        detail: "Best for testing or special retrofit scenarios. Different power boxes use different loose-wire SKUs.",
      },
      "9pin": {
        title: "9PIN J1939",
        detail: "Switch to 9PIN power access based on the vehicle model.",
      },
      "16pin": {
        title: "16PIN OBD",
        detail: "Standard OBD method. PBP / PBM builds include the 16PIN power extension cable by default.",
      },
    },
    accessoryDetails: {
      screen: "Image display for driver assist",
      c29n: "Driver monitoring IPC camera for DMS-related scenarios.",
      ca46_adplus: "BSD camera for PBM scenarios.",
      ca38: "Basic reverse camera for rear-view and reverse use.",
      ca42: "For trailers",
      ca46_m1n: "Interior Monitoring",
      square_camera_m1n: "Square camera for outdoor waterproof reverse or rear-view scenarios.",
    },
    optionalDetails: {
      rwatch: "Useful for driver behavior reminder and linkage reminder projects. Available on Standard, PBP, and PBM.",
      b2: "External BSD sound-and-light alarm. Available on PBM. One B2 power and adapter cable is included automatically.",
      b3: "Internal sound-and-light alarm. Available on PBM and requires a B3 extension cable length choice.",
      microSd: "Optional storage card. AD Plus 2.0 supports up to 2 cards.",
    },
    labels: {
      screenCable: "Screen corrugated cable",
      ipcCable: "IPC extension cable",
      ahdCable: "AHD extension cable",
      rearBsdCable: "Rear BSD extension cable",
      b3Cable: "B3 extension cable",
      currentMain: "Current main combo",
      currentWiring: "Wiring",
      currentVideoCombo: "Current video combo",
      optionalsTitle: "Optional items",
      videoComboTitle: "Video combo",
      specsManual: "Product resources",
      builtIn: "This cable path is already included by default",
      needsExtra: "An extra cable SKU is required",
      unsupported: "This method is not supported with the current power box",
      choosePowerBoxFirst: "Choose a power box first",
      b3Hint: "B3 requires one extension cable. Choose the length based on installation distance.",
      power16ExtTitle: "16PIN power extension cable",
      power16ExtDetail: "Makes power access easier during installation.",
      quantity: "Qty",
      card1: "Card 1",
      card2: "Card 2",
      capacity: "Capacity",
    },
  },
};

UI.zh = UI.en;

const stepPillsEl = document.getElementById("step-pills");
const stepCopyEl = document.getElementById("step-copy");
const wizardTopEl = document.querySelector(".wizard-top");
const wizardStageEl = document.getElementById("wizard-stage");
const summaryMetaEl = document.getElementById("summary-meta");
const cartListEl = document.getElementById("cart-list");
const prevStepBtn = document.getElementById("prev-step");
const nextStepBtn = document.getElementById("next-step");
const exportCsvBtn = document.getElementById("export-csv");
const exportJsonBtn = document.getElementById("export-json");
const langZhBtn = document.getElementById("lang-zh");
const langEnBtn = document.getElementById("lang-en");

const state = {
  productId: "adplus20",
  language: "en",
  step: 1,
  productPickerOpen: true,
  scenarioId: null,
  familyId: null,
  packageId: null,
  selections: {},
  custom: {
    host: null,
    powerBox: null,
    wiring: {},
    wiringExtras: {},
    accessoryEditor: null,
    accessories: {},
    optionals: {},
  },
  c6: { powerModel: null },
  avm: { mode: null },
};

function t() {
  return UI[state.language] || UI.en;
}

// Pick the Chinese or English variant based on the active language.
function L(zh, en) {
  return state.language === "zh" ? zh : en;
}

function localizedText(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[state.language] || value.zh || value.en || "";
  }
  return String(value || "");
}

function pickPreviewAsset(assets = []) {
  return assets.find((asset) => /\.(png|jpe?g|gif|webp|bmp)$/i.test(asset)) || "";
}

const SUPPLEMENTAL_PREVIEW_BY_PART = {
  "5154022100006": "North America Sales List-FILE/C6 Lite 2_0/Image/C6lite2.0dual.png",
  "5154022100020": "North America Sales List-FILE/C6 Lite 2_0/Image/C6lite2.0single.png",
  "5152119100007": "North America Sales List-FILE/AD Plus 2_0/Image/33-C29N-image.png",
  "5151003100126": "North America Sales List-FILE/C6 Lite 2_0/Image/21-Square Camera-image.png",
  "5151022100069": "assets/shared-media/camera-metal-snail.png",
  "5190012100075": "North America Sales List-FILE/960C53/图片/25-7-inch Screen-图片4.png",
  "5090091100025": "North America Sales List-FILE/960C53/图片/34-B2-R-image.png",
  "5090091100026": "North America Sales List-FILE/960C53/图片/35-B2-L-image.png",
  "5190067100044": "North America Sales List-FILE/M3N/Image/5-R-Watch-image.png",
  "5151036100003": "North America Sales List-FILE/M3N/Image/10-CA29M-image.png",
  "5151019100038": "North America Sales List-FILE/M3N/Image/11-CA20S-image.png",
  "5200007100101": "North America Sales List-FILE/M3N/Image/12-AD Kit 3.0-image.gif",
  "5151053100007": "North America Sales List-FILE/M3N/Image/16-CA46-image.png",
  "5190076100018": "North America Sales List-FILE/M3N/Image/2-惯导模块-image.png",
  "1261050100409": "North America Sales List-FILE/M3N/Image/4-20PIN Plug Signal Cable-image.png",
  "1210040000008": "North America Sales List-FILE/M3N/Image/6-Alarm Serial Port Connection Cable-image.png",
  "1610002100008": "North America Sales List-FILE/M1N 2_0/Image/36-Micro SD Card-image.png",
  "1610002100007": "North America Sales List-FILE/M1N 2_0/Image/36-Micro SD Card-image.png",
  "1610002100006": "North America Sales List-FILE/M1N 2_0/Image/36-Micro SD Card-image.png",
  "1610002100005": "North America Sales List-FILE/M1N 2_0/Image/36-Micro SD Card-image.png",
  "1610004100014": "North America Sales List-FILE/M3N/Image/37-M.2 SSD-image.png",
  "1610004100013": "North America Sales List-FILE/M3N/Image/37-M.2 SSD-image.png",
  "1610004100012": "North America Sales List-FILE/M3N/Image/37-M.2 SSD-image.png",
};

SUPPLEMENTAL_PREVIEW_BY_PART["1262010000025"] = "assets/shared-media/m3n-b2-cable-single.png";
SUPPLEMENTAL_PREVIEW_BY_PART["1262010100031"] = "assets/shared-media/m3n-b2-cable-dual.png";
SUPPLEMENTAL_PREVIEW_BY_PART["1120041000455"] = "assets/shared-media/m3n-adkit-bracket.png";
SUPPLEMENTAL_PREVIEW_BY_PART["1160010100023"] = "assets/shared-media/m3n-adkit-bracket-screw.png";
SUPPLEMENTAL_PREVIEW_BY_PART["5190015100004"] = "assets/shared-media/m3n-speaker-a.png";
SUPPLEMENTAL_PREVIEW_BY_PART["1260011000026"] = "assets/shared-media/m3n-speaker-adapter-cable.png";
SUPPLEMENTAL_PREVIEW_BY_PART["1261050000056"] = "assets/shared-media/m3n-microphone-cable.png";
SUPPLEMENTAL_PREVIEW_BY_PART["5190015100021"] = "assets/shared-media/m3n-microphone-alt.png";
SUPPLEMENTAL_PREVIEW_BY_PART["5190021100004"] = "assets/shared-media/m3n-microphone-alt.png";
SUPPLEMENTAL_PREVIEW_BY_PART["1260040100057"] = "assets/shared-media/m3n-microphone-cable.png";

function fallbackItemPreviewAsset(item) {
  if (!item) return "";
  const direct = pickPreviewAsset(item.images || []);
  if (direct) return direct;
  const normalizedPart = normalizeWhitespace(item.partNumber);
  if (normalizedPart && SUPPLEMENTAL_PREVIEW_BY_PART[normalizedPart]) {
    return SUPPLEMENTAL_PREVIEW_BY_PART[normalizedPart];
  }
  if (!normalizedPart) return "";
  const productPriority = ["adplus20", "m1n20", "m3n", "c6lite20", "avm", "z5", "960c53", "966c46ipc"];
  for (const productId of productPriority) {
    const line = catalog.productLines.find((entry) => entry.id === productId);
    const match = line?.items?.find(
      (entry) => normalizeWhitespace(entry.partNumber) === normalizedPart && pickPreviewAsset(entry.images || [])
    );
    const preview = pickPreviewAsset(match?.images || []);
    if (preview) return preview;
  }
  return "";
}

function normalizeWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function englishCatalogText(value) {
  const lines = String(value || "")
    .split(/\n+/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);
  if (lines.length > 1) {
    return lines.find((line) => /[A-Za-z]/.test(line)) || lines[0];
  }
  const compact = normalizeWhitespace(value);
  const stripped = compact.replace(/[\u4e00-\u9fff()]/g, "").replace(/\s+/g, " ").trim();
  return stripped || compact;
}

function chineseCatalogText(value) {
  const lines = String(value || "")
    .split(/\n+/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);
  const zhLine = lines.find((line) => /[\u4e00-\u9fff]/.test(line));
  return zhLine || normalizeWhitespace(value);
}

function bilingualCatalogText(value) {
  return {
    zh: chineseCatalogText(value),
    en: englishCatalogText(value),
  };
}

function displayCatalogText(value) {
  return state.language === "zh" ? chineseCatalogText(value) : englishCatalogText(value);
}

function findItemByRow(rowNumber) {
  return product?.items.find((item) => item.rowNumber === rowNumber) || null;
}

function findCatalogItem(productId, rowNumber) {
  const line = catalog.productLines.find((item) => item.id === productId);
  return line?.items.find((item) => item.rowNumber === rowNumber) || null;
}

// Shared component library keyed by part number (SKU).
// Holds the *presentation* of a physical part (curated title / image / description) so the
// same camera looks identical in every product instead of being re-described per flow.
// Flow-specific behaviour (cameraType, extension rows, power-box rules) stays with each consumer.
const SKU_LIBRARY = {
  // --- cameras already curated for the AD Plus flow ---
  "5152119100007": { title: { zh: "C29N DMS camera", en: "C29N DMS camera" },
    detail: UI.zh.accessoryDetails.c29n, detailEn: UI.en.accessoryDetails.c29n },
  "5151053100007": { title: { zh: "CA46 BSD camera", en: "CA46 BSD camera" },
    image: "North America Sales List-FILE/AD Plus 2_0/Image/15-CA46-image.png",
    detail: UI.zh.accessoryDetails.ca46_adplus, detailEn: UI.en.accessoryDetails.ca46_adplus },
  "5051043100003": { title: { zh: "CA38 reverse camera", en: "CA38 reverse camera" },
    image: "assets/shared-media/camera-ca38.png",
    detail: UI.zh.accessoryDetails.ca38, detailEn: UI.en.accessoryDetails.ca38 },
  "5200027100004": { title: { zh: "CA42 wireless camera", en: "CA42 wireless camera" },
    detail: UI.zh.accessoryDetails.ca42, detailEn: UI.en.accessoryDetails.ca42 },
  "5151022100069": { title: { zh: "CA46 金属海螺", en: "Metal snail camera" },
    image: "assets/shared-media/camera-metal-snail.png",
    detail: UI.zh.accessoryDetails.ca46_m1n, detailEn: UI.en.accessoryDetails.ca46_m1n },
  "5151003100126": { title: { zh: "Square camera", en: "Square camera" },
    image: "North America Sales List-FILE/C6 Lite 2_0/Image/21-Square Camera-image.png",
    detail: UI.zh.accessoryDetails.square_camera_m1n, detailEn: UI.en.accessoryDetails.square_camera_m1n },
  // --- cameras that only existed as raw catalog rows (no AD Plus curation) ---
  "5151036100003": { title: { zh: "CA29M DMS camera", en: "CA29M DMS camera" },
    image: "North America Sales List-FILE/M3N/Image/10-CA29M-image.png" },
  "5151019100038": { title: { zh: "CA20S ADAS camera", en: "CA20S ADAS camera" },
    image: "North America Sales List-FILE/M3N/Image/11-CA20S-image.png" },
  "5200007100101": { title: { zh: "AD Kit 3.0 (DMS + ADAS)", en: "AD Kit 3.0 (DMS + ADAS)" },
    image: "North America Sales List-FILE/M3N/Image/12-AD Kit 3.0-image.gif" },
  // --- optionals shared with the AD Plus flow (screen / alarms) ---
  "5190012100075": { title: { zh: "DP7S 屏幕", en: "DP7S screen" },
    image: "assets/shared-media/screen-dp7s.png",
    detail: UI.zh.accessoryDetails.screen, detailEn: UI.en.accessoryDetails.screen },
  "5090091100025": { title: { zh: "B2 sound and light alarm", en: "B2 sound and light alarm" },
    image: "North America Sales List-FILE/AD Plus 2_0/Image/b2.png",
    detail: UI.zh.optionalDetails.b2, detailEn: UI.en.optionalDetails.b2 },
  "5090091100026": { title: { zh: "B2 sound and light alarm", en: "B2 sound and light alarm" },
    image: "North America Sales List-FILE/AD Plus 2_0/Image/b2.png",
    detail: UI.zh.optionalDetails.b2, detailEn: UI.en.optionalDetails.b2 },
  "5190108100003": { title: { zh: "B3 sound and light alarm", en: "B3 sound and light alarm" },
    detail: UI.zh.optionalDetails.b3, detailEn: UI.en.optionalDetails.b3 },
  // --- C6 Lite 2.0 parts (title-only: distinguish otherwise-identical cable names) ---
  "1261090100095": { title: { zh: "16PIN OBD Power Cable (RS232)", en: "16PIN OBD Power Cable (RS232)" } },
  "1261090100117": { title: { zh: "9PIN OBD Power Cable (RS232)", en: "9PIN OBD Power Cable (RS232)" } },
  "1261090100120": { title: { zh: "16PIN OBD Power Cable (CAN)", en: "16PIN OBD Power Cable (CAN)" } },
  "1261090100121": { title: { zh: "9PIN OBD Power Cable (CAN)", en: "9PIN OBD Power Cable (CAN)" } },
  "1260010100356": { title: { zh: "AHD Extension Cable 3M", en: "AHD Extension Cable 3M" }, image: "North America Sales List-FILE/C6 Lite 2_0/Image/C6-AHD-Extension-Cable.png" },
  "1260010100357": { title: { zh: "AHD Extension Cable 5M", en: "AHD Extension Cable 5M" }, image: "North America Sales List-FILE/C6 Lite 2_0/Image/C6-AHD-Extension-Cable.png" },
  "1260010100358": { title: { zh: "AHD Extension Cable 7M", en: "AHD Extension Cable 7M" }, image: "North America Sales List-FILE/C6 Lite 2_0/Image/C6-AHD-Extension-Cable.png" },
  "1260010100359": { title: { zh: "AHD Extension Cable 9M", en: "AHD Extension Cable 9M" }, image: "North America Sales List-FILE/C6 Lite 2_0/Image/C6-AHD-Extension-Cable.png" },
  // C6 cables whose photos were embedded in the workbook (extracted here) rather than the shared image folder.
  "1260040100326": { image: "North America Sales List-FILE/C6 Lite 2_0/Image/C6-Device-Extension-Cable.png" },
  "1260011100208": { image: "North America Sales List-FILE/C6 Lite 2_0/Image/C6-AHD-Expansion-Cable.png" },
  "5151047100028": { title: { zh: "CA29P DMS camera", en: "CA29P DMS camera" } },
  // C6 Lite base kits — real dual/single product photos (catalog only had a shared wiring diagram)
  "5154022100006": { image: "North America Sales List-FILE/C6 Lite 2_0/Image/C6lite2.0dual.png" },
  "5154022100020": { image: "North America Sales List-FILE/C6 Lite 2_0/Image/C6-2.0-S-kit.png" },
  // AVM parts — images extracted from the workbook (were missing on disk)
  "1261020100108": { title: { zh: "音视频转接线", en: "Audio-Video Adapter Cable" }, image: "North America Sales List-FILE/AVM/Image/AVM-AV-Adapter-Cable.png" },
  "1260010000130": { title: { zh: "级联转接线", en: "Cascading Mode Adapter Cable" }, image: "North America Sales List-FILE/AVM/Image/AVM-Cascading-Adapter-Cable.png" },
  "1260011100152": { title: { zh: "音视频延长线 5M", en: "Audio-Video Extension Cable 5M" }, image: "North America Sales List-FILE/AVM/Image/AVM-AV-Extension-Cable.png" },
  "1260011100153": { title: { zh: "音视频延长线 11M", en: "Audio-Video Extension Cable 11M" }, image: "North America Sales List-FILE/AVM/Image/AVM-AV-Extension-Cable.png" },
  "1260011100154": { title: { zh: "音视频延长线 15M", en: "Audio-Video Extension Cable 15M" }, image: "North America Sales List-FILE/AVM/Image/AVM-AV-Extension-Cable.png" },
  "1260011100155": { title: { zh: "音视频延长线 23M", en: "Audio-Video Extension Cable 23M" }, image: "North America Sales List-FILE/AVM/Image/AVM-AV-Extension-Cable.png" },
  "5190074100007": { image: "North America Sales List-FILE/AVM/Image/AVM-Calibration-Cloth.png" },
  "1210010100059": { title: { zh: "AHD 信号转接线", en: "AHD Signal Adapter Cable" }, image: "North America Sales List-FILE/AVM/Image/AVM-AHD-Signal-Adapter.png" },
  "1262010000025": { title: { zh: "B2 转接线（接 1 个）", en: "B2 Adapter Cable (1 alarm)" }, image: "North America Sales List-FILE/AVM/Image/AVM-B2-Adapter-1.png" },
  "1262010100031": { title: { zh: "B2 转接线（接 2 个）", en: "B2 Adapter Cable (2 alarms)" }, image: "North America Sales List-FILE/AVM/Image/AVM-B2-Adapter-2.png" },
};

function skuInfo(partNumber) {
  return SKU_LIBRARY[partNumber] || null;
}

const customCatalog = {
  hosts: [
    {
      id: "dual",
      short: { zh: "Dual-lens", en: "Dual-lens" },
      title: { zh: "Dual-lens host", en: "Dual-lens host" },
      detail: {
        zh: "Best for projects that need dual-path base video capability.", en: "Best for projects that need dual-path base video capability.",
      },
      image: "North America Sales List-FILE/AD Plus 2_0/Image/image.png",
      packageRows: { standard: 14, plus: 19, max: 17 },
    },
    {
      id: "single",
      short: { zh: "Single-lens", en: "Single-lens" },
      title: { zh: "Single-lens host", en: "Single-lens host" },
      detail: {
        zh: "Best for projects that only need a single-path host and may add accessories later.", en: "Best for projects that only need a single-path host and may add accessories later.",
      },
      image: "North America Sales List-FILE/AD Plus 2_0/Image/14-AD Plus 2.0-S Kit 套装-image.png",
      packageRows: { standard: 15, plus: 20, max: 18 },
    },
  ],
  powerBoxes: [
    {
      id: "standard",
      title: { zh: "Standard Power Box", en: "Standard Power Box" },
      badge: { zh: "Standard Power Box", en: "Standard Power Box" },
      detail: {
        zh: "Base solution for standard deployments.", en: "Base solution for standard deployments.",
      },
      note: {
        zh: "Start here when the customer only needs a basic project.", en: "Start here when the customer only needs a basic project.",
      },
    },
    {
      id: "plus",
      title: { zh: "Power Box Plus", en: "Power Box Plus" },
      badge: { zh: "Power Box Plus", en: "Power Box Plus" },
      detail: {
        zh: "With ECU parsing cability, suitable for mid-level projects.", en: "With ECU parsing cability, suitable for mid-level projects.",
      },
      note: {
        zh: "Includes 16PIN by default and can also add 9PIN or loose wire.", en: "Includes 16PIN by default and can also add 9PIN or loose wire.",
      },
    },
    {
      id: "max",
      title: { zh: "Power Box Max", en: "Power Box Max" },
      badge: { zh: "Power Box Max", en: "Power Box Max" },
      detail: {
        zh: "Extra 4 channels expansion. Highest expandability for more complex alarm and linkage setups.", en: "Extra 4 channels expansion. Highest expandability for more complex alarm and linkage setups.",
      },
      note: {
        zh: "Prefer this tier when future expansion is likely.", en: "Prefer this tier when future expansion is likely.",
      },
    },
  ],
  wiringModes: [
    {
      id: "loose",
      title: { zh: "散线方式", en: "Loose wire" },
      detail: {
        zh: "Best for testing or retrofit scenarios. Different power boxes use different loose-wire SKUs.", en: "Best for testing or retrofit scenarios. Different power boxes use different loose-wire SKUs.",
      },
      support: { standard: "builtin", plus: "item", max: "item" },
      rows: { plus: 26, max: 27 },
    },
    {
      id: "9pin",
      title: { zh: "9PIN J1939", en: "9PIN J1939" },
      detail: {
        zh: "Switch to 9PIN power access based on the vehicle model.", en: "Switch to 9PIN power access based on the vehicle model.",
      },
      support: { standard: "item", plus: "item", max: "item" },
      rows: { standard: 22, plus: 24, max: 24 },
    },
    {
      id: "16pin",
      title: { zh: "16PIN OBD", en: "16PIN OBD" },
      detail: {
        zh: "Standard OBD method. PBP / PBM builds include the 16PIN power extension cable by default.", en: "Standard OBD method. PBP / PBM builds include the 16PIN power extension cable by default.",
      },
      support: { standard: "item", plus: "item", max: "item" },
      rows: { standard: 23, plus: 25, max: 25 },
    },
  ],
  accessories: [
    {
      id: "ca46_adplus",
      ...skuInfo("5151053100007"),
      itemRow: 16,
      cameraType: "ahd",
      extensionRows: [31, 32, 33],
      extensionLabel: { zh: "AHD extension cable", en: "AHD extension cable" },
      allowedPowerBoxes: ["max"],
      sortOrder: -10,
    },
    {
      id: "screen",
      ...skuInfo("5190012100075"),
      itemRow: 40,
      extensionRows: [41],
      extensionLabel: { zh: "Screen corrugated cable", en: "Screen corrugated cable" },
      lockExtension: true,
      secondaryExtensionRows: [31, 32, 33],
      secondaryExtensionLabel: { zh: "AHD 延长线", en: "AHD extension cable" },
    },
    {
      id: "c29n",
      ...skuInfo("5152119100007"),
      itemRow: 34,
      cameraType: "ipc",
      extensionRows: [28, 29, 30],
      extensionLabel: { zh: "IPC extension cable", en: "IPC extension cable" },
    },
    {
      id: "ca38",
      ...skuInfo("5051043100003"),
      itemRow: 35,
      cameraType: "ahd",
      extensionRows: [31, 32, 33],
      extensionLabel: { zh: "AHD extension cable", en: "AHD extension cable" },
    },
    {
      id: "ca42",
      ...skuInfo("5200027100004"),
      itemRow: 36,
      cameraType: "ahd",
      extensionRows: [37, 38, 39],
      extensionLabel: { zh: "Rear BSD extension cable", en: "Rear BSD extension cable" },
    },
    {
      id: "ca46_m1n",
      ...skuInfo("5151022100069"),
      sourceProductId: "m3n",
      itemRow: 23,
      cameraType: "ahd",
      extensionRows: [31, 32, 33],
      extensionLabel: { zh: "AHD 延长线", en: "AHD extension cable" },
      sortOrder: 10,
    },
    {
      id: "square_camera_m1n",
      ...skuInfo("5151003100126"),
      sourceProductId: "m1n20",
      itemRow: 22,
      cameraType: "ahd",
      extensionRows: [31, 32, 33],
      extensionLabel: { zh: "AHD extension cable", en: "AHD extension cable" },
    },
  ],
  optionals: [
    {
      id: "rwatch",
      title: { zh: "R-Watch", en: "R-Watch" },
      itemRow: 42,
      detail: UI.zh.optionalDetails.rwatch,
      detailEn: UI.en.optionalDetails.rwatch,
      allowedPowerBoxes: ["standard", "plus", "max"],
    },
    {
      id: "b2",
      ...skuInfo("5090091100025"),
      itemRow: 43,
      allowedPowerBoxes: ["max"],
      requiredRows: [45],
      maxQuantity: 4,
    },
    {
      id: "b3",
      ...skuInfo("5190108100003"),
      itemRow: 47,
      allowedPowerBoxes: ["max"],
      extensionRows: [48, 49, 50],
      extensionLabel: { zh: "B3 extension cable", en: "B3 extension cable" },
      lockExtension: true,
      maxQuantity: 4,
    },
    {
      id: "micro_sd",
      title: { zh: "Micro SD card", en: "Micro SD card" },
      image: "North America Sales List-FILE/AD Plus 2_0/Image/sd card.png",
      detail: { zh: "", en: UI.en.optionalDetails.microSd },
      detailEn: UI.en.optionalDetails.microSd,
      allowedPowerBoxes: ["standard", "plus", "max"],
      maxQuantity: 2,
    },
  ],
  helperRows: {
    videoOutputCable: 21,
  },
};

const SD_CARD_VARIANTS = [
  { partNumber: "1610002100008", name: { zh: "Micro SD 128GB", en: "Micro SD 128GB" } },
  { partNumber: "1610002100007", name: { zh: "Micro SD 256GB", en: "Micro SD 256GB" } },
  { partNumber: "1610002100006", name: { zh: "Micro SD 512GB", en: "Micro SD 512GB" } },
  { partNumber: "1610002100005", name: { zh: "Micro SD 1TB", en: "Micro SD 1TB" } },
];

const M2_SSD_VARIANTS = [
  { partNumber: "1610004100014", name: { zh: "M.2 SSD 512GB", en: "M.2 SSD 512GB" } },
  { partNumber: "1610004100013", name: { zh: "M.2 SSD 1TB", en: "M.2 SSD 1TB" } },
  { partNumber: "1610004100012", name: { zh: "M.2 SSD 2TB", en: "M.2 SSD 2TB" } },
];

const PRODUCT_ENTRY_IDS = ["adplus20", "m1n20", "m3n", "c6lite20", "avm", "z5", "960c53", "966c46ipc"];

function currentProduct() {
  return product;
}

function isAdplusProduct() {
  return state.productId === "adplus20";
}

function isM1nProduct() {
  return state.productId === "m1n20";
}

function isM3nProduct() {
  return state.productId === "m3n";
}

function isC6Product() {
  return state.productId === "c6lite20";
}

function isAvmProduct() {
  return state.productId === "avm";
}

function isZ5Product() {
  return state.productId === "z5";
}

function is960C53Product() {
  return state.productId === "960c53";
}

function is966C46Product() {
  return state.productId === "966c46ipc";
}

function isMSeriesProduct() {
  return isM1nProduct() || isM3nProduct();
}

function isStepperProduct() {
  return isMSeriesProduct() || isC6Product();
}

function isPresetPackageProduct() {
  return Boolean(PRODUCT_META[state.productId]?.presetPackage);
}

function productEntryImage(productLine) {
  const explicit = PRODUCT_META[productLine?.id]?.entryImage;
  if (explicit) return explicit;
  return pickPreviewAsset(productLine?.items?.find((item) => item.images?.length)?.images || []) || "";
}

function productEntryTitle(productLine) {
  return (productLine?.title || "").replaceAll("_", ".");
}

function productEntries() {
  return PRODUCT_ENTRY_IDS.map((id) => catalog.productLines.find((item) => item.id === id))
    .filter(Boolean)
    .map((item) => ({
      id: item.id,
      title: productEntryTitle(item),
      note: "Select this product first, then click Next to enter the build flow.",
      image: productEntryImage(item),
    }));
}

const M1N_STEP_ROWS = {
  wiring: new Set([5, 7]),
  cameras: new Set([11, 12, 13, 14, 15, 16, 17, 22, 23]),
  optionals: new Set([6, 8, 10, 18, 19, 31, 34, 36, 37, 38]),
};

const M3N_STEP_ROWS = {
  wiring: new Set([5, 7]),
  cameras: new Set([10, 11, 12, 13, 14, 15, 17, 22, 23]),
  optionals: new Set([3, 6, 8, 18, 19, 31, 34, 37, 38]),
};

const C6_STEP_ROWS = {
  wiring: new Set([9, 10, 11, 12, 13, 14, 15]),
  cameras: new Set([16, 17, 18, 19, 20, 21, 22]),
  optionals: new Set([23, 24]),
};

const AVM_STEP_ROWS = {
  cameras: new Set([13, 14]),
  wiring: new Set([7, 8, 9, 10, 11, 12]),
  optionals: new Set([15, 16, 17, 18]),
};

const Z5_STEP_ROWS = {
  storage: new Set([3, 4, 5, 6]),
};

const C53_STEP_ROWS = {
  base: new Set([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]),
  video: new Set([19, 20, 21, 22, 23, 24, 25]),
  display: new Set([26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]),
  host: new Set([40, 41, 42, 43, 44, 45, 49, 50]),
};

const IPC966_STEP_ROWS = {
  extension: new Set([3, 4, 5, 6, 7, 8, 9]),
  host: new Set([10, 11, 12, 17]),
  display: new Set([13, 14, 18, 19, 20, 25]),
  optionals: new Set([15, 16, 21, 22, 23, 24, 26]),
};

const M3N_CAMERA_EXTENSION_ROWS = {
  ahd: [24, 25, 26, 27],
  ipc: [28, 29, 30],
};

const M_SERIES_CHANNEL_RULES = {
  m1n20: { ipc: 2, ahd: 4 },
  m3n: { ipc: 4, ahd: 4 },
};

const C6_STEPS = {
  zh: null, en: [
    { id: 1, title: "Choose Core Kit", description: "Start by selecting the single-lens or dual-lens C6 Lite 2.0 base kit." },
    { id: 2, title: "Choose Wiring", description: "Select the device extension cable, power cable, and related connection cables." },
    { id: 3, title: "Choose Cameras", description: "Add DMS, reverse-view, and related video items based on the project needs." },
    { id: 4, title: "Choose Accessories", description: "Finish with notifier, storage card, and other optional items." },
    { id: 5, title: "Review & Export", description: "Check the full list and export the selected SKU list." },
  ],
};

const Z5_STEPS = {
  zh: null, en: [
    { id: 1, title: "Choose Core Kit", description: "Start with the Z5 base kit before adding storage." },
    { id: 2, title: "Choose Storage", description: "Select the required Micro SD card capacity." },
    { id: 3, title: "Review & Export", description: "Check the final list and export the selected SKUs." },
  ],
};

const C53_STEPS = {
  zh: null, en: [
    { id: 1, title: "Choose Core Kit", description: "Start by selecting the C53-L or C53-R base kit." },
    { id: 2, title: "Choose Base Accessories", description: "Add power box, brackets, input/output cables, and base hardware." },
    { id: 3, title: "Choose Video & GPS", description: "Select GPS modules, front BSD cameras, and the related video items." },
    { id: 4, title: "Choose Screen & Alerts", description: "Add screens, B2 / B3 devices, and their matching extension cables." },
    { id: 5, title: "Choose Host & Service", description: "Complete the build with MDVR, service cables, and AVOUT adapters." },
    { id: 6, title: "Review & Export", description: "Check the complete list and export the selected SKUs." },
  ],
};

const IPC966_STEPS = {
  zh: null, en: [
    { id: 1, title: "Choose Core Kit", description: "Start with the 966C46-IPC base kit." },
    { id: 2, title: "Choose Extension & Mounting", description: "Select extension cables, rainproof bracket, and installation tools." },
    { id: 3, title: "Choose Host & Adapter", description: "Add the matching host and required adapter cables." },
    { id: 4, title: "Choose Screen & Speakers", description: "Select screen, sunshade, and the inner / outer speaker setup." },
    { id: 5, title: "Choose Optional Items", description: "Add switches, extension box, and other supporting accessories." },
    { id: 6, title: "Review & Export", description: "Check the final list and export the selected SKUs." },
  ],
};

const AVM_STEPS = {
  zh: null, en: [
    { id: 1, title: "Choose Base Kit", description: "AVM 360 kit — includes 4 surround cameras and the calibration cloth." },
    { id: 2, title: "Connection & Wiring", description: "Choose standalone or cascade, then add video extension cables." },
    { id: 3, title: "Choose Screen", description: "Add the DP7S screen and AHD signal adapter cable." },
    { id: 4, title: "Exterior Alarm", description: "Add B2 alarm devices and their adapter cables." },
    { id: 5, title: "Review & Export", description: "Check the full list and export the selected SKU list." },
  ],
};

// Central per-product metadata.
//  - entryImage: hero image on the product picker.
//  - presetPackage: product runs the fixed "core kit + pick items" flow (vs. adplus custom / m-series).
//  - steps: localized step definitions for the wizard header.
//  - selectable: for preset products, maps each wizard step number to a catalog row-set key.
//  - kit: which "current kit" label to show ("base" or "core").
const PRODUCT_META = {
  adplus20:    { entryImage: "North America Sales List-FILE/AD Plus 2_0/Image/image.png" },
  m1n20:       { entryImage: "North America Sales List-FILE/M1N 2_0/Image/3-M1N 2.0 -image.png" },
  m3n:         { entryImage: "North America Sales List-FILE/M3N/Image/3-M3N-image.png" },
  c6lite20:    { entryImage: "North America Sales List-FILE/C6 Lite 2_0/Image/C6lite2.0dual.png",
                 presetPackage: true, steps: C6_STEPS, kit: "core",
                 selectable: { rows: C6_STEP_ROWS, map: { 2: "wiring", 3: "cameras", 4: "optionals" } } },
  avm:         { entryImage: "North America Sales List-FILE/AVM/Image/5-AVM-image.png",
                 presetPackage: true, steps: AVM_STEPS, kit: "base",
                 selectable: { rows: AVM_STEP_ROWS, map: { 2: "cameras", 3: "wiring", 4: "optionals" } } },
  z5:          { entryImage: "North America Sales List-FILE/Z5/Image/Z5/1-Z5-Z5主视图1.png",
                 presetPackage: true, steps: Z5_STEPS, kit: "core",
                 selectable: { rows: Z5_STEP_ROWS, map: { 2: "storage" } } },
  "960c53":    { entryImage: "North America Sales List-FILE/960C53/图片/1-C53-L-image.png",
                 presetPackage: true, steps: C53_STEPS, kit: "core",
                 selectable: { rows: C53_STEP_ROWS, map: { 2: "base", 3: "video", 4: "display", 5: "host" } } },
  "966c46ipc": { entryImage: "North America Sales List-FILE/966C46-IPC/图片/1-966C46-IPC kit-image.png",
                 presetPackage: true, steps: IPC966_STEPS, kit: "core",
                 selectable: { rows: IPC966_STEP_ROWS, map: { 2: "extension", 3: "host", 4: "display", 5: "optionals" } } },
};

function buildScenarios() {
  if (!product) {
    return [];
  }

  const built = product.solutions
    .map((solution, index) => ({
      scenarioId: `scenario-${index + 1}`,
      familyId: solution.id,
      familyLabel: {
        zh: `${t().familyPrefix} ${solution.id}`,
        en: `${UI.en.familyPrefix} ${solution.id}`,
      },
      title: bilingualCatalogText(solution.title || `${t().familyPrefix} ${index + 1}`),
      note: bilingualCatalogText(solution.note),
      image: pickPreviewAsset(solution.images),
      sourceIndex: index + 1,
    }))
    .filter((scenario) => (isAdplusProduct() ? KEPT_SCENARIO_POSITIONS.has(scenario.sourceIndex) : true));

  if (!isAdplusProduct()) return built;

  const customScenario = {
    scenarioId: CUSTOM_SCENARIO_ID,
    familyId: CUSTOM_FAMILY_ID,
    familyLabel: { zh: UI.zh.customScenario.familyLabel, en: UI.en.customScenario.familyLabel },
    title: { zh: UI.zh.customScenario.title, en: UI.en.customScenario.title },
    note: { zh: UI.zh.customScenario.note, en: UI.en.customScenario.note },
    image: "North America Sales List-FILE/AD Plus 2_0/Image/image.png",
    sourceIndex: 0,
  };

  return [customScenario, ...built];
}

let scenarios = buildScenarios();

state.scenarioId = scenarios[0]?.scenarioId || null;
state.familyId = scenarios[0]?.familyId || null;

function currentScenario() {
  return scenarios.find((item) => item.scenarioId === state.scenarioId) || null;
}

function isCustomFlow() {
  return isAdplusProduct() && state.familyId === CUSTOM_FAMILY_ID;
}

function currentSteps() {
  const steps = PRODUCT_META[state.productId]?.steps;
  if (steps) return L(steps.zh, steps.en) || steps.en;
  if (isStepperProduct()) return t().m1nSteps;
  return isCustomFlow() ? t().customSteps : t().presetSteps;
}

function currentPackageFamilyIds() {
  const pkg = product?.items?.find((item) => item.id === state.packageId);
  return new Set(pkg?.solutionRefs || []);
}

function itemsForFamily() {
  if (!product) return [];
  // AVM and C6 (now a free custom-style build) expose the whole item list, not a scenario subset.
  if (isAvmProduct() || isC6Product()) return product.items;
  if (!state.familyId || isCustomFlow()) return product.items;
  return product.items.filter((item) => !item.solutionRefs.length || item.solutionRefs.includes(state.familyId));
}

function packageCandidates() {
  if (isAvmProduct()) {
    return product.items.filter((item) => /kit/i.test(item.group) || /kit/i.test(item.name));
  }
  if (isC6Product()) {
    return product.items.filter((item) => /kit/i.test(item.group) || /kit/i.test(item.name));
  }
  return itemsForFamily().filter((item) => /kit/i.test(item.group) || /kit/i.test(item.name));
}

function accessoryCandidates() {
  return itemsForFamily().filter((item) => item.id !== state.packageId);
}

function groupedItems(items) {
  return items.reduce((map, item) => {
    const key = item.group || "Ungrouped";
    if (!map[key]) map[key] = [];
    map[key].push(item);
    return map;
  }, {});
}

function suggestAccessorySelection(item, groupItems) {
  if (item.id === state.packageId) return true;
  if (isAvmProduct() && item.rowNumber !== undefined && [13, 14].includes(item.rowNumber)) return true;
  if (!item.solutionRefs.length) return false;
  if (/video output cable/i.test(item.group) || /video output cable/i.test(item.name)) return true;
  return groupItems.length === 1 && item.solutionRefs.includes(state.familyId);
}

function seedPresetSelections() {
  const accessoryGroups = groupedItems(accessoryCandidates());
  const packageIds = new Set(packageCandidates().map((item) => item.id));
  for (const item of itemsForFamily()) {
    if (!state.selections[item.id]) {
      const groupItems = accessoryGroups[item.group] || [];
      state.selections[item.id] = {
        checked: packageIds.has(item.id) ? item.id === state.packageId : suggestAccessorySelection(item, groupItems),
        quantity: item.quantity || "1",
      };
    }
  }
  if (state.packageId && state.selections[state.packageId]) {
    state.selections[state.packageId].checked = true;
  }
}

function resetCustomState() {
  state.custom = {
    host: null,
    powerBox: null,
    wiring: {},
    wiringExtras: {},
    accessoryEditor: null,
    accessories: {},
    optionals: {},
  };
}

function resetScenarioState() {
  state.packageId = null;
  state.selections = {};
  resetCustomState();
  if (isMSeriesProduct()) {
    state.packageId = packageCandidates()[0]?.id || null;
    if (state.packageId) {
      const pkg = packageCandidates().find((item) => item.id === state.packageId);
      state.selections[state.packageId] = { checked: true, quantity: pkg?.quantity || "1" };
    }
    return;
  }
  if (!isCustomFlow()) {
    state.packageId = packageCandidates()[0]?.id || null;
    seedPresetSelections();
  }
}

function chooseScenario(scenarioId) {
  const scenario = scenarios.find((item) => item.scenarioId === scenarioId);
  if (!scenario) return;
  state.productPickerOpen = isAdplusProduct();
  state.scenarioId = scenario.scenarioId;
  state.familyId = scenario.familyId;
  state.step = 1;
  resetScenarioState();
  render();
}

function chooseProduct(productId) {
  const nextProduct = catalog.productLines.find((item) => item.id === productId);
  if (!nextProduct) return;
  state.productId = productId;
  state.productPickerOpen = true;
  product = nextProduct;
  scenarios = buildScenarios();
  if (productId === "adplus20") {
    const customScenario = scenarios.find((item) => item.scenarioId === CUSTOM_SCENARIO_ID);
    state.scenarioId = customScenario?.scenarioId || scenarios[0]?.scenarioId || null;
    state.familyId = customScenario?.familyId || scenarios[0]?.familyId || null;
  } else {
    state.scenarioId = scenarios[0]?.scenarioId || null;
    state.familyId = scenarios[0]?.familyId || null;
  }
  state.step = 1;
  resetScenarioState();
  render();
}

function choosePackage(packageId) {
  state.packageId = packageId;
  if (isC6Product()) {
    const pkg = product?.items?.find((item) => item.id === packageId);
    state.familyId = pkg?.solutionRefs?.[0] || null;
  }
  for (const item of packageCandidates()) {
    if (!state.selections[item.id]) state.selections[item.id] = { checked: false, quantity: item.quantity || "1" };
    state.selections[item.id].checked = item.id === packageId;
  }
  render();
}

function currentPackage() {
  return packageCandidates().find((item) => item.id === state.packageId) || null;
}

function packagePreview(item) {
  const curated = skuInfo(item.partNumber)?.image;
  if (curated) return { src: curated, fallback: false };
  const ownImage = pickPreviewAsset(item.images);
  if (ownImage) return { src: ownImage, fallback: false };
  const scenarioImage = currentScenario()?.image || "";
  return scenarioImage ? { src: scenarioImage, fallback: true } : { src: "", fallback: false };
}

function selectedCustomHost() {
  return customCatalog.hosts.find((item) => item.id === state.custom.host) || null;
}

function selectedCustomPowerBox() {
  return customCatalog.powerBoxes.find((item) => item.id === state.custom.powerBox) || null;
}

function selectedCustomWirings() {
  return customCatalog.wiringModes.filter((item) => state.custom.wiring[item.id]);
}

function customPowerBoxPreview(powerBoxId) {
  const host = selectedCustomHost();
  if (!host) return "";
  if (powerBoxId === "standard") return host.image || "";
  const packageItem = findItemByRow(host.packageRows[powerBoxId]);
  return pickPreviewAsset(packageItem?.images || []) || host.image || "";
}

function customWiringPreview(modeId, powerBoxId) {
  if (!powerBoxId) return "";
  if (powerBoxId === "standard" && modeId === "loose") return "North America Sales List-FILE/AD Plus 2_0/Image/hard wire.png";
  if ((powerBoxId === "plus" || powerBoxId === "max") && modeId === "loose") return "North America Sales List-FILE/AD Plus 2_0/Image/hardwire pbm.png";
  if (powerBoxId === "standard" && modeId === "9pin") return pickPreviewAsset(findItemByRow(22)?.images || []);
  if (powerBoxId === "standard" && modeId === "16pin") return pickPreviewAsset(findItemByRow(23)?.images || []);
  if ((powerBoxId === "plus" || powerBoxId === "max") && modeId === "9pin") return pickPreviewAsset(findItemByRow(24)?.images || []);
  if ((powerBoxId === "plus" || powerBoxId === "max") && modeId === "16pin") return "North America Sales List-FILE/AD Plus 2_0/Image/16pinobd for pbm pbp.png";
  return "";
}

function customWiringSku(modeId, powerBoxId) {
  if (powerBoxId === "standard" && modeId === "loose") return "1261090100038";
  if ((powerBoxId === "plus" || powerBoxId === "max") && modeId === "16pin") return "1260040100242";
  const mode = customCatalog.wiringModes.find((item) => item.id === modeId);
  const rowNumber = mode?.rows?.[powerBoxId];
  return rowNumber ? findItemByRow(rowNumber)?.partNumber || "" : "";
}

function customPackageItem() {
  const host = selectedCustomHost();
  const powerBox = selectedCustomPowerBox();
  if (!host || !powerBox) return null;
  return findItemByRow(host.packageRows[powerBox.id]);
}

function selectedCustomAccessoryDefs() {
  return customCatalog.accessories.filter((item) => {
    const stateBlock = state.custom.accessories[item.id];
    if (!stateBlock) return false;
    if (item.cameraType) return Number(stateBlock.quantity || 0) > 0;
    return Boolean(stateBlock.checked);
  });
}

function selectedCustomOptionalDefs() {
  const powerBox = selectedCustomPowerBox();
  return customCatalog.optionals.filter(
    (item) => state.custom.optionals[item.id]?.checked && (!powerBox || item.allowedPowerBoxes.includes(powerBox.id))
  );
}

function ca42TrailerAdapterEnabled() {
  const ca42State = ensureAccessoryState("ca42");
  return Number(ca42State.quantity || 0) > 0 && Boolean(ca42State.addonChecked);
}

function ca42TrailerAdapterBlocksRwatch() {
  const powerBox = selectedCustomPowerBox();
  return powerBox?.id === "standard" && ca42TrailerAdapterEnabled();
}

function visibleCustomOptionals() {
  const powerBox = selectedCustomPowerBox();
  if (!powerBox) return [];
  return customCatalog.optionals.filter((item) => item.allowedPowerBoxes.includes(powerBox.id));
}

function isOptionalDisabled(optionalDef) {
  return optionalDef.id === "rwatch" && ca42TrailerAdapterBlocksRwatch();
}

function selectedCameraCounts() {
  return selectedCustomAccessoryDefs().reduce(
    (acc, item) => {
      const qty = Number(ensureAccessoryState(item.id).quantity || 0);
      if (item.cameraType === "ipc") acc.ipc += qty;
      if (item.cameraType === "ahd") acc.ahd += qty;
      return acc;
    },
    { ipc: 0, ahd: 0 }
  );
}

function cameraCapacityRule() {
  const powerBox = selectedCustomPowerBox();
  if (!powerBox) return null;
  if (powerBox.id === "standard" || powerBox.id === "plus") {
    return {
      maxIpc: 1,
      maxAhd: 1,
      label: L("当前方案最多 1 路 IPC + 1 路 AHD", "This setup supports up to 1 IPC + 1 AHD"),
    };
  }
  if (powerBox.id === "max") {
    return {
      maxIpc: 1,
      maxAhdWithIpc: 3,
      maxAhdOnly: 4,
      label: L("PBM 最多 1 路 IPC + 3 路 AHD，或者 4 路 AHD", "PBM supports up to 1 IPC + 3 AHD, or 4 AHD"),
    };
  }
  return null;
}

function cameraCapacityWarning() {
  const rule = cameraCapacityRule();
  if (!rule) return "";
  const counts = selectedCameraCounts();
  const overText = "Selection exceeds the camera limit";
  if (rule.maxAhd !== undefined) {
    if (counts.ipc > rule.maxIpc || counts.ahd > rule.maxAhd) {
      return `${overText}: ${rule.label}`;
    }
    return "";
  }
  if (counts.ipc > rule.maxIpc) return `${overText}: ${rule.label}`;
  if (counts.ipc >= 1 && counts.ahd > rule.maxAhdWithIpc) return `${overText}: ${rule.label}`;
  if (counts.ipc === 0 && counts.ahd > rule.maxAhdOnly) return `${overText}: ${rule.label}`;
  return "";
}

function cameraCapacityStatus() {
  const rule = cameraCapacityRule();
  const counts = selectedCameraCounts();
  if (!rule) return { ipcRemaining: Infinity, ahdRemaining: Infinity, warning: "" };
  if (rule.maxAhd !== undefined) {
    return {
      ipcRemaining: Math.max(0, rule.maxIpc - counts.ipc),
      ahdRemaining: Math.max(0, rule.maxAhd - counts.ahd),
      warning: cameraCapacityWarning(),
    };
  }
  const ipcRemaining = counts.ahd >= rule.maxAhdOnly ? 0 : Math.max(0, rule.maxIpc - counts.ipc);
  const ahdLimit = counts.ipc >= 1 ? rule.maxAhdWithIpc : rule.maxAhdOnly;
  return {
    ipcRemaining,
    ahdRemaining: Math.max(0, ahdLimit - counts.ahd),
    warning: cameraCapacityWarning(),
  };
}

function isAccessoryChoiceDisabled(accessoryDef) {
  const accessoryState = ensureAccessoryState(accessoryDef.id);
  if (accessoryState.checked || !accessoryDef.cameraType) return false;
  const status = cameraCapacityStatus();
  if (accessoryDef.cameraType === "ipc") return status.ipcRemaining <= 0;
  if (accessoryDef.cameraType === "ahd") return status.ahdRemaining <= 0;
  return false;
}

function maxAccessoryQuantity(accessoryDef) {
  if (!accessoryDef.cameraType) return 1;
  const currentState = ensureAccessoryState(accessoryDef.id);
  const currentQty = Number(currentState.quantity || 0);
  const counts = selectedCameraCounts();
  const otherIpc = counts.ipc - (accessoryDef.cameraType === "ipc" ? currentQty : 0);
  const otherAhd = counts.ahd - (accessoryDef.cameraType === "ahd" ? currentQty : 0);
  const powerBox = selectedCustomPowerBox();
  if (!powerBox) return 1;
  if (powerBox.id === "standard" || powerBox.id === "plus") {
    if (accessoryDef.cameraType === "ipc") return Math.max(0, 1 - otherIpc);
    if (accessoryDef.cameraType === "ahd") return Math.max(0, 1 - otherAhd);
    return 1;
  }
  if (powerBox.id === "max") {
    if (accessoryDef.cameraType === "ipc") {
      if (otherAhd >= 4) return 0;
      return Math.max(0, 1 - otherIpc);
    }
    if (accessoryDef.cameraType === "ahd") {
      const limit = otherIpc >= 1 ? 3 : 4;
      return Math.max(0, limit - otherAhd);
    }
  }
  return 1;
}

function normalizeAccessorySelections() {
  for (const def of customCatalog.accessories) {
    const stateBlock = ensureAccessoryState(def.id);
    if (!def.cameraType) {
      stateBlock.checked = Boolean(stateBlock.checked);
      if (stateBlock.checked && !stateBlock.extension && def.extensionRows?.length) {
        stateBlock.extension = findItemByRow(def.extensionRows[0])?.id || "";
      }
      if (stateBlock.checked && !stateBlock.extraExtension && def.secondaryExtensionRows?.length) {
        stateBlock.extraExtension = findItemByRow(def.secondaryExtensionRows[0])?.id || "";
      }
      continue;
    }
    if (Number(stateBlock.quantity || 0) <= 0) {
      stateBlock.checked = false;
      stateBlock.quantity = 0;
      stateBlock.extension = "";
      stateBlock.extraExtension = "";
      stateBlock.addonChecked = false;
      stateBlock.extensions = [];
      continue;
    }
    const maxQty = Math.max(0, maxAccessoryQuantity(def));
    stateBlock.checked = true;
    stateBlock.quantity = Math.min(Math.max(1, Number(stateBlock.quantity || 1)), maxQty);
    const defaultExtensionId = def.extensionRows?.length ? findItemByRow(def.extensionRows[0])?.id || "" : "";
    stateBlock.extensions = Array.from(
      { length: Number(stateBlock.quantity || 0) },
      (_, index) => stateBlock.extensions?.[index] || defaultExtensionId
    );
    stateBlock.extension = stateBlock.extensions[0] || stateBlock.extension || "";
  }
}

function orderedCustomAccessories() {
  const powerBox = selectedCustomPowerBox();
  return customCatalog.accessories
    .filter((item) => !item.allowedPowerBoxes || (powerBox && item.allowedPowerBoxes.includes(powerBox.id)))
    .sort((left, right) => {
      const leftRank = left.cameraType ? 0 : 1;
      const rightRank = right.cameraType ? 0 : 1;
      if (leftRank !== rightRank) return leftRank - rightRank;
      return (left.sortOrder || 0) - (right.sortOrder || 0);
    });
}

function extractCableLength(item) {
  const text = [item?.note, item?.description, item?.name].filter(Boolean).join(" ");
  const match = text.match(/(\d+(?:\.\d+)?)\s*(M|CM|MM)\b/i);
  return match ? `${match[1]}${match[2].toUpperCase()}` : "";
}

function formatExtensionOptionLabel(item) {
  const length = extractCableLength(item);
  const rawName = typeof item?.name === "string" ? item.name : displayCatalogText(item?.name || "");
  const name = normalizeWhitespace((rawName || "").split(/\r?\n/)[0]);
  const partNumber = item?.partNumber || t().noPartNumber;
  return [length, name, partNumber].filter(Boolean).join(" | ");
}

function extensionLengthValue(item) {
  const text = [item?.note, item?.description, item?.name].filter(Boolean).join(" ");
  const match = text.match(/(\d+(?:\.\d+)?)\s*(M|CM|MM)\b/i);
  if (!match) return Number.POSITIVE_INFINITY;
  const value = Number(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === "MM") return value / 1000;
  if (unit === "CM") return value / 100;
  return value;
}

function accessoryDetailText(def) {
  if (def.id === "screen") return state.language === "zh" ? UI.zh.accessoryDetails.screen : UI.en.accessoryDetails.screen;
  return state.language === "zh" ? def.detail : def.detailEn;
}

function optionalDetailText(def) {
  return state.language === "zh" ? def.detail : def.detailEn;
}

function ensureAccessoryState(accessoryId) {
  if (!state.custom.accessories[accessoryId]) {
    state.custom.accessories[accessoryId] = { checked: false, extension: "", extraExtension: "", addonChecked: false, extensions: [], quantity: 0 };
  }
  return state.custom.accessories[accessoryId];
}

function ensureOptionalState(optionalId) {
  if (!state.custom.optionals[optionalId]) {
    state.custom.optionals[optionalId] = {
      checked: false,
      extension: "",
      extensions: [],
      quantity: 0,
      variant1: SD_CARD_VARIANTS[0].partNumber,
      variant2: SD_CARD_VARIANTS[0].partNumber,
    };
  }
  return state.custom.optionals[optionalId];
}

function setCustomHost(hostId) {
  state.custom.host = hostId;
  render();
}

function setCustomPowerBox(powerBoxId) {
  const changed = state.custom.powerBox !== powerBoxId;
  state.custom.powerBox = powerBoxId;
  if (changed) {
    applyDefaultWiring();
    state.custom.optionals = {};
    normalizeAccessorySelections();
  }
  render();
}

function isWiringSupported(mode) {
  const powerBoxId = state.custom.powerBox;
  return powerBoxId ? Boolean(mode.support[powerBoxId]) : false;
}

function applyDefaultWiring() {
  state.custom.wiring = {};
  state.custom.wiringExtras = {};
  if (state.custom.powerBox === "standard") state.custom.wiring.loose = true;
  if (state.custom.powerBox === "plus" || state.custom.powerBox === "max") {
    state.custom.wiring["16pin"] = true;
    state.custom.wiringExtras.power16Extension = true;
  }
}

function toggleCustomWiring(wiringId, checked) {
  const powerBoxId = state.custom.powerBox;
  if ((powerBoxId === "standard" && wiringId === "loose") || ((powerBoxId === "plus" || powerBoxId === "max") && wiringId === "16pin")) {
    state.custom.wiring[wiringId] = true;
    render();
    return;
  }
  state.custom.wiring[wiringId] = checked;
  render();
}

function toggleCustomWiringExtra(extraId, checked) {
  state.custom.wiringExtras[extraId] = checked;
  render();
}

function toggleCustomAccessory(accessoryId, checked) {
  const accessoryDef = customCatalog.accessories.find((item) => item.id === accessoryId);
  if (!accessoryDef) return;
  const accessoryState = ensureAccessoryState(accessoryId);
  if (accessoryDef.cameraType) {
    accessoryState.quantity = checked ? Math.max(1, Number(accessoryState.quantity || 1)) : 0;
    accessoryState.checked = accessoryState.quantity > 0;
    if (!accessoryState.checked) accessoryState.addonChecked = false;
    normalizeAccessorySelections();
    render();
    return;
  }
  accessoryState.checked = checked;
  accessoryState.quantity = checked ? 1 : 0;
  if (checked && !accessoryState.extension && accessoryDef.extensionRows?.length) {
    const defaultExtension = findItemByRow(accessoryDef.extensionRows[0]);
    accessoryState.extension = defaultExtension?.id || "";
  }
  if (checked && !accessoryState.extraExtension && accessoryDef.secondaryExtensionRows?.length) {
    const defaultExtraExtension = findItemByRow(accessoryDef.secondaryExtensionRows[0]);
    accessoryState.extraExtension = defaultExtraExtension?.id || "";
  }
  if (!checked) {
    accessoryState.extension = accessoryDef.lockExtension && accessoryDef.extensionRows?.length
      ? findItemByRow(accessoryDef.extensionRows[0])?.id || ""
      : "";
    accessoryState.extraExtension = "";
  }
  normalizeAccessorySelections();
  render();
}

function setCustomAccessoryQuantity(accessoryId, quantity) {
  const accessoryDef = customCatalog.accessories.find((item) => item.id === accessoryId);
  if (!accessoryDef) return;
  const accessoryState = ensureAccessoryState(accessoryId);
  const maxQty = Math.max(0, maxAccessoryQuantity(accessoryDef));
  accessoryState.quantity = Math.min(Math.max(0, Number(quantity || 0)), maxQty);
  accessoryState.checked = accessoryState.quantity > 0;
  normalizeAccessorySelections();
  if (accessoryDef.cameraType) {
    if (accessoryState.quantity > 0) {
      state.custom.accessoryEditor = accessoryId;
    } else if (state.custom.accessoryEditor === accessoryId) {
      state.custom.accessoryEditor = null;
    }
  }
  render();
}

function openAccessoryEditor(accessoryId) {
  state.custom.accessoryEditor = accessoryId;
  render();
}

function closeAccessoryEditor() {
  state.custom.accessoryEditor = null;
  render();
}

function toggleCustomOptional(optionalId, checked) {
  const optionalDef = customCatalog.optionals.find((item) => item.id === optionalId);
  if (!optionalDef) return;
  if (isOptionalDisabled(optionalDef)) return;
  const optionalState = ensureOptionalState(optionalId);
  if (optionalDef.maxQuantity) {
    optionalState.quantity = checked ? Math.max(1, Number(optionalState.quantity || 1)) : 0;
    optionalState.checked = optionalState.quantity > 0;
    if (optionalDef.extensionRows?.length) {
      const defaultExtension = findItemByRow(optionalDef.extensionRows[0])?.id || "";
      optionalState.extensions = Array.from(
        { length: Number(optionalState.quantity || 0) },
        (_, index) => optionalState.extensions?.[index] || defaultExtension
      );
      optionalState.extension = optionalState.extensions[0] || "";
    }
    render();
    return;
  }
  optionalState.checked = checked;
  if (checked && !optionalState.extension && optionalDef.extensionRows?.length) {
    const defaultExtension = findItemByRow(optionalDef.extensionRows[0]);
    optionalState.extension = defaultExtension?.id || "";
  }
  if (!checked) {
    optionalState.extension = optionalDef.lockExtension && optionalDef.extensionRows?.length
      ? findItemByRow(optionalDef.extensionRows[0])?.id || ""
      : "";
  }
  render();
}

function setAccessoryExtension(accessoryId, nextValue, slot = 0, stateField = "extension") {
  const accessoryDef = customCatalog.accessories.find((item) => item.id === accessoryId);
  const accessoryState = ensureAccessoryState(accessoryId);
  if (!accessoryDef) return;
  if (nextValue === "none") {
    if (!window.confirm(t().confirmRemoveCable)) {
      render();
      return;
    }
    if (stateField === "extensions") {
      accessoryState.extensions[slot] = "";
      if (slot === 0) accessoryState.extension = "";
    } else {
      accessoryState[stateField] = "";
    }
    render();
    return;
  }
  const matchedItem = findItemByRow(Number(nextValue));
  const matchedId = matchedItem?.id || "";
  if (accessoryDef.cameraType && stateField === "extensions") {
    accessoryState.extensions[slot] = matchedId;
    if (slot === 0) accessoryState.extension = matchedId;
  } else {
    accessoryState[stateField] = matchedId;
  }
  render();
}

function toggleAccessoryAddon(accessoryId, checked) {
  const accessoryState = ensureAccessoryState(accessoryId);
  accessoryState.addonChecked = checked;
  if (accessoryId === "ca42" && checked && selectedCustomPowerBox()?.id === "standard") {
    const rwatchState = ensureOptionalState("rwatch");
    rwatchState.checked = false;
    rwatchState.quantity = 0;
  }
  render();
}

function setOptionalExtension(optionalId, nextValue, slot = 0) {
  const optionalDef = customCatalog.optionals.find((item) => item.id === optionalId);
  const optionalState = ensureOptionalState(optionalId);
  const matchedItem = findItemByRow(Number(nextValue));
  const matchedId = matchedItem?.id || "";
  if (optionalDef?.maxQuantity && optionalDef.extensionRows?.length) {
    optionalState.extensions[slot] = matchedId;
    if (slot === 0) optionalState.extension = matchedId;
  } else {
    optionalState.extension = matchedId;
  }
  render();
}

function setOptionalQuantity(optionalId, quantity) {
  const optionalDef = customCatalog.optionals.find((item) => item.id === optionalId);
  const optionalState = ensureOptionalState(optionalId);
  const maxQty = Math.max(1, Number(optionalDef?.maxQuantity || 2));
  optionalState.quantity = Math.min(maxQty, Math.max(0, Number(quantity || 0)));
  optionalState.checked = optionalState.quantity > 0;
  if (optionalDef?.extensionRows?.length) {
    const defaultExtension = findItemByRow(optionalDef.extensionRows[0])?.id || "";
    optionalState.extensions = Array.from(
      { length: Number(optionalState.quantity || 0) },
      (_, index) => optionalState.extensions?.[index] || defaultExtension
    );
    optionalState.extension = optionalState.extensions[0] || "";
  }
  render();
}

function setOptionalVariant(optionalId, slot, partNumber) {
  const optionalState = ensureOptionalState(optionalId);
  if (slot === 1) optionalState.variant1 = partNumber;
  if (slot === 2) optionalState.variant2 = partNumber;
  render();
}

function wiringSummaryText() {
  const powerBox = selectedCustomPowerBox();
  const modes = selectedCustomWirings();
  if (!modes.length || !powerBox) return "";
  return modes
    .map((mode) => {
      const supportType = mode.support[powerBox.id];
      if (supportType === "builtin") return `${localizedText(mode.title)} (${"included"})`;
      if (supportType === false) return "";
      if (mode.id === "16pin" && (powerBox.id === "plus" || powerBox.id === "max")) return localizedText(mode.title);
      const item = findItemByRow(mode.rows[powerBox.id]);
      return normalizeWhitespace(item?.name || localizedText(mode.title));
    })
    .filter(Boolean)
    .join(" / ");
}

function selectedPresetItems() {
  const rows = itemsForFamily()
    .filter((item) => {
      // C6: AHD extension cables are chosen per-camera (nested); the AHD expansion cable (r15) is auto-added.
      if (isC6Product() && [15, 16, 17, 18, 19].includes(item.rowNumber)) return false;
      // AVM: connection + B2 adapter cables are auto-added, not manually selected.
      if (isAvmProduct() && [7, 8, 19, 20].includes(item.rowNumber)) return false;
      return isMSeriesProduct() ? m3nPresetItemSelected(item) : state.selections[item.id]?.checked;
    })
    .map((item) => {
      const variantOptions = presetVariantOptions(item);
      const selectedVariantPart = state.selections[item.id]?.variantPartNumber;
      const selectedVariant = variantOptions?.find((entry) => entry.partNumber === selectedVariantPart) || variantOptions?.[0] || null;
      const avmQuantity =
        isAvmProduct() && item.rowNumber === 13
          ? "4"
          : state.selections[item.id]?.quantity || item.quantity || "1";
      return {
        product: product.title,
        scenario: localizedText(currentScenario()?.title || ""),
        family: state.familyId || "",
        group: displayCatalogText(item.group),
        name: variantOptions
          ? localizedText(selectedVariant.name)
          : (isZ5Product() && Z5_STEP_ROWS.storage.has(item.rowNumber))
            ? `Micro SD ${displayCatalogText(item.note || item.name)}`
          : (skuInfo(item.partNumber)?.title ? localizedText(skuInfo(item.partNumber).title) : displayCatalogText(item.name)),
        partNumber: variantOptions ? selectedVariant.partNumber : item.partNumber,
        quantity:
          isMSeriesProduct() && isM3nPresetCameraItem(item)
            ? String(Number(state.selections[item.id]?.quantity || 0))
            : avmQuantity,
        note: displayCatalogText(item.note),
        description: displayCatalogText(item.description),
      };
    });

  if (isC6Product()) {
    const c6Line = (it, qty = "1") => ({
      product: product.title,
      scenario: localizedText(currentScenario()?.title || ""),
      family: state.familyId || "",
      group: displayCatalogText(it.group),
      name: skuInfo(it.partNumber)?.title ? localizedText(skuInfo(it.partNumber).title) : displayCatalogText(it.name),
      partNumber: it.partNumber,
      quantity: qty,
      note: displayCatalogText(it.note),
      description: displayCatalogText(it.description),
    });
    const selectedCams = c6Items([20, 21, 22]).filter((cam) => state.selections[cam.id]?.checked);
    // Append each selected camera's chosen AHD extension cable.
    selectedCams.forEach((cam) => {
      const extRow = state.selections[cam.id]?.c6ExtRow;
      const ext = extRow ? findItemByRow(Number(extRow)) : null;
      if (ext) rows.push(c6Line(ext));
    });
    // Auto-add one AHD expansion cable (r15) whenever any camera is selected.
    if (selectedCams.length) {
      const exp = c6Items([15])[0];
      if (exp) rows.push(c6Line(exp));
    }
  }

  if (isAvmProduct()) {
    // Auto-add the connection-mode adapter cable (standalone -> r7, cascade -> r8).
    const mode = avmCurrentMode();
    if (mode) {
      const adapter = findItemByRow(mode.adapterRow);
      if (adapter) {
        rows.push({
          product: product.title,
          scenario: localizedText(currentScenario()?.title || ""),
          family: state.familyId || "",
          group: displayCatalogText(adapter.group),
          name: skuInfo(adapter.partNumber)?.title ? localizedText(skuInfo(adapter.partNumber).title) : displayCatalogText(adapter.name),
          partNumber: adapter.partNumber,
          quantity: "1",
          note: displayCatalogText(adapter.note),
          description: displayCatalogText(adapter.description),
        });
      }
    }
    const b2Selections = itemsForFamily().filter(
      (item) => state.selections[item.id]?.checked && item.rowNumber !== undefined && [17, 18].includes(item.rowNumber)
    );
    if (b2Selections.length === 1) {
      const singleB2Adapter = findItemByRow(19);
      if (singleB2Adapter) {
        rows.push({
          product: product.title,
          scenario: localizedText(currentScenario()?.title || ""),
          family: state.familyId || "",
          group: displayCatalogText(singleB2Adapter.group),
          name: displayCatalogText(singleB2Adapter.name),
          partNumber: singleB2Adapter.partNumber,
          quantity: "1",
          note: displayCatalogText(singleB2Adapter.note),
          description: displayCatalogText(singleB2Adapter.description),
        });
      }
    }
    if (b2Selections.length >= 2) {
      const dualB2Adapter = findItemByRow(20);
      if (dualB2Adapter) {
        rows.push({
          product: product.title,
          scenario: localizedText(currentScenario()?.title || ""),
          family: state.familyId || "",
          group: displayCatalogText(dualB2Adapter.group),
          name: displayCatalogText(dualB2Adapter.name),
          partNumber: dualB2Adapter.partNumber,
          quantity: "1",
          note: displayCatalogText(dualB2Adapter.note),
          description: displayCatalogText(dualB2Adapter.description),
        });
      }
    }
    return rows;
  }

  if (!isMSeriesProduct()) return rows;

  const b2Selections = itemsForFamily().filter(
    (item) => m3nPresetItemSelected(item) && item.rowNumber !== undefined && [18, 19].includes(item.rowNumber)
  );

  if (b2Selections.length === 1) {
    const singleB2Adapter = findItemByRow(20);
    if (singleB2Adapter) {
      rows.push({
        product: product.title,
        scenario: localizedText(currentScenario()?.title || ""),
        family: state.familyId || "",
        group: displayCatalogText(singleB2Adapter.group),
        name: displayCatalogText(singleB2Adapter.name),
        partNumber: singleB2Adapter.partNumber,
        quantity: "1",
        note: displayCatalogText(singleB2Adapter.note),
        description: displayCatalogText(singleB2Adapter.description),
      });
    }
  }

  if (b2Selections.length >= 2) {
    const dualB2Adapter = findItemByRow(21);
    if (dualB2Adapter) {
      rows.push({
        product: product.title,
        scenario: localizedText(currentScenario()?.title || ""),
        family: state.familyId || "",
        group: displayCatalogText(dualB2Adapter.group),
        name: displayCatalogText(dualB2Adapter.name),
        partNumber: dualB2Adapter.partNumber,
        quantity: "1",
        note: displayCatalogText(dualB2Adapter.note),
        description: displayCatalogText(dualB2Adapter.description),
      });
    }
  }

  const extensionRows = [];
  for (const item of itemsForFamily().filter((entry) => m3nPresetItemSelected(entry))) {
    const block = state.selections[item.id] || {};
    const extensionIds =
      isM3nPresetCameraItem(item) && Array.isArray(block.extensions) && block.extensions.length
        ? block.extensions
        : block.extensionId
          ? [block.extensionId]
          : [];
    for (const extensionId of extensionIds) {
      if (!extensionId) continue;
      const extensionItem = product.items.find((entry) => entry.id === extensionId);
      if (!extensionItem) continue;
      extensionRows.push({
        product: product.title,
        scenario: localizedText(currentScenario()?.title || ""),
        family: state.familyId || "",
        group: displayCatalogText(extensionItem.group),
        name: displayCatalogText(extensionItem.name),
        partNumber: extensionItem.partNumber,
        quantity: "1",
        note: displayCatalogText(extensionItem.note),
        description: displayCatalogText(extensionItem.description),
      });
    }
  }

  return [...rows, ...extensionRows];
}

function selectedCustomItems() {
  const rows = [];
  const pkg = customPackageItem();
  if (pkg) rows.push(pkg);

  const powerBox = selectedCustomPowerBox();
  const hasReachedWiringStep = state.step >= 4;
  if (powerBox && hasReachedWiringStep) {
    for (const wiring of selectedCustomWirings()) {
      const supportType = wiring.support[powerBox.id];
      if (supportType === "item") {
        if (wiring.id === "16pin" && (powerBox.id === "plus" || powerBox.id === "max")) continue;
        const mapped = findItemByRow(wiring.rows[powerBox.id]);
        if (mapped) rows.push(mapped);
      }
    }
    if ((powerBox.id === "plus" || powerBox.id === "max") && state.custom.wiringExtras.power16Extension) {
      const extensionItem = findItemByRow(25);
      if (extensionItem) rows.push(extensionItem);
    }
  }

  const selectedAccessoryDefs = selectedCustomAccessoryDefs();
  const shouldAddVideoOutputCable = selectedAccessoryDefs.some((def) => {
    if (def.cameraType) return true;
    if (def.id === "screen") return powerBox?.id !== "max";
    return false;
  });
  if (shouldAddVideoOutputCable) {
    const helper = findItemByRow(customCatalog.helperRows.videoOutputCable);
    if (helper) rows.push(helper);
  }

  for (const def of selectedAccessoryDefs) {
    const item = def.sourceProductId ? findCatalogItem(def.sourceProductId, def.itemRow) : findItemByRow(def.itemRow);
    const accessoryState = ensureAccessoryState(def.id);
    const quantity = Number(accessoryState.quantity || 0);
    if (def.cameraType && quantity <= 0) continue;
    if (item) rows.push({ ...item, quantity: String(quantity) });
    if (def.cameraType) {
      for (const extensionId of accessoryState.extensions || []) {
        if (!extensionId) continue;
        const extensionItem = product.items.find((entry) => entry.id === extensionId);
        if (extensionItem) rows.push({ ...extensionItem, quantity: "1" });
      }
    } else {
      const extensionId = accessoryState.extension;
      if (extensionId) {
        const extensionItem = product.items.find((entry) => entry.id === extensionId);
        if (extensionItem) rows.push({ ...extensionItem, quantity: String(quantity || 1) });
      }
      const extraExtensionId = accessoryState.extraExtension;
      if (extraExtensionId) {
        const extraExtensionItem = product.items.find((entry) => entry.id === extraExtensionId);
        if (extraExtensionItem) rows.push({ ...extraExtensionItem, quantity: String(quantity || 1) });
      }
    }
    if (def.id === "ca42" && accessoryState.addonChecked) {
      rows.push({
        id: "ca42_serial_adapter",
        rowNumber: 0,
        name: "Serial port adapter cable",
        group: "Reversing Monitoring, Rear BSD",
        note: "Optional. Used to enable trailer matching and available for all power-box builds. R-Watch is unavailable only when this is enabled on Standard Power Box.",
        description: "232 Signal Adapter Cable - C43 | One end small 5557-4P, other end SM-3Y female head + flying lead | 150mm | No label | C43 | 3036ML",
        partNumber: "1261050100291",
        quantity: "1",
      });
    }
  }

  for (const def of selectedCustomOptionalDefs()) {
    if (def.id === "micro_sd") {
      const stateBlock = ensureOptionalState(def.id);
      const qty = Math.min(2, Math.max(1, Number(stateBlock.quantity || 1)));
      const selectedParts = [stateBlock.variant1, stateBlock.variant2].slice(0, qty);
      for (const partNumber of selectedParts) {
        const variant = SD_CARD_VARIANTS.find((item) => item.partNumber === partNumber) || SD_CARD_VARIANTS[0];
        rows.push({
          id: `micro_sd_${variant.partNumber}`,
          group: "Storage",
          name: localizedText(variant.name),
          partNumber: variant.partNumber,
          quantity: "1",
          note: def.detailEn,
          description: def.detailEn,
        });
      }
      continue;
    }
    const stateBlock = ensureOptionalState(def.id);
    const quantity = Math.max(1, Number(stateBlock.quantity || 1));
    const item = findItemByRow(def.itemRow);
    if (item) rows.push({ ...item, quantity: String(quantity) });
    for (const requiredRow of def.requiredRows || []) {
      const requiredItem = findItemByRow(requiredRow);
      if (requiredItem) rows.push({ ...requiredItem, quantity: String(quantity) });
    }
    if (def.maxQuantity && def.extensionRows?.length) {
      for (const extensionId of stateBlock.extensions || []) {
        if (!extensionId) continue;
        const extensionItem = product.items.find((entry) => entry.id === extensionId);
        if (extensionItem) rows.push({ ...extensionItem, quantity: "1" });
      }
    } else {
      const extensionId = stateBlock.extension;
      if (extensionId) {
        const extensionItem = product.items.find((entry) => entry.id === extensionId);
        if (extensionItem) rows.push(extensionItem);
      }
    }
  }

  const mergedRows = Array.from(
    rows.reduce((acc, item) => {
      const existing = acc.get(item.id);
      const qty = Number(item.quantity || "1");
      if (existing) {
        existing.quantity = String(Number(existing.quantity || "1") + qty);
      } else {
        acc.set(item.id, { ...item, quantity: String(qty) });
      }
      return acc;
    }, new Map()).values()
  );
  return mergedRows.map((item) => ({
    product: product.title,
    scenario: localizedText(currentScenario()?.title || ""),
    family: state.familyId || "",
    group: displayCatalogText(item.group),
    name: displayCatalogText(item.name),
    partNumber: item.partNumber,
    quantity: item.quantity || "1",
    note: displayCatalogText(item.note),
    description: displayCatalogText(item.description),
  }));
}

function selectedItems() {
  return isCustomFlow() ? selectedCustomItems() : selectedPresetItems();
}

function updateStepControls() {
  const steps = currentSteps();
  prevStepBtn.disabled = state.productPickerOpen;
  nextStepBtn.textContent = state.step === steps.length ? t().stay : t().next;
  nextStepBtn.disabled = state.productPickerOpen
    ? !Boolean(state.productId)
    : state.step === steps.length || !validateCurrentStep();
}

function validateCurrentStep() {
  if (state.productPickerOpen) return Boolean(state.productId);
  if (!isCustomFlow()) {
    if (state.step === 1) return (isC6Product() || isAvmProduct()) ? Boolean(state.packageId) : Boolean(state.scenarioId);
    if (state.step === 2) {
      // C6 requires a power cable (RS232/CAN model + connector) before moving on.
      if (isC6Product()) return c6Items([10, 11, 12, 13]).some((it) => state.selections[it.id]?.checked);
      // AVM requires a connection mode.
      if (isAvmProduct()) return Boolean(state.avm?.mode);
      return Boolean(state.packageId);
    }
    return true;
  }
  if (state.step === 1) return Boolean(state.scenarioId);
  if (state.step === 2) return Boolean(state.custom.host);
  if (state.step === 3) return Boolean(state.custom.powerBox);
  if (state.step === 4) return selectedCustomWirings().length > 0;
  return true;
}

function renderStepPills() {
  if (wizardTopEl) {
    wizardTopEl.hidden = state.productPickerOpen;
  }
  if (state.productPickerOpen) {
    stepPillsEl.innerHTML = "";
    stepCopyEl.innerHTML = "";
    return;
  }
  const steps = currentSteps();
  stepPillsEl.innerHTML = steps
    .map(
      (step) => `
        <div class="step-pill ${step.id === state.step ? "active" : ""} ${step.id < state.step ? "done" : ""}">
          <span>${step.id}</span>
          <strong>${step.title}</strong>
        </div>
      `
    )
    .join("");

  const step = steps.find((item) => item.id === state.step) || steps[0];
  stepCopyEl.innerHTML = `
    <span class="step">${t().stepLabel} ${step.id}</span>
    <h2>${step.title}</h2>
    <p>${step.description}</p>
  `;
}

function renderScenarioStep() {
  wizardStageEl.innerHTML = `
    <div class="scenario-grid product-entry-grid">
      ${productEntries()
        .map((entry) => {
          const active = entry.id === state.productId ? "active" : "";
          return `
            <button class="scenario-card product-entry-card ${active}" data-product-entry="${entry.id}">
              ${
                entry.image
                  ? `<div class="scenario-media"><img loading="lazy" decoding="async" src="./${entry.image}" alt="${entry.title}" /></div>`
                  : `<div class="scenario-media"><span class="empty">${entry.title}</span></div>`
              }
              <div class="scenario-copy">
                <div class="tag">${L("产品", "Product")}</div>
                <h3>${entry.title}</h3>
                <p>${entry.note}</p>
              </div>
            </button>
          `;
        })
        .join("")}
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-product-entry]").forEach((node) => {
    node.addEventListener("click", () => chooseProduct(node.dataset.productEntry));
  });
}

function renderScenarioCompareSection() {
  const baseImage = "North America Sales List-FILE/AD Plus 2_0/Image/1--image.png";
  const hostImage = "North America Sales List-FILE/AD Plus 2_0/Image/image.png";
  const rWatchImage = "North America Sales List-FILE/AD Plus 2_0/Image/R-Watch/41-R-Watch-image.png";
  const ca42Image = "North America Sales List-FILE/AD Plus 2_0/Image/CA42 2.0/35-CA42 2.0-image.png";

  return `
    <section class="compare-panel">
      <div class="compare-head">
        <h3>${t().homeCompareTitle}</h3>
        <p>${t().homeCompareIntro}</p>
      </div>
      <div class="compare-grid">
        <article class="compare-card">
          <div class="compare-label">${t().homeCompareRebuild}</div>
          <div class="exploded-diagram">
            <div class="exploded-node exploded-node-host">
              <img loading="lazy" decoding="async" src="./${hostImage}" alt="Host" />
              <strong>${"Dual-lens host"}</strong>
            </div>
            <div class="exploded-node exploded-node-power">
              <strong>${"Standard Power Box"}</strong>
              <span>${L("独立模块，可替换为 PBP / PBM", "Independent module, can be swapped to PBP / PBM")}</span>
            </div>
            <div class="exploded-node exploded-node-watch">
              <img loading="lazy" decoding="async" src="./${rWatchImage}" alt="R-Watch" />
              <strong>R-Watch</strong>
            </div>
            <div class="exploded-node exploded-node-camera">
              <img loading="lazy" decoding="async" src="./${ca42Image}" alt="CA42" />
              <strong>CA42 2.0</strong>
            </div>
            <div class="exploded-link exploded-link-1"></div>
            <div class="exploded-link exploded-link-2"></div>
            <div class="exploded-link exploded-link-3"></div>
          </div>
          <p class="hint">${t().homeCompareRebuildNote}</p>
        </article>

        <article class="compare-card">
          <div class="compare-label">${t().homeCompareOverlay}</div>
          <div class="overlay-diagram">
            <img loading="lazy" decoding="async" src="./${baseImage}" alt="Scenario 1" />
            <div class="overlay-tag overlay-tag-host">${L("主机", "Host")}</div>
            <div class="overlay-tag overlay-tag-power">${"Power box"}</div>
            <div class="overlay-tag overlay-tag-watch">R-Watch</div>
            <div class="overlay-tag overlay-tag-camera">CA42</div>
          </div>
          <p class="hint">${t().homeCompareOverlayNote}</p>
        </article>
      </div>
    </section>
  `;
}

function renderScenarioSplitPreview() {
  const labels = {
    title: "Original Diagram Split Preview",
    intro: "Keep the original line-art style, then split the host, power box, and video breakout directly from the source diagram and rearrange them for later swapping.",
    badge: "Split from original diagram",
    host: "Host",
    video: "Video breakout",
    power: "Standard power box",
    watch: "R-Watch",
    wiring: "Wiring options",
    wiringHint: "ACC / 16PIN OBD / 9PIN J1939 can be switched later based on vehicle type",
    note: "This first sample uses home-page Solution 1. Once this direction is confirmed, the other retained solutions can be split in the same style.",
  };

  return `
    <section class="compare-panel split-preview-panel">
      <div class="compare-head">
        <h3>${labels.title}</h3>
        <p>${labels.intro}</p>
      </div>
      <article class="compare-card split-preview-card">
        <div class="compare-label">${labels.badge}</div>
        <div class="split-diagram">
          <div class="split-part split-part-host">
            <span>${labels.host}</span>
            <img loading="lazy" decoding="async" src="./assets/diagram-parts/host-dual.png" alt="${labels.host}" />
          </div>
          <div class="split-part split-part-video">
            <span>${labels.video}</span>
            <img loading="lazy" decoding="async" src="./assets/diagram-parts/video-breakout.png" alt="${labels.video}" />
          </div>
          <div class="split-part split-part-power">
            <span>${labels.power}</span>
            <img loading="lazy" decoding="async" src="./assets/diagram-parts/power-box.png" alt="${labels.power}" />
          </div>
          <div class="split-part split-part-watch">
            <span>${labels.watch}</span>
            <img loading="lazy" decoding="async" src="./North America Sales List-FILE/AD Plus 2_0/Image/R-Watch/41-R-Watch-image.png" alt="${labels.watch}" />
          </div>
          <div class="split-part split-part-wiring">
            <span>${labels.wiring}</span>
            <div class="split-wiring-list">
              <b>ACC</b>
              <b>16PIN OBD</b>
              <b>9PIN J1939</b>
            </div>
            <p>${labels.wiringHint}</p>
          </div>
          <div class="split-link split-link-1"></div>
          <div class="split-link split-link-2"></div>
          <div class="split-link split-link-3"></div>
          <div class="split-link split-link-4"></div>
        </div>
        <p class="hint">${labels.note}</p>
      </article>
    </section>
  `;
}

function renderPresetPackageStep() {
  const packages = packageCandidates();
  const scenario = currentScenario();
  const resources = product?.resources || {};
  wizardStageEl.innerHTML = `
    <div class="focus-banner">
      <div>
        <strong>${(isC6Product() || isAvmProduct()) ? (state.language === "zh" ? "产品" : t().summaryFields.product) : t().summaryFields.solution}</strong>
        <p>${(isC6Product() || isAvmProduct()) ? (currentProduct()?.title || "-") : (localizedText(scenario?.title || "") || "-")}</p>
      </div>
      <div>
        ${
          (isC6Product() || isAvmProduct())
            ? `
              <strong>${L("当前选择", "Current selection")}</strong>
              <p>${currentPackage() ? displayCatalogText(currentPackage().name) : (L("请先选择基础套装", "Choose the base kit first"))}</p>
            `
            : `
              <strong>${t().labels.specsManual}</strong>
              <div class="resource-links">
                ${resources.specUrl ? `<a href="${resources.specUrl}" target="_blank" rel="noreferrer">${t().resourceLabels.spec}</a>` : ""}
                ${resources.manualUrl ? `<a href="${resources.manualUrl}" target="_blank" rel="noreferrer">${t().resourceLabels.manual}</a>` : ""}
              </div>
            `
        }
      </div>
    </div>
    <div class="package-grid">
      ${packages
        .map((item) => {
          const active = item.id === state.packageId ? "active" : "";
          const preview = packagePreview(item);
          return `
            <button class="package-card ${active}" data-package="${item.id}">
              ${
                preview.src
                  ? `<img loading="lazy" decoding="async" class="package-image" src="./${preview.src}" alt="${displayCatalogText(item.name)}" />`
                  : `<div class="package-image package-image-empty">${t().emptyPreview}</div>`
              }
              <div class="package-head">
                <div>
                  <div class="group-badge">${isC6Product() ? displayCatalogText((item.group || "").split(",")[0]) : displayCatalogText(item.group)}</div>
                  <h3>${displayCatalogText(item.name)}</h3>
                </div>
                <div class="sku">${item.partNumber || t().noPartNumber}</div>
              </div>
              <div class="review-card">
                <p>${displayCatalogText(item.note || item.description || "")}</p>
              </div>
              ${preview.fallback ? `<div class="fallback-note">${L("当前物料缺少独立图片，暂用方案图预览", "No dedicated item image. Using the solution image as fallback.")}</div>` : ""}
            </button>
          `;
        })
        .join("")}
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-package]").forEach((node) => {
    node.addEventListener("click", () => choosePackage(node.dataset.package));
  });
}

function z5CoreItem() {
  return product?.items?.find((item) => item.rowNumber === 2) || currentPackage() || packageCandidates()[0] || null;
}

function z5StorageItems() {
  return product?.items?.filter((item) => Z5_STEP_ROWS.storage.has(item.rowNumber)) || [];
}

function setZ5StorageQuantity(itemId, nextQuantity) {
  const quantity = Math.max(0, Math.min(1, Number(nextQuantity || 0)));
  for (const item of z5StorageItems()) {
    const block = ensurePresetSelectionState(item.id, item.quantity || "1");
    const selected = item.id === itemId && quantity > 0;
    block.checked = selected;
    block.quantity = selected ? "1" : "0";
  }
  render();
}

function renderZ5CoreStep() {
  const kit = z5CoreItem();
  if (kit?.id && !state.packageId) {
    state.packageId = kit.id;
    ensurePresetSelectionState(kit.id, kit.quantity || "1").checked = true;
  }
  const preview = kit ? packagePreview(kit) : { src: "", fallback: false };
  wizardStageEl.innerHTML = `
    <div class="focus-banner">
      <div>
        <strong>${t().summaryFields.product}</strong>
        <p>${currentProduct()?.title || "Z5"}</p>
      </div>
      <div>
        <strong>${L("Core kit", "Core kit")}</strong>
        <p>${kit ? displayCatalogText(kit.name) : "-"}</p>
      </div>
    </div>
    <div class="package-grid z5-package-grid">
      <button class="package-card active" data-package="${kit?.id || ""}">
        ${
          preview.src
            ? `<img loading="lazy" decoding="async" class="package-image" src="./${preview.src}" alt="${kit ? displayCatalogText(kit.name) : "Z5"}" />`
            : `<div class="package-image package-image-empty">${t().emptyPreview}</div>`
        }
        <div class="package-head">
          <div>
            <div class="group-badge">${displayCatalogText(kit?.group || "Z5 Kit")}</div>
            <h3>${kit ? displayCatalogText(kit.name) : "Z5"}</h3>
          </div>
          <div class="sku">${kit?.partNumber || t().noPartNumber}</div>
        </div>
        <div class="review-card">
          <p>${kit ? displayCatalogText(kit.note || kit.description || "") : ""}</p>
        </div>
      </button>
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-package]").forEach((node) => {
    node.addEventListener("click", () => choosePackage(node.dataset.package));
  });
}

function renderZ5StorageStep() {
  const storageItems = z5StorageItems();
  wizardStageEl.innerHTML = `
    <div class="focus-banner">
      <div>
        <strong>${t().summaryFields.product}</strong>
        <p>${currentProduct()?.title || "Z5"}</p>
      </div>
      <div>
        <strong>${L("Storage rule", "Storage rule")}</strong>
        <p>${L("Z5 supports up to 1 Micro SD card.", "Z5 supports up to 1 Micro SD card.")}</p>
      </div>
    </div>
    <div class="group-list accessory-vertical-list">
      ${storageItems
        .map((item) => {
          const block = ensurePresetSelectionState(item.id, item.quantity || "1");
          const quantity = block.checked ? Number(block.quantity || 0) : 0;
          const selected = quantity > 0 ? "selected" : "";
          const preview = skuInfo(item.partNumber)?.image || fallbackItemPreviewAsset(item);
          const capacity = displayCatalogText(item.note || item.name);
          return `
            <section class="group-card accessory-row-group">
              <div class="item-card accessory-row-card ${selected}">
                <div class="accessory-row-media">
                  ${preview ? `<img loading="lazy" decoding="async" class="thumb" src="./${preview}" alt="${capacity}" />` : `<div class="thumb"></div>`}
                </div>
                <div class="accessory-row-copy">
                  <h4>Micro SD ${capacity}</h4>
                  <div class="sku">${item.partNumber || t().noPartNumber}</div>
                  <p>${L("Storage option for Z5. Each host supports up to 1 card.", "Storage option for Z5. Each host supports up to 1 card.")}</p>
                </div>
                <div class="accessory-row-control">
                  <div class="qty-stepper" aria-label="Quantity">
                    <button type="button" class="qty-btn" data-z5-storage="${item.id}" data-direction="-1" ${quantity <= 0 ? "disabled" : ""}>-</button>
                    <span class="qty-value">${quantity}</span>
                    <button type="button" class="qty-btn" data-z5-storage="${item.id}" data-direction="1" ${quantity >= 1 ? "disabled" : ""}>+</button>
                  </div>
                </div>
              </div>
            </section>
          `;
        })
        .join("")}
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-z5-storage]").forEach((node) => {
    node.addEventListener("click", () => {
      const itemId = node.dataset.z5Storage;
      const block = ensurePresetSelectionState(itemId);
      const currentQty = block.checked ? Number(block.quantity || 0) : 0;
      const nextQty = currentQty + Number(node.dataset.direction || 0);
      setZ5StorageQuantity(itemId, nextQty);
    });
  });
}

function renderPresetAccessoryStep() {
  const groups = groupedItems(accessoryCandidates());
  wizardStageEl.innerHTML = `
    <div class="group-list">
      ${Object.entries(groups)
        .map(
          ([groupName, items]) => `
            <section class="group-card">
              <div class="group-meta">
                <h3>${displayCatalogText(groupName)}</h3>
                <div class="group-badge">${items.length}</div>
              </div>
              <div class="item-grid">
                ${items
                  .map((item) => {
                    const checked = state.selections[item.id]?.checked ? "checked" : "";
                    const preview = fallbackItemPreviewAsset(item);
                    return `
                      <label class="item-card ${checked ? "selected" : ""}">
                        <input type="checkbox" data-selection="${item.id}" ${checked} />
                        <div class="item-copy">
                          <div class="item-head">
                            <h4>${displayCatalogText(item.name)}</h4>
                            <div class="sku">${item.partNumber || t().noPartNumber}</div>
                          </div>
                          ${preview ? `<img loading="lazy" decoding="async" class="thumb" src="./${preview}" alt="${displayCatalogText(item.name)}" />` : `<div class="thumb"></div>`}
                          <p>${displayCatalogText(item.note || item.description || "")}</p>
                        </div>
                      </label>
                    `;
                  })
                  .join("")}
              </div>
            </section>
          `
        )
        .join("")}
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-selection]").forEach((node) => {
    node.addEventListener("change", (event) => {
      if (!state.selections[node.dataset.selection]) {
        state.selections[node.dataset.selection] = { checked: false, quantity: "1" };
      }
      state.selections[node.dataset.selection].checked = event.target.checked;
      render();
    });
  });
  wizardStageEl.querySelectorAll("[data-preset-variant]").forEach((node) => {
    node.addEventListener("change", (event) => {
      setPresetVariant(node.dataset.presetVariant, event.target.value);
    });
  });
}

function m1nItemsByRows(rowSet) {
  return (product?.items || []).filter((item) => rowSet.has(item.rowNumber));
}

function currentMSeriesStepRows() {
  if (isAvmProduct()) return AVM_STEP_ROWS;
  if (isM3nProduct()) return M3N_STEP_ROWS;
  if (isC6Product()) return C6_STEP_ROWS;
  return M1N_STEP_ROWS;
}

function currentMSeriesChannelRule() {
  return M_SERIES_CHANNEL_RULES[state.productId] || { ipc: 1, ahd: 1 };
}

function m3nCameraExtensionRows(item) {
  if (isM1nProduct()) {
    const text = `${item?.name || ""} ${item?.group || ""}`.toLowerCase();
    if (/c29n|ca20s|dms|adas/.test(text)) return [28, 29, 30];
    if (/ca29m|ca46|square camera|方型机|metal conch|金属海螺|bsd|surveillance/.test(text)) return [24, 25, 26, 27];
    return [];
  }
  const text = `${item?.name || ""} ${item?.group || ""}`.toLowerCase();
  if (/c29n|ca20s|dms|adas/.test(text)) return M3N_CAMERA_EXTENSION_ROWS.ipc;
  if (/ca29m/.test(text)) return M3N_CAMERA_EXTENSION_ROWS.ahd;
  if (/ca46|square camera|方型机|metal conch|金属海螺|bsd|surveillance/.test(text)) return M3N_CAMERA_EXTENSION_ROWS.ahd;
  return [];
}

function isM3nPresetCameraItem(item) {
  return Boolean(m3nPresetCameraType(item));
}

function m3nCameraExtensionRowsForMSeries(item) {
  const text = `${item?.name || ""} ${item?.group || ""}`.toLowerCase();
  if (/c29n/.test(text)) return M3N_CAMERA_EXTENSION_ROWS.ipc;
  if (/ca29m|ca20s/.test(text)) return M3N_CAMERA_EXTENSION_ROWS.ahd;
  if (/ca46|square camera|metal conch|bsd|surveillance/.test(text)) return M3N_CAMERA_EXTENSION_ROWS.ahd;
  return [];
}

function m3nPresetItemSelected(item) {
  if (!item) return false;
  if (isMSeriesProduct() && isM3nPresetCameraItem(item)) {
    const block = state.selections[item.id];
    return Boolean(block?.checked) && Number(block?.quantity || 0) > 0;
  }
  return Boolean(state.selections[item.id]?.checked);
}

function ensurePresetSelectionState(itemId, fallbackQuantity = "1") {
  if (!state.selections[itemId]) {
    state.selections[itemId] = { checked: false, quantity: fallbackQuantity };
  }
  return state.selections[itemId];
}

function isLockedPresetItem(item) {
  return isAvmProduct() && item?.rowNumber !== undefined && [13, 14].includes(item.rowNumber);
}

function maxM3nPresetQuantity(item) {
  const type = m3nPresetCameraType(item);
  if (!type) return 1;
  const block = state.selections[item.id];
  const currentQty = block?.checked ? Number(block.quantity || 0) : 0;
  const status = m3nPresetCameraStatus();
  return currentQty + (type === "ipc" ? status.ipcRemaining : status.ahdRemaining);
}

function presetVariantOptions(item) {
  if (!item) return null;
  if (isC6Product() && item.rowNumber === 24) return SD_CARD_VARIANTS;
  if (item.rowNumber === 37) return SD_CARD_VARIANTS;
  if (item.rowNumber === 38) return M2_SSD_VARIANTS;
  return null;
}

function setPresetVariant(itemId, partNumber) {
  const item = product?.items?.find((entry) => entry.id === itemId);
  const block = ensurePresetSelectionState(itemId, item?.quantity || "1");
  block.variantPartNumber = partNumber;
  render();
}

function setM3nPresetSelection(itemId, checked) {
  const item = product?.items?.find((entry) => entry.id === itemId);
  const block = ensurePresetSelectionState(itemId, item?.quantity || "1");
  block.checked = checked;
  if (isM3nPresetCameraItem(item)) {
    block.quantity = checked ? "1" : "0";
  }
  if (checked) {
    const extensionRows = m3nCameraExtensionRowsForMSeries(item);
    if (extensionRows.length && !block.extensionId) {
      block.extensionId = findItemByRow(extensionRows[0])?.id || "";
    }
    for (const childRow of [...m3nAdkitChildRows(item), ...m3nOptionalChildRows(item)]) {
      const childItem = findItemByRow(childRow);
      if (childItem) ensurePresetSelectionState(childItem.id, childItem.quantity || "1").checked = true;
    }
  } else {
    block.extensionId = "";
    for (const childRow of [...m3nAdkitChildRows(item), ...m3nOptionalChildRows(item)]) {
      const childItem = findItemByRow(childRow);
      if (childItem) ensurePresetSelectionState(childItem.id, childItem.quantity || "1").checked = false;
    }
  }
  render();
}

function setM3nPresetQuantity(itemId, nextQuantity) {
  const item = product?.items?.find((entry) => entry.id === itemId);
  if (!item) return;
  const block = ensurePresetSelectionState(itemId, item.quantity || "1");
  const maxQty = Math.max(0, maxM3nPresetQuantity(item));
  const quantity = Math.max(0, Math.min(maxQty, Number(nextQuantity || 0)));
  const defaultExtensionRows = m3nCameraExtensionRowsForMSeries(item);
  const defaultExtensionId = defaultExtensionRows.length ? findItemByRow(defaultExtensionRows[0])?.id || "" : "";
  block.quantity = quantity;
  block.checked = quantity > 0;
  block.extensions = Array.from({ length: quantity }, (_, index) => block.extensions?.[index] || defaultExtensionId);
  block.extensionId = block.extensions[0] || "";
  render();
}

function setM3nPresetChildSelection(itemId, checked) {
  const item = product?.items?.find((entry) => entry.id === itemId);
  const block = ensurePresetSelectionState(itemId, item?.quantity || "1");
  block.checked = checked;
  render();
}

function setM3nPresetCameraExtension(itemId, rowNumber, slot = 0) {
  const block = ensurePresetSelectionState(itemId);
  if (rowNumber === "none") {
    block.extensionId = "";
    if (Array.isArray(block.extensions)) block.extensions[slot] = "";
    render();
    return;
  }
  const extensionId = findItemByRow(Number(rowNumber))?.id || "";
  block.extensionId = extensionId;
  if (!Array.isArray(block.extensions)) block.extensions = [];
  block.extensions[slot] = extensionId;
  render();
}

function m3nPresetCameraType(item) {
  if (!item) return null;
  const extensionRows = m3nCameraExtensionRowsForMSeries(item);
  if (extensionRows === M3N_CAMERA_EXTENSION_ROWS.ipc) return "ipc";
  if (extensionRows === M3N_CAMERA_EXTENSION_ROWS.ahd) return "ahd";
  return null;
}

function m3nAdkitChildRows(item) {
  if (!item) return [];
  if (isM1nProduct() && item.rowNumber === 14) return [15, 16];
  if (isM3nProduct() && item.rowNumber === 13) return [14, 15];
  return [];
}

function m3nOptionalChildRows(item) {
  if (!item) return [];
  if (isM1nProduct()) {
    if (item.rowNumber === 8) return [9];
    if (item.rowNumber === 31) return [32];
    if (item.rowNumber === 34) return [35];
    if (item.rowNumber === 36) return [33];
    return [];
  }
  if (isM3nProduct()) {
    if (item.rowNumber === 8) return [9];
    if (item.rowNumber === 34) return [35];
    return [];
  }
  if (item.rowNumber === 34) return [35];
  if (item.rowNumber === 36) return [33];
  return [];
}

function m3nOptionalDisplay(item) {
  if (!item) return { name: "", note: "", preview: "" };
  if (item.rowNumber === 8) {
    return {
      name: "Microphone",
      note: "Choose when audio pickup is needed. The adapter cable is included below.",
      preview: fallbackItemPreviewAsset(item),
    };
  }
  const info = skuInfo(item.partNumber);
  return {
    name: info?.title ? localizedText(info.title) : displayCatalogText(item.name),
    note: info?.detail !== undefined ? L(info.detail, info.detailEn) : displayCatalogText(item.note || item.description || ""),
    preview: info?.image || fallbackItemPreviewAsset(item),
  };
}

function m3nPresetCameraStatus() {
  const channelRule = currentMSeriesChannelRule();
  const selectedItems = m1nItemsByRows(currentMSeriesStepRows().cameras).filter((item) => m3nPresetItemSelected(item));
  const ipc = selectedItems
    .filter((item) => m3nPresetCameraType(item) === "ipc")
    .reduce((sum, item) => sum + Number(state.selections[item.id]?.quantity || 0), 0);
  const ahd = selectedItems
    .filter((item) => m3nPresetCameraType(item) === "ahd")
    .reduce((sum, item) => sum + Number(state.selections[item.id]?.quantity || 0), 0);
  return {
    ipc,
    ahd,
    ipcRemaining: Math.max(0, channelRule.ipc - ipc),
    ahdRemaining: Math.max(0, channelRule.ahd - ahd),
  };
}

function renderM1nSelectableStep(items, summaryLabel) {
  const grouped = groupedItems(items);
  const itemCard = (item) => {
    const locked = isLockedPresetItem(item);
    const checked = (locked || state.selections[item.id]?.checked) ? "checked" : "";
    const selected = checked ? "selected" : "";
    const variantOptions = presetVariantOptions(item);
    const selectedVariantPart = state.selections[item.id]?.variantPartNumber;
    const selectedVariant = variantOptions?.find((entry) => entry.partNumber === selectedVariantPart) || variantOptions?.[0] || null;
    // Variant items (storage) keep their per-variant name; everything else can use the shared SKU library.
    const info = variantOptions ? null : skuInfo(item.partNumber);
    const preview = info?.image || fallbackItemPreviewAsset(item);
    const headingName = variantOptions ? localizedText(selectedVariant.name) : (info?.title ? localizedText(info.title) : displayCatalogText(item.name));
    const detailText = info?.detail !== undefined ? L(info.detail, info.detailEn) : displayCatalogText(item.note || item.description || "");
    return `
      <section class="group-card accessory-row-group">
        <label class="item-card accessory-row-card ${selected}">
          <div class="accessory-row-media">
            ${preview ? `<img loading="lazy" decoding="async" class="thumb" src="./${preview}" alt="${headingName}" />` : `<div class="thumb"></div>`}
          </div>
          <div class="accessory-row-copy">
            <h4>${headingName}</h4>
            <div class="sku">${variantOptions ? selectedVariant.partNumber : item.partNumber || t().noPartNumber}</div>
            <p>${detailText}</p>
          </div>
          <div class="accessory-row-control">
            <input type="checkbox" data-selection="${item.id}" ${checked} ${locked ? "disabled" : ""} />
          </div>
        </label>
        ${
          checked && variantOptions
            ? `
              <div class="extension-picker">
                <div class="extension-picker-head">
                  <strong>${L("容量 / 料号", "Capacity / part number")}</strong>
                  <span>${"Maximum 1 unit"}</span>
                </div>
                <label>
                  <span>${L("选择规格", "Choose variant")}</span>
                  <select data-preset-variant="${item.id}">
                    ${variantOptions
                      .map((variant) => `<option value="${variant.partNumber}" ${selectedVariant.partNumber === variant.partNumber ? "selected" : ""}>${localizedText(variant.name)} | ${variant.partNumber}</option>`)
                      .join("")}
                  </select>
                </label>
              </div>
            `
            : ""
        }
      </section>
    `;
  };
  wizardStageEl.innerHTML = `
    <div class="focus-banner">
      <div>
        <strong>${t().summaryFields.product}</strong>
        <p>${currentProduct()?.title || "-"}</p>
      </div>
      <div>
        <strong>${summaryLabel}</strong>
        <p>${currentPackage() ? displayCatalogText(currentPackage().name) : "-"}</p>
      </div>
    </div>
    <div class="group-list accessory-vertical-list">
      ${Object.entries(grouped)
        .map(([groupName, groupItems]) =>
          // Only keep a group header when it actually groups several parts; singletons render flat.
          groupItems.length >= 2
            ? `
              <section class="group-card">
                <div class="group-meta">
                  <h3>${displayCatalogText(groupName)}</h3>
                  <div class="group-badge">${groupItems.length}</div>
                </div>
                <div class="group-list accessory-vertical-list">
                  ${groupItems.map(itemCard).join("")}
                </div>
              </section>
            `
            : groupItems.map(itemCard).join("")
        )
        .join("")}
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-selection]").forEach((node) => {
    node.addEventListener("change", (event) => {
      if (!state.selections[node.dataset.selection]) {
        state.selections[node.dataset.selection] = { checked: false, quantity: "1" };
      }
      state.selections[node.dataset.selection].checked = event.target.checked;
      render();
    });
  });
  wizardStageEl.querySelectorAll("[data-preset-variant]").forEach((node) => {
    node.addEventListener("change", (event) => {
      setPresetVariant(node.dataset.presetVariant, event.target.value);
    });
  });
}

function c6Items(rows) {
  return (product?.items || []).filter((item) => rows.includes(item.rowNumber));
}
function c6PowerModelOf(item) {
  return /CAN/i.test(item.group?.en || item.group || "") ? "can" : "rs232";
}
function c6SelectedKitIsSingle() {
  const pkg = currentPackage();
  return /single-lens/i.test(pkg?.group?.en || pkg?.group || "");
}
function c6CurrentPowerModel() {
  const checked = c6Items([10, 11, 12, 13]).find((it) => state.selections[it.id]?.checked);
  return checked ? c6PowerModelOf(checked) : state.c6?.powerModel || null;
}
// Business rules from the spec:
//  - Extra cameras / AHD expansion are only for the single-lens (2.0-S) kit; the dual-lens uses both channels.
//  - R-Watch only works on the RS232 model.
function normalizeC6Selections() {
  const single = c6SelectedKitIsSingle();
  if (!single) {
    c6Items([20, 21, 22]).forEach((cam) => {
      if (state.selections[cam.id]) {
        state.selections[cam.id].checked = false;
        state.selections[cam.id].c6ExtRow = "";
      }
    });
  } else {
    // Single-lens expands only one AHD channel -> keep at most one camera.
    let seenCam = false;
    c6Items([20, 21, 22]).forEach((cam) => {
      if (state.selections[cam.id]?.checked) {
        if (seenCam) {
          state.selections[cam.id].checked = false;
          state.selections[cam.id].c6ExtRow = "";
        } else seenCam = true;
      }
    });
  }
  // AHD Expansion (r15) is auto-added with cameras, never selected manually.
  const exp = c6Items([15])[0];
  if (exp && state.selections[exp.id]) state.selections[exp.id].checked = false;
  if (c6CurrentPowerModel() === "can") {
    const rwatch = c6Items([23])[0];
    if (rwatch && state.selections[rwatch.id]) state.selections[rwatch.id].checked = false;
  }
}
const C6_POWER_MODELS = [
  { id: "rs232", title: { zh: "RS232 机型", en: "RS232 model" }, detail: { zh: "适用于 RS232 车型", en: "For RS232 vehicles" } },
  { id: "can", title: { zh: "CAN 机型", en: "CAN model" }, detail: { zh: "适用于 CAN 车型", en: "For CAN vehicles" } },
];

// AVM base: the AVM 360 kit (surround cameras + calibration are part of the core system).
function renderAvmBaseStep() {
  const kit = c6Items([6])[0];
  const included = c6Items([13, 14]); // CA51D ×4, calibration cloth
  const active = kit && kit.id === state.packageId ? "active" : "";
  const kitImg = (kit && (skuInfo(kit.partNumber)?.image || fallbackItemPreviewAsset(kit) || pickPreviewAsset(kit.images))) || "";
  wizardStageEl.innerHTML = `
    <button class="option-card avm-kit-card ${active}" data-package="${kit?.id || ""}">
      ${kitImg ? `<img loading="lazy" decoding="async" class="host-photo" src="./${kitImg}" alt="AVM" />` : `<div class="host-photo host-photo-empty">${t().emptyPreview}</div>`}
      <div class="tag">${L("360° 环视系统", "360° surround-view system")}</div>
      <h3>${displayCatalogText(kit?.name) || "AVM"}</h3>
      <div class="sku">${kit?.partNumber || t().noPartNumber}</div>
      <p>${displayCatalogText(kit?.note || "")}</p>
    </button>
    <div class="c6-section">
      <h3 class="c6-section-title">${L("套装已包含", "Included in this kit")}</h3>
      <div class="group-list accessory-vertical-list">
        ${included
          .map((it) => {
            const info = skuInfo(it.partNumber);
            const preview = info?.image || fallbackItemPreviewAsset(it);
            const qty = it.rowNumber === 13 ? " × 4" : "";
            const name = (info?.title ? localizedText(info.title) : displayCatalogText(it.name)) + qty;
            return `
              <section class="group-card accessory-row-group">
                <label class="item-card accessory-row-card selected">
                  <div class="accessory-row-media">${preview ? `<img loading="lazy" decoding="async" class="thumb" src="./${preview}" alt="${name}" />` : `<div class="thumb"></div>`}</div>
                  <div class="accessory-row-copy">
                    <h4>${name}</h4>
                    <div class="sku">${it.partNumber || t().noPartNumber}</div>
                    <p>${displayCatalogText(it.note || "")}</p>
                  </div>
                  <div class="accessory-row-control"><span class="tag">${L("必带", "Included")}</span></div>
                </label>
              </section>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
  wizardStageEl.querySelectorAll("[data-package]").forEach((node) => {
    node.addEventListener("click", () => choosePackage(node.dataset.package));
  });
}

// AVM connection modes: which adapter cable + reference diagram.
const AVM_MODES = [
  { id: "standalone", adapterRow: 7, diagram: "North America Sales List-FILE/AVM/Image/1--image.png",
    title: { zh: "单机录屏", en: "Standalone (record on screen)" },
    detail: { zh: "AVM 直连 DP7S 屏幕录制。", en: "AVM records directly to the DP7S screen." } },
  { id: "cascade", adapterRow: 8, diagram: "North America Sales List-FILE/AVM/Image/2--image.png",
    title: { zh: "级联录像机", en: "Cascade to a recorder" },
    detail: { zh: "AVM 作为从机接入 AD Plus / MDVR 录像机。", en: "AVM connects as a slave to an AD Plus / MDVR recorder." } },
];
function avmCurrentMode() {
  return AVM_MODES.find((m) => m.id === state.avm?.mode) || null;
}
// A selectable AVM item card (checkbox), curated via the SKU library.
function avmItemCard(item) {
  const block = state.selections[item.id] || {};
  const checked = block.checked ? "checked" : "";
  const selected = block.checked ? "selected" : "";
  const info = skuInfo(item.partNumber);
  const preview = info?.image || fallbackItemPreviewAsset(item);
  const name = info?.title ? localizedText(info.title) : displayCatalogText(item.name);
  const detail = info?.detail !== undefined ? L(info.detail, info.detailEn) : displayCatalogText(item.note || item.description || "");
  return `
    <section class="group-card accessory-row-group">
      <label class="item-card accessory-row-card ${selected}">
        <div class="accessory-row-media">${preview ? `<img loading="lazy" decoding="async" class="thumb" src="./${preview}" alt="${name}" />` : `<div class="thumb"></div>`}</div>
        <div class="accessory-row-copy">
          <h4>${name}</h4>
          <div class="sku">${item.partNumber || t().noPartNumber}</div>
          <p>${detail}</p>
        </div>
        <div class="accessory-row-control"><input type="checkbox" data-avm-item="${item.id}" ${checked} /></div>
      </label>
    </section>
  `;
}
function attachAvmHandlers() {
  wizardStageEl.querySelectorAll("[data-avm-item]").forEach((node) => {
    node.addEventListener("change", (event) => {
      const id = node.dataset.avmItem;
      if (!state.selections[id]) state.selections[id] = { checked: false, quantity: "1" };
      state.selections[id].checked = event.target.checked;
      render();
    });
  });
  wizardStageEl.querySelectorAll("[data-avm-mode]").forEach((node) => {
    node.addEventListener("click", () => {
      state.avm = state.avm || {};
      state.avm.mode = node.dataset.avmMode;
      render();
    });
  });
}
function avmFocusBanner() {
  const mode = avmCurrentMode();
  return `
    <div class="focus-banner">
      <div><strong>${t().summaryFields.product}</strong><p>${currentProduct()?.title || "-"}</p></div>
      <div><strong>${L("连接方式", "Connection mode")}</strong><p>${mode ? localizedText(mode.title) : t().noneSelected}</p></div>
    </div>
  `;
}

// AVM step 2 — connection mode (picks the adapter cable) + video extension cables.
function renderAvmWiringStep() {
  const mode = avmCurrentMode();
  const extensions = c6Items([9, 10, 11, 12]);
  wizardStageEl.innerHTML = `
    ${avmFocusBanner()}
    <div class="c6-section">
      <h3 class="c6-section-title">${L("连接方式", "Connection mode")}</h3>
      <p class="c6-section-hint">${L("选择 AVM 如何接入——决定所需的转接线。", "Choose how the AVM connects — this sets the required adapter cable.")}</p>
      <div class="option-grid two-col">
        ${AVM_MODES.map((m) => `
          <button class="option-card ${state.avm?.mode === m.id ? "active" : ""}" data-avm-mode="${m.id}">
            <div class="tag">${localizedText(m.title)}</div>
            <h3>${localizedText(m.title)}</h3>
            <p>${localizedText(m.detail)}</p>
          </button>
        `).join("")}
      </div>
      ${
        mode
          ? `<div class="c6-section">
              <img loading="lazy" decoding="async" class="avm-diagram" src="./${mode.diagram}" alt="diagram" />
              <p class="c6-section-hint">${L("已自动加入转接线：", "Adapter cable auto-added:")} ${(() => { const a = findItemByRow(mode.adapterRow); return a ? (skuInfo(a.partNumber)?.title ? localizedText(skuInfo(a.partNumber).title) : displayCatalogText(a.name)) : ""; })()}</p>
            </div>`
          : `<p class="c6-section-hint">${L("请先选择连接方式。", "Choose a connection mode first.")}</p>`
      }
    </div>
    <div class="c6-section">
      <h3 class="c6-section-title">${L("视频延长线（按需）", "Video extension cable (optional)")}</h3>
      <div class="group-list accessory-vertical-list">${extensions.map(avmItemCard).join("")}</div>
    </div>
  `;
  attachAvmHandlers();
}

// AVM step 3 — screen (DP7S) + AHD signal adapter.
function renderAvmScreenStep() {
  const items = c6Items([15, 16]);
  wizardStageEl.innerHTML = `
    ${avmFocusBanner()}
    <div class="c6-section">
      <h3 class="c6-section-title">${L("屏幕", "Screen")}</h3>
      <div class="group-list accessory-vertical-list">${items.map(avmItemCard).join("")}</div>
    </div>
  `;
  attachAvmHandlers();
}

// AVM step 4 — exterior alarm (B2 left/right) + adapter cables.
function renderAvmAlarmStep() {
  const items = c6Items([17, 18]); // B2 right / left — adapter cable is auto-added by count
  wizardStageEl.innerHTML = `
    ${avmFocusBanner()}
    <div class="c6-section">
      <h3 class="c6-section-title">${L("外部报警", "Exterior alarm")}</h3>
      <p class="c6-section-hint">${L("B2 分左/右两只，可选装；转接线会按所选数量自动加入。", "B2 comes as left/right units (optional); the matching adapter cable is added automatically.")}</p>
      <div class="group-list accessory-vertical-list">${items.map(avmItemCard).join("")}</div>
    </div>
  `;
  attachAvmHandlers();
}

// C6 Lite base kit: single vs dual lens, AD-Plus host-card layout.
function renderC6BaseStep() {
  const kits = c6Items([7, 8]);
  wizardStageEl.innerHTML = `
    <div class="option-grid two-col">
      ${kits
        .map((kit) => {
          const active = kit.id === state.packageId ? "active" : "";
          const preview = skuInfo(kit.partNumber)?.image || fallbackItemPreviewAsset(kit) || pickPreviewAsset(kit.images);
          const single = /single-lens/i.test(kit.group?.en || kit.group || "");
          const lens = single ? L("单镜头", "Single-lens") : L("双镜头", "Dual-lens");
          const detail = single ? L("单镜头一体机", "Single-lens integrated unit") : L("双镜头一体机", "Dual-lens integrated unit");
          return `
            <button class="option-card ${active}" data-package="${kit.id}">
              ${preview ? `<img loading="lazy" decoding="async" class="host-photo" src="./${preview}" alt="${displayCatalogText(kit.name)}" />` : `<div class="host-photo host-photo-empty">${t().emptyPreview}</div>`}
              <div class="tag">${lens}</div>
              <h3>${displayCatalogText(kit.name)}</h3>
              <div class="sku">${kit.partNumber || t().noPartNumber}</div>
              <p>${detail}</p>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
  wizardStageEl.querySelectorAll("[data-package]").forEach((node) => {
    node.addEventListener("click", () => choosePackage(node.dataset.package));
  });
}

// C6 Lite wiring: pick the model (RS232 / CAN) first, then the connector (16PIN / 9PIN); extras below.
function renderC6WiringStep() {
  state.c6 = state.c6 || { powerModel: null };
  const powerCables = c6Items([10, 11, 12, 13]);
  // normalize: keep at most one power cable selected
  let seenPower = false;
  powerCables.forEach((it) => {
    if (state.selections[it.id]?.checked) {
      if (seenPower) state.selections[it.id].checked = false;
      else seenPower = true;
    }
  });
  const selectedPower = powerCables.find((it) => state.selections[it.id]?.checked) || null;
  const model = selectedPower ? c6PowerModelOf(selectedPower) : state.c6.powerModel;
  const connectorCables = powerCables.filter((it) => c6PowerModelOf(it) === model);
  // AHD Expansion (r15) is auto-added when a camera is chosen, so it is not a manual option here.
  const extras = c6Items([9, 14]);
  const kit = currentPackage();
  const connectorOf = (it) => (/9\s*PIN/i.test(displayCatalogText(it.name)) ? "9PIN" : "16PIN");
  wizardStageEl.innerHTML = `
    <div class="focus-banner">
      <div>
        <strong>${t().summaryFields.product}</strong>
        <p>${currentProduct()?.title || "-"}</p>
      </div>
      <div>
        <strong>${L("当前核心套装", "Current core kit")}</strong>
        <p>${kit ? displayCatalogText(kit.name) : "-"}</p>
      </div>
    </div>
    <div class="c6-section">
      <h3 class="c6-section-title">${L("电源线", "Power cable")}</h3>
      <p class="c6-section-hint">${L("先选机型，再选接口。", "First choose the model, then the connector.")}</p>
      <div class="option-grid two-col">
        ${C6_POWER_MODELS.map((m) => `
          <button class="option-card ${model === m.id ? "active" : ""}" data-c6-model="${m.id}">
            <div class="tag">${localizedText(m.title)}</div>
            <h3>${localizedText(m.title)}</h3>
            <p>${localizedText(m.detail)}</p>
          </button>
        `).join("")}
      </div>
      ${
        model
          ? `
            <div class="option-grid two-col">
              ${connectorCables
                .map((it) => {
                  const active = state.selections[it.id]?.checked ? "active" : "";
                  const preview = fallbackItemPreviewAsset(it);
                  const connector = connectorOf(it);
                  return `
                    <button class="option-card ${active}" data-c6-connector="${it.id}">
                      ${preview ? `<img loading="lazy" decoding="async" class="host-photo" src="./${preview}" alt="${connector}" />` : `<div class="host-photo host-photo-empty">${t().emptyPreview}</div>`}
                      <div class="tag">${connector}</div>
                      <h3>${connector} OBD</h3>
                      <div class="sku">${it.partNumber || t().noPartNumber}</div>
                      <p>${displayCatalogText(it.note || it.description || "")}</p>
                    </button>
                  `;
                })
                .join("")}
            </div>
          `
          : `<p class="c6-section-hint">${L("请先选择机型。", "Choose a model first.")}</p>`
      }
    </div>
    <div class="c6-section">
      <h3 class="c6-section-title">${L("可选线材", "Optional cables")}</h3>
      <div class="group-list accessory-vertical-list">
        ${extras
          .map((it) => {
            const checked = state.selections[it.id]?.checked ? "checked" : "";
            const selected = checked ? "selected" : "";
            const info = skuInfo(it.partNumber);
            const preview = info?.image || fallbackItemPreviewAsset(it);
            const name = info?.title ? localizedText(info.title) : displayCatalogText(it.name);
            return `
              <section class="group-card accessory-row-group">
                <label class="item-card accessory-row-card ${selected}">
                  <div class="accessory-row-media">
                    ${preview ? `<img loading="lazy" decoding="async" class="thumb" src="./${preview}" alt="${name}" />` : `<div class="thumb"></div>`}
                  </div>
                  <div class="accessory-row-copy">
                    <h4>${name}</h4>
                    <div class="sku">${it.partNumber || t().noPartNumber}</div>
                    <p>${displayCatalogText(it.note || it.description || "")}</p>
                  </div>
                  <div class="accessory-row-control">
                    <input type="checkbox" data-c6-extra="${it.id}" ${checked} />
                  </div>
                </label>
              </section>
            `;
          })
          .join("")}
      </div>
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-c6-model]").forEach((node) => {
    node.addEventListener("click", () => {
      const m = node.dataset.c6Model;
      state.c6 = state.c6 || {};
      state.c6.powerModel = m;
      c6Items([10, 11, 12, 13]).forEach((it) => {
        if (c6PowerModelOf(it) !== m && state.selections[it.id]) state.selections[it.id].checked = false;
      });
      render();
    });
  });
  wizardStageEl.querySelectorAll("[data-c6-connector]").forEach((node) => {
    node.addEventListener("click", () => {
      const id = node.dataset.c6Connector;
      c6Items([10, 11, 12, 13]).forEach((it) => {
        if (!state.selections[it.id]) state.selections[it.id] = { checked: false, quantity: "1" };
        state.selections[it.id].checked = it.id === id;
      });
      render();
    });
  });
  wizardStageEl.querySelectorAll("[data-c6-extra]").forEach((node) => {
    node.addEventListener("change", (event) => {
      const id = node.dataset.c6Extra;
      if (!state.selections[id]) state.selections[id] = { checked: false, quantity: "1" };
      state.selections[id].checked = event.target.checked;
      render();
    });
  });
}

// C6 Lite cameras: each camera is a card; selecting it reveals a nested AHD extension-cable picker.
function renderC6CameraStep() {
  const cameras = c6Items([20, 21, 22]);
  const extCables = c6Items([16, 17, 18, 19]);
  const kit = currentPackage();
  const single = c6SelectedKitIsSingle();
  wizardStageEl.innerHTML = `
    <div class="focus-banner">
      <div>
        <strong>${t().summaryFields.product}</strong>
        <p>${currentProduct()?.title || "-"}</p>
      </div>
      <div>
        <strong>${L("当前核心套装", "Current core kit")}</strong>
        <p>${kit ? displayCatalogText(kit.name) : "-"}</p>
      </div>
    </div>
    ${
      !single
        ? `<div class="capacity-note warning">
            <strong>${L("双镜头无法额外加装摄像头", "No extra cameras on the dual-lens kit")}</strong>
            <p>${L("双镜头套装已占用两路 AHD 通道。若需加装摄像头，请在第 1 步改选单镜头（C6 Lite 2.0-S）。", "The dual-lens kit already uses both AHD channels. To add a camera, switch to the single-lens (C6 Lite 2.0-S) kit in step 1.")}</p>
          </div>`
        : `<div class="capacity-note">
            <strong>${L("最多加装 1 个摄像头", "Add at most one camera")}</strong>
            <p>${L("单镜头仅可扩展一路 AHD 通道，因此摄像头只能选择一个。", "The single-lens kit can expand only one AHD channel, so you can add at most one camera.")}</p>
          </div>`
    }
    <div class="group-list accessory-vertical-list">
      ${(single ? cameras : [])
        .map((cam) => {
          const block = state.selections[cam.id] || {};
          const checked = block.checked ? "checked" : "";
          const selected = block.checked ? "selected" : "";
          const info = skuInfo(cam.partNumber);
          const preview = info?.image || fallbackItemPreviewAsset(cam);
          const name = info?.title ? localizedText(info.title) : displayCatalogText(cam.name);
          const detail = info?.detail !== undefined ? L(info.detail, info.detailEn) : displayCatalogText(cam.note || cam.description || "");
          const extRow = block.c6ExtRow || "";
          return `
            <section class="group-card accessory-row-group">
              <label class="item-card accessory-row-card ${selected}">
                <div class="accessory-row-media">
                  ${preview ? `<img loading="lazy" decoding="async" class="thumb" src="./${preview}" alt="${name}" />` : `<div class="thumb"></div>`}
                </div>
                <div class="accessory-row-copy">
                  <h4>${name}</h4>
                  <div class="sku">${cam.partNumber || t().noPartNumber}</div>
                  <p>${detail}</p>
                </div>
                <div class="accessory-row-control">
                  <input type="checkbox" data-c6-camera="${cam.id}" ${checked} />
                </div>
              </label>
              ${
                block.checked
                  ? `
                    <div class="extension-picker">
                      <div class="extension-picker-head">
                        <strong>${L("AHD 延长线", "AHD extension cable")}</strong>
                        <span>${L("按安装距离选择，可不选", "Optional — choose by install distance")}</span>
                      </div>
                      <label>
                        <span>${t().lengthAndPart}</span>
                        <select data-c6-cam-ext="${cam.id}">
                          <option value="" ${extRow === "" ? "selected" : ""}>${t().notNeeded}</option>
                          ${extCables
                            .map((ext) => {
                              const et = skuInfo(ext.partNumber)?.title;
                              const label = et ? localizedText(et) : displayCatalogText(ext.name);
                              return `<option value="${ext.rowNumber}" ${String(extRow) === String(ext.rowNumber) ? "selected" : ""}>${label} | ${ext.partNumber}</option>`;
                            })
                            .join("")}
                        </select>
                      </label>
                    </div>
                  `
                  : ""
              }
            </section>
          `;
        })
        .join("")}
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-c6-camera]").forEach((node) => {
    node.addEventListener("change", (event) => {
      const id = node.dataset.c6Camera;
      if (!state.selections[id]) state.selections[id] = { checked: false, quantity: "1" };
      state.selections[id].checked = event.target.checked;
      // Single-lens can expand only one AHD channel -> at most one camera.
      if (event.target.checked) {
        c6Items([20, 21, 22]).forEach((other) => {
          if (other.id !== id && state.selections[other.id]) {
            state.selections[other.id].checked = false;
            state.selections[other.id].c6ExtRow = "";
          }
        });
      }
      render();
    });
  });
  wizardStageEl.querySelectorAll("[data-c6-cam-ext]").forEach((node) => {
    node.addEventListener("change", (event) => {
      const id = node.dataset.c6CamExt;
      if (!state.selections[id]) state.selections[id] = { checked: true, quantity: "1" };
      state.selections[id].c6ExtRow = event.target.value;
      render();
    });
  });
}

// C6 Lite accessories: R-Watch + Micro SD (with nested capacity picker), AD-Plus-style cards.
function renderC6AccessoryStep() {
  const items = c6Items([23, 24]);
  const kit = currentPackage();
  wizardStageEl.innerHTML = `
    <div class="focus-banner">
      <div>
        <strong>${t().summaryFields.product}</strong>
        <p>${currentProduct()?.title || "-"}</p>
      </div>
      <div>
        <strong>${L("当前核心套装", "Current core kit")}</strong>
        <p>${kit ? displayCatalogText(kit.name) : "-"}</p>
      </div>
    </div>
    <div class="group-list accessory-vertical-list">
      ${items
        .map((it) => {
          const block = state.selections[it.id] || {};
          const checked = block.checked ? "checked" : "";
          const selected = block.checked ? "selected" : "";
          const variantOptions = presetVariantOptions(it);
          const selectedVariant = variantOptions
            ? variantOptions.find((v) => v.partNumber === block.variantPartNumber) || variantOptions[0]
            : null;
          const info = variantOptions ? null : skuInfo(it.partNumber);
          const preview = info?.image || fallbackItemPreviewAsset(it);
          const name = variantOptions ? localizedText(selectedVariant.name) : (info?.title ? localizedText(info.title) : displayCatalogText(it.name));
          // R-Watch (row 23) only supports the RS232 model.
          const disabled = it.rowNumber === 23 && c6CurrentPowerModel() === "can";
          const detail = disabled
            ? L("R-Watch 仅支持 RS232 机型。当前接线为 CAN，请改用 RS232 机型。", "R-Watch only supports the RS232 model. Current wiring is CAN — switch to an RS232 power cable to use it.")
            : (info?.detail !== undefined ? L(info.detail, info.detailEn) : displayCatalogText(it.note || it.description || ""));
          const skuText = variantOptions ? selectedVariant.partNumber : it.partNumber || t().noPartNumber;
          return `
            <section class="group-card accessory-row-group">
              <label class="item-card accessory-row-card ${selected} ${disabled ? "disabled" : ""}">
                <div class="accessory-row-media">
                  ${preview ? `<img loading="lazy" decoding="async" class="thumb" src="./${preview}" alt="${name}" />` : `<div class="thumb"></div>`}
                </div>
                <div class="accessory-row-copy">
                  <h4>${name}</h4>
                  <div class="sku">${skuText}</div>
                  <p>${detail}</p>
                </div>
                <div class="accessory-row-control">
                  <input type="checkbox" data-c6-extra="${it.id}" ${checked} ${disabled ? "disabled" : ""} />
                </div>
              </label>
              ${
                block.checked && variantOptions
                  ? `
                    <div class="extension-picker">
                      <div class="extension-picker-head">
                        <strong>${L("容量 / 料号", "Capacity / part number")}</strong>
                        <span>${"Maximum 1 unit"}</span>
                      </div>
                      <label>
                        <span>${L("选择规格", "Choose variant")}</span>
                        <select data-preset-variant="${it.id}">
                          ${variantOptions
                            .map((v) => `<option value="${v.partNumber}" ${selectedVariant.partNumber === v.partNumber ? "selected" : ""}>${localizedText(v.name)} | ${v.partNumber}</option>`)
                            .join("")}
                        </select>
                      </label>
                    </div>
                  `
                  : ""
              }
            </section>
          `;
        })
        .join("")}
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-c6-extra]").forEach((node) => {
    node.addEventListener("change", (event) => {
      const id = node.dataset.c6Extra;
      if (!state.selections[id]) state.selections[id] = { checked: false, quantity: "1" };
      state.selections[id].checked = event.target.checked;
      render();
    });
  });
  wizardStageEl.querySelectorAll("[data-preset-variant]").forEach((node) => {
    node.addEventListener("change", (event) => {
      setPresetVariant(node.dataset.presetVariant, event.target.value);
    });
  });
}

function renderM3nCameraStep() {
  const items = m1nItemsByRows(currentMSeriesStepRows().cameras).filter((item) =>
    isM1nProduct() ? ![15, 16].includes(item.rowNumber) : ![14, 15].includes(item.rowNumber)
  );
  const cameraStatus = m3nPresetCameraStatus();
  const channelRule = currentMSeriesChannelRule();
  const productTitle = currentProduct()?.title || "M-series";
  wizardStageEl.innerHTML = `
    <div class="focus-banner">
      <div>
        <strong>${t().summaryFields.product}</strong>
        <p>${currentProduct()?.title || "-"}</p>
      </div>
      <div>
        <strong>${L("当前基础套装", "Current base kit")}</strong>
        <p>${currentPackage() ? displayCatalogText(currentPackage().name) : "-"}</p>
      </div>
    </div>
    <div class="capacity-note">
      <strong>Channel rule</strong>
      <p>${productTitle} supports up to ${channelRule.ipc} IPC channels and ${channelRule.ahd} AHD channels. Remaining: ${cameraStatus.ipcRemaining} IPC / ${cameraStatus.ahdRemaining} AHD.</p>
    </div>
    <div class="group-list accessory-vertical-list">
      ${items
        .map((item) => {
                    const block = ensurePresetSelectionState(item.id, item.quantity || "1");
                    const quantity = isM3nPresetCameraItem(item) ? (block.checked ? Number(block.quantity || 0) : 0) : (block.checked ? 1 : 0);
                    const maxQty = isM3nPresetCameraItem(item) ? Math.max(0, maxM3nPresetQuantity(item)) : 1;
                    const checked = block.checked ? "checked" : "";
                    const selected = (isM3nPresetCameraItem(item) ? quantity > 0 : block.checked) ? "selected" : "";
                    const info = skuInfo(item.partNumber);
                    const preview = info?.image || fallbackItemPreviewAsset(item);
                    const displayName = info?.title ? localizedText(info.title) : displayCatalogText(item.name);
                    const displayDetail = info?.detail !== undefined ? L(info.detail, info.detailEn) : displayCatalogText(item.note || item.description || "");
                    const cameraType = m3nPresetCameraType(item);
                    const disabled =
                      !selected &&
                      ((cameraType === "ipc" && cameraStatus.ipcRemaining <= 0) ||
                        (cameraType === "ahd" && cameraStatus.ahdRemaining <= 0));
                    const extensionRows = m3nCameraExtensionRowsForMSeries(item);
                    const childRows = m3nAdkitChildRows(item);
                    const extensionTitle =
                      extensionRows === M3N_CAMERA_EXTENSION_ROWS.ipc
                        ? ("IPC extension cable")
                        : ("AHD extension cable");
                    return `
                      <section class="group-card accessory-row-group">
                        <label class="item-card accessory-row-card ${selected} ${disabled ? "disabled" : ""}">
                          <div class="accessory-row-media">
                            ${preview ? `<img loading="lazy" decoding="async" class="thumb" src="./${preview}" alt="${displayCatalogText(item.name)}" />` : `<div class="thumb"></div>`}
                          </div>
                          <div class="accessory-row-copy">
                            <h4>${displayName}</h4>
                            <div class="sku">${item.partNumber || t().noPartNumber}</div>
                            <p>${displayDetail}</p>
                          </div>
                          <div class="accessory-row-control">
                            ${
                              cameraType
                                ? `
                                  <div class="qty-stepper" data-m3n-camera-stepper="${item.id}">
                                    <button type="button" class="qty-btn" data-m3n-camera-step="${item.id}" data-direction="-1" ${quantity <= 0 ? "disabled" : ""}>-</button>
                                    <span class="qty-value">${quantity}</span>
                                    <button type="button" class="qty-btn" data-m3n-camera-step="${item.id}" data-direction="1" ${maxQty <= 0 || quantity >= maxQty ? "disabled" : ""}>+</button>
                                  </div>
                                `
                                : `<input type="checkbox" data-m3n-camera="${item.id}" ${checked} ${disabled ? "disabled" : ""} />`
                            }
                          </div>
                        </label>
                        ${
                          cameraType && quantity > 0
                            ? Array.from({ length: quantity }, (_, index) => {
                                const selectedExtensionId = block.extensions?.[index] || block.extensionId || "";
                                return `
                                  <div class="extension-picker">
                                    <div class="extension-picker-head">
                                      <strong>${extensionTitle} ${index + 1}</strong>
                                      <span>${t().chooseLength}</span>
                                    </div>
                                    <label>
                                      <span>${t().lengthAndPart}</span>
                                      <select data-m3n-camera-extension="${item.id}" data-m3n-camera-extension-slot="${index}">
                                        ${extensionRows
                                          .map((rowNumber) => {
                                            const extensionItem = findItemByRow(rowNumber);
                                            const selectedOption = selectedExtensionId === extensionItem?.id ? "selected" : "";
                                            return `<option value="${rowNumber}" ${selectedOption}>${formatExtensionOptionLabel(extensionItem)}</option>`;
                                          })
                                          .join("")}
                                      </select>
                                    </label>
                                    <p class="hint">${t().installImpact}</p>
                                  </div>
                                `;
                              }).join("")
                            : ""
                        }
                        ${
                          block.checked && childRows.length
                            ? `
                              <div class="extension-picker">
                                <div class="extension-picker-head">
                                  <strong>${L("AD Kit 配件", "AD Kit accessories")}</strong>
                                  <span>${L("按需勾选支架和螺丝", "Select bracket and screws if needed")}</span>
                                </div>
                                <div class="sub-option-list">
                                  ${childRows
                                    .map((rowNumber) => {
                                      const childItem = findItemByRow(rowNumber);
                                      if (!childItem) return "";
                                      const childChecked = state.selections[childItem.id]?.checked ? "checked" : "";
                                      const childPreview = fallbackItemPreviewAsset(childItem);
                                      return `
                                        <label class="sub-option-card">
                                          <div class="sub-option-media">
                                            ${childPreview ? `<img loading="lazy" decoding="async" class="thumb" src="./${childPreview}" alt="${displayCatalogText(childItem.name)}" />` : `<div class="thumb"></div>`}
                                          </div>
                                          <div class="sub-option-copy">
                                            <strong>${displayCatalogText(childItem.name)}</strong>
                                            <span>${childItem.partNumber || t().noPartNumber}</span>
                                          </div>
                                          <input type="checkbox" data-m3n-camera-child="${childItem.id}" ${childChecked} />
                                        </label>
                                      `;
                                    })
                                    .join("")}
                                </div>
                              </div>
                            `
                            : ""
                        }
                      </section>
                    `;
        })
        .join("")}
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-m3n-camera]").forEach((node) => {
    node.addEventListener("change", (event) => {
      setM3nPresetSelection(node.dataset.m3nCamera, event.target.checked);
    });
  });

  wizardStageEl.querySelectorAll("[data-m3n-camera-step]").forEach((node) => {
    node.addEventListener("click", () => {
      const itemId = node.dataset.m3nCameraStep;
      const block = ensurePresetSelectionState(itemId);
      const currentQty = block.checked ? Number(block.quantity || 0) : 0;
      const nextQty = currentQty + Number(node.dataset.direction || 0);
      setM3nPresetQuantity(itemId, nextQty);
    });
  });

  wizardStageEl.querySelectorAll("[data-m3n-camera-extension]").forEach((node) => {
    node.addEventListener("change", (event) => {
      setM3nPresetCameraExtension(
        node.dataset.m3nCameraExtension,
        event.target.value,
        Number(node.dataset.m3nCameraExtensionSlot || 0)
      );
    });
  });

  wizardStageEl.querySelectorAll("[data-m3n-camera-child]").forEach((node) => {
    node.addEventListener("change", (event) => {
      setM3nPresetChildSelection(node.dataset.m3nCameraChild, event.target.checked);
    });
  });
}

function renderM1nBaseStep() {
  const pkg = currentPackage() || packageCandidates()[0];
  const preview = pkg ? pickPreviewAsset(pkg.images || []) : "";
  wizardStageEl.innerHTML = `
    <div class="focus-banner">
      <div>
        <strong>${t().summaryFields.product}</strong>
        <p>${currentProduct()?.title || "-"}</p>
      </div>
      <div>
        <strong>${L("流程说明", "Flow")}</strong>
        <p>${"Next, select wiring, then cameras, then accessories."}</p>
      </div>
    </div>
    <section class="group-card accessory-row-group">
      <div class="item-card accessory-row-card selected">
        <div class="accessory-row-media">
          ${preview ? `<img loading="lazy" decoding="async" class="thumb" src="./${preview}" alt="${pkg ? displayCatalogText(pkg.name) : ""}" />` : `<div class="thumb"></div>`}
        </div>
        <div class="accessory-row-copy">
          <h4>${pkg ? displayCatalogText(pkg.name) : "M1N 2.0"}</h4>
          <div class="sku">${pkg?.partNumber || t().noPartNumber}</div>
          <p>${pkg ? displayCatalogText(pkg.note || pkg.description || "") : ""}</p>
        </div>
        <div class="accessory-row-control">
          <div class="tag">${L("基础套装", "Base kit")}</div>
        </div>
      </div>
    </section>
  `;
}

function renderM1nWiringStep() {
  renderM1nSelectableStep(
    m1nItemsByRows(currentMSeriesStepRows().wiring),
    L("当前基础套装", "Current base kit")
  );
}

function renderM1nCameraStep() {
  renderM3nCameraStep();
}

function renderM3nOptionalStep() {
  const items = m1nItemsByRows(currentMSeriesStepRows().optionals).filter((item) =>
    isM1nProduct() ? ![9, 32, 35].includes(item.rowNumber) : ![33, 35].includes(item.rowNumber)
  );
  const grouped = groupedItems(items);
  const itemCard = (item) => {
    const block = ensurePresetSelectionState(item.id, item.quantity || "1");
    const checked = block.checked ? "checked" : "";
    const selected = block.checked ? "selected" : "";
    const childRows = m3nOptionalChildRows(item);
    const display = m3nOptionalDisplay(item);
    // Storage rows (SD / SSD) carry several part numbers by capacity; let the user pick one.
    const variantOptions = presetVariantOptions(item);
    const selectedVariant = variantOptions
      ? variantOptions.find((entry) => entry.partNumber === block.variantPartNumber) || variantOptions[0]
      : null;
    const headingName = variantOptions ? localizedText(selectedVariant.name) : display.name;
    const skuText = variantOptions ? selectedVariant.partNumber : item.partNumber || t().noPartNumber;
    return `
      <section class="group-card accessory-row-group">
        <label class="item-card accessory-row-card ${selected}">
          <div class="accessory-row-media">
            ${display.preview ? `<img loading="lazy" decoding="async" class="thumb" src="./${display.preview}" alt="${headingName}" />` : `<div class="thumb"></div>`}
          </div>
          <div class="accessory-row-copy">
            <h4>${headingName}</h4>
            <div class="sku">${skuText}</div>
            <p>${display.note}</p>
          </div>
          <div class="accessory-row-control">
            <input type="checkbox" data-m3n-optional="${item.id}" ${checked} />
          </div>
        </label>
        ${
          block.checked && variantOptions
            ? `
              <div class="extension-picker">
                <div class="extension-picker-head">
                  <strong>${L("容量 / 料号", "Capacity / part number")}</strong>
                  <span>${"Choose based on project requirements"}</span>
                </div>
                <label>
                  <span>${L("选择规格", "Choose variant")}</span>
                  <select data-preset-variant="${item.id}">
                    ${variantOptions
                      .map((variant) => `<option value="${variant.partNumber}" ${selectedVariant.partNumber === variant.partNumber ? "selected" : ""}>${localizedText(variant.name)} | ${variant.partNumber}</option>`)
                      .join("")}
                  </select>
                </label>
              </div>
            `
            : ""
        }
        ${
          block.checked && childRows.length
            ? `
              <div class="extension-picker">
                <div class="extension-picker-head">
                  <strong>${L("配套线材", "Included cable")}</strong>
                  <span>${"Included with this item"}</span>
                </div>
                <div class="sub-option-list">
                  ${childRows
                    .map((rowNumber) => {
                      const childItem = findItemByRow(rowNumber);
                      if (!childItem) return "";
                      const childPreview = fallbackItemPreviewAsset(childItem);
                      return `
                        <label class="sub-option-card locked">
                          <div class="sub-option-media">
                            ${childPreview ? `<img loading="lazy" decoding="async" class="thumb" src="./${childPreview}" alt="${displayCatalogText(childItem.name)}" />` : `<div class="thumb"></div>`}
                          </div>
                          <div class="sub-option-copy">
                            <strong>${displayCatalogText(childItem.name)}</strong>
                            <span>${childItem.partNumber || t().noPartNumber}</span>
                          </div>
                          <input type="checkbox" checked disabled />
                        </label>
                      `;
                    })
                    .join("")}
                </div>
              </div>
            `
            : ""
        }
      </section>
    `;
  };
  wizardStageEl.innerHTML = `
    <div class="focus-banner">
      <div>
        <strong>${t().summaryFields.product}</strong>
        <p>${currentProduct()?.title || "-"}</p>
      </div>
      <div>
        <strong>${L("当前基础套装", "Current base kit")}</strong>
        <p>${currentPackage() ? displayCatalogText(currentPackage().name) : "-"}</p>
      </div>
    </div>
    <div class="group-list accessory-vertical-list">
      ${Object.entries(grouped)
        .map(([groupName, groupItems]) => {
          // Singleton groups render flat; multi-item groups keep a header.
          if (groupItems.length < 2) return groupItems.map(itemCard).join("");
          const heading = groupItems.some((item) => item.rowNumber === 36 || item.rowNumber === 8)
            ? "Microphone"
            : groupItems.some((item) => item.rowNumber === 34)
              ? L("Speaker 喇叭", "Speaker")
              : displayCatalogText(groupName);
          return `
            <section class="group-card">
              <div class="group-meta">
                <h3>${heading}</h3>
                <div class="group-badge">${groupItems.length}</div>
              </div>
              <div class="group-list accessory-vertical-list">
                ${groupItems.map(itemCard).join("")}
              </div>
            </section>
          `;
        })
        .join("")}
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-m3n-optional]").forEach((node) => {
    node.addEventListener("change", (event) => {
      setM3nPresetSelection(node.dataset.m3nOptional, event.target.checked);
    });
  });
  wizardStageEl.querySelectorAll("[data-preset-variant]").forEach((node) => {
    node.addEventListener("change", (event) => {
      setPresetVariant(node.dataset.presetVariant, event.target.value);
    });
  });
}

function renderM1nOptionalStep() {
  renderM3nOptionalStep();
}

function renderCustomHostStep() {
  wizardStageEl.innerHTML = `
    <div class="option-grid two-col">
      ${customCatalog.hosts
        .map((host) => {
          const active = state.custom.host === host.id ? "active" : "";
          return `
            <button class="option-card ${active}" data-host="${host.id}">
              ${
                host.image
                  ? `<img loading="lazy" decoding="async" class="host-photo" src="./${host.image}" alt="${localizedText(host.title)}" />`
                  : `<div class="host-photo host-photo-empty">${t().emptyPreview}</div>`
              }
              <div class="tag">${localizedText(host.short)}</div>
              <h3>${localizedText(host.title)}</h3>
              <p>${localizedText(host.detail)}</p>
            </button>
          `;
        })
        .join("")}
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-host]").forEach((node) => {
    node.addEventListener("click", () => setCustomHost(node.dataset.host));
  });
}

function renderCustomPowerBoxStep() {
  const host = selectedCustomHost();
  wizardStageEl.innerHTML = `
    <div class="focus-banner">
      <div>
        <strong>${t().summaryFields.host}</strong>
        <p>${host ? localizedText(host.title) : t().noneSelected}</p>
      </div>
    </div>
    <div class="option-grid three-col">
      ${customCatalog.powerBoxes
        .map((powerBox) => {
          const active = state.custom.powerBox === powerBox.id ? "active" : "";
          const preview = customPowerBoxPreview(powerBox.id);
          return `
            <button class="option-card power-box-card ${active}" data-power-box="${powerBox.id}">
              ${
                preview
                  ? `<img loading="lazy" decoding="async" class="host-photo" src="./${preview}" alt="${localizedText(powerBox.title)}" />`
                  : `<div class="host-photo host-photo-empty">${t().emptyPreview}</div>`
              }
              <div class="tag">${localizedText(powerBox.badge)}</div>
              <h3>${localizedText(powerBox.title)}</h3>
              <p>${localizedText(powerBox.detail)}</p>
            </button>
          `;
        })
        .join("")}
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-power-box]").forEach((node) => {
    node.addEventListener("click", () => setCustomPowerBox(node.dataset.powerBox));
  });
}

function renderCustomWiringStep() {
  const powerBox = selectedCustomPowerBox();
  const power16ExtensionItem = findItemByRow(25);
  const showPower16ExtensionCard = powerBox && (powerBox.id === "plus" || powerBox.id === "max");
  const power16ExtensionPreview = pickPreviewAsset(power16ExtensionItem?.images || []);
  wizardStageEl.innerHTML = `
    <div class="focus-banner">
      <div>
        <strong>${t().summaryFields.powerBox}</strong>
        <p>${powerBox ? localizedText(powerBox.title) : t().noneSelected}</p>
      </div>
      <div>
        <strong>${t().summaryFields.host}</strong>
        <p>${selectedCustomHost() ? localizedText(selectedCustomHost().title) : t().noneSelected}</p>
      </div>
    </div>
    <div class="option-grid three-col">
      ${customCatalog.wiringModes
        .map((mode) => {
          const supported = isWiringSupported(mode);
          const wiringSku = customWiringSku(mode.id, powerBox?.id);
          const lockedDefault =
            powerBox && ((powerBox.id === "standard" && mode.id === "loose") || ((powerBox.id === "plus" || powerBox.id === "max") && mode.id === "16pin"));
          const preview = customWiringPreview(mode.id, powerBox?.id);
          return `
            <label class="option-card wiring-card ${state.custom.wiring[mode.id] ? "active" : ""} ${supported ? "" : "disabled"} ${lockedDefault ? "locked-option" : ""}">
              ${
                preview
                  ? `<img loading="lazy" decoding="async" class="host-photo" src="./${preview}" alt="${localizedText(mode.title)}" />`
                  : `<div class="host-photo host-photo-empty">${t().emptyPreview}</div>`
              }
              <input type="checkbox" data-wiring="${mode.id}" ${state.custom.wiring[mode.id] ? "checked" : ""} ${supported && !lockedDefault ? "" : "disabled"} />
              <div class="tag">${localizedText(mode.title)}</div>
              <h3>${localizedText(mode.title)}</h3>
              <div class="sku">${wiringSku || t().noPartNumber}</div>
              <p>${localizedText(mode.detail)}</p>
            </label>
          `;
        })
        .join("")}
      ${
        showPower16ExtensionCard
          ? `
            <label class="option-card wiring-card wiring-extra-card ${state.custom.wiringExtras.power16Extension ? "active" : ""}">
              ${
                power16ExtensionPreview
                  ? `<img loading="lazy" decoding="async" class="host-photo" src="./${power16ExtensionPreview}" alt="${t().labels.power16ExtTitle}" />`
                  : `<div class="host-photo host-photo-empty">${t().emptyPreview}</div>`
              }
              <input type="checkbox" data-wiring-extra="power16Extension" ${state.custom.wiringExtras.power16Extension ? "checked" : ""} />
              <div class="tag">${t().labels.power16ExtTitle}</div>
              <h3>${t().labels.power16ExtTitle}</h3>
              <div class="sku">${power16ExtensionItem?.partNumber || "1260040100236"}</div>
              <p>${t().labels.power16ExtDetail}</p>
            </label>
          `
          : ""
      }
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-wiring]").forEach((node) => {
    node.addEventListener("change", (event) => {
      toggleCustomWiring(node.dataset.wiring, event.target.checked);
    });
  });
  wizardStageEl.querySelectorAll("[data-wiring-extra]").forEach((node) => {
    node.addEventListener("change", (event) => {
      toggleCustomWiringExtra(node.dataset.wiringExtra, event.target.checked);
    });
  });
}

function renderExtensionBlock(def, stateBlock, extensionSetter, allowNone = true, slot = 0, heading = "", options = {}) {
  const extensionRows = options.extensionRows || def.extensionRows || [];
  const title = options.label || localizedText(def.extensionLabel);
  const stateField = options.stateField || (extensionSetter === "accessory" && def.cameraType ? "extensions" : "extension");
  const lockExtension = options.lockExtension ?? def.lockExtension;
  const selectedExtensionId = stateField === "extensions" ? stateBlock.extensions?.[slot] || "" : stateBlock[stateField] || "";
  const sortedExtensionRows = [...extensionRows].sort((leftRow, rightRow) => {
    const leftItem = findItemByRow(leftRow);
    const rightItem = findItemByRow(rightRow);
    return extensionLengthValue(leftItem) - extensionLengthValue(rightItem);
  });
  return `
    <div class="extension-picker">
      <div class="extension-picker-head">
        <strong>${heading || title}</strong>
        <span>${lockExtension ? t().locked : t().chooseLength}</span>
      </div>
      <label>
        <span>${t().lengthAndPart}</span>
        <select data-extension-kind="${extensionSetter}" data-extension-id="${def.id}" data-extension-slot="${slot}" data-extension-field="${stateField}" ${lockExtension ? "disabled" : ""}>
          ${sortedExtensionRows
            .map((rowNumber) => {
              const extensionItem = findItemByRow(rowNumber);
              const selectedOption = selectedExtensionId === extensionItem?.id ? "selected" : "";
              return `<option value="${rowNumber}" ${selectedOption}>${formatExtensionOptionLabel(extensionItem)}</option>`;
            })
            .join("")}
          ${lockExtension || !allowNone ? "" : `<option value="none" ${selectedExtensionId ? "" : "selected"}>${t().notNeeded}</option>`}
        </select>
      </label>
      <p class="hint">${lockExtension ? t().lockedCable : t().installImpact}</p>
    </div>
  `;
}

function renderAccessoryEditor() {
  const accessoryId = state.custom.accessoryEditor;
  if (!accessoryId) return "";
  const def = customCatalog.accessories.find((item) => item.id === accessoryId);
  if (!def || !def.cameraType) return "";
  const stateBlock = ensureAccessoryState(accessoryId);
  const quantity = Number(stateBlock.quantity || 0);
  if (quantity <= 0) return "";
  return `
    <div class="accessory-editor-backdrop" data-close-accessory-editor="true"></div>
    <div class="accessory-editor-panel">
      <div class="accessory-editor-head">
        <div>
          <strong>${localizedText(def.title)}</strong>
          <p>${quantity} ${localizedText(def.extensionLabel)}</p>
        </div>
        <button type="button" class="accessory-editor-close" data-close-accessory-editor="true">脳</button>
      </div>
      <div class="accessory-editor-body">
        ${Array.from({ length: quantity }, (_, index) =>
          renderExtensionBlock(
            def,
            stateBlock,
            "accessory",
            true,
            index,
            `${localizedText(def.extensionLabel)} ${index + 1}`
          )
        ).join("")}
      </div>
    </div>
  `;
}

function renderSelectedCameraConfigs() {
  const selectedCameras = selectedCameraAccessoryDefs();
  if (!selectedCameras.length) return "";
  return `
    <section class="camera-config-panel">
      <div class="camera-config-panel-head">
        <strong>${L("已选摄像头线材配置", "Selected camera cable setup")}</strong>
        <span>${L("下方卡片只选数量，这里统一设置每一路延长线长度", "Use the cards below for quantity only. Set each extension length here.")}</span>
      </div>
      <div class="camera-config-list">
        ${selectedCameras
          .map((def) => {
            const stateBlock = ensureAccessoryState(def.id);
            const quantity = Number(stateBlock.quantity || 0);
            return `
              <article class="camera-config-item">
                <div class="camera-config-item-head">
                  <strong>${localizedText(def.title)}</strong>
                  <span>${quantity} x ${localizedText(def.extensionLabel)}</span>
                </div>
                <div class="camera-config-item-grid">
                  ${Array.from({ length: quantity }, (_, index) =>
                    renderExtensionBlock(
                      def,
                      stateBlock,
                      "accessory",
                      true,
                      index,
                      `${localizedText(def.extensionLabel)} ${index + 1}`
                    )
                  ).join("")}
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderCustomAccessoryStep() {
  const capacityRule = cameraCapacityRule();
  const capacityWarning = cameraCapacityWarning();
  const capacityStatus = cameraCapacityStatus();
  const accessories = orderedCustomAccessories();
  wizardStageEl.innerHTML = `
    <div class="focus-banner">
      <div>
        <strong>${t().labels.currentMain}</strong>
        <p>${selectedCustomHost() ? localizedText(selectedCustomHost().title) : "-"} + ${selectedCustomPowerBox() ? localizedText(selectedCustomPowerBox().title) : "-"}</p>
      </div>
      <div>
        <strong>${t().labels.currentWiring}</strong>
        <p>${selectedCustomWirings().map((item) => localizedText(item.title)).join(" / ") || "-"}</p>
      </div>
    </div>
    ${
      capacityRule
        ? `<div class="capacity-note ${capacityWarning ? "warning" : ""}">
            <strong>${t().cameraRuleTitle}</strong>
            <p>${capacityWarning || `${capacityRule.label}. ${"Remaining"} ${capacityStatus.ipcRemaining} IPC / ${capacityStatus.ahdRemaining} AHD.`}</p>
          </div>`
        : ""
    }
    <div class="group-list accessory-vertical-list">
      ${accessories
        .map((def) => {
          const item = def.sourceProductId ? findCatalogItem(def.sourceProductId, def.itemRow) : findItemByRow(def.itemRow);
          const blockState = ensureAccessoryState(def.id);
          const maxQty = Math.max(1, maxAccessoryQuantity(def));
          const quantity = Number(blockState.quantity || 0);
          const selected = (def.cameraType ? quantity > 0 : blockState.checked) ? "selected" : "";
          const disabled = isAccessoryChoiceDisabled(def) ? "disabled" : "";
          const preview = def.image || pickPreviewAsset(item?.images || []);
          return `
            <section class="group-card accessory-row-group">
              <label class="item-card accessory-row-card ${selected} ${disabled}">
                <div class="accessory-row-media">
                  ${preview ? `<img loading="lazy" decoding="async" class="thumb" src="./${preview}" alt="${localizedText(def.title)}" />` : `<div class="thumb"></div>`}
                </div>
                <div class="accessory-row-copy">
                  <h4>${localizedText(def.title)}</h4>
                  <div class="sku">${item?.partNumber || t().noPartNumber}</div>
                  <p>${accessoryDetailText(def)}</p>
                </div>
                <div class="accessory-row-control">
                  ${
                    def.cameraType
                      ? `
                        <div class="qty-stepper" data-accessory-stepper="${def.id}">
                          <button type="button" class="qty-btn" data-accessory-step="${def.id}" data-direction="-1" ${quantity <= 0 ? "disabled" : ""}>-</button>
                          <span class="qty-value">${quantity}</span>
                          <button type="button" class="qty-btn" data-accessory-step="${def.id}" data-direction="1" ${quantity >= maxQty ? "disabled" : ""}>+</button>
                        </div>
                      `
                      : `<input type="checkbox" data-accessory="${def.id}" ${blockState.checked ? "checked" : ""} ${disabled ? "disabled" : ""} />`
                  }
                </div>
              </label>
              ${
                def.cameraType && quantity > 0
                  ? `
                    ${Array.from({ length: quantity }, (_, index) =>
                      renderExtensionBlock(
                        def,
                        blockState,
                        "accessory",
                        true,
                        index,
                        `${localizedText(def.extensionLabel)} ${index + 1}`
                      )
                    ).join("")}
                    ${
                      def.id === "ca42"
                        ? `
                          <div class="extension-picker">
                            <div class="extension-picker-head">
                              <strong>${"Serial port adapter cable"}</strong>
                              <span>${"Optional feature cable"}</span>
                            </div>
                            <div class="sku">1261050100291</div>
                            <label class="inline-check">
                              <input type="checkbox" data-accessory-addon="${def.id}" ${blockState.addonChecked ? "checked" : ""} />
                              <span>Enable trailer matching cable set</span>
                            </label>
                            <p class="hint">Available for all power-box builds to enable trailer matching. Limitation: R-Watch is unavailable only when this is enabled on Standard Power Box.</p>
                          </div>
                        `
                        : ""
                    }
                  `
                  : !def.cameraType && blockState.checked
                    ? `
                      ${renderExtensionBlock(def, blockState, "accessory")}
                      ${
                        def.secondaryExtensionRows?.length
                          ? renderExtensionBlock(def, blockState, "accessory", true, 0, "", {
                              extensionRows: def.secondaryExtensionRows,
                              label: localizedText(def.secondaryExtensionLabel),
                              stateField: "extraExtension",
                              lockExtension: false,
                            })
                          : ""
                      }
                    `
                    : ""
              }
            </section>
          `;
        })
        .join("")}
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-accessory]").forEach((node) => {
    node.addEventListener("change", (event) => {
      toggleCustomAccessory(node.dataset.accessory, event.target.checked);
    });
  });
  wizardStageEl.querySelectorAll("[data-accessory-step]").forEach((node) => {
    node.addEventListener("click", () => {
      const accessoryId = node.dataset.accessoryStep;
      const currentQty = Number(ensureAccessoryState(accessoryId).quantity || 0);
      const nextQty = currentQty + Number(node.dataset.direction || 0);
      setCustomAccessoryQuantity(accessoryId, nextQty);
    });
  });
  wizardStageEl.querySelectorAll("[data-accessory-addon]").forEach((node) => {
    node.addEventListener("change", (event) => {
      toggleAccessoryAddon(node.dataset.accessoryAddon, event.target.checked);
    });
  });
}

function renderCustomOptionalStep() {
  const optionals = visibleCustomOptionals();
  wizardStageEl.innerHTML = `
    <div class="focus-banner">
      <div>
        <strong>${t().labels.currentMain}</strong>
        <p>${selectedCustomHost() ? localizedText(selectedCustomHost().title) : "-"} + ${selectedCustomPowerBox() ? localizedText(selectedCustomPowerBox().title) : "-"}</p>
      </div>
      <div>
        <strong>${t().labels.currentVideoCombo}</strong>
        <p>${selectedCustomAccessoryDefs().map((item) => localizedText(item.title)).join(" / ") || t().noneSelected}</p>
      </div>
    </div>
    <div class="group-list accessory-vertical-list">
      ${optionals
        .map((def) => {
          const item = findItemByRow(def.itemRow);
          const blockState = ensureOptionalState(def.id);
          const quantity = Number(blockState.quantity || 0);
          const isMultiQty = Number(def.maxQuantity || 0) > 1;
          const disabled = isOptionalDisabled(def);
          const selected = (isMultiQty ? quantity > 0 : blockState.checked) ? "selected" : "";
          const preview = def.image || pickPreviewAsset(item?.images || []);
          return `
            <section class="group-card accessory-row-group">
              <label class="item-card accessory-row-card ${selected} ${disabled ? "disabled" : ""}">
                <div class="accessory-row-media">
                  ${preview ? `<img loading="lazy" decoding="async" class="thumb" src="./${preview}" alt="${localizedText(def.title)}" />` : `<div class="thumb"></div>`}
                </div>
                <div class="accessory-row-copy">
                  <h4>${localizedText(def.title)}</h4>
                  <div class="sku">${item?.partNumber || t().noPartNumber}</div>
                  <p>${optionalDetailText(def)}</p>
                </div>
                <div class="accessory-row-control">
                  ${
                    isMultiQty
                      ? `
                        <div class="qty-stepper" data-optional-stepper="${def.id}">
                          <button type="button" class="qty-btn" data-optional-step="${def.id}" data-direction="-1" ${quantity <= 0 || disabled ? "disabled" : ""}>-</button>
                          <span class="qty-value">${quantity}</span>
                          <button type="button" class="qty-btn" data-optional-step="${def.id}" data-direction="1" ${quantity >= Number(def.maxQuantity || 1) || disabled ? "disabled" : ""}>+</button>
                        </div>
                      `
                      : `<input type="checkbox" data-optional="${def.id}" ${blockState.checked ? "checked" : ""} ${disabled ? "disabled" : ""} />`
                  }
                </div>
              </label>
              ${
                quantity > 0 && def.id === "micro_sd"
                  ? `
                    <div class="extension-picker accessory-qty-picker">
                      <div class="extension-picker-head">
                        <strong>${t().labels.capacity}</strong>
                        <span>1 - ${Number(def.maxQuantity || 2)}</span>
                      </div>
                      <label>
                        <span>${t().labels.card1} ${t().labels.capacity}</span>
                        <select data-optional-variant="${def.id}" data-slot="1">
                          ${SD_CARD_VARIANTS.map((variant) => `<option value="${variant.partNumber}" ${blockState.variant1 === variant.partNumber ? "selected" : ""}>${localizedText(variant.name)} | ${variant.partNumber}</option>`).join("")}
                        </select>
                      </label>
                      ${
                        Number(blockState.quantity || 1) === 2
                          ? `
                            <label>
                              <span>${t().labels.card2} ${t().labels.capacity}</span>
                              <select data-optional-variant="${def.id}" data-slot="2">
                                ${SD_CARD_VARIANTS.map((variant) => `<option value="${variant.partNumber}" ${blockState.variant2 === variant.partNumber ? "selected" : ""}>${localizedText(variant.name)} | ${variant.partNumber}</option>`).join("")}
                              </select>
                            </label>
                          `
                          : ""
                      }
                    </div>
                  `
                  : ""
              }
              ${
                quantity > 0 && def.maxQuantity && def.extensionRows?.length
                  ? Array.from({ length: quantity }, (_, index) =>
                      renderExtensionBlock(
                        def,
                        blockState,
                        "optional",
                        true,
                        index,
                        `${localizedText(def.extensionLabel)} ${index + 1}`
                      ).replace(t().lockedCable, t().labels.b3Hint)
                    ).join("")
                  : blockState.checked && def.extensionRows?.length
                    ? renderExtensionBlock(def, blockState, "optional", true).replace(t().lockedCable, t().labels.b3Hint)
                    : ""
              }
            </section>
          `;
        })
        .join("")}
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-optional]").forEach((node) => {
    node.addEventListener("change", (event) => {
      toggleCustomOptional(node.dataset.optional, event.target.checked);
    });
  });
  wizardStageEl.querySelectorAll("[data-optional-step]").forEach((node) => {
    node.addEventListener("click", () => {
      const optionalId = node.dataset.optionalStep;
      const currentQty = Number(ensureOptionalState(optionalId).quantity || 0);
      const nextQty = currentQty + Number(node.dataset.direction || 0);
      setOptionalQuantity(optionalId, nextQty);
    });
  });
  wizardStageEl.querySelectorAll("[data-optional-variant]").forEach((node) => {
    node.addEventListener("change", (event) => {
      setOptionalVariant(node.dataset.optionalVariant, Number(node.dataset.slot), event.target.value);
    });
  });
}

function renderReviewStep() {
  const rows = selectedItems();
  wizardStageEl.innerHTML = `
    <div class="review-card">
      <h3>${t().reviewTitle}</h3>
      <div class="review-meta">
        <p><strong>${t().summaryFields.product}:</strong> ${product.title}</p>
        <p><strong>${t().summaryFields.scenario}:</strong> ${localizedText(currentScenario()?.title || "") || "-"}</p>
        ${
          isCustomFlow()
            ? `
              <p><strong>${t().summaryFields.host}:</strong> ${selectedCustomHost() ? localizedText(selectedCustomHost().title) : "-"}</p>
              <p><strong>${t().summaryFields.powerBox}:</strong> ${selectedCustomPowerBox() ? localizedText(selectedCustomPowerBox().title) : "-"}</p>
              <p><strong>${t().summaryFields.wiring}:</strong> ${selectedCustomWirings().map((item) => localizedText(item.title)).join(" / ") || "-"}</p>
              <p><strong>${t().summaryFields.optionals}:</strong> ${selectedCustomOptionalDefs().map((item) => localizedText(item.title)).join(" / ") || t().noneSelected}</p>
            `
            : `
              <p><strong>${t().summaryFields.package}:</strong> ${currentPackage() ? displayCatalogText(currentPackage().name) : "-"}</p>
            `
        }
        <p><strong>${t().summaryFields.itemCount}:</strong> ${rows.length}</p>
      </div>
      <p class="hint">${t().reviewHint}</p>
    </div>
  `;
}

function kitLabel(kind) {
  if (kind === "base") return L("当前基础套装", "Current base kit");
  return L("当前核心套装", "Current core kit");
}

function renderStage() {
  if (isC6Product()) normalizeC6Selections();
  if (state.productPickerOpen) {
    renderScenarioStep();
    return;
  }
  if (state.step === 1) {
    if (isC6Product()) renderC6BaseStep();
    else if (isAvmProduct()) renderAvmBaseStep();
    else if (isMSeriesProduct()) renderM1nBaseStep();
    else if (isZ5Product()) renderZ5CoreStep();
    else if (isPresetPackageProduct()) renderPresetPackageStep();
    else renderScenarioStep();
    return;
  }
  if (!isCustomFlow()) {
    if (isMSeriesProduct()) {
      if (state.step === 2) renderM1nWiringStep();
      else if (state.step === 3) renderM1nCameraStep();
      else if (state.step === 4) renderM1nOptionalStep();
      else renderReviewStep();
      return;
    }
    // AVM bespoke steps: connection / screen / alarm.
    if (isAvmProduct()) {
      if (state.step === 2) { renderAvmWiringStep(); return; }
      if (state.step === 3) { renderAvmScreenStep(); return; }
      if (state.step === 4) { renderAvmAlarmStep(); return; }
    }
    // C6 Lite uses bespoke, AD-Plus-style step screens (built in stages).
    if (isC6Product()) {
      if (state.step === 2) {
        renderC6WiringStep();
        return;
      }
      if (state.step === 3) {
        renderC6CameraStep();
        return;
      }
      if (state.step === 4) {
        renderC6AccessoryStep();
        return;
      }
    }
    const meta = PRODUCT_META[state.productId];
    if (isZ5Product()) {
      if (state.step === 2) renderZ5StorageStep();
      else renderReviewStep();
      return;
    }
    if (meta?.selectable) {
      const rowKey = meta.selectable.map[state.step];
      if (rowKey) renderM1nSelectableStep(m1nItemsByRows(meta.selectable.rows[rowKey]), kitLabel(meta.kit));
      else renderReviewStep();
      return;
    }
    if (state.step === 2) renderPresetPackageStep();
    else if (state.step === 3) renderPresetAccessoryStep();
    else renderReviewStep();
    return;
  }
  if (state.step === 2) renderCustomHostStep();
  else if (state.step === 3) renderCustomPowerBoxStep();
  else if (state.step === 4) renderCustomWiringStep();
  else if (state.step === 5) renderCustomAccessoryStep();
  else if (state.step === 6) renderCustomOptionalStep();
  else renderReviewStep();
}

function renderSummary() {
  if (state.productPickerOpen) {
    summaryMetaEl.innerHTML = `
      <p><strong>${t().summaryFields.product}:</strong> ${product?.title || "-"}</p>
      <p><strong>${t().summaryFields.scenario}:</strong> ${localizedText(currentScenario()?.title || "") || t().noneSelected}</p>
    `;
    cartListEl.innerHTML = `<p class="empty">${t().rightBlank}</p>`;
    return;
  }
  if (state.step === 1 && !isZ5Product()) {
    if (isPresetPackageProduct()) {
      summaryMetaEl.innerHTML = `
        <p><strong>${t().summaryFields.product}:</strong> ${product?.title || "-"}</p>
        <p><strong>${t().summaryFields.package}:</strong> ${currentPackage() ? displayCatalogText(currentPackage().name) : t().noneSelected}</p>
      `;
    } else {
      summaryMetaEl.innerHTML = `
        <p><strong>${t().summaryFields.product}:</strong> ${product?.title || "-"}</p>
        <p><strong>${t().summaryFields.scenario}:</strong> ${localizedText(currentScenario()?.title || "") || t().noneSelected}</p>
      `;
    }
    cartListEl.innerHTML = `<p class="empty">${t().rightBlank}</p>`;
    return;
  }

  const rows = selectedItems();
  if (isCustomFlow()) {
    summaryMetaEl.innerHTML = `
      <p><strong>${t().summaryFields.product}:</strong> ${product?.title || "-"}</p>
      <p><strong>${t().summaryFields.host}:</strong> ${selectedCustomHost() ? localizedText(selectedCustomHost().title) : t().noneSelected}</p>
      <p><strong>${t().summaryFields.powerBox}:</strong> ${selectedCustomPowerBox() ? localizedText(selectedCustomPowerBox().title) : t().noneSelected}</p>
      <p><strong>${t().summaryFields.wiring}:</strong> ${selectedCustomWirings().map((item) => localizedText(item.title)).join(" / ") || t().noneSelected}</p>
      <p><strong>${t().summaryFields.wiringNote}:</strong> ${wiringSummaryText() || t().noneSelected}</p>
      <p><strong>${t().summaryFields.optionals}:</strong> ${selectedCustomOptionalDefs().map((item) => localizedText(item.title)).join(" / ") || t().noneSelected}</p>
    `;
    if (!rows.length) {
      cartListEl.innerHTML = `<p class="empty">${t().rightBlank}</p>`;
      return;
    }
  } else {
    const scenario = currentScenario();
    const pkg = currentPackage();
    summaryMetaEl.innerHTML = isZ5Product()
      ? `
        <p><strong>${t().summaryFields.product}:</strong> ${product?.title || "-"}</p>
        <p><strong>${L("Core kit", "Core kit")}:</strong> ${pkg ? displayCatalogText(pkg.name) : t().noneSelected}</p>
        <p><strong>SKU:</strong> ${pkg?.partNumber || t().noneSelected}</p>
        <p><strong>${t().summaryFields.itemCount}:</strong> ${rows.length}</p>
      `
      : isPresetPackageProduct()
      ? `
        <p><strong>${t().summaryFields.product}:</strong> ${product?.title || "-"}</p>
        <p><strong>${L("基础套装", "Base kit")}:</strong> ${pkg ? displayCatalogText(pkg.name) : t().noneSelected}</p>
        <p><strong>${t().summaryFields.package}:</strong> ${pkg?.partNumber || t().noneSelected}</p>
        <p><strong>${t().summaryFields.itemCount}:</strong> ${rows.length}</p>
      `
      : `
        <p><strong>${t().summaryFields.product}:</strong> ${product?.title || "-"}</p>
        <p><strong>${t().summaryFields.solution}:</strong> ${localizedText(scenario?.title || "") || "-"}</p>
        <p><strong>${t().summaryFields.package}:</strong> ${pkg?.partNumber || t().noneSelected}</p>
        <p><strong>${t().summaryFields.itemCount}:</strong> ${rows.length}</p>
      `;
    if (!rows.length) {
      cartListEl.innerHTML = `<p class="empty">${t().noItems}</p>`;
      return;
    }
  }

  const selectedAccessoryDefs = selectedCustomAccessoryDefs();
  const shouldShowVideoNote =
    isCustomFlow() &&
    selectedAccessoryDefs.some((def) => {
      if (def.cameraType) return true;
      if (def.id === "screen") return selectedCustomPowerBox()?.id !== "max";
      return false;
    });
  const summaryNote = shouldShowVideoNote ? `<div class="helper-note">${t().summaryNoteVideo}</div>` : "";

  cartListEl.innerHTML =
    summaryNote +
    rows
      .map(
        (row) => `
          <div class="cart-row">
            <div>
            <strong>${displayCatalogText(row.name || row.group)}</strong>
            <div class="sku">${row.partNumber || t().noPartNumber}</div>
            <div class="hint">${displayCatalogText(row.group)}</div>
          </div>
            <div>x ${row.quantity}</div>
          </div>
        `
      )
      .join("");
}

function renderStaticContent() {
  document.documentElement.lang = L("zh-CN", "en");
  document.body.classList.toggle("compact-flow", state.step > 1);
  document.title = t().docTitle;
  document.getElementById("hero-eyebrow").textContent = t().heroEyebrow;
  document.getElementById("hero-title").textContent = t().heroTitle;
  document.getElementById("hero-intro").textContent = t().heroIntro;
  document.getElementById("highlight-1").textContent = t().heroHighlights[0];
  document.getElementById("highlight-2").textContent = t().heroHighlights[1];
  document.getElementById("highlight-3").textContent = t().heroHighlights[2];
  document.getElementById("hero-note-label").textContent = t().heroNoteLabel;
  document.getElementById("hero-note-title").textContent = t().heroNoteTitle;
  document.getElementById("hero-note-body").textContent = t().heroNoteBody;
  document.getElementById("summary-step").textContent = t().summaryStep;
  document.getElementById("summary-title").textContent = t().summaryTitle;
  prevStepBtn.textContent = t().prev;
  exportCsvBtn.textContent = t().exportCsv;
  exportJsonBtn.textContent = t().exportJson;
  langZhBtn.textContent = state.language === "en" ? "CN" : "中文";
  langEnBtn.textContent = "EN";
  langZhBtn.classList.toggle("active", state.language === "zh");
  langEnBtn.classList.toggle("active", state.language === "en");
}

function render() {
  renderStaticContent();
  renderStepPills();
  renderStage();
  renderSummary();
  updateStepControls();

  wizardStageEl.querySelectorAll("[data-extension-kind]").forEach((node) => {
    node.addEventListener("change", (event) => {
      const kind = node.dataset.extensionKind;
      const id = node.dataset.extensionId;
      const slot = Number(node.dataset.extensionSlot || 0);
      const field = node.dataset.extensionField || "extension";
      if (kind === "accessory") setAccessoryExtension(id, event.target.value, slot, field);
      if (kind === "optional") setOptionalExtension(id, event.target.value, slot);
    });
  });
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportCsv() {
  const rows = selectedItems();
  const header = ["Product", "Scenario", "Family", "Group", "Name", "Part Number", "Quantity", "Note"];
  const lines = [header.join(",")];
  rows.forEach((row) => {
    lines.push(
      [row.product, row.scenario, row.family, row.group, row.name, row.partNumber, row.quantity, row.note]
        .map((value) => `"${String(value || "").replaceAll('"', '""')}"`)
        .join(",")
    );
  });
  downloadFile(`${state.productId || "product"}-cart.csv`, lines.join("\n"), "text/csv;charset=utf-8");
}

function exportJson() {
  downloadFile(`${state.productId || "product"}-cart.json`, JSON.stringify(selectedItems(), null, 2), "application/json;charset=utf-8");
}

function setLanguage(language) {
  if (!LANGS.includes(language)) return;
  state.language = language;
  render();
}

prevStepBtn.addEventListener("click", () => {
  if (isAdplusProduct() && !state.productPickerOpen && state.step === 2) {
    state.productPickerOpen = true;
    state.step = 1;
    render();
    return;
  }
  if (state.step > 1) {
    state.step -= 1;
    render();
    return;
  }
  if (!state.productPickerOpen && state.step === 1) {
    state.productPickerOpen = true;
    render();
  }
});

nextStepBtn.addEventListener("click", () => {
  if (!validateCurrentStep()) return;
  if (state.productPickerOpen) {
    state.productPickerOpen = false;
    state.step = isAdplusProduct() ? 2 : 1;
    render();
    return;
  }
  if (state.step < currentSteps().length) {
    state.step += 1;
    render();
  }
});

exportCsvBtn.addEventListener("click", exportCsv);
exportJsonBtn.addEventListener("click", exportJson);
langZhBtn.addEventListener("click", () => setLanguage("zh"));
langEnBtn.addEventListener("click", () => setLanguage("en"));

if (product) {
  resetScenarioState();
}

render();
