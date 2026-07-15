# Streamax Sales Configurator — Project Overview

## 1. Project background

The North America sellable catalog contains many hosts, cameras, power cables, adapter cables, extension cables, displays, storage cards, and accessories. The information is necessary, but it is difficult to use directly as a solution-building tool.

Three recurring problems motivated this project:

1. **The sellable catalog is not friendly for new colleagues.** New technical-support and sales colleagues need substantial training before they can confidently turn customer needs into a complete solution. Every customer request differs, so preparing a solution can take significant time and can delay quotation.
2. **Discovery calls often end before the key installation details are collected.** A customer may be interested in one or several solutions, but important details can remain unknown: vehicle type, available power connection, vehicle length, camera position, storage requirement, and screen requirement. Adding the maximum possible redundancy increases solution cost and can reduce customer interest; asking for every detail later can slow the process and reduce confidence.
3. **Manual solutions are vulnerable to small but costly errors.** Connector gender, cable type, output cable, adapter cable, extension length, and accessory combinations are easy to miss. Technical support often relies on individual experience to organize the list, so missing or incorrect cables can happen even when the main device selection is correct.

## 2. Project objective

Convert the abstract and part-number-heavy Excel sellable catalog into an understandable, guided solution-building tool.

The goal is not simply to display products online. The goal is to let a user construct a technically consistent solution with less training, fewer repeated cable checks, and more attention on the customer scenario itself.

## 3. Project content and delivered capability

### 3.1 Visual product-selection flow

- Converted product, kit, accessory, and cable choices from spreadsheet rows into visual selection pages.
- Organizes choices in the order a user naturally needs them: host or solution form, power connection, cameras, supporting cables, display, storage, and accessories.
- Keeps a live Build Summary so the selected materials are visible throughout the process.

### 3.2 Product-rule and capacity checks

- Applies interface and camera-count limits for supported product lines.
- Applies algorithm-capacity limits where AHD and IPC cameras use host resources differently.
- Applies recording-channel capacity checks so accessory solutions cannot silently exceed the selected MDVR capacity.
- Handles solution-specific constraints, including standalone versus cascade scenarios where applicable.

### 3.3 Cable and installation safeguards

- Automatically includes required adapter or signal cables in defined scenarios, such as selections that need an AHD signal adapter or video output cable.
- Presents compatible extension-cable choices when a camera, display, or accessory requires an installation-length decision.
- Provides reminders when removing or changing a supporting cable could affect installation.
- Reduces manual sorting of connector types, male/female ends, outputs, adapters, and extension cables.

### 3.4 Storage, accessories, and export

- Supports SD-card selection using the same consistent structure across applicable products.
- Supports product-specific accessories such as displays, alarms, GPS, calibration materials, and other required options.
- Exports the final material list in the approved Opportunity Product Import Template format, with `Sales Price` preset to `1` and `Factory` preset to `Vietnam factory`.

### 3.5 Beta feedback and operational visibility

- Provides visible version information and release notes for beta users.
- Lets a user annotate a specific page element and submit a written change request; the reviewer can reopen the same configuration in an administrator-only page with that element highlighted.
- Provides an internal admin view for feedback, annotations, and exported-solution activity.

## 4. What the project solves

| Previous working method | Improvement delivered by the configurator |
| --- | --- |
| Read a long catalog and manually infer a compatible package | Follow a guided, visual solution path |
| Depend heavily on personal experience for cables and connectors | Apply reusable rules, defaults, and installation reminders |
| Repeatedly ask customers for missing installation details after a call | Use the guided questions to collect the details needed for the solution |
| Build a list separately and manually check it for omissions | Maintain a live material summary and export one consistent Excel list |
| Report an issue vaguely through chat or email | Mark the exact UI element and let the reviewer reopen it in context |

## 5. Current effect

The first phase has established a usable beta configurator rather than a static online catalog. Supported product paths can be configured through visual steps, with dynamic material summaries and rule-based restrictions for the scenarios already modeled in the knowledge base.

The current experience is expected to improve the speed and consistency of preliminary solution preparation, especially for users who do not yet have deep familiarity with all connector and cable combinations. It also makes assumptions visible earlier in the conversation, which should improve the quality of discovery-call follow-up.

The product is now ready to be measured with operating data. The following indicators should be tracked after deployment:

- Number of exported solutions and active users.
- Average time from customer requirement to first complete material list.
- Number and type of feedback or annotation reports.
- Rate of missing-cable, wrong-connector, or compatibility corrections before order placement.
- Conversion from discovery call to a confirmed preliminary solution or quotation.

> Add actual baseline and post-launch figures here once sufficient usage data is available.

## 6. Current blockers and risks

### 6.1 Sellable-catalog detail is not yet complete enough

The source sellable catalog needs more structured detail. For example, AD Plus 2.0 should include the full set of applicable loose-wire, OBD, and other cable SKUs, with their differences and applicable conditions clearly highlighted. The configurator can only guide reliably when the source catalog explains the selection rules and differences clearly enough.

### 6.2 Sellable part numbers and Salesforce ordering part numbers can differ

In some cases, the part number used in the sellable catalog is not the final Salesforce ordering SKU. Sales colleagues may still need to compare descriptions and search for the corresponding order SKU after receiving a solution. This leaves manual work and mismatch risk at the final ordering stage.

### 6.3 Rule ownership and validation need an operating process

The first phase has documented many product rules in the knowledge base, but every rule needs a clear business owner, source, confirmation status, and review cadence. Otherwise, a correct configuration today can become outdated when a product, cable, or sales policy changes.

## 7. Phase-two direction

Phase two should shift the product from a **product-oriented kit selector** to a **scenario-oriented solution builder**, and gradually move from an internal technical-support and sales tool to a customer-facing guided experience.

### 7.1 Vehicle-model and camera-placement builder

Create a visual vehicle model where a user can add cameras to the front, rear, left side, right side, or cabin. The solution should respond automatically by adding or removing the corresponding cameras, cables, extensions, accessories, channel usage, and compatibility checks.

This will let customers describe the solution through the vehicle and scenario rather than through product names.

### 7.2 Semantic AI requirement intake, controlled by approved rules

Introduce a large-model interface that understands a customer’s natural-language scenario, such as vehicle type, operating environment, safety concern, camera location, and recording need.

The model should not freely invent a solution. Its role is to convert the customer’s abstract requirement into structured inputs for the approved configuration rules and preset solution templates. The existing rule engine then produces a consistent, validated material list.

### 7.3 Local inventory connection

Connect verified local inventory, starting with Houston warehouse availability where feasible. The solution could then distinguish between a technically valid configuration and a configuration that can be supplied from local stock, supporting faster quotation and delivery discussions.

### 7.4 Salesforce ordering-SKU mapping

Build and maintain a mapping between sellable-catalog SKUs, solution descriptions, and Salesforce order SKUs. The exported list should show the correct ordering part number or clearly flag where a mapping still needs confirmation.

## 8. Recommended next steps

1. Confirm the Phase-one product-rule list with product management and technical support, prioritizing high-frequency product lines and cables.
2. Complete sellable-catalog detail and explicitly document the differences between similar cable and power options.
3. Establish the Salesforce ordering-SKU mapping and a named owner for future maintenance.
4. Deploy the beta version, collect usage and error-correction data, and use the results to prioritize Phase-two vehicle-model scenarios.
5. Prototype the vehicle-model interaction with a small number of high-volume customer scenarios before expanding to broader AI intake and inventory integration.
