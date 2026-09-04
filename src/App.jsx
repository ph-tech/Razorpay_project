import { useMemo, useState } from 'react'

const alerts = [
  {
    id: 'RSK-4892', merchant: 'Northstar Electronics', initials: 'NE', severity: 'Critical', score: 91, age: '12 min ago',
    summary: '4 failed settlements in 48 hours, 3.2× above normal',
    insight: 'Settlement failures increased sharply after a new payout beneficiary was added.',
    signals: [['Settlement failures', 32, '8.4% now · 2.6% typical'], ['Payout timing', 19, '03:14 · normally 10:00–14:00'], ['KYC status', 16, 'Document expires in 9 days'], ['New beneficiary', 12, 'Added 18 hours ago']],
    actions: ['Pause the next settlement', 'Request KYC re-verification', 'Confirm beneficiary account'],
    baseline: [20, 23, 21, 25, 22, 23, 22, 26, 24, 25, 23, 28], current: [21, 24, 27, 29, 25, 31, 38, 46, 54, 67, 82, 91],
  },
  {
    id: 'RSK-4891', merchant: 'Pine & Press', initials: 'PP', severity: 'High', score: 76, age: '26 min ago',
    summary: 'Transaction volume is 2.8× higher in the last 3 hours',
    insight: 'Most new payments are from cards not previously seen at this merchant.',
    signals: [['New-card payments', 27, '71% now · 34% typical'], ['Transaction velocity', 22, '184/hr · 66/hr typical'], ['Average order size', 14, '₹1,840 · ₹980 typical'], ['IP mismatch', 8, '12% of payments']],
    actions: ['Limit transaction velocity', 'Review recent payment pattern', 'Monitor for 24 hours'],
    baseline: [31, 33, 32, 36, 35, 34, 37, 36, 39, 35, 34, 37], current: [33, 35, 36, 38, 42, 47, 52, 58, 65, 68, 72, 76],
  },
  {
    id: 'RSK-4890', merchant: 'Aster Health Labs', initials: 'AH', severity: 'High', score: 72, age: '41 min ago',
    summary: 'Chargebacks are 2.4× the merchant’s 90-day rate',
    insight: 'Disputes are concentrated around “service not received” claims.',
    signals: [['Chargeback rate', 29, '1.9% now · 0.8% typical'], ['Dispute concentration', 18, '64% same reason'], ['Refund delay', 11, '6.8 days · 2.1 typical'], ['Repeat disputes', 9, '7 linked accounts']],
    actions: ['Escalate to merchant success', 'Enable enhanced monitoring'],
    baseline: [18, 20, 19, 20, 22, 21, 23, 24, 25, 29, 37, 43], current: [19, 20, 21, 25, 27, 31, 39, 48, 55, 63, 68, 72],
  },
  {
    id: 'RSK-4889', merchant: 'Brewline Coffee Co.', initials: 'BC', severity: 'Medium', score: 58, age: '1 hour ago',
    summary: 'PAN details do not match a newly added director',
    insight: 'The merchant’s payment behaviour is stable; only compliance signals changed.',
    signals: [['Director identity', 24, 'Name differs from PAN'], ['Ownership change', 16, 'Director added 2 days ago'], ['Document age', 8, 'Last uploaded 11 months ago']],
    actions: ['Request director KYC update', 'Keep current settlement cadence'],
    baseline: [22, 20, 21, 22, 21, 23, 22, 20, 24, 22, 21, 22], current: [22, 21, 22, 24, 25, 29, 34, 41, 48, 52, 56, 58],
  },
]

const tones = {
  Critical: 'bg-[#ffe1df] text-[#a43835] border-[#f5bab4]',
  High: 'bg-[#fff0c9] text-[#9b5b05] border-[#f0d98f]',
  Medium: 'bg-[#e5edff] text-[#3c589f] border-[#c7d5fa]',
}

function Sparkline({ values, color }) {
  const points = values.map((value, index) => `${index * 12},${43 - value * 0.38}`).join(' ')
  return <svg viewBox="0 0 132 48" className="h-11 w-full" preserveAspectRatio="none" aria-label="Risk trend"><line x1="0" y1="38" x2="132" y2="38" stroke="#e7e8e2" /><polyline fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" points={points} /></svg>
}

function App() {
  const [selectedId, setSelectedId] = useState(alerts[0].id)
  const [filter, setFilter] = useState('All')
  const [resolved, setResolved] = useState([])
  const [notice, setNotice] = useState('')
  const selected = alerts.find((alert) => alert.id === selectedId)
  const remaining = useMemo(() => alerts.filter((alert) => !resolved.includes(alert.id) && (filter === 'All' || alert.severity === filter)), [filter, resolved])
  const totalWeight = selected.signals.reduce((sum, [, weight]) => sum + weight, 0)

  const chooseAction = (action) => setNotice(`“${action}” has been added to Northstar Electronics’ review plan.`)
  const resolve = () => {
    setResolved((current) => [...current, selected.id])
    const next = alerts.find((alert) => alert.id !== selected.id && !resolved.includes(alert.id))
    if (next) setSelectedId(next.id)
    setNotice(`${selected.merchant} has been marked as reviewed.`)
  }

  return <div className="min-h-screen bg-[#f3f6fb] text-[#18283c]">
    <header className="border-b border-[#19344e] bg-[#102b46] text-white">
      <div className="mx-auto flex h-15 max-w-[1380px] items-center justify-between px-6">
        <div className="flex items-center gap-3"><div className="grid h-7 w-7 place-items-center rounded-md bg-[#f3b646] text-xs font-bold text-[#162c45]">R</div><span className="text-sm font-semibold tracking-[-0.02em]">RiskLens</span><span className="ml-2 hidden border-l border-[#436078] pl-4 text-xs text-[#aebfcf] sm:block">Merchant risk operations</span></div>
        <div className="flex items-center gap-4 text-xs text-[#c8d6e2]"><span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#72d1a3]" /> Live monitoring</span><button className="grid h-7 w-7 place-items-center rounded-full bg-[#f5d47d] font-medium text-[#263b4c]">PS</button></div>
      </div>
    </header>

    <main className="mx-auto max-w-[1380px] px-6 py-7">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-medium uppercase tracking-[0.11em] text-[#777c75]">Today’s queue</p><h1 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">Review the risks that need a decision.</h1></div>
        <div className="flex items-center gap-6 rounded-md border border-[#cbd9e7] bg-white px-4 py-2.5 text-xs shadow-[0_2px_10px_rgba(25,55,85,0.06)]"><div><span className="block text-[#637487]">Open alerts</span><strong className="text-base">{alerts.length - resolved.length}</strong></div><div className="border-l border-[#e2e9ef] pl-5"><span className="block text-[#637487]">Critical</span><strong className="text-base text-[#c44642]">{alerts.filter((alert) => alert.severity === 'Critical' && !resolved.includes(alert.id)).length}</strong></div></div>
      </div>

      {notice && <div className="mb-5 flex items-center justify-between rounded-md border border-[#cfe0d0] bg-[#edf5ed] px-4 py-3 text-sm text-[#356142]"><span>{notice}</span><button onClick={() => setNotice('')} className="font-medium">Dismiss</button></div>}

      <div className="grid gap-5 lg:grid-cols-[400px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-[#cbd9e7] bg-white shadow-[0_2px_12px_rgba(25,55,85,0.05)]">
          <div className="border-b border-[#e5ebf1] p-4"><div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold">Alerts to review</h2><p className="mt-0.5 text-xs text-[#68788a]">Select an alert to see the evidence.</p></div></div><div className="mt-4 flex gap-1.5">{['All', 'Critical', 'High', 'Medium'].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded px-2 py-1 text-xs font-medium transition ${filter === item ? 'bg-[#153d60] text-white' : 'text-[#516779] hover:bg-[#eef4fa]'}`}>{item}</button>)}</div></div>
          <div className="divide-y divide-[#e7edf3]">{remaining.length ? remaining.map((alert) => <button key={alert.id} onClick={() => setSelectedId(alert.id)} className={`w-full border-l-[3px] p-4 text-left transition ${selected.id === alert.id ? 'border-[#ee7c58] bg-[#fff6ef]' : 'border-transparent hover:bg-[#f4f8fc]'}`}><div className="flex items-center gap-2.5"><div className="grid h-8 w-8 place-items-center rounded-md border border-[#d4e0eb] bg-[#edf4fa] text-[11px] font-semibold text-[#49657b]">{alert.initials}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold">{alert.merchant}</span><span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${tones[alert.severity]}`}>{alert.severity}</span></div><p className="mt-1 text-xs leading-4 text-[#566b7c]">{alert.summary}</p><p className="mt-1.5 font-mono text-[10px] text-[#8190a0]">Risk score {alert.score} · {alert.age}</p></div></div></button>) : <p className="p-7 text-center text-sm text-[#737870]">No alerts match this filter.</p>}</div>
        </aside>

        <section className="overflow-hidden rounded-lg border border-[#cbd9e7] bg-white shadow-[0_2px_12px_rgba(25,55,85,0.05)]">
          <div className="border-b border-[#e5ebf1] px-5 py-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex gap-3"><div className="grid h-10 w-10 place-items-center rounded-md border border-[#d4e0eb] bg-[#edf4fa] text-xs font-semibold text-[#49657b]">{selected.initials}</div><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-semibold">{selected.merchant}</h2><span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${tones[selected.severity]}`}>{selected.severity} risk</span></div><p className="mt-0.5 text-xs text-[#748595]">{selected.id} · detected {selected.age}</p></div></div><button onClick={resolve} className="rounded-md bg-[#153d60] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#0e304e]">Mark reviewed</button></div></div>
          <div className="p-5">
            <div className="rounded-md border border-[#ffd5bd] bg-[#fff4ec] p-4"><div className="flex items-start justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#bd5936]">Decision summary</p><h3 className="mt-1.5 text-lg font-semibold tracking-[-0.025em]">{selected.summary}</h3><p className="mt-2 max-w-2xl text-sm leading-5 text-[#626e78]">{selected.insight}</p></div><div className="shrink-0 text-right"><p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#8b8079]">Risk score</p><p className="mt-1 font-mono text-3xl font-medium text-[#c45136]">{selected.score}<span className="text-sm text-[#837b74]">/100</span></p><p className="text-[11px] text-[#4c7c63]">94% confidence</p></div></div></div>

            <div className="mt-6 grid gap-7 xl:grid-cols-[1fr_0.86fr]">
              <div><div className="flex items-baseline justify-between"><div><h3 className="text-sm font-semibold">What drove this score</h3><p className="mt-0.5 text-xs text-[#777c75]">Each signal adds points to the risk score.</p></div><span className="text-xs text-[#777c75]">Total impact +{totalWeight}</span></div><div className="mt-4 space-y-4">{selected.signals.map(([name, points, detail]) => <div key={name}><div className="flex items-center justify-between gap-4 text-xs"><span className="font-medium">{name}</span><span className="text-right text-[#747a72]">{detail}</span></div><div className="mt-1.5 flex items-center gap-2"><div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e9e9e3]"><div className="h-full rounded-full bg-[#b95c34]" style={{ width: `${points / totalWeight * 100}%` }} /></div><span className="w-8 font-mono text-[11px] text-[#a34e2b]">+{points}</span></div></div>)}</div></div>
              <div className="border-t border-[#e5e6e0] pt-5 xl:border-l xl:border-t-0 xl:pl-7 xl:pt-0"><h3 className="text-sm font-semibold">What should happen next</h3><p className="mt-0.5 text-xs text-[#777c75]">Actions selected from the applicable risk policy.</p><div className="mt-4 space-y-2">{selected.actions.map((action, index) => <button key={action} onClick={() => chooseAction(action)} className="flex w-full items-center gap-3 rounded-md border border-[#dedfd8] bg-white p-3 text-left text-xs font-medium transition hover:border-[#bfc9bd] hover:bg-[#f8faf7]"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#edf2ec] text-[10px] text-[#4f704f]">{index + 1}</span><span className="flex-1">{action}</span><span className="text-[#849086]">Add</span></button>)}</div></div>
            </div>

            <div className="mt-7 border-t border-[#e5e6e0] pt-5"><div className="flex items-baseline justify-between"><div><h3 className="text-sm font-semibold">Is this unusual for this merchant?</h3><p className="mt-0.5 text-xs text-[#777c75]">The current pattern is compared to the last 90 days.</p></div><span className="text-xs font-medium text-[#a34e2b]">Rising risk</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-md border border-[#e1e2dc] bg-white p-3"><div className="flex justify-between text-xs"><span className="font-medium">Usual pattern</span><span className="text-[#747a72]">Average score 24</span></div><Sparkline values={selected.baseline} color="#879484" /></div><div className="rounded-md border border-[#e1e2dc] bg-white p-3"><div className="flex justify-between text-xs"><span className="font-medium">Current pattern</span><span className="text-[#a34e2b]">Now {selected.score}</span></div><Sparkline values={selected.current} color="#b95c34" /></div></div></div>
          </div>
        </section>
      </div>

      <section className="mt-5 grid gap-px overflow-hidden rounded-lg border border-[#dedfd8] bg-[#dedfd8] sm:grid-cols-3"><div className="bg-[#fbfbf8] p-4"><p className="text-xs text-[#72776f]">False-positive rate</p><p className="mt-1 text-xl font-semibold">6.8% <span className="text-xs font-medium text-[#3c7249]">↓ 1.4%</span></p></div><div className="bg-[#fbfbf8] p-4"><p className="text-xs text-[#72776f]">Risks caught before loss</p><p className="mt-1 text-xl font-semibold">87.4% <span className="text-xs font-medium text-[#3c7249]">↑ 2.1%</span></p></div><div className="bg-[#fbfbf8] p-4"><p className="text-xs text-[#72776f]">Average resolution time</p><p className="mt-1 text-xl font-semibold">4h 12m <span className="text-xs font-medium text-[#3c7249]">↓ 36m</span></p></div></section>
    </main>
  </div>
}

export default App
