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
  cameras: new Set([11, 12, 13, 14, 15, 16, 17, 22, 23, 39]),
  optionals: new Set([6, 8, 10, 18, 19, 31, 34, 37, 38]),
};

const M3N_STEP_ROWS = {
  wiring: new Set([5, 7]),
  cameras: new Set([10, 11, 12, 13, 14, 15, 16, 17, 22, 23]),
  optionals: new Set([3, 6, 8, 18, 19, 31, 34, 37, 38]),
};

const C6_STEP_ROWS = {
  wiring: new Set([10, 11, 12, 13, 27, 28]),
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
  accessories: new Set([8, 9]),
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
  m1n20: { ipc: 2, ahd: 4, recording: 6 },
  m3n: { ipc: 4, ahd: 4, recording: 8 },
};

const C6_STEPS = {
  zh: null, en: [
    { id: 1, title: "Choose Core Kit", description: "Choose one of four clearly labelled kits: single or dual lens, RS232 or CAN." },
    { id: 2, title: "Choose Power Cable", description: "Confirm the default power cable or switch it to the connector required by the vehicle." },
    { id: 3, title: "Choose Camera", description: "A single-lens kit can add one AHD camera; dual-lens kits already use both channels." },
    { id: 4, title: "Choose R-Watch & Storage", description: "Finish with the compatible R-Watch and up to one Micro SD card." },
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

const AVM_FLOW_STEPS = {
  zh: null, en: [
    { id: 1, title: "Choose Mode & Base Kit", description: "Select standalone or cascade, then confirm the required AVM kit." },
    { id: 2, title: "Cameras & Calibration", description: "Four surround cameras, four individual extension cables, and the calibration cloth are required." },
    { id: 3, title: "Host Connection & Screen", description: "Configure cascade wiring and the AVM bird's-eye AHD output." },
    { id: 4, title: "Alerts & Storage", description: "Add left/right B2 alarms and up to two Micro SD cards." },
    { id: 5, title: "Review & Export", description: "Check the complete AVM list and export the selected SKUs." },
  ],
};

const AVM_STANDALONE_FLOW_STEPS = {
  zh: null, en: [
    { id: 1, title: "Choose Mode & Base Kit", description: "Select standalone or cascade, then confirm the required AVM kit." },
    { id: 2, title: "Cameras & Calibration", description: "Four surround cameras, four individual extension cables, and the calibration cloth are required." },
    { id: 3, title: "Screen, Alerts & Storage", description: "Configure the DP7S screen, left/right B2 alarms, and up to two Micro SD cards." },
    { id: 4, title: "Review & Export", description: "Check the complete AVM list and export the selected SKUs." },
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
                 presetPackage: true, steps: AVM_FLOW_STEPS, kit: "base",
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
