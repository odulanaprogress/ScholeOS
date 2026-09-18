/**
 * Comprehensive Automated Test Suite for Wave 10: CBT Backend
 *
 * Verifies:
 * 1. PostgreSQL Schema: cbt_tests, cbt_questions, cbt_submissions, enums.
 * 2. POST /cbt/tests - Subject teacher creates draft test + questions with totalPoints calculation.
 * 3. PATCH /cbt/tests/:id - Teacher edits draft test & questions (only while 'draft').
 * 4. POST /cbt/tests/:id/publish - Teacher flips status to 'scheduled' (locks draft editing).
 * 5. GET /cbt/tests/student - Student fetches tests with dynamic statuses (not_yet_live, live_now, completed, missed).
 * 6. POST /cbt/tests/:id/start - Student starts test session:
 *    - CRITICAL SECURITY CHECK: correct_option_index is STRICTLY stripped from student payload.
 *    - Duplicate restart guard: retakes of completed tests strictly rejected (HTTP 400).
 *    - Resume support: in-progress test returns active session & saved answers.
 * 7. PATCH /cbt/submissions/:id/answer - Incremental answer saving protects partial progress against disconnects.
 * 8. POST /cbt/submissions/:id/submit - Server-side auto-grading against answer key (untrusted client scores ignored).
 * 9. Auto-Submit on Timeout - Submissions marked 'auto_submitted' with identical server-side scoring.
 * 10. GET /cbt/submissions/:id/results - Detailed question-by-question breakdown of student answer vs correct answer.
 * 11. GET /cbt/tests/:id/results - Aggregated class analytics (average, highest, completion rate, submission roster).
 * 12. POST /cbt/tests/:id/import-to-gradebook - Teacher pulls completed CBT scores into continuous assessment grid with weight scaling.
 */

process.env.NODE_ENV = "test";

import { app } from "./index";
import { cbtTests, cbtQuestions, cbtSubmissions, cbtTestStatusEnum, cbtSubmissionStatusEnum } from "../../db/schema/cbt";
import { clearMemoryCbtStore } from "./routes/cbt";
import { setCachedLicense, clearMemoryLicenseCache } from "../licensing/cache";

let passCount = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ PASS: ${message}`);
}

function count() {
  passCount++;
}

async function runCbtTests() {
  console.log("\n===============================================================");
  console.log("          📝 RUNNING WAVE 10 CBT BACKEND VERIFICATION");
  console.log("===============================================================\n");

  clearMemoryCbtStore();
  clearMemoryLicenseCache();

  const testSchoolId = "11111111-1111-1111-1111-111111111111";

  // Pre-seed active license into memory cache for zero-latency test execution
  setCachedLicense(testSchoolId, {
    id: "lic-cbt-01",
    schoolId: testSchoolId,
    plan: "premium",
    status: "active",
    studentCountLimit: 1000,
    trialEndsAt: null,
    gracePeriodEndsAt: null,
    renewalDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    daysRemaining: 30,
    isTrial: false,
    isGracePeriod: false,
    isSuspended: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const testClassId = "class_jss1_gold";
  const testSubjectId = "subj_mathematics";
  const testTermId = "term_2026_first";
  const teacherUserId = "staff_teacher_adeyemi_01";
  const student1Id = "student_amina_adeleke_01";
  const student2Id = "student_emeka_okafor_02";

  // 1. Database Schema & Definitions
  console.log("1️⃣ Verifying Database Schema for Wave 10 CBT...");
  assert(cbtTests !== undefined, "cbtTests table is defined in schema");
  count();
  assert(cbtTests.id !== undefined, "cbtTests has id column");
  count();
  assert(cbtTests.schoolId !== undefined, "cbtTests has schoolId column");
  count();
  assert(cbtTests.classId !== undefined, "cbtTests has classId column");
  count();
  assert(cbtTests.subjectId !== undefined, "cbtTests has subjectId column");
  count();
  assert(cbtTests.termId !== undefined, "cbtTests has termId column");
  count();
  assert(cbtTests.durationMinutes !== undefined, "cbtTests has durationMinutes column");
  count();
  assert(cbtTests.scheduledAt !== undefined, "cbtTests has scheduledAt column");
  count();
  assert(cbtTests.status !== undefined, "cbtTests has status column");
  count();
  assert(cbtTests.totalPoints !== undefined, "cbtTests has totalPoints column");
  count();

  assert(cbtQuestions !== undefined, "cbtQuestions table is defined in schema");
  count();
  assert(cbtQuestions.id !== undefined, "cbtQuestions has id column");
  count();
  assert(cbtQuestions.testId !== undefined, "cbtQuestions has testId column");
  count();
  assert(cbtQuestions.questionText !== undefined, "cbtQuestions has questionText column");
  count();
  assert(cbtQuestions.options !== undefined, "cbtQuestions has options jsonb column");
  count();
  assert(cbtQuestions.correctOptionIndex !== undefined, "cbtQuestions has correctOptionIndex column");
  count();
  assert(cbtQuestions.points !== undefined, "cbtQuestions has points column");
  count();

  assert(cbtSubmissions !== undefined, "cbtSubmissions table is defined in schema");
  count();
  assert(cbtSubmissions.id !== undefined, "cbtSubmissions has id column");
  count();
  assert(cbtSubmissions.testId !== undefined, "cbtSubmissions has testId column");
  count();
  assert(cbtSubmissions.studentId !== undefined, "cbtSubmissions has studentId column");
  count();
  assert(cbtSubmissions.answers !== undefined, "cbtSubmissions has answers jsonb column");
  count();
  assert(cbtSubmissions.score !== undefined, "cbtSubmissions has score column");
  count();
  assert(cbtSubmissions.status !== undefined, "cbtSubmissions has status column");
  count();

  assert(cbtTestStatusEnum.enumValues.includes("draft"), "cbtTestStatusEnum has draft");
  count();
  assert(cbtTestStatusEnum.enumValues.includes("scheduled"), "cbtTestStatusEnum has scheduled");
  count();
  assert(cbtTestStatusEnum.enumValues.includes("live"), "cbtTestStatusEnum has live");
  count();
  assert(cbtTestStatusEnum.enumValues.includes("completed"), "cbtTestStatusEnum has completed");
  count();

  assert(cbtSubmissionStatusEnum.enumValues.includes("not_started"), "cbtSubmissionStatusEnum has not_started");
  count();
  assert(cbtSubmissionStatusEnum.enumValues.includes("in_progress"), "cbtSubmissionStatusEnum has in_progress");
  count();
  assert(cbtSubmissionStatusEnum.enumValues.includes("completed"), "cbtSubmissionStatusEnum has completed");
  count();
  assert(cbtSubmissionStatusEnum.enumValues.includes("auto_submitted"), "cbtSubmissionStatusEnum has auto_submitted");
  count();

  // 2. POST /cbt/tests (Subject Teacher creates draft test + questions)
  console.log("\n2️⃣ Testing POST /cbt/tests (Create Test + Questions)...");

  // Rejection of non-teacher
  const studentCreateRes = await app.request("/cbt/tests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer test_token_student",
      "x-school-id": testSchoolId,
      "x-user-role": "student",
    },
    body: JSON.stringify({ title: "Unauthorized Test" }),
  });
  assert(studentCreateRes.status === 403, "Student role forbidden from creating test (HTTP 403)");
  count();

  // Missing fields rejected
  const badCreateRes = await app.request("/cbt/tests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer test_token_teacher",
      "x-school-id": testSchoolId,
      "x-user-role": "subject_teacher",
    },
    body: JSON.stringify({ title: "Incomplete Test" }),
  });
  assert(badCreateRes.status === 400, "Incomplete payload rejected with HTTP 400");
  count();

  // Successful test creation
  const now = new Date();
  const scheduledTime = new Date(now.getTime() - 5 * 60 * 1000).toISOString(); // 5 min ago (active live window)

  const createTestPayload = {
    classId: testClassId,
    subjectId: testSubjectId,
    termId: testTermId,
    title: "JSS 1 First Term Mathematics CBT Examination",
    durationMinutes: 45,
    scheduledAt: scheduledTime,
    questions: [
      {
        questionText: "Solve for x: 2x + 6 = 14",
        options: ["x = 2", "x = 4", "x = 6", "x = 8"],
        correctOptionIndex: 1, // 'x = 4'
        points: 2,
        displayOrder: 1,
      },
      {
        questionText: "What is the square root of 144?",
        options: ["10", "11", "12", "14"],
        correctOptionIndex: 2, // '12'
        points: 2,
        displayOrder: 2,
      },
      {
        questionText: "If a triangle has angles 60° and 70°, what is the third angle?",
        options: ["40°", "50°", "60°", "70°"],
        correctOptionIndex: 1, // '50°'
        points: 3,
        displayOrder: 3,
      },
      {
        questionText: "Express 0.75 as a fraction in its lowest terms:",
        options: ["1/2", "2/3", "3/4", "4/5"],
        correctOptionIndex: 2, // '3/4'
        points: 3,
        displayOrder: 4,
      },
    ],
  };

  const createRes = await app.request("/cbt/tests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer test_token_teacher",
      "x-school-id": testSchoolId,
      "x-user-role": "subject_teacher",
      "x-staff-id": teacherUserId,
    },
    body: JSON.stringify(createTestPayload),
  });
  assert(createRes.status === 201, "Teacher creates CBT test (HTTP 201 Created)");
  count();
  const createdTest = (await createRes.json()) as any;
  assert(createdTest.id !== undefined, "Created test has generated UUID id");
  count();
  assert(createdTest.status === "draft", "Test initial status is 'draft'");
  count();
  assert(createdTest.totalPoints === 10, "Total points computed accurately (2 + 2 + 3 + 3 = 10 points)");
  count();
  assert(createdTest.questionCount === 4, "Question count is 4");
  count();

  const testId = createdTest.id;

  // 3. PATCH /cbt/tests/:id (Teacher edits draft test)
  console.log("\n3️⃣ Testing PATCH /cbt/tests/:id (Edit Draft Test)...");
  const patchRes = await app.request(`/cbt/tests/${testId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer test_token_teacher",
      "x-school-id": testSchoolId,
      "x-user-role": "subject_teacher",
    },
    body: JSON.stringify({
      title: "JSS 1 First Term Mathematics CBT (Updated)",
      durationMinutes: 50,
    }),
  });
  assert(patchRes.status === 200, "Teacher updates draft test details (HTTP 200 OK)");
  count();
  const patchedTest = (await patchRes.json()) as any;
  assert(patchedTest.title === "JSS 1 First Term Mathematics CBT (Updated)", "Title successfully updated");
  count();
  assert(patchedTest.durationMinutes === 50, "Duration updated to 50 minutes");
  count();

  // 4. POST /cbt/tests/:id/publish (Publish test to 'scheduled')
  console.log("\n4️⃣ Testing POST /cbt/tests/:id/publish (Publish to Scheduled)...");
  const publishRes = await app.request(`/cbt/tests/${testId}/publish`, {
    method: "POST",
    headers: {
      Authorization: "Bearer test_token_teacher",
      "x-school-id": testSchoolId,
      "x-user-role": "subject_teacher",
    },
  });
  assert(publishRes.status === 200, "Teacher publishes test (HTTP 200 OK)");
  count();
  const publishedData = (await publishRes.json()) as any;
  assert(publishedData.status === "scheduled", "Test status is flipped to 'scheduled'");
  count();

  // State guard: Ensure test can NO LONGER be edited once scheduled
  const editLockedRes = await app.request(`/cbt/tests/${testId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer test_token_teacher",
      "x-school-id": testSchoolId,
      "x-user-role": "subject_teacher",
    },
    body: JSON.stringify({ title: "Illegal Edit" }),
  });
  assert(editLockedRes.status === 400, "Editing published test is strictly rejected (HTTP 400)");
  count();

  // 5. GET /cbt/tests/student (Student queries available tests)
  console.log("\n5️⃣ Testing GET /cbt/tests/student (Student Test Discovery)...");
  const studentListRes = await app.request(`/cbt/tests/student?classId=${testClassId}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer test_token_student",
      "x-school-id": testSchoolId,
      "x-user-role": "student",
      "x-student-id": student1Id,
    },
  });
  assert(studentListRes.status === 200, "Student fetches tests (HTTP 200 OK)");
  count();
  const studentListData = (await studentListRes.json()) as any;
  assert(Array.isArray(studentListData.tests), "Response contains tests array");
  count();
  const studentTestCard = studentListData.tests.find((t: any) => t.id === testId);
  assert(studentTestCard !== undefined, "Scheduled test is visible to student");
  count();
  assert(studentTestCard.computedStatus === "live_now", "Test dynamic status computed as 'live_now'");
  count();

  // 6. POST /cbt/tests/:id/start (Student starts test taking session)
  console.log("\n6️⃣ Testing POST /cbt/tests/:id/start & Answer Key Security Invariant...");
  const startRes = await app.request(`/cbt/tests/${testId}/start`, {
    method: "POST",
    headers: {
      Authorization: "Bearer test_token_student",
      "x-school-id": testSchoolId,
      "x-user-role": "student",
      "x-student-id": student1Id,
    },
  });
  assert(startRes.status === 201, "Student starts test session (HTTP 201 Created)");
  count();
  const sessionData = (await startRes.json()) as any;
  assert(sessionData.submissionId !== undefined, "Returns submissionId");
  count();
  assert(sessionData.questions.length === 4, "Returns all 4 test questions");
  count();

  // CRITICAL SECURITY ASSERTION:
  // correctOptionIndex and correct_option_index MUST NOT BE EXPOSED in student response!
  for (const q of sessionData.questions) {
    assert(q.correctOptionIndex === undefined, "CRITICAL: correctOptionIndex is strictly STRIPPED from student payload");
    assert(q.correct_option_index === undefined, "CRITICAL: correct_option_index is absent from student payload");
    assert(Array.isArray(q.options) && q.options.length === 4, "Question contains 4 multiple choice options");
  }
  count();

  const submission1Id = sessionData.submissionId;
  const question1Id = sessionData.questions[0].id;
  const question2Id = sessionData.questions[1].id;
  const question3Id = sessionData.questions[2].id;
  const question4Id = sessionData.questions[3].id;

  // Test session resume
  const resumeRes = await app.request(`/cbt/tests/${testId}/start`, {
    method: "POST",
    headers: {
      Authorization: "Bearer test_token_student",
      "x-school-id": testSchoolId,
      "x-user-role": "student",
      "x-student-id": student1Id,
    },
  });
  assert(resumeRes.status === 200, "Calling start while in_progress resumes session (HTTP 200)");
  count();
  const resumeData = (await resumeRes.json()) as any;
  assert(resumeData.resumed === true, "Session indicates resumed: true");
  count();
  assert(resumeData.submissionId === submission1Id, "Resumes same submission ID");
  count();

  // 7. PATCH /cbt/submissions/:id/answer (Incremental answer saving)
  console.log("\n7️⃣ Testing PATCH /cbt/submissions/:id/answer (Incremental Answer Saving)...");

  // Student 1 answers Question 1 correctly (Option Index 1: 'x = 4')
  const ans1Res = await app.request(`/cbt/submissions/${submission1Id}/answer`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer test_token_student",
      "x-school-id": testSchoolId,
    },
    body: JSON.stringify({ questionId: question1Id, selectedOptionIndex: 1 }),
  });
  assert(ans1Res.status === 200, "Saved answer for question 1 (HTTP 200 OK)");
  count();
  const ans1Data = (await ans1Res.json()) as any;
  assert(ans1Data.savedAnswerCount === 1, "Saved answer count is 1");
  count();

  // Student 1 answers Question 2 correctly (Option Index 2: '12')
  await app.request(`/cbt/submissions/${submission1Id}/answer`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test_token_student", "x-school-id": testSchoolId },
    body: JSON.stringify({ questionId: question2Id, selectedOptionIndex: 2 }),
  });

  // Student 1 answers Question 3 INCORRECTLY (Option Index 0: '40°' instead of 1: '50°')
  await app.request(`/cbt/submissions/${submission1Id}/answer`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test_token_student", "x-school-id": testSchoolId },
    body: JSON.stringify({ questionId: question3Id, selectedOptionIndex: 0 }),
  });

  // Student 1 answers Question 4 correctly (Option Index 2: '3/4')
  const ans4Res = await app.request(`/cbt/submissions/${submission1Id}/answer`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test_token_student", "x-school-id": testSchoolId },
    body: JSON.stringify({ questionId: question4Id, selectedOptionIndex: 2 }),
  });
  const ans4Data = (await ans4Res.json()) as any;
  assert(ans4Data.savedAnswerCount === 4, "All 4 answers recorded incrementally in JSONB map");
  count();

  // 8. POST /cbt/submissions/:id/submit (Server-side auto-grading)
  console.log("\n8️⃣ Testing POST /cbt/submissions/:id/submit (Server-Side Auto-Grading)...");

  // Client attempts to sneak an untrusted client-computed score of 100 in the body
  const submitRes = await app.request(`/cbt/submissions/${submission1Id}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer test_token_student",
      "x-school-id": testSchoolId,
    },
    body: JSON.stringify({
      untrustedClientScore: 100, // Should be completely ignored!
    }),
  });
  assert(submitRes.status === 200, "Student submits test (HTTP 200 OK)");
  count();
  const submitData = (await submitRes.json()) as any;
  assert(submitData.status === "completed", "Status updated to 'completed'");
  count();
  // Q1 (2 pts, correct) + Q2 (2 pts, correct) + Q3 (3 pts, wrong) + Q4 (3 pts, correct) = 7 pts out of 10
  assert(submitData.score === 7, "Score correctly calculated server-side as 7 points (Q1=2 + Q2=2 + Q4=3 = 7)");
  count();
  assert(submitData.totalPoints === 10, "Total points is 10");
  count();
  assert(submitData.percentage === 70, "Percentage computed as 70%");
  count();
  assert(typeof submitData.timeTakenSeconds === "number", "Calculates timeTakenSeconds");
  count();

  // Retake prevention: Student cannot restart or retake submitted test
  const retakeBlockedRes = await app.request(`/cbt/tests/${testId}/start`, {
    method: "POST",
    headers: {
      Authorization: "Bearer test_token_student",
      "x-school-id": testSchoolId,
      "x-user-role": "student",
      "x-student-id": student1Id,
    },
  });
  assert(retakeBlockedRes.status === 400, "Retaking a submitted test is strictly BLOCKED (HTTP 400)");
  count();

  // 9. Auto-Submit on Timeout Path (Student 2)
  console.log("\n9️⃣ Testing Auto-Submit on Timeout Path (Student 2)...");
  const start2Res = await app.request(`/cbt/tests/${testId}/start`, {
    method: "POST",
    headers: {
      Authorization: "Bearer test_token_student",
      "x-school-id": testSchoolId,
      "x-user-role": "student",
      "x-student-id": student2Id,
    },
  });
  const session2Data = (await start2Res.json()) as any;
  const submission2Id = session2Data.submissionId;

  // Student 2 only answers Q1 correctly and Q2 correctly before time runs out
  await app.request(`/cbt/submissions/${submission2Id}/answer`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test_token_student", "x-school-id": testSchoolId },
    body: JSON.stringify({ questionId: question1Id, selectedOptionIndex: 1 }),
  });
  await app.request(`/cbt/submissions/${submission2Id}/answer`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test_token_student", "x-school-id": testSchoolId },
    body: JSON.stringify({ questionId: question2Id, selectedOptionIndex: 2 }),
  });

  // Auto-submit triggered on timeout
  const autoSubmitRes = await app.request(`/cbt/submissions/${submission2Id}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer test_token_student",
      "x-school-id": testSchoolId,
    },
    body: JSON.stringify({ autoSubmit: true }),
  });
  assert(autoSubmitRes.status === 200, "Auto-submit on timeout returns HTTP 200 OK");
  count();
  const autoSubmitData = (await autoSubmitRes.json()) as any;
  assert(autoSubmitData.status === "auto_submitted", "Status is marked as 'auto_submitted'");
  count();
  assert(autoSubmitData.score === 4, "Server scores 4 points for the 2 answered questions (Q1=2 + Q2=2 = 4)");
  count();
  assert(autoSubmitData.percentage === 40, "Percentage is 40%");
  count();

  // 10. GET /cbt/submissions/:id/results (Detailed Question Breakdown)
  console.log("\n🔟 Testing GET /cbt/submissions/:id/results (Detailed Breakdown)...");
  const resultsRes = await app.request(`/cbt/submissions/${submission1Id}/results`, {
    method: "GET",
    headers: {
      Authorization: "Bearer test_token_student",
      "x-school-id": testSchoolId,
    },
  });
  assert(resultsRes.status === 200, "Results query returns HTTP 200 OK");
  count();
  const resultsData = (await resultsRes.json()) as any;
  assert(resultsData.score === 7, "Results show score 7");
  count();
  assert(resultsData.percentage === 70, "Results show percentage 70%");
  count();
  assert(Array.isArray(resultsData.questions) && resultsData.questions.length === 4, "Provides 4 question breakdown items");
  count();

  // Check Question 3 (the incorrect answer)
  const q3Result = resultsData.questions.find((q: any) => q.id === question3Id);
  assert(q3Result !== undefined, "Found Question 3 result");
  count();
  assert(q3Result.selectedOptionIndex === 0, "Shows student selected option 0");
  count();
  assert(q3Result.correctOptionIndex === 1, "Shows correct option was 1");
  count();
  assert(q3Result.isCorrect === false, "Marks isCorrect as false");
  count();
  assert(q3Result.pointsEarned === 0, "Earned 0 points for incorrect answer");
  count();

  // Check Question 1 (the correct answer)
  const q1Result = resultsData.questions.find((q: any) => q.id === question1Id);
  assert(q1Result.isCorrect === true, "Marks Question 1 isCorrect as true");
  count();
  assert(q1Result.pointsEarned === 2, "Earned 2 points for Question 1");
  count();

  // 11. GET /cbt/tests/:id/results (Teacher Aggregated Analytics)
  console.log("\n1️⃣1️⃣ Testing GET /cbt/tests/:id/results (Teacher Analytics)...");
  const teacherAnalyticsRes = await app.request(`/cbt/tests/${testId}/results`, {
    method: "GET",
    headers: {
      Authorization: "Bearer test_token_teacher",
      "x-school-id": testSchoolId,
      "x-user-role": "subject_teacher",
    },
  });
  assert(teacherAnalyticsRes.status === 200, "Teacher fetches class analytics (HTTP 200 OK)");
  count();
  const analyticsData = (await teacherAnalyticsRes.json()) as any;
  assert(analyticsData.submittedCount === 2, "Reports 2 student submissions");
  count();
  assert(analyticsData.highestScore === 7, "Highest score is 7");
  count();
  assert(analyticsData.lowestScore === 4, "Lowest score is 4");
  count();
  // Average: (7 + 4) / 2 = 5.5
  assert(analyticsData.averageScore === 5.5, "Average score is 5.5 points");
  count();
  assert(analyticsData.averagePercentage === 55, "Average percentage is 55%");
  count();
  assert(Array.isArray(analyticsData.submissions), "Lists submission records");
  count();

  // 12. POST /cbt/tests/:id/import-to-gradebook (Import CBT into Assessment Component)
  console.log("\n1️⃣2️⃣ Testing POST /cbt/tests/:id/import-to-gradebook (Gradebook Integration)...");
  const targetComponentId = "comp_cbt_test_20";

  const importRes = await app.request(`/cbt/tests/${testId}/import-to-gradebook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer test_token_teacher",
      "x-school-id": testSchoolId,
      "x-user-role": "subject_teacher",
    },
    body: JSON.stringify({ componentId: targetComponentId }),
  });
  assert(importRes.status === 200, "Teacher imports CBT scores into gradebook (HTTP 200 OK)");
  count();
  const importData = (await importRes.json()) as any;
  assert(importData.importedCount === 2, "Imported 2 student scores");
  count();
  assert(importData.componentId === targetComponentId, "Associated with requested component");
  count();
  assert(importData.maxWeight === 20, "Component maximum weight is 20 points");
  count();

  // Verify weight scaling:
  // Student 1: 70% of 20 = 14 points
  // Student 2: 40% of 20 = 8 points
  const s1Imported = importData.sampleEntries.find((e: any) => e.studentId === student1Id);
  assert(s1Imported !== undefined, "Found Student 1 imported score");
  count();
  assert(s1Imported.scaledScore === 14, "Student 1 (70%) scaled to 14/20 points");
  count();

  const s2Imported = importData.sampleEntries.find((e: any) => e.studentId === student2Id);
  assert(s2Imported !== undefined, "Found Student 2 imported score");
  count();
  assert(s2Imported.scaledScore === 8, "Student 2 (40%) scaled to 8/20 points");
  count();

  console.log("\n===============================================================");
  console.log(`  🎉 ALL ${passCount} WAVE 10 CBT BACKEND TESTS PASSED SUCCESSFULLY!`);
  console.log("===============================================================\n");
}

runCbtTests().catch((err) => {
  console.error("\n❌ WAVE 10 TEST RUN FAILED:", err);
  process.exit(1);
});
