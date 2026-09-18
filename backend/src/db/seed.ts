import { db, client } from "./index";
import {
  schools,
  schoolLicenses,
  sessionsTerms,
  assessmentComponents,
  classes,
  subjects,
  staff,
  guardians,
  students,
  guardianStudents,
  assignments,
  feeStructures,
  invoices,
  payments,
  announcements,
  webhookLog,
} from "./schema/index";

async function seed() {
  console.log("🌱 Seeding ScholeOS demo database with realistic test dataset...");

  try {
    // 1. Create Demo School
    const [demoSchool] = await db
      .insert(schools)
      .values({
        clerkOrgId: "org_demo_apex_college_101",
        name: "Apex International College",
        shortName: "Apex College",
        address: "15 Victoria Island Crescent, Lagos, Nigeria",
        brandColor: "#4338CA",
        logoUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80",
        subdomain: "apex-college",
      })
      .returning();

    console.log(`✓ Created School: ${demoSchool.name} (${demoSchool.id})`);

    // 2. Create School License (Premium Active)
    const thirtyDaysAhead = new Date();
    thirtyDaysAhead.setDate(thirtyDaysAhead.getDate() + 30);
    const oneYearAhead = new Date();
    oneYearAhead.setFullYear(oneYearAhead.getFullYear() + 1);

    await db.insert(schoolLicenses).values({
      schoolId: demoSchool.id,
      plan: "premium",
      status: "active",
      trialEndsAt: thirtyDaysAhead,
      renewalDate: oneYearAhead,
      studentCountLimit: 500,
    });
    console.log("✓ Created School License (Premium - Active)");

    // 3. Create Sessions & Terms
    const [term1] = await db
      .insert(sessionsTerms)
      .values([
        {
          schoolId: demoSchool.id,
          name: "2025/2026 - First Term",
          startDate: "2025-09-08",
          endDate: "2025-12-19",
          isCurrent: true,
        },
        {
          schoolId: demoSchool.id,
          name: "2025/2026 - Second Term",
          startDate: "2026-01-08",
          endDate: "2026-04-10",
          isCurrent: false,
        },
        {
          schoolId: demoSchool.id,
          name: "2025/2026 - Third Term",
          startDate: "2026-04-27",
          endDate: "2026-07-24",
          isCurrent: false,
        },
      ])
      .returning();
    console.log(`✓ Created Academic Sessions & Terms (Current: ${term1.name})`);

    // 4. Create Assessment Components (Session-wide default scheme = 100%)
    await db.insert(assessmentComponents).values([
      {
        schoolId: demoSchool.id,
        termId: null, // session-wide default
        componentName: "1st Continuous Assessment",
        weight: 20,
        displayOrder: 1,
      },
      {
        schoolId: demoSchool.id,
        termId: null,
        componentName: "Mid-Term Test",
        weight: 20,
        displayOrder: 2,
      },
      {
        schoolId: demoSchool.id,
        termId: null,
        componentName: "Project & Assignment",
        weight: 10,
        displayOrder: 3,
      },
      {
        schoolId: demoSchool.id,
        termId: null,
        componentName: "Terminal Examination",
        weight: 50,
        displayOrder: 4,
      },
    ]);
    console.log("✓ Created 4 Assessment Components totaling 100% weight");

    // 5. Create Classes
    const [classJss1A, classJss2A, classSs1Sci] = await db
      .insert(classes)
      .values([
        { schoolId: demoSchool.id, name: "JSS 1A" },
        { schoolId: demoSchool.id, name: "JSS 2A" },
        { schoolId: demoSchool.id, name: "SS 1 Science" },
        { schoolId: demoSchool.id, name: "SS 2 Commercial" },
      ])
      .returning();
    console.log("✓ Created Classes (JSS 1A, JSS 2A, SS 1 Science, SS 2 Commercial)");

    // 6. Create Subjects
    const [mathSubject, englishSubject, scienceSubject] = await db
      .insert(subjects)
      .values([
        { schoolId: demoSchool.id, name: "Mathematics" },
        { schoolId: demoSchool.id, name: "English Language" },
        { schoolId: demoSchool.id, name: "Basic Science" },
        { schoolId: demoSchool.id, name: "Physics" },
        { schoolId: demoSchool.id, name: "Chemistry" },
        { schoolId: demoSchool.id, name: "Economics" },
      ])
      .returning();
    console.log("✓ Created 6 Core Subjects");

    // 7. Create Staff (including dual-role teacher)
    const [adminStaff, dualRoleTeacher, subjectTeacher] = await db
      .insert(staff)
      .values([
        {
          schoolId: demoSchool.id,
          clerkUserId: "user_clerk_admin_01",
          fullName: "Dr. Funmilayo Adeleke",
          email: "principal@apexcollege.edu.ng",
          status: "active",
          roles: ["admin"],
        },
        {
          schoolId: demoSchool.id,
          clerkUserId: "user_clerk_teacher_01",
          fullName: "Mr. Babatunde Adeyemi",
          email: "b.adeyemi@apexcollege.edu.ng",
          status: "active",
          roles: ["class_teacher", "subject_teacher"], // Dual role!
        },
        {
          schoolId: demoSchool.id,
          clerkUserId: "user_clerk_teacher_02",
          fullName: "Mrs. Chioma Okonkwo",
          email: "c.okonkwo@apexcollege.edu.ng",
          status: "active",
          roles: ["subject_teacher"],
        },
      ])
      .returning();
    console.log("✓ Created Staff (Admin, Dual-Role Teacher, Subject Teacher)");

    // 8. Create Assignments (Permission Backbone)
    await db.insert(assignments).values([
      // Mr. Adeyemi is Class Teacher for JSS 1A
      {
        schoolId: demoSchool.id,
        staffId: dualRoleTeacher.id,
        classId: classJss1A.id,
        subjectId: null, // class teacher assignment has no specific subject
        termId: term1.id,
        role: "class_teacher",
        status: "active",
      },
      // Mr. Adeyemi also teaches Mathematics in JSS 1A
      {
        schoolId: demoSchool.id,
        staffId: dualRoleTeacher.id,
        classId: classJss1A.id,
        subjectId: mathSubject.id,
        termId: term1.id,
        role: "subject_teacher",
        status: "active",
      },
      // Mrs. Okonkwo teaches English Language in JSS 1A
      {
        schoolId: demoSchool.id,
        staffId: subjectTeacher.id,
        classId: classJss1A.id,
        subjectId: englishSubject.id,
        termId: term1.id,
        role: "subject_teacher",
        status: "active",
      },
    ]);
    console.log("✓ Created Class and Subject Teacher assignments");

    // 9. Create Guardians & Students (including Sibling Case)
    const [guardianOkafor, guardianAbubakar] = await db
      .insert(guardians)
      .values([
        {
          schoolId: demoSchool.id,
          clerkUserId: "user_clerk_guardian_01",
          fullName: "Chief Emeka Okafor",
          phone: "+2348031234567",
          email: "emeka.okafor@example.com",
        },
        {
          schoolId: demoSchool.id,
          clerkUserId: "user_clerk_guardian_02",
          fullName: "Dr. (Mrs.) Zainab Abubakar",
          phone: "+2348029876543",
          email: "zainab.abubakar@example.com",
        },
      ])
      .returning();

    // Sibling student 1 & 2 under Guardian Okafor
    const [student1, student2, student3, student4] = await db
      .insert(students)
      .values([
        {
          schoolId: demoSchool.id,
          classId: classJss1A.id,
          guardianId: guardianOkafor.id,
          fullName: "Somtochukwu Okafor",
          admissionNumber: "APX/2025/001",
          dateOfBirth: "2013-05-14",
        },
        {
          schoolId: demoSchool.id,
          classId: classJss2A.id,
          guardianId: guardianOkafor.id,
          fullName: "Kamsiyochukwu Okafor",
          admissionNumber: "APX/2025/002",
          dateOfBirth: "2011-11-20",
        },
        {
          schoolId: demoSchool.id,
          classId: classJss1A.id,
          guardianId: guardianAbubakar.id,
          fullName: "Farouk Abubakar",
          admissionNumber: "APX/2025/003",
          dateOfBirth: "2013-02-09",
        },
        {
          schoolId: demoSchool.id,
          classId: classJss1A.id,
          guardianId: null, // Unassigned guardian initially
          fullName: "David Adeleke",
          admissionNumber: "APX/2025/004",
          dateOfBirth: "2013-08-30",
        },
      ])
      .returning();

    // Link sibling relationship in join table
    await db.insert(guardianStudents).values([
      { guardianId: guardianOkafor.id, studentId: student1.id },
      { guardianId: guardianOkafor.id, studentId: student2.id },
      { guardianId: guardianAbubakar.id, studentId: student3.id },
    ]);
    console.log("✓ Created Guardians & Students with sibling relationships");

    // 10. Create Fee Structures
    const [tuitionFee, scienceFee] = await db
      .insert(feeStructures)
      .values([
        {
          schoolId: demoSchool.id,
          termId: term1.id,
          classId: null, // applies to all classes
          feeType: "First Term Tuition Fee",
          amount: "85000.00",
          dueDate: "2025-10-15",
          isRecurring: true,
        },
        {
          schoolId: demoSchool.id,
          termId: term1.id,
          classId: classSs1Sci.id, // class specific
          feeType: "Science Laboratory & ICT Levy",
          amount: "15000.00",
          dueDate: "2025-10-15",
          isRecurring: true,
        },
      ])
      .returning();
    console.log("✓ Created Fee Structures (Tuition ₦85,000 + Science Levy ₦15,000)");

    // 11. Create Invoices and Payments
    // Student 1: Fully Paid via Paystack
    const [invoice1] = await db
      .insert(invoices)
      .values({
        schoolId: demoSchool.id,
        studentId: student1.id,
        termId: term1.id,
        feeStructureId: tuitionFee.id,
        totalAmount: "85000.00",
        amountPaid: "85000.00",
        status: "paid",
      })
      .returning();

    await db.insert(payments).values({
      schoolId: demoSchool.id,
      invoiceId: invoice1.id,
      amount: "85000.00",
      channel: "paystack",
      providerRef: "pstk_trx_94829104",
      verificationStatus: "approved",
    });

    // Student 3: Partially Paid via Flutterwave
    const [invoice2] = await db
      .insert(invoices)
      .values({
        schoolId: demoSchool.id,
        studentId: student3.id,
        termId: term1.id,
        feeStructureId: tuitionFee.id,
        totalAmount: "85000.00",
        amountPaid: "40000.00",
        status: "partially_paid",
      })
      .returning();

    await db.insert(payments).values({
      schoolId: demoSchool.id,
      invoiceId: invoice2.id,
      amount: "40000.00",
      channel: "flutterwave",
      providerRef: "flw_trx_5739281",
      verificationStatus: "approved",
    });

    // Student 4: Pending Bank Transfer Verification
    const [invoice3] = await db
      .insert(invoices)
      .values({
        schoolId: demoSchool.id,
        studentId: student4.id,
        termId: term1.id,
        feeStructureId: tuitionFee.id,
        totalAmount: "85000.00",
        amountPaid: "85000.00",
        status: "pending_verification",
      })
      .returning();

    await db.insert(payments).values({
      schoolId: demoSchool.id,
      invoiceId: invoice3.id,
      amount: "85000.00",
      channel: "bank_transfer_proof",
      proofUrl: "https://res.cloudinary.com/scholeos/proofs/sample_transfer_receipt.jpg",
      verificationStatus: "pending",
    });
    console.log("✓ Created Invoices and Payments (Paid, Partially Paid, and Pending Verification)");

    // 12. Create Announcements
    await db.insert(announcements).values({
      schoolId: demoSchool.id,
      title: "Welcome to the 2025/2026 Academic Session",
      message: "We warmly welcome all returning students, new admissions, and esteemed parents to the new academic year!",
      audience: { scope: "everyone" },
      channels: ["in_app", "whatsapp"],
      status: "sent",
      sentAt: new Date(),
      createdByStaffId: adminStaff.id,
    });
    console.log("✓ Created Broadcast Announcement");

    // 13. Webhook Idempotency Log
    await db.insert(webhookLog).values({
      provider: "clerk",
      eventId: "evt_demo_org_created_01",
      payload: {
        type: "organization.created",
        id: "org_demo_apex_college_101",
        name: "Apex International College",
      },
    });
    console.log("✓ Initialized Webhook Idempotency Log");

    console.log("\n🎉 Demo database seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
