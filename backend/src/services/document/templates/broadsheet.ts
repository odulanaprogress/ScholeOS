/**
 * White-Labeled Class Broadsheet HTML Template (Wave 7)
 *
 * Renders an A4 Landscape class-wide master score sheet (students × subjects matrix),
 * sorted by 1224 Standard Competition Rank with school logo and brand styling.
 */

import type { BroadsheetDocumentData } from "../types";

export function renderBroadsheetHtml(data: BroadsheetDocumentData): string {
  const brand = data.school.brandColor || "#4338CA";
  const logo =
    data.school.logoUrl ||
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80";

  const subjectHeaderCells = data.subjects
    .map((s) => `<th class="text-center" style="font-size: 9px;">${s.code || s.name.substring(0, 4).toUpperCase()}</th>`)
    .join("");

  const studentRows = data.students
    .map((st, idx) => {
      const scoreCells = data.subjects
        .map((sub) => {
          const score = st.subjectScores[sub.id];
          return `<td class="text-center">${score !== undefined ? score : "-"}</td>`;
        })
        .join("");

      return `
      <tr class="${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}">
        <td class="text-center font-bold" style="color: ${brand};">${st.position}</td>
        <td class="text-left font-mono" style="font-size: 9px;">${st.admissionNumber}</td>
        <td class="text-left font-medium whitespace-nowrap">${st.studentName}</td>
        ${scoreCells}
        <td class="text-center font-bold">${st.overallTotal}</td>
        <td class="text-center font-bold" style="color: ${brand};">${st.average.toFixed(1)}%</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${data.className} — ${data.termName} Official Broadsheet</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1E1B1A;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      font-size: 10px;
      line-height: 1.2;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid ${brand};
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .header-logo {
      width: 55px;
      height: 55px;
      object-fit: contain;
      border-radius: 6px;
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
    .broadsheet-title {
      font-size: 12px;
      font-weight: 700;
      color: #334155;
      margin: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 10px;
    }
    th {
      background: ${brand};
      color: #FFFFFF;
      padding: 6px 4px;
      font-weight: 600;
      border: 1px solid ${brand};
    }
    td {
      padding: 4px 4px;
      border: 1px solid #CBD5E1;
    }
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .font-bold { font-weight: 700; }
    .font-medium { font-weight: 500; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, monospace; }
    .bg-slate-50 { background-color: #F8FAFC; }
    .bg-white { background-color: #FFFFFF; }
    .whitespace-nowrap { white-space: nowrap; }
    .footer {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      padding-top: 8px;
      border-top: 1px solid #E2E8F0;
    }
    .sig-line {
      width: 180px;
      border-top: 1px dashed #64748B;
      text-align: center;
      font-size: 9px;
      color: #64748B;
      padding-top: 3px;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="${logo}" alt="${data.school.name}" class="header-logo" />
    <div class="header-text">
      <h1 class="school-name">${data.school.name}</h1>
      <p class="broadsheet-title">${data.className.toUpperCase()} MASTER BROADSHEET • ${data.termName.toUpperCase()} (${data.sessionName})</p>
    </div>
    <div style="width: 55px; text-align: right; font-size: 9px; color: #64748B;">
      TOTAL STUDENTS: <strong>${data.students.length}</strong>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="text-center" style="width: 40px;">Rank</th>
        <th class="text-left" style="width: 85px;">Admission No</th>
        <th class="text-left">Student Name</th>
        ${subjectHeaderCells}
        <th class="text-center" style="width: 45px;">Total</th>
        <th class="text-center" style="width: 50px;">Avg</th>
      </tr>
    </thead>
    <tbody>
      ${studentRows}
    </tbody>
  </table>

  <div class="footer">
    <div class="sig-line">Class Teacher: Verified & Prepared</div>
    <div class="sig-line">Dean of Studies: Reviewed</div>
    <div class="sig-line">Principal: Approved & Stamped</div>
  </div>
</body>
</html>`;
}
