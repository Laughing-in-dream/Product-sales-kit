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
    else if (isAvmProduct()) renderAvm2BaseStep();
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
    // AVM bespoke steps: mandatory cameras, then host connection and screen.
    if (isAvmProduct()) {
      if (state.step === 2) { renderAvm2CameraStep(); return; }
      if (state.step === 3) { renderAvm2WiringStep(); return; }
      if (state.avm?.mode === "standalone") { renderReviewStep(); return; }
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
  if (avmCascadeActive() && !state.productPickerOpen && state.step === (isAdplusProduct() ? 2 : 1)) {
    avmReturnFromHostFlow();
    return;
  }
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
  if (isAvmProduct() && state.avm?.mode === "cascade" && state.step === 3) {
    avmEnterHostFlow();
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
