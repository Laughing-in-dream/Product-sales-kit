function c6Items(rows) {
  return (product?.items || []).filter((item) => rows.includes(item.rowNumber));
}

// AVM 2.0 flow. These helpers deliberately construct the fixed AVM BOM instead
// of relying on generic checkbox state: every AVM always has four cameras,
// four camera leads and one calibration-cloth set.
function avmState() {
  state.avm = state.avm || {};
  state.avm.mode = state.avm.mode || "standalone";
  state.avm.cascadeHost = state.avm.cascadeHost || "adplus20";
  state.avm.ahdRoute = state.avm.ahdRoute || "direct";
  state.avm.cameraExtensions = state.avm.cameraExtensions?.length === 4 ? state.avm.cameraExtensions : [9, 9, 9, 9];
  state.avm.storageVariants = state.avm.storageVariants?.length === 2 ? state.avm.storageVariants : [SD_CARD_VARIANTS[0].partNumber, SD_CARD_VARIANTS[0].partNumber];
  state.avm.storageQuantity = Math.max(0, Math.min(2, Number(state.avm.storageQuantity || 0)));
  return state.avm;
}

function avmItemByRow(row) {
  return c6Items([row])[0] || null;
}

function avmDisplayName(item) {
  return skuInfo(item?.partNumber)?.title ? localizedText(skuInfo(item.partNumber).title) : displayCatalogText(item?.name || "");
}

function avmBomLine(item, quantity = "1") {
  return {
    product: product.title,
    scenario: "",
    family: "",
    group: displayCatalogText(item.group),
    name: avmDisplayName(item),
    partNumber: item.partNumber,
    quantity: String(quantity),
    note: displayCatalogText(item.note),
    description: displayCatalogText(item.description),
  };
}

function avmSelectableCard(item, key, checked, detailOverride = "") {
  const preview = skuInfo(item.partNumber)?.image || fallbackItemPreviewAsset(item);
  return `
    <section class="group-card accessory-row-group">
      <label class="item-card accessory-row-card ${checked ? "selected" : ""}">
        <div class="accessory-row-media">${preview ? `<img loading="lazy" decoding="async" class="thumb" src="./${preview}" alt="${avmDisplayName(item)}" />` : `<div class="thumb"></div>`}</div>
        <div class="accessory-row-copy"><h4>${avmDisplayName(item)}</h4><div class="sku">${item.partNumber}</div><p>${detailOverride || displayCatalogText(item.note || item.description || "")}</p></div>
        <div class="accessory-row-control"><input type="checkbox" ${key} ${checked ? "checked" : ""} /></div>
      </label>
    </section>`;
}

function renderAvm2BaseStep() {
  const avm = avmState();
  const kit = avmItemByRow(6);
  const active = state.packageId === kit?.id;
  const kitPreview = skuInfo(kit?.partNumber)?.image || fallbackItemPreviewAsset(kit);
  wizardStageEl.innerHTML = `
    <div class="c6-section">
      <h3 class="c6-section-title">${L("方案模式", "Solution mode")}</h3>
      <div class="option-grid two-col">
        <button type="button" class="option-card ${avm.mode === "standalone" ? "active" : ""}" data-avm2-mode="standalone"><div class="tag">${L("单机", "Standalone")}</div><h3>${L("独立单机", "Standalone AVM")}</h3><p>${L("AVM 直接向 DP7S 输出鸟瞰图。", "AVM sends its bird's-eye AHD output directly to DP7S.")}</p></button>
        <button type="button" class="option-card ${avm.mode === "cascade" ? "active" : ""}" data-avm2-mode="cascade"><div class="tag">${L("级联", "Cascade")}</div><h3>${L("级联从机", "Cascade slave")}</h3><p>${L("AVM 通过 IPC 接入 AD Plus 2.0、M1N 2.0 或 M3N。", "AVM connects through IPC to AD Plus 2.0, M1N 2.0, or M3N.")}</p></button>
      </div>
    </div>
    <div class="c6-section">
      <h3 class="c6-section-title">${L("必选 AVM Kit", "Required AVM kit")}</h3>
      <button class="option-card avm-kit-card ${active ? "active" : ""}" data-package="${kit?.id || ""}">
        ${kitPreview ? `<img loading="lazy" decoding="async" class="host-photo" src="./${kitPreview}" alt="AVM" />` : ""}
        <div class="tag">${L("必选", "Required")}</div><h3>${avmDisplayName(kit)}</h3><div class="sku">${kit?.partNumber || ""}</div><p>${displayCatalogText(kit?.note || "")}</p>
      </button>
    </div>`;
  wizardStageEl.querySelectorAll("[data-avm2-mode]").forEach((node) => node.addEventListener("click", () => { avm.mode = node.dataset.avm2Mode; render(); }));
  wizardStageEl.querySelectorAll("[data-package]").forEach((node) => node.addEventListener("click", () => choosePackage(node.dataset.package)));
}

function renderAvm2CameraStep() {
  const avm = avmState();
  const camera = avmItemByRow(13);
  const calibration = avmItemByRow(14);
  const extensions = [9, 10, 11, 12].map(avmItemByRow).filter(Boolean);
  const cameraPreview = skuInfo(camera?.partNumber)?.image || fallbackItemPreviewAsset(camera);
  wizardStageEl.innerHTML = `
    <div class="focus-banner"><div><strong>${L("固定配置", "Fixed configuration")}</strong><p>${L("4 个环视摄像机 + 4 条独立延长线 + 标定布", "4 surround cameras + 4 individual extension cables + calibration cloth")}</p></div></div>
    <section class="group-card accessory-row-group"><div class="item-card accessory-row-card selected"><div class="accessory-row-media">${cameraPreview ? `<img class="thumb" src="./${cameraPreview}" alt="${avmDisplayName(camera)}" />` : ""}</div><div class="accessory-row-copy"><h4>${avmDisplayName(camera)} × 4</h4><div class="sku">${camera?.partNumber || ""}</div><p>${L("每套 AVM 必带四个同制式 CA51D 摄像机。", "Every AVM requires four CA51D cameras of the same standard.")}</p></div><div class="accessory-row-control"><span class="tag">${L("必选", "Required")}</span></div></div></section>
    <div class="extension-picker"><div class="extension-picker-head"><strong>${L("四条摄像机延长线", "Four camera extension cables")}</strong><span>${L("分别按安装距离选择", "Choose each by installation distance")}</span></div>${[0, 1, 2, 3].map((slot) => `<label><span>${L("摄像机", "Camera")} ${slot + 1}</span><select data-avm2-camera-extension="${slot}">${extensions.map((item) => `<option value="${item.rowNumber}" ${Number(avm.cameraExtensions[slot]) === item.rowNumber ? "selected" : ""}>${formatExtensionOptionLabel(item)}</option>`).join("")}</select></label>`).join("")}</div>
    <section class="group-card accessory-row-group"><div class="item-card accessory-row-card selected"><div class="accessory-row-copy"><h4>${avmDisplayName(calibration)}</h4><div class="sku">${calibration?.partNumber || ""}</div><p>${L("一套 4 块，默认带出。", "One set of four, included by default.")}</p></div><div class="accessory-row-control"><span class="tag">${L("必选", "Required")}</span></div></div></section>`;
  wizardStageEl.querySelectorAll("[data-avm2-camera-extension]").forEach((node) => node.addEventListener("change", () => { avm.cameraExtensions[Number(node.dataset.avm2CameraExtension)] = Number(node.value); render(); }));
}

function renderAvm2WiringStep() {
  const avm = avmState();
  const screen = avmItemByRow(15);
  const screenChecked = Boolean(state.selections[screen?.id]?.checked);
  const hostNames = { adplus20: "AD Plus 2.0", m1n20: "M1N 2.0", m3n: "M3N" };
  wizardStageEl.innerHTML = `
    <div class="c6-section">
      <h3 class="c6-section-title">${L("上级主机连接", "Host connection")}</h3>
      ${avm.mode === "cascade" ? `<p class="c6-section-hint">${L("级联线会自动加入。主机侧占用 1 路 IPC 与 1 路录像通道，画面为四分屏。", "The cascade IPC cable is included automatically. The host uses 1 IPC and 1 recording channel for a four-way split view.")}</p><label class="extension-picker"><span>${L("级联目标主机", "Cascade host")}</span><select data-avm2-host>${Object.entries(hostNames).map(([id, name]) => `<option value="${id}" ${avm.cascadeHost === id ? "selected" : ""}>${name}</option>`).join("")}</select></label>` : `<p class="c6-section-hint">${L("单机模式不接上级 MDVR。", "Standalone mode does not connect to an upstream MDVR.")}</p>`}
    </div>
    <div class="c6-section"><h3 class="c6-section-title">${L("司机屏幕与俯瞰图输出", "Driver screen & bird's-eye output")}</h3>${avmSelectableCard(screen, `data-avm2-screen="${screen.id}"`, screenChecked)}
      ${screenChecked ? `<div class="option-grid two-col"><button type="button" class="option-card ${avm.ahdRoute === "direct" ? "active" : ""}" data-avm2-route="direct"><h3>${L("直接到屏幕", "Direct to screen")}</h3><p>${L("带 AHD 信号转接线，仅供司机查看。", "Includes the AHD signal adapter; for driver viewing only.")}</p></button>${avm.mode === "cascade" ? `<button type="button" class="option-card ${avm.ahdRoute === "split" ? "active" : ""}" data-avm2-route="split"><h3>${L("屏幕 + MDVR 录制", "Screen + MDVR recording")}</h3><p>${L("带一拖二线，同时接屏幕和主机 AHD 输入。", "Includes the splitter cable to feed both screen and host AHD input.")}</p></button>` : ""}</div>` : ""}
    </div>`;
  wizardStageEl.querySelectorAll("[data-avm2-host]").forEach((node) => node.addEventListener("change", () => { avm.cascadeHost = node.value; render(); }));
  wizardStageEl.querySelectorAll("[data-avm2-screen]").forEach((node) => node.addEventListener("change", (event) => { state.selections[screen.id] = { checked: event.target.checked, quantity: "1" }; render(); }));
  wizardStageEl.querySelectorAll("[data-avm2-route]").forEach((node) => node.addEventListener("click", () => { avm.ahdRoute = node.dataset.avm2Route; render(); }));
}

function renderAvm2AccessoriesStep() {
  const avm = avmState();
  const b2s = [avmItemByRow(17), avmItemByRow(18)];
  const b2Extensions = [28, 29, 30].map((row) => findCatalogItem("m3n", row)).filter(Boolean);
  wizardStageEl.innerHTML = `
    <div class="c6-section"><h3 class="c6-section-title">${L("B2 声光报警器", "B2 sound and light alarms")}</h3><p class="c6-section-hint">${L("左右独立选择。每个 B2 默认带 6PIN IPC 延长线；转接线按数量自动匹配。", "Choose left/right independently. Each B2 includes a default 6PIN IPC extension; the adapter is matched by quantity.")}</p>
      <div class="group-list accessory-vertical-list">${b2s.map((item) => { const block = state.selections[item.id] || {}; const selected = Boolean(block.checked); const ext = Number(block.b2ExtensionRow || 28); return `${avmSelectableCard(item, `data-avm2-b2="${item.id}"`, selected)}${selected ? `<div class="extension-picker"><label><span>${L("B2 IPC 延长线", "B2 IPC extension cable")}</span><select data-avm2-b2-extension="${item.id}">${b2Extensions.map((cable) => `<option value="${cable.rowNumber}" ${ext === cable.rowNumber ? "selected" : ""}>${formatExtensionOptionLabel(cable)}</option>`).join("")}</select></label></div>` : ""}`; }).join("")}</div>
    </div>
    <div class="c6-section"><h3 class="c6-section-title">${L("Micro SD 卡", "Micro SD cards")}</h3><div class="qty-stepper"><button type="button" class="qty-btn" data-avm2-storage-step="-1" ${avm.storageQuantity === 0 ? "disabled" : ""}>-</button><span class="qty-value">${avm.storageQuantity}</span><button type="button" class="qty-btn" data-avm2-storage-step="1" ${avm.storageQuantity >= 2 ? "disabled" : ""}>+</button></div>${Array.from({ length: avm.storageQuantity }, (_, index) => `<div class="extension-picker"><label><span>${L("SD 卡", "SD card")} ${index + 1}</span><select data-avm2-storage-variant="${index}">${SD_CARD_VARIANTS.map((variant) => `<option value="${variant.partNumber}" ${avm.storageVariants[index] === variant.partNumber ? "selected" : ""}>${localizedText(variant.name)} | ${variant.partNumber}</option>`).join("")}</select></label></div>`).join("")}</div>`;
  wizardStageEl.querySelectorAll("[data-avm2-b2]").forEach((node) => node.addEventListener("change", (event) => { const block = state.selections[node.dataset.avm2B2] || { quantity: "1" }; block.checked = event.target.checked; block.b2ExtensionRow = block.b2ExtensionRow || 28; state.selections[node.dataset.avm2B2] = block; render(); }));
  wizardStageEl.querySelectorAll("[data-avm2-b2-extension]").forEach((node) => node.addEventListener("change", () => { state.selections[node.dataset.avm2B2Extension].b2ExtensionRow = Number(node.value); render(); }));
  wizardStageEl.querySelectorAll("[data-avm2-storage-step]").forEach((node) => node.addEventListener("click", () => { avm.storageQuantity = Math.max(0, Math.min(2, avm.storageQuantity + Number(node.dataset.avm2StorageStep))); render(); }));
  wizardStageEl.querySelectorAll("[data-avm2-storage-variant]").forEach((node) => node.addEventListener("change", () => { avm.storageVariants[Number(node.dataset.avm2StorageVariant)] = node.value; render(); }));
}

function selectedAvmItems() {
  const avm = avmState();
  const rows = [avmBomLine(avmItemByRow(6)), avmBomLine(avmItemByRow(13), 4), avmBomLine(avmItemByRow(14))];
  avm.cameraExtensions.forEach((row) => { const item = avmItemByRow(Number(row)); if (item) rows.push(avmBomLine(item)); });
  if (avm.mode === "cascade") { const cascadeCable = avmItemByRow(8); if (cascadeCable) rows.push(avmBomLine(cascadeCable)); }
  const screen = avmItemByRow(15);
  if (state.selections[screen?.id]?.checked) {
    rows.push(avmBomLine(screen));
    const ahdCable = avmItemByRow(avm.mode === "cascade" && avm.ahdRoute === "split" ? 7 : 16);
    if (ahdCable) rows.push(avmBomLine(ahdCable));
  }
  const selectedB2 = [avmItemByRow(17), avmItemByRow(18)].filter((item) => state.selections[item?.id]?.checked);
  selectedB2.forEach((item) => { rows.push(avmBomLine(item)); const extension = findCatalogItem("m3n", Number(state.selections[item.id]?.b2ExtensionRow || 28)); if (extension) rows.push(avmBomLine(extension)); });
  if (selectedB2.length) { const adapter = avmItemByRow(selectedB2.length === 1 ? 19 : 20); if (adapter) rows.push(avmBomLine(adapter)); }
  for (let index = 0; index < avm.storageQuantity; index += 1) { const variant = SD_CARD_VARIANTS.find((item) => item.partNumber === avm.storageVariants[index]) || SD_CARD_VARIANTS[0]; rows.push({ product: product.title, scenario: "", family: "", group: "Storage", name: localizedText(variant.name), partNumber: variant.partNumber, quantity: "1", note: "AVM storage", description: "AVM Micro SD card" }); }
  return rows;
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
