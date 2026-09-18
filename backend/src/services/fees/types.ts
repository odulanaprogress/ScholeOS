/**
 * Fees Service Types (Wave 5)
 */

export interface FeesAuthContext {
  userId: string;
  orgId?: string;
  orgRole?: string;
  email?: string;
}

export interface CreateFeeStructureDTO {
  schoolId?: string;
  feeType: string;
  amount: number | string;
  termId: string;
  classId?: string | null;
  dueDate: string; // YYYY-MM-DD
  isRecurring?: boolean;
}

export interface GenerateInvoicesDTO {
  schoolId?: string;
  termId: string;
}

export interface SubmitPaymentProofDTO {
  invoiceId: string;
  amount: number | string;
  proofImage: string; // base64 string or data URL
}

export interface ApprovePaymentDTO {
  paymentId: string;
}

export interface RejectPaymentDTO {
  reason: string;
}

export interface PaystackWebhookPayload {
  event: string;
  data: {
    id: number | string;
    reference: string;
    amount: number; // in kobo
    status: string;
    paid_at?: string;
    channel?: string;
    metadata?: {
      invoiceId?: string;
      invoice_id?: string;
      schoolId?: string;
      school_id?: string;
      studentId?: string;
    };
    customer?: {
      email?: string;
    };
  };
}

export interface FlutterwaveWebhookPayload {
  event: string;
  data: {
    id: number | string;
    tx_ref: string;
    amount: number; // in naira
    status: string;
    created_at?: string;
    payment_type?: string;
    meta?: {
      invoiceId?: string;
      invoice_id?: string;
      schoolId?: string;
      studentId?: string;
    };
  };
}

export interface ArrearsSummary {
  totalOwed: number;
  countOfStudentsWithBalance: number;
  totalInvoices: number;
  totalCollected: number;
}

export interface StudentArrearsItem {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  totalInvoiced: number;
  totalPaid: number;
  totalOwed: number;
  lastPaymentDate: string | null;
  invoices: {
    invoiceId: string;
    feeType: string;
    totalAmount: number;
    amountPaid: number;
    amountOwed: number;
    status: string;
  }[];
}
