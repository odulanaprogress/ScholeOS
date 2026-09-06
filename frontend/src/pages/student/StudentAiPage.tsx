import React, { useState } from 'react'
import { ChatWindow, type ChatMessage } from '@/components/ui/ChatWindow'
import { BookOpen, GraduationCap } from 'lucide-react'

export interface StudentAiPageProps {
  studentName?: string
  classNameTitle?: string
}

const STUDENT_SUBJECTS = [
  'Mathematics',
  'English Language',
  'Basic Science',
  'Social Studies',
  'Agricultural Science',
  'Business Studies',
  'Civic Education',
  'French Language',
]

const STUDENT_SUGGESTED_PROMPTS = [
  'Explain this topic in simple terms',
  'Help me understand my homework question',
  'Give me 3 practice questions on this topic',
  'Check my answer to a problem',
]

export const StudentAiPage: React.FC<StudentAiPageProps> = ({
  studentName = 'Fatima Bello',
  classNameTitle = 'JSS 2A',
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState<boolean>(false)

  // Switching subject clears the conversation and resets context
  const handleSubjectChange = (newSubject: string) => {
    setSelectedSubject(newSubject)
    setMessages([])
  }

  const getStudentAiResponse = (prompt: string, subject: string): string => {
    const lower = prompt.toLowerCase()

    if (lower.includes('explain this topic') || lower.includes('simple terms') || lower.includes('explain')) {
      if (subject === 'Mathematics') {
        return `Hello ${studentName.split(' ')[0]}! Let's break down **Algebraic Expansion & Factorisation** in simple terms:

Imagine you have a rectangle with width **x** and length **(x + 5)**.
The total area is:
• **x × (x + 5) = x² + 5x**

Factorisation is simply running this process in reverse! If someone gives you **x² + 5x**, you look for the common term (**x**) that divides both parts:
• Take out **x** → **x(x + 5)**

Does this concept make sense, or would you like to see a numerical example with numbers like (x + 2)(x + 3)?`
      }

      if (subject === 'English Language') {
        return `Let's break down **Direct vs. Reported Speech** in simple terms!

• **Direct Speech:** Exact words spoken inside quotation marks:
  *"I am going to the library," Fatima said.*

• **Reported (Indirect) Speech:** Telling someone else what was said later on:
  *Fatima said that she was going to the library.*

Notice two key changes:
1. The pronoun changes from **"I"** to **"she"**.
2. The present tense **"am going"** shifts one step into the past: **"was going"**.

Would you like to try converting a sentence yourself?`
      }

      return `Here is a simple explanation for **${subject}**:

The most effective way to master any new topic in ${subject} is to connect it to everyday life. First identify the primary definition, then observe its practical cause and effect.

Which specific chapter or term topic from your ${subject} syllabus are you currently revising?`
    }

    if (lower.includes('homework') || lower.includes('help me understand')) {
      return `I'm happy to guide you through your **${subject}** homework!

Remember our rule: **I won't do the problem for you**, but I will help you unlock how to solve it step-by-step.

1. What is the exact question asking you to find?
2. What values or information were given in the question?
3. What formula or concept do you think applies here?

Type out the question, and let's work through the first step together!`
    }

    if (lower.includes('practice questions') || lower.includes('3 practice')) {
      if (subject === 'Mathematics') {
        return `Here are **3 practice questions** on JSS 2 **${subject}** to test your skills:

**Question 1:** Expand the expression: **3(2x - 4)**
*Hint: Multiply 3 by each term inside the bracket.*

**Question 2:** Factorise completely: **8y + 12**
*Hint: What is the highest common factor of 8 and 12?*

**Question 3:** Solve for **x**: **2x + 7 = 19**
*Hint: Subtract 7 from both sides first, then divide by 2.*

Try solving them in your exercise book and type your answers here for me to check!`
      }

      return `Here are **3 practice questions** for **${subject}**:

1. Define the primary concept of this week's lesson in your own words.
2. List two real-world examples where this principle is applied in Nigeria.
3. What is the main difference between the two primary classifications discussed in class?

Write down your thoughts, and reply with your answers so we can review them!`
    }

    if (lower.includes('check my answer') || lower.includes('answer')) {
      return `Let's check your work in **${subject}**!

Please share:
1. The original question or equation.
2. Your step-by-step working.
3. The final answer you calculated.

I'll check your method and let you know if you're on the right track or where you can tighten your steps!`
    }

    // Default tutoring response
    return `That's a great question regarding **${subject}**!

In **${classNameTitle}**, mastering this foundation prepares you directly for your end-of-term exams and upcoming BECE papers.

To help you best: Are you working through a specific textbook exercise, or reviewing a class handout from your teacher? Tell me a bit more and we'll tackle it together!`
  }

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    setTimeout(() => {
      const responseText = getStudentAiResponse(text, selectedSubject)
      const assistantMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, assistantMsg])
      setIsTyping(false)
    }, 800)
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[600px]">
      {/* 1. Subject Selector Bar */}
      <div className="bg-cream-surface rounded-2xl border border-cream-border/80 p-3.5 shadow-2xs shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/60 text-indigo-brand flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-charcoal-dark">
              Study Subject Context
            </h3>
            <p className="text-[11px] text-charcoal-muted">
              Select what subject you want help with today ({classNameTitle})
            </p>
          </div>
        </div>

        {/* Subject Select Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-charcoal-muted shrink-0 hidden sm:inline">
            Active Subject:
          </span>
          <div className="relative min-w-[200px]">
            <BookOpen className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full bg-cream-base/60 text-charcoal-dark text-xs sm:text-sm rounded-xl py-2 pl-9 pr-3 border border-cream-border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-indigo-brand focus:ring-indigo-brand/20 font-bold"
            >
              {STUDENT_SUBJECTS.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Full-Height ChatWindow */}
      <div className="flex-1 min-h-0">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          suggestedPrompts={STUDENT_SUGGESTED_PROMPTS}
          onSelectSuggestedPrompt={handleSendMessage}
          assistantName={`AI Tutor (${selectedSubject})`}
          assistantRole="Personal Academic Study Guide"
          assistantAvatarIcon={GraduationCap}
          emptyStateTitle={`Ready to study ${selectedSubject}?`}
          emptyStateSubtitle={`Ask me to explain any topic, help you break down difficult questions, or give you practice exercises for ${selectedSubject}.`}
          placeholder={`Ask anything about ${selectedSubject}...`}
          disclaimerText="This tutor helps you learn — it won't do your homework for you."
          accentColor="#4338CA"
          className="h-full"
        />
      </div>
    </div>
  )
}
