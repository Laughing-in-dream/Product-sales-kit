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

