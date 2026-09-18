/**
 * White-Labeled Payment Receipt HTML Template (Wave 7)
 *
 * Renders an official school payment receipt with logo crest, brand accent color,
 * student details, amount in words/figures, payment channel, and verification seal.
 */

import type { ReceiptDocumentData } from "../types";

export function renderReceiptHtml(data: ReceiptDocumentData): string {
  const brand = data.school.brandColor || "#4338CA";
  const logo =
    data.school.logoUrl ||
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Receipt ${data.receiptNumber} — ${data.studentName}</title>
  <style>
    @page {
      size: A5 landscape;
      margin: 10mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1E1B1A;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.4;
    }
    .receipt-container {
      border: 2px solid ${brand};
      border-radius: 8px;
      padding: 16px;
      position: relative;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid ${brand}30;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .header-logo {
      width: 60px;
      height: 60px;
      object-fit: contain;
    }
    .header-text {
      flex: 1;
      text-align: center;
    }
    .school-name {
      font-size: 18px;
      font-weight: 800;
      color: ${brand};
      margin: 0 0 2px 0;
      text-transform: uppercase;
    }
    .receipt-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #64748B;
      text-transform: uppercase;
      margin: 0;
    }
    .receipt-meta {
      text-align: right;
    }
    .receipt-no {
      font-size: 14px;
      font-weight: 800;
      color: ${brand};
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 12px;
    }
    .detail-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 10px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .label {
      color: #64748B;
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .val {
      font-weight: 700;
      color: #0F172A;
    }
    .amount-banner {
      background: ${brand}10;
      border: 1px solid ${brand}40;
      border-radius: 6px;
      padding: 12px;
      text-align: center;
      margin-bottom: 16px;
    }
    .amount-figures {
      font-size: 24px;
      font-weight: 900;
      color: ${brand};
    }
    .amount-words {
      font-size: 11px;
      color: #475569;
      font-style: italic;
      margin-top: 2px;
    }
    .seal {
      display: inline-block;
      border: 2px solid #059669;
      color: #059669;
      padding: 4px 12px;
      font-size: 11px;
      font-weight: 800;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 16px;
      padding-top: 8px;
    }
    .bursar-sig {
      width: 160px;
      border-top: 1px dashed #64748B;
      text-align: center;
      font-size: 10px;
      color: #64748B;
      padding-top: 4px;
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="header">
      <img src="${logo}" alt="${data.school.name}" class="header-logo" />
      <div class="header-text">
        <h1 class="school-name">${data.school.name}</h1>
        <p class="receipt-title">Official Payment Receipt</p>
      </div>
      <div class="receipt-meta">
        <div class="receipt-no">${data.receiptNumber}</div>
        <div style="font-size: 10px; color: #64748B;">Date: ${data.paymentDate}</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="detail-card">
        <div class="row"><span class="label">Received From:</span><span class="val">${data.studentName}</span></div>
        <div class="row"><span class="label">Admission No:</span><span class="val">${data.admissionNumber}</span></div>
        <div class="row"><span class="label">Class:</span><span class="val">${data.className}</span></div>
      </div>
      <div class="detail-card">
        <div class="row"><span class="label">Payment Purpose:</span><span class="val">${data.feeType}</span></div>
        <div class="row"><span class="label">Channel:</span><span class="val" style="text-transform: capitalize;">${data.channel.replace(/_/g, " ")}</span></div>
        <div class="row"><span class="label">Reference:</span><span class="val" style="font-size: 10px;">${data.providerRef || data.paymentId.substring(0, 13)}</span></div>
      </div>
    </div>

    <div class="amount-banner">
      <div class="amount-figures">₦${data.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</div>
      <div class="amount-words">Amount in Words: ${data.amountInWords || "One Hundred and Fifty Thousand Naira Only"}</div>
    </div>

    <div class="footer">
      <div>
        <span class="seal">✓ Verified & Cleared</span>
        <div style="font-size: 8px; color: #94A3B8; margin-top: 4px;">System Generated Electronic Receipt • No Physical Signature Required</div>
      </div>
      <div class="bursar-sig">
        Bursary / Accounts Department
      </div>
    </div>
  </div>
</body>
</html>`;
}
