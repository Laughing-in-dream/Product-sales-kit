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

function z5AccessoryItems() {
  return product?.items?.filter((item) => Z5_STEP_ROWS.accessories.has(item.rowNumber)) || [];
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
    <div class="option-grid two-col">
      <button class="option-card active" data-package="${kit?.id || ""}">
        ${
          preview.src
            ? `<img loading="lazy" decoding="async" class="host-photo" src="./${preview.src}" alt="${kit ? displayCatalogText(kit.name) : "Z5"}" />`
            : `<div class="host-photo host-photo-empty">${t().emptyPreview}</div>`
        }
        <div class="tag">${L("固定核心套装", "Required core kit")}</div>
        <h3>${kit ? displayCatalogText(kit.name) : "Z5"}</h3>
        <div class="sku">${kit?.partNumber || t().noPartNumber}</div>
        <p>${kit ? displayCatalogText(kit.note || kit.description || "") : ""}</p>
      </button>
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-package]").forEach((node) => {
    node.addEventListener("click", () => choosePackage(node.dataset.package));
  });
}

function renderZ5StorageStep() {
  const storageItems = z5StorageItems();
  const accessories = z5AccessoryItems();
  const selectedStorage = storageItems.find((item) => state.selections[item.id]?.checked) || null;
  const storageQuantity = selectedStorage ? 1 : 0;
  const storagePreviewItem = selectedStorage || storageItems[0] || null;
  const storagePreview = storagePreviewItem ? (skuInfo(storagePreviewItem.partNumber)?.image || fallbackItemPreviewAsset(storagePreviewItem)) : "";
  const storageName = selectedStorage ? `Micro SD ${displayCatalogText(selectedStorage.note || selectedStorage.name)}` : "Micro SD card";
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
    <section class="group-card accessory-row-group">
      <div class="item-card accessory-row-card ${storageQuantity > 0 ? "selected" : ""}">
        <div class="accessory-row-media">${storagePreview ? `<img loading="lazy" decoding="async" class="thumb" src="./${storagePreview}" alt="${storageName}" />` : `<div class="thumb"></div>`}</div>
        <div class="accessory-row-copy"><h4>${storageName}</h4><div class="sku">${selectedStorage?.partNumber || t().noPartNumber}</div><p>${L("Choose up to one Micro SD card for Z5.", "Choose up to one Micro SD card for Z5.")}</p></div>
        <div class="accessory-row-control"><div class="qty-stepper"><button type="button" class="qty-btn" data-z5-storage-step="-1" ${storageQuantity === 0 ? "disabled" : ""}>-</button><span class="qty-value">${storageQuantity}</span><button type="button" class="qty-btn" data-z5-storage-step="1" ${storageQuantity >= 1 ? "disabled" : ""}>+</button></div></div>
      </div>
      ${storageQuantity > 0 ? `<div class="extension-picker accessory-qty-picker storage-picker"><div class="extension-picker-head"><strong>${L("选择 Micro SD 卡", "Choose Micro SD card")}</strong><span>${L("最多 1 张", "Up to 1 card")}</span></div><div class="storage-card-grid"><label class="storage-card"><span class="storage-card-label">${L("Micro SD 卡", "Micro SD card")}</span><select data-z5-storage-variant>${storageItems.map((item) => `<option value="${item.id}" ${item.id === selectedStorage.id ? "selected" : ""}>Micro SD ${displayCatalogText(item.note || item.name)}</option>`).join("")}</select><span class="storage-card-sku">SKU ${selectedStorage.partNumber}</span></label></div></div>` : ""}
    </section>
    <div class="c6-section">
      <h3 class="c6-section-title">${L("可选附件", "Optional accessories")}</h3>
      <div class="group-list accessory-vertical-list">
        ${accessories.map((item) => {
          const block = ensurePresetSelectionState(item.id, item.quantity || "1");
          const preview = skuInfo(item.partNumber)?.image || fallbackItemPreviewAsset(item);
          const name = skuInfo(item.partNumber)?.title ? localizedText(skuInfo(item.partNumber).title) : displayCatalogText(item.name);
          return `<section class="group-card accessory-row-group"><label class="item-card accessory-row-card ${block.checked ? "selected" : ""}"><div class="accessory-row-media">${preview ? `<img loading="lazy" decoding="async" class="thumb" src="./${preview}" alt="${name}" />` : `<div class="thumb"></div>`}</div><div class="accessory-row-copy"><h4>${name}</h4><div class="sku">${item.partNumber}</div><p>${displayCatalogText(item.note || item.description || "")}</p></div><div class="accessory-row-control"><input type="checkbox" data-z5-accessory="${item.id}" ${block.checked ? "checked" : ""} /></div></label></section>`;
        }).join("")}
      </div>
    </div>
  `;

  wizardStageEl.querySelectorAll("[data-z5-storage-step]").forEach((node) => {
    node.addEventListener("click", () => {
      const nextQuantity = Math.max(0, Math.min(1, storageQuantity + Number(node.dataset.z5StorageStep || 0)));
      setZ5StorageQuantity(selectedStorage?.id || storageItems[0]?.id, nextQuantity);
    });
  });
  wizardStageEl.querySelectorAll("[data-z5-storage-variant]").forEach((node) => {
    node.addEventListener("change", (event) => setZ5StorageQuantity(event.target.value, 1));
  });
  wizardStageEl.querySelectorAll("[data-z5-accessory]").forEach((node) => {
    node.addEventListener("change", (event) => {
      const block = ensurePresetSelectionState(node.dataset.z5Accessory, "1");
      block.checked = event.target.checked;
      block.quantity = event.target.checked ? "1" : "0";
      render();
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
