import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { Textarea } from '@/components/ui/Textarea'
import { ChatWindow, type ChatMessage } from '@/components/ui/ChatWindow'
import {
  Sparkles,
  MessageSquare,
  FileText,
  RefreshCw,
  CheckCircle2,
  BookmarkCheck,
  User,
  BookOpen,
  GraduationCap,
  X,
} from 'lucide-react'
import {
  ADMIN_SUGGESTED_PROMPTS,
  REPORT_CARD_STUDENTS,
  REPORT_CARD_SUBJECTS,
  REPORT_CARD_TONES,
  getAdminAiResponse,
  generateReportCardComment,
} from './adminAiData'

export const AdminAiPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('chat')

  // --- CHAT TAB STATE ---
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState<boolean>(false)

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    // Simulate AI thinking and response delay
    setTimeout(() => {
      const responseText = getAdminAiResponse(text)
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, assistantMsg])
      setIsTyping(false)
    }, 850)
  }

  // --- REPORT CARD COMMENTS STATE ---
  const [selectedStudentId, setSelectedStudentId] = useState<string>('ada')
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics')
  const [selectedTone, setSelectedTone] = useState<string>(REPORT_CARD_TONES[0])
  const [generatedComment, setGeneratedComment] = useState<string>(
    'Ada has shown consistent improvement in Mathematics this term, particularly in analytical problem-solving speed and assignment diligence. Class attendance and practical participation remain excellent.'
  )
  const [iteration, setIteration] = useState<number>(0)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [insertSuccessToast, setInsertSuccessToast] = useState<string | null>(null)

  const activeStudent = REPORT_CARD_STUDENTS.find((s) => s.id === selectedStudentId) || REPORT_CARD_STUDENTS[0]

  const handleGenerateComment = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const nextIter = iteration + 1
      setIteration(nextIter)
      const comment = generateReportCardComment(
        activeStudent.name,
        selectedSubject,
        selectedTone,
        nextIter
      )
      setGeneratedComment(comment)
      setIsGenerating(false)
    }, 400)
  }

  const handleInsertComment = () => {
    setInsertSuccessToast(
      `Comment successfully inserted into ${activeStudent.name}'s terminal report card for ${selectedSubject}!`
    )
    setTimeout(() => {
      setInsertSuccessToast(null)
    }, 4500)
  }

  const tabs: TabItem[] = [
    {
      id: 'chat',
      label: 'Chat Assistant',
      icon: MessageSquare,
    },
    {
      id: 'comments',
      label: 'Report Card Comments',
      icon: FileText,
    },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[640px]">
      {/* 1. Header Navigation Tabs */}
      <div className="bg-cream-surface rounded-2xl border border-cream-border/80 p-2 shadow-2xs shrink-0 flex items-center justify-between">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId)}
          variant="pills"
          accentColor="#4338CA"
        />

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200/60 text-indigo-brand text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold-brand" />
          <span>Crown Academy AI Copilot</span>
        </div>
      </div>

      {/* 2. TAB A: CHAT ASSISTANT */}
      {activeTab === 'chat' && (
        <div className="flex-1 min-h-0">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
            suggestedPrompts={ADMIN_SUGGESTED_PROMPTS}
            onSelectSuggestedPrompt={handleSendMessage}
            assistantName="ScholeOS Admin Copilot"
            assistantRole="School Intelligence & Analytics Assistant"
            assistantAvatarIcon={Sparkles}
            emptyStateTitle="Ask ScholeOS Anything About Your School"
            emptyStateSubtitle="Inquire about fee arrears, analyze term broadsheet averages, check attendance summaries, or draft administrative announcements."
            placeholder="Ask about fees, student results, attendance, or broadsheet metrics..."
            accentColor="#4338CA"
            className="h-full"
          />
        </div>
      )}

      {/* 3. TAB B: REPORT CARD COMMENTS */}
      {activeTab === 'comments' && (
        <div className="flex-1 overflow-y-auto space-y-6 animate-fadeIn">
          {/* Top Configuration Form Card */}
          <Card className="p-6 bg-cream-surface border border-cream-border/80 shadow-xs space-y-5">
            <div>
              <h3 className="text-base sm:text-lg font-display font-bold text-charcoal-dark flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-brand" />
                Automated Qualitative Comment Generator
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
                Generate personalized, WAEC-compliant term remarks based on student trajectory and subject competency.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Class Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display">
                  Class Arm
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={activeStudent.class}
                    onChange={() => {}}
                    className="w-full bg-cream-base/50 text-charcoal-dark text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-3 border border-cream-border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-indigo-brand focus:ring-indigo-brand/20 font-medium"
                  >
                    <option value="JSS 2A">JSS 2A (Form Master: Mrs. Bola Adeyemi)</option>
                    <option value="JSS 2B">JSS 2B</option>
                    <option value="SSS 1 Science">SSS 1 Science</option>
                    <option value="SSS 2">SSS 2</option>
                  </select>
                </div>
              </div>

              {/* Student Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display">
                  Student Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full bg-cream-base/50 text-charcoal-dark text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-3 border border-cream-border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-indigo-brand focus:ring-indigo-brand/20 font-semibold"
                  >
                    {REPORT_CARD_STUDENTS.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.class})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display">
                  Subject / Scope
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full bg-cream-base/50 text-charcoal-dark text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-3 border border-cream-border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-indigo-brand focus:ring-indigo-brand/20 font-medium"
                  >
                    {REPORT_CARD_SUBJECTS.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Performance Tone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display">
                  Tone & Trajectory
                </label>
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  className="w-full bg-cream-base/50 text-charcoal-dark text-xs sm:text-sm rounded-xl py-2.5 px-3 border border-cream-border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-indigo-brand focus:ring-indigo-brand/20 font-medium"
                >
                  {REPORT_CARD_TONES.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerateComment}
                isLoading={isGenerating}
                className="shadow-sm font-semibold"
              >
                <Sparkles className="w-4 h-4 mr-1.5 text-gold-brand" />
                Generate Comment
              </Button>
            </div>
          </Card>

          {/* Generated Result Card */}
          <Card className="p-6 bg-cream-surface border border-cream-border/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-cream-border/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  AI
                </div>
                <div>
                  <h4 className="text-sm font-display font-bold text-charcoal-dark">
                    Generated Remark for {activeStudent.name}
                  </h4>
                  <p className="text-[11px] text-charcoal-muted">
                    Scope: {selectedSubject} • Tone: {selectedTone}
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-charcoal-muted bg-cream-base px-2.5 py-1 rounded-full border border-cream-border">
                Editable draft
              </span>
            </div>

            {/* Editable Textarea */}
            <div>
              <Textarea
                value={generatedComment}
                onChange={(e) => setGeneratedComment(e.target.value)}
                rows={4}
                className="font-body text-charcoal-dark leading-relaxed text-sm bg-white"
                helperText="You can edit this remark directly before inserting it into the student's terminal broadsheet record."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleGenerateComment}
                disabled={isGenerating}
                className="text-charcoal-dark"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate Alternative
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleInsertComment}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-sm"
              >
                <BookmarkCheck className="w-4 h-4 mr-1.5" />
                Insert Into Report Card
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Floating Success Toast */}
      {insertSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl shadow-xl bg-emerald-900/95 text-white border border-emerald-700 backdrop-blur-md animate-in slide-in-from-bottom-2 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <p className="text-xs sm:text-sm font-medium flex-1">{insertSuccessToast}</p>
          <button
            type="button"
            onClick={() => setInsertSuccessToast(null)}
            className="text-white/70 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
