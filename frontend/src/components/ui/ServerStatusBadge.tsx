import React, { useState, useEffect } from 'react'
import {
  checkBackendHealth,
  type SystemHealthResponse,
  API_BASE_URL,
  subscribeToBackendActivity,
  recentActivities,
  type RealtimeActivityEvent,
  sendAdminAiChat,
} from '@/lib/api'
import {
  Activity,
  Database,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wifi,
  ChevronDown,
  Zap,
  Sparkles,
  Bot,
  Megaphone,
  UserCheck,
  FileSpreadsheet,
} from 'lucide-react'
import { cn } from '@/utils/cn'

export const ServerStatusBadge: React.FC<{ className?: string }> = ({ className }) => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null)
  const [healthData, setHealthData] = useState<SystemHealthResponse | null>(null)
  const [latency, setLatency] = useState<number>(0)
  const [isChecking, setIsChecking] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [activities, setActivities] = useState<RealtimeActivityEvent[]>(recentActivities)

  const verifyConnection = async () => {
    setIsChecking(true)
    const res = await checkBackendHealth()
    setIsOnline(res.isOnline)
    setLatency(res.latencyMs)
    setHealthData(res.health)
    setIsChecking(false)
  }

  useEffect(() => {
    verifyConnection()
    // Poll every 12 seconds for real-time status
    const interval = setInterval(verifyConnection, 12000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToBackendActivity(() => {
      setActivities([...recentActivities])
    })
    return unsubscribe
  }, [])

  const handleTestProbe = async () => {
    try {
      await sendAdminAiChat('Ping live diagnostic probe')
    } catch {
      // Ignored, event bus already captured
    }
    verifyConnection()
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'ai':
        return <Bot className="w-3.5 h-3.5 text-purple-600" />
      case 'announcement':
        return <Megaphone className="w-3.5 h-3.5 text-amber-600" />
      case 'cbt':
        return <Zap className="w-3.5 h-3.5 text-indigo-600" />
      case 'staff':
        return <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
      case 'score':
        return <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-600" />
    }
  }

  return (
    <div className={cn('relative inline-block text-left font-sans', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-brand/20',
          isOnline === null
            ? 'bg-gray-50 border-gray-200 text-gray-500'
            : isOnline
            ? 'bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100/60 text-emerald-800'
            : 'bg-rose-50/80 border-rose-200 hover:bg-rose-100/60 text-rose-800 animate-pulse'
        )}
        title="Real-Time Backend Connection Status"
      >
        <span className="relative flex h-2 w-2">
          {isOnline && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          )}
          <span
            className={cn(
              'relative inline-flex rounded-full h-2 w-2',
              isOnline === null
                ? 'bg-gray-400'
                : isOnline
                ? 'bg-emerald-500'
                : 'bg-rose-500'
            )}
          />
        </span>

        <span className="hidden sm:inline font-semibold">
          {isOnline === null
            ? 'Checking Engine...'
            : isOnline
            ? `Live Engine • ${latency}ms`
            : 'Engine Offline'}
        </span>

        <span className="sm:hidden font-semibold">
          {isOnline ? 'Live' : 'Offline'}
        </span>

        <ChevronDown
          className={cn(
            'w-3 h-3 transition-transform duration-200 opacity-60',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Real-Time Status Popover */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-cream-border p-4 z-50 animate-fadeIn space-y-3.5">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-cream-border">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center',
                    isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  )}
                >
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-charcoal-dark leading-tight">
                    Real-Time System Architecture
                  </h4>
                  <p className="text-[11px] text-slate-subtle">
                    Frontend & Backend live telemetry
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleTestProbe}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-brand hover:bg-indigo-100 transition-colors flex items-center gap-1"
                  title="Fire a live Claude AI & Supabase diagnostic test"
                >
                  <Zap className="w-3 h-3" />
                  Live Probe
                </button>
                <button
                  type="button"
                  onClick={verifyConnection}
                  disabled={isChecking}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-brand hover:bg-cream-base transition-colors"
                  title="Ping Backend Now"
                >
                  <RefreshCw
                    className={cn('w-3.5 h-3.5', isChecking && 'animate-spin text-indigo-brand')}
                  />
                </button>
              </div>
            </div>

            {/* Status Grid */}
            <div className="space-y-2 text-xs">
              {/* Backend Engine */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-cream-base/40 border border-cream-border/60">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-brand" />
                  <div>
                    <span className="font-semibold text-charcoal-dark block leading-tight">
                      Hono Node.js Server
                    </span>
                    <span className="text-[10px] text-slate-subtle font-mono">
                      {API_BASE_URL}
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1',
                    isOnline
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  )}
                >
                  {isOnline ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-rose-600" />
                      Disconnected
                    </>
                  )}
                </span>
              </div>

              {/* PostgreSQL Database */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-cream-base/40 border border-cream-border/60">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-warm-gold" />
                  <div>
                    <span className="font-semibold text-charcoal-dark block leading-tight">
                      Supabase PostgreSQL
                    </span>
                    <span className="text-[10px] text-slate-subtle">
                      {healthData?.database?.database
                        ? `DB: ${healthData.database.database} • ${healthData.database.status}`
                        : 'AWS EU-Central-1 Pooler'}
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1',
                    isOnline && healthData?.database?.status === 'connected'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  )}
                >
                  {isOnline && healthData?.database?.status === 'connected' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Connected
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Waiting
                    </>
                  )}
                </span>
              </div>

              {/* Latency & Protocol */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 rounded-xl bg-cream-base/30 border border-cream-border/40 text-center">
                  <span className="text-[10px] text-slate-subtle block uppercase font-bold tracking-wider">
                    Network Roundtrip
                  </span>
                  <span className="text-sm font-display font-black text-charcoal-dark">
                    {latency} ms
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-cream-base/30 border border-cream-border/40 text-center">
                  <span className="text-[10px] text-slate-subtle block uppercase font-bold tracking-wider">
                    Environment
                  </span>
                  <span className="text-sm font-display font-black text-indigo-brand capitalize">
                    {healthData?.environment || 'Development'}
                  </span>
                </div>
              </div>
            </div>

            {/* LIVE REAL-TIME ACTIVITY STREAM */}
            <div className="pt-2 border-t border-cream-border/60">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-bold text-slate-subtle uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Activity Stream:
                </p>
                <span className="text-[9px] text-slate-400 font-mono">
                  {activities.length} events logged
                </span>
              </div>

              {activities.length === 0 ? (
                <div className="p-2 text-center text-[11px] text-slate-subtle bg-cream-base/20 rounded-xl border border-dashed border-cream-border">
                  Ready! Perform actions in any module to view live event logs.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {activities.slice(0, 5).map((act) => (
                    <div
                      key={act.id}
                      className="p-1.5 rounded-lg bg-cream-base/50 border border-cream-border/60 flex items-start gap-2 text-[11px]"
                    >
                      <div className="p-1 rounded bg-white shadow-xs shrink-0 mt-0.5">
                        {getEventIcon(act.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-charcoal-dark truncate">
                            {act.title}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono shrink-0 ml-1">
                            {act.latencyMs ? `${act.latencyMs}ms` : act.timestamp}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-subtle truncate">
                          {act.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Microservices List */}
            {healthData?.microservices && (
              <div className="pt-2 border-t border-cream-border/60">
                <p className="text-[10px] font-bold text-slate-subtle uppercase tracking-wider mb-1.5">
                  Connected Microservices:
                </p>
                <div className="flex flex-wrap gap-1">
                  {healthData.microservices.map((svc) => (
                    <span
                      key={svc}
                      className="px-1.5 py-0.5 bg-indigo-light/60 text-indigo-brand rounded-md text-[9px] font-mono font-medium"
                    >
                      {svc.replace('-service', '')}
                    </span>
                  ))}
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[9px] font-mono font-medium">
                    cbt
                  </span>
                </div>
              </div>
            )}

            {/* Offline Helper */}
            {!isOnline && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] leading-relaxed">
                <strong>Backend server not detected.</strong>
                <p className="mt-0.5">
                  To start the backend, open a terminal and run:
                  <code className="block mt-1 font-mono bg-white px-2 py-1 rounded text-rose-900 border border-rose-200 font-bold">
                    cd backend && pnpm dev
                  </code>
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
