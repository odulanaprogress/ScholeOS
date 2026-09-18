/**
 * White-Labeled Student ID Cards HTML Template (Wave 7)
 *
 * Renders compact CR80 ID cards (single card and whole-class batch printing grid)
 * with school logo, brand colors, student details, and inline SVG QR codes.
 */

import type { StudentIdCardData, SchoolBranding } from "../types";
import { generateSvgQrCode } from "../qrcode";

/**
 * Renders a single student ID card HTML snippet
 */
function renderCardSnippet(card: StudentIdCardData): string {
  const brand = card.school.brandColor || "#4338CA";
  const logo =
    card.school.logoUrl ||
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80";
  const photo =
    card.photoUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

  const qrSvg = generateSvgQrCode(`SCHOLEOS:${card.school.id}:${card.studentId}:${card.admissionNumber}`, 68);

  return `
  <div class="id-card">
    <div class="id-header" style="background: ${brand};">
      <img src="${logo}" class="id-logo" alt="${card.school.name}" />
      <div class="id-school-name">${card.school.name}</div>
    </div>
    <div class="id-body">
      <div class="id-left">
        <img src="${photo}" class="id-photo" alt="${card.studentName}" />
        <div class="id-tag">STUDENT</div>
      </div>
      <div class="id-right">
        <div class="id-name">${card.studentName}</div>
        <div class="id-field"><span class="id-lbl">ADM NO:</span> <strong>${card.admissionNumber}</strong></div>
        <div class="id-field"><span class="id-lbl">CLASS:</span> <strong>${card.className}</strong></div>
        <div class="id-field"><span class="id-lbl">VALID:</span> 2026 / 2027</div>
      </div>
      <div class="id-qr-box">
        ${qrSvg}
      </div>
    </div>
    <div class="id-footer" style="border-top: 2px solid ${brand};">
      <span>Authorized Student ID • Property of School</span>
    </div>
  </div>`;
}

/**
 * Renders a single printable ID card page
 */
export function renderSingleIdCardHtml(card: StudentIdCardData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>ID Card — ${card.studentName}</title>
  <style>
    @page {
      size: 85.6mm 53.98mm;
      margin: 0;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #F1F5F9;
      height: 100vh;
    }
    .id-card {
      width: 85.6mm;
      height: 53.98mm;
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .id-header {
      color: #FFFFFF;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .id-logo {
      width: 20px;
      height: 20px;
      object-fit: contain;
      border-radius: 2px;
      background: #FFFFFF;
      padding: 1px;
    }
    .id-school-name {
      font-size: 8.5px;
      font-weight: 800;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      letter-spacing: 0.3px;
    }
    .id-body {
      flex: 1;
      display: flex;
      padding: 6px 8px;
      align-items: center;
      gap: 8px;
    }
    .id-left {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .id-photo {
      width: 44px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #CBD5E1;
    }
    .id-tag {
      font-size: 6.5px;
      font-weight: 800;
      color: #FFFFFF;
      background: #0F172A;
      padding: 1px 4px;
      border-radius: 2px;
      margin-top: 2px;
      letter-spacing: 0.5px;
    }
    .id-right {
      flex: 1;
    }
    .id-name {
      font-size: 9.5px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 3px;
      line-height: 1.1;
    }
    .id-field {
      font-size: 7.5px;
      color: #334155;
      margin-bottom: 2px;
    }
    .id-lbl {
      color: #64748B;
      font-weight: 600;
    }
    .id-qr-box {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .id-footer {
      font-size: 6px;
      color: #64748B;
      text-align: center;
      padding: 2px 4px;
      background: #F8FAFC;
    }
  </style>
</head>
<body>
  ${renderCardSnippet(card)}
</body>
</html>`;
}

/**
 * Renders a whole-class batch printing grid (8 ID cards per A4 sheet)
 */
export function renderBatchIdCardsHtml(
  cards: StudentIdCardData[],
  school: SchoolBranding,
  className: string
): string {
  const brand = school.brandColor || "#4338CA";
  const cardsHtml = cards.map((c) => renderCardSnippet(c)).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${className} — Batch Printable ID Cards</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #FFFFFF;
    }
    .batch-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid ${brand};
      padding-bottom: 6px;
      margin-bottom: 12px;
      font-size: 11px;
    }
    .batch-grid {
      display: grid;
      grid-template-columns: repeat(2, 85.6mm);
      gap: 8mm;
      justify-content: center;
    }
    .id-card {
      width: 85.6mm;
      height: 53.98mm;
      background: #FFFFFF;
      border: 1px dashed #94A3B8;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
      break-inside: avoid;
    }
    .id-header {
      color: #FFFFFF;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .id-logo {
      width: 20px;
      height: 20px;
      object-fit: contain;
      border-radius: 2px;
      background: #FFFFFF;
      padding: 1px;
    }
    .id-school-name {
      font-size: 8.5px;
      font-weight: 800;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      letter-spacing: 0.3px;
    }
    .id-body {
      flex: 1;
      display: flex;
      padding: 6px 8px;
      align-items: center;
      gap: 8px;
    }
    .id-left {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .id-photo {
      width: 44px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #CBD5E1;
    }
    .id-tag {
      font-size: 6.5px;
      font-weight: 800;
      color: #FFFFFF;
      background: #0F172A;
      padding: 1px 4px;
      border-radius: 2px;
      margin-top: 2px;
      letter-spacing: 0.5px;
    }
    .id-right {
      flex: 1;
    }
    .id-name {
      font-size: 9.5px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 3px;
      line-height: 1.1;
    }
    .id-field {
      font-size: 7.5px;
      color: #334155;
      margin-bottom: 2px;
    }
    .id-lbl {
      color: #64748B;
      font-weight: 600;
    }
    .id-qr-box {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .id-footer {
      font-size: 6px;
      color: #64748B;
      text-align: center;
      padding: 2px 4px;
      background: #F8FAFC;
    }
  </style>
</head>
<body>
  <div class="batch-header">
    <span><strong>${school.name}</strong> • ${className} ID Cards Batch Print</span>
    <span>Total Cards: <strong>${cards.length}</strong></span>
  </div>
  <div class="batch-grid">
    ${cardsHtml}
  </div>
</body>
</html>`;
}
