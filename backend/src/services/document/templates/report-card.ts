/**
 * White-Labeled Report Card HTML Template (Wave 7)
 *
 * Renders an official A4 portrait report card incorporating the school's own
 * logo crest, brand accent color, continuous assessment breakdown, 1224 competition rank, and remarks.
 */

import type { ReportCardDocumentData } from "../types";

export function renderReportCardHtml(data: ReportCardDocumentData): string {
  const brand = data.school.brandColor || "#4338CA";
  const logo =
    data.school.logoUrl ||
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80";

  // Discover all unique CA component names across subjects
  const componentNamesSet = new Set<string>();
  data.subjects.forEach((s) => {
    Object.keys(s.components).forEach((c) => componentNamesSet.add(c));
  });
  const componentNames = Array.from(componentNamesSet);

  const subjectRows = data.subjects
    .map((s, idx) => {
      const compCells = componentNames
        .map((cName) => `<td class="text-center">${s.components[cName] ?? "-"}</td>`)
        .join("");

      return `
      <tr class="${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}">
        <td class="font-medium text-left">${s.subjectName}</td>
        ${compCells}
        <td class="font-bold text-center">${s.total}</td>
        <td class="font-bold text-center text-indigo-700">${s.grade}</td>
        <td class="text-left text-xs">${s.remark}</td>
      </tr>`;
    })
    .join("");

  const componentHeaders = componentNames
    .map((cName) => `<th class="text-center">${cName}</th>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${data.studentName} — ${data.termName} Official Report Card</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1E1B1A;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      font-size: 12px;
      line-height: 1.4;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px solid ${brand};
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .header-logo {
      width: 75px;
      height: 75px;
      object-fit: contain;
      border-radius: 8px;
    }
    .header-text {
      flex: 1;
      text-align: center;
      padding: 0 16px;
    }
    .school-name {
      font-size: 20px;
      font-weight: 800;
      color: ${brand};
      margin: 0 0 4px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .school-sub {
      color: #64748B;
      font-size: 11px;
      margin: 0;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      background: ${brand}15;
      color: ${brand};
      font-weight: 700;
      font-size: 11px;
      border-radius: 9999px;
      margin-top: 6px;
      text-transform: uppercase;
    }
    .student-card {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
    }
    .meta-label {
      font-size: 9px;
      color: #64748B;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 2px;
    }
    .meta-value {
      font-size: 13px;
      font-weight: 700;
      color: #0F172A;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 11px;
    }
    th {
      background: ${brand};
      color: #FFFFFF;
      padding: 8px 6px;
      font-weight: 600;
      border: 1px solid ${brand};
    }
    td {
      padding: 6px 6px;
      border: 1px solid #CBD5E1;
    }
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .font-bold { font-weight: 700; }
    .font-medium { font-weight: 500; }
    .bg-slate-50 { background-color: #F8FAFC; }
    .bg-white { background-color: #FFFFFF; }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }
    .summary-box {
      border: 2px solid ${brand}30;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      background: #FFFFFF;
    }
    .summary-val {
      font-size: 22px;
      font-weight: 800;
      color: ${brand};
    }
    .comments-section {
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 12px;
      background: #F8FAFC;
      margin-bottom: 16px;
    }
    .comment-block {
      margin-bottom: 10px;
    }
    .comment-label {
      font-size: 10px;
      font-weight: 700;
      color: ${brand};
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .comment-text {
      font-size: 11px;
      color: #334155;
      font-style: italic;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px solid #E2E8F0;
    }
    .sig-line {
      width: 180px;
      border-top: 1px dashed #64748B;
      text-align: center;
      font-size: 10px;
      color: #64748B;
      padding-top: 4px;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="${logo}" alt="${data.school.name}" class="header-logo" />
    <div class="header-text">
      <h1 class="school-name">${data.school.name}</h1>
      <p class="school-sub">${data.school.address || "Academic Excellence & Character"}</p>
      <div class="badge">${data.termName} Report Card • ${data.sessionName}</div>
    </div>
    <div style="width: 75px; text-align: right;">
      <div style="font-size: 10px; color: #64748B;">STATUS</div>
      <div style="font-weight: 800; font-size: 12px; color: ${data.status === "published" ? "#059669" : "#D97706"}; text-transform: uppercase;">
        ${data.status}
      </div>
    </div>
  </div>

  <div class="student-card">
    <div class="meta-item">
      <span class="meta-label">Student Name</span>
      <span class="meta-value">${data.studentName}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Admission Number</span>
      <span class="meta-value">${data.admissionNumber}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Class</span>
      <span class="meta-value">${data.className}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Class Rank</span>
      <span class="meta-value" style="color: ${brand};">${data.position}</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="text-left">Subject</th>
        ${componentHeaders}
        <th class="text-center">Total (100)</th>
        <th class="text-center">Grade</th>
        <th class="text-left">Remarks</th>
      </tr>
    </thead>
    <tbody>
      ${subjectRows}
    </tbody>
  </table>

  <div class="summary-grid">
    <div class="summary-box">
      <div class="meta-label">Cumulative Total</div>
      <div class="summary-val">${data.overallTotal} <span style="font-size: 12px; color: #64748B;">/ ${data.maxPossibleTotal}</span></div>
    </div>
    <div class="summary-box">
      <div class="meta-label">Term Average</div>
      <div class="summary-val">${data.average.toFixed(1)}%</div>
    </div>
    <div class="summary-box">
      <div class="meta-label">Final Position</div>
      <div class="summary-val">${data.position}</div>
    </div>
  </div>

  <div class="comments-section">
    <div class="comment-block">
      <div class="comment-label">Class Teacher's Remark</div>
      <div class="comment-text">"${data.teacherComment || "An encouraging performance with consistent academic progress."}"</div>
    </div>
    <div class="comment-block" style="margin-bottom: 0;">
      <div class="comment-label">Head of School / Principal's Stamp & Remark</div>
      <div class="comment-text">"${data.headTeacherComment || "Promising effort. Maintain academic focus in the upcoming term."}"</div>
    </div>
  </div>

  <div class="footer">
    <div class="sig-line">Class Teacher Signature</div>
    <div class="sig-line">Principal / Date</div>
  </div>
</body>
</html>`;
}
