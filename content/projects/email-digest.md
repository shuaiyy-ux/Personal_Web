Email volume in any active inbox is a triage problem before it is a writing problem. Every thread needs a quick verdict (act now, wait, or ignore) and a chunk of them want a one-line reply. EmailDigest is an AI email client I built so the triage takes minutes and the writing takes one click. The product is general; my running config scopes it to a single Gmail label so the assistant cannot wander past one inbox boundary, but the same UI works on any IMAP-accessible account.

The brief I gave myself was concrete: get the daily total under fifteen minutes, and stop relying on memory to track who is waiting on a reply. Across the last three weeks of dogfooding the inbox has carried 81, 137, and 48 threads. A typical week sits at eighty to one hundred twenty, peaks around one forty. Without help, even the median week is fifteen-plus decisions per day spread across morning, noon, and night check-ins, plus the cognitive load of holding "wait did I reply to that?" in working memory.

<div class="email-digest-mock email-digest-mock--hero" aria-label="EmailDigest three-pane interface mockup">
  <div class="email-digest-mock__sidebar">
    <div class="email-digest-mock__sidebar-brand">ED</div>
    <div class="email-digest-mock__sidebar-item email-digest-mock__sidebar-item--active" title="Inbox">📥</div>
    <div class="email-digest-mock__sidebar-item" title="Calendar">📅</div>
    <div class="email-digest-mock__sidebar-item" title="Ask AI">✦</div>
    <div class="email-digest-mock__sidebar-item" title="Settings">⚙</div>
  </div>
  <div class="email-digest-mock__list">
    <div class="email-digest-mock__tabs">
      <span class="email-digest-mock__tab email-digest-mock__tab--active">Urgent · 3</span>
      <span class="email-digest-mock__tab">Action · 9</span>
      <span class="email-digest-mock__tab">FYI · 22</span>
      <span class="email-digest-mock__tab">All · 81</span>
    </div>
    <div class="email-digest-mock__row email-digest-mock__row--selected">
      <span class="email-digest-mock__dot email-digest-mock__dot--urgent"></span>
      <div class="email-digest-mock__row-main">
        <div class="email-digest-mock__row-head">
          <span class="email-digest-mock__row-from">Lina Park</span>
          <span class="email-digest-mock__row-time">10:32</span>
        </div>
        <div class="email-digest-mock__row-subject">Sprint review moved to Thursday</div>
        <div class="email-digest-mock__row-summary">▸ Time slipped by a day; she asks you to confirm the new slot.</div>
        <span class="email-digest-mock__bucket email-digest-mock__bucket--primary">PRIMARY</span>
      </div>
    </div>
    <div class="email-digest-mock__row">
      <span class="email-digest-mock__dot email-digest-mock__dot--action"></span>
      <div class="email-digest-mock__row-main">
        <div class="email-digest-mock__row-head">
          <span class="email-digest-mock__row-from">Vercel</span>
          <span class="email-digest-mock__row-time">09:15</span>
        </div>
        <div class="email-digest-mock__row-subject">Your team's invoice for April</div>
        <div class="email-digest-mock__row-summary">▸ $24.00 charged on Apr 28; receipt attached.</div>
        <span class="email-digest-mock__bucket email-digest-mock__bucket--track">TRACK</span>
      </div>
    </div>
    <div class="email-digest-mock__row">
      <span class="email-digest-mock__dot email-digest-mock__dot--action"></span>
      <div class="email-digest-mock__row-main">
        <div class="email-digest-mock__row-head">
          <span class="email-digest-mock__row-from">Marco Reyes</span>
          <span class="email-digest-mock__row-time">08:45</span>
        </div>
        <div class="email-digest-mock__row-subject">Re: API contract questions</div>
        <div class="email-digest-mock__row-summary">▸ Asks for a 30-min sync to lock the response shape.</div>
        <span class="email-digest-mock__bucket email-digest-mock__bucket--primary">PRIMARY</span>
      </div>
    </div>
    <div class="email-digest-mock__row">
      <span class="email-digest-mock__dot email-digest-mock__dot--fyi"></span>
      <div class="email-digest-mock__row-main">
        <div class="email-digest-mock__row-head">
          <span class="email-digest-mock__row-from">Stratechery</span>
          <span class="email-digest-mock__row-time">07:30</span>
        </div>
        <div class="email-digest-mock__row-subject">Daily Update: Anthropic and the agent stack</div>
        <div class="email-digest-mock__row-summary">▸ Skimmable; no action; saved to "later".</div>
        <span class="email-digest-mock__bucket email-digest-mock__bucket--news">NEWS</span>
      </div>
    </div>
    <div class="email-digest-mock__row email-digest-mock__row--muted">
      <span class="email-digest-mock__dot email-digest-mock__dot--low"></span>
      <div class="email-digest-mock__row-main">
        <div class="email-digest-mock__row-head">
          <span class="email-digest-mock__row-from">no-reply@calendly</span>
          <span class="email-digest-mock__row-time">06:18</span>
        </div>
        <div class="email-digest-mock__row-subject">Reminder: 1:1 with Sam tomorrow</div>
        <div class="email-digest-mock__row-summary">▸ Calendar already has it; auto-classified Junk.</div>
        <span class="email-digest-mock__bucket email-digest-mock__bucket--junk">JUNK</span>
      </div>
    </div>
  </div>
  <div class="email-digest-mock__detail">
    <div class="email-digest-mock__detail-meta">
      <div class="email-digest-mock__detail-from">Lina Park &lt;lina@studio.co&gt;</div>
      <div class="email-digest-mock__detail-subject">Sprint review moved to Thursday</div>
      <div class="email-digest-mock__detail-time">Today, 10:32</div>
    </div>
    <div class="email-digest-mock__detail-body">
      <p>Hey, the engineering review on Wednesday is colliding with the board prep, so we are bumping sprint review to <b>Thursday 3pm</b>. Same room. Let me know if that works for you, otherwise I will find a 30-min slot Friday morning.</p>
    </div>
    <div class="email-digest-mock__detail-draft">
      <div class="email-digest-mock__detail-draft-label">AI DRAFT REPLY</div>
      <p>Thursday 3pm works. I will move my afternoon block. Anything I should bring beyond the sprint deck?</p>
      <div class="email-digest-mock__detail-draft-actions">
        <span class="email-digest-mock__btn email-digest-mock__btn--primary">Open in Gmail</span>
        <span class="email-digest-mock__btn">Edit</span>
        <span class="email-digest-mock__btn email-digest-mock__btn--ghost">Discard</span>
      </div>
    </div>
  </div>
</div>

*FIG.01: every thread carries a one-line AI summary so I can skip opening eighty percent of them. The split tabs route by urgency. The right pane previews the body and offers a draft reply when the LLM thinks one is needed. Drafts never auto-send; they open as Gmail compose drafts on click.*

The classification surface is doing more work than the visual suggests. Each thread runs through a 4-bucket classifier (Primary, Track, News, Junk) on arrival, then gets a separate urgency tag (urgent, action, FYI, low) used to route into the split tabs. Of 281 emails the classifier has touched so far, I have explicitly corrected the bucket on 2. That is a 0.7% manual-correction rate, which is the rate I have to step in, not the model's true accuracy (I do not catch every miscategorization, especially in the FYI tail). Still, the directional signal is that the classifier is good enough to trust at the list level and revisit only when something feels off in the right pane.

<div class="email-digest-mock email-digest-mock--card" aria-label="Single mail card zoom">
  <div class="email-digest-mock__row email-digest-mock__row--zoom">
    <span class="email-digest-mock__dot email-digest-mock__dot--urgent"></span>
    <div class="email-digest-mock__row-main">
      <div class="email-digest-mock__row-head">
        <span class="email-digest-mock__row-from">Marco Reyes</span>
        <span class="email-digest-mock__row-time">Tue 4:12pm</span>
      </div>
      <div class="email-digest-mock__row-subject">Re: API contract questions</div>
      <div class="email-digest-mock__row-summary">▸ Wants a 30-min sync this week to lock the response shape and error envelope.</div>
      <div class="email-digest-mock__row-meta">
        <span class="email-digest-mock__bucket email-digest-mock__bucket--primary">PRIMARY</span>
        <span class="email-digest-mock__chip email-digest-mock__chip--action">action</span>
        <span class="email-digest-mock__chip email-digest-mock__chip--mention">2 mentions</span>
      </div>
    </div>
  </div>
</div>

*FIG.02: a single card. Bucket is the LLM's category; chip is the per-email urgency; mentions count threading depth. The summary is the one-liner the LLM emits as part of classification, not a separate call.*

The Ask AI surface handles the queries that do not have a single-thread answer. "What deadlines do I have this week?" is the canonical one. Without it, I would scroll through three weeks of subject lines hunting for date words. With it, the agent retrieves the relevant chunks via RAG and returns a grounded list with citations.

<div class="email-digest-mock email-digest-mock--ask" aria-label="Ask AI conversation mockup">
  <div class="email-digest-mock__chat-header">Ask AI · agentic RAG over my inbox</div>
  <div class="email-digest-mock__chat-msg email-digest-mock__chat-msg--user">
    What deadlines do I have this week?
  </div>
  <div class="email-digest-mock__chat-msg email-digest-mock__chat-msg--ai">
    <p>Three deadlines surfaced from the last seven days of mail:</p>
    <ol>
      <li><b>Thu 3pm</b> · Sprint review with Lina <span class="email-digest-mock__chat-cite">[#a4f1]</span></li>
      <li><b>Fri EOD</b> · API contract sign-off with Marco <span class="email-digest-mock__chat-cite">[#7c2e]</span></li>
      <li><b>Sun 23:59</b> · Vercel team plan auto-renews <span class="email-digest-mock__chat-cite">[#9b18]</span></li>
    </ol>
    <p class="email-digest-mock__chat-meta">Grounded on 3 emails. Click any [#id] to open the source thread.</p>
  </div>
</div>

*FIG.03: Ask AI runs an agentic RAG loop over the inbox via Sonnet. Replies cite the email IDs they pulled from so the answer is verifiable, not a hallucinated calendar.*

The fourth piece is calendar extraction. Most deadlines hide inside paragraphs ("we need this by Friday EOD"), and most calendar tools cannot find them. When the classifier sees a date phrase it suggests a calendar tile, and a one-click confirm puts it on the strip.

<div class="email-digest-mock email-digest-mock--cal" aria-label="Calendar event extraction mockup">
  <div class="email-digest-mock__cal-source">
    <div class="email-digest-mock__cal-from">Lina Park · 10:32</div>
    <div class="email-digest-mock__cal-text">"...we are bumping sprint review to <b>Thursday 3pm</b>. Same room."</div>
  </div>
  <div class="email-digest-mock__cal-arrow">→</div>
  <div class="email-digest-mock__cal-tile">
    <div class="email-digest-mock__cal-tile-day">THU</div>
    <div class="email-digest-mock__cal-tile-time">3:00 to 4:00pm</div>
    <div class="email-digest-mock__cal-tile-title">Sprint review</div>
    <div class="email-digest-mock__cal-tile-source">extracted from Lina's reply</div>
  </div>
</div>

*FIG.04: dates and meeting times in the body get pulled into a calendar view automatically; deadlines stop hiding in threads.*

The extraction is one half of the calendar story. The other half is a real calendar view at `/calendar`, a FullCalendar grid that shows the next six months alongside the past thirty days, scoped to events the classifier scraped from Primary and Track threads. Every tile keeps a back-pointer to the source email, so the question I actually have when I see "sprint review Thursday 3pm" two weeks later (where did that come from) is one click away. The scan is on demand: I press a button, the LLM works through the most recent unprocessed batch, and the new tiles appear.

<div class="email-digest-mock email-digest-mock--week" aria-label="Calendar week view mockup">
  <div class="email-digest-mock__week-head">
    <div class="email-digest-mock__week-title">Apr 28 to May 2</div>
    <div class="email-digest-mock__week-actions">
      <span class="email-digest-mock__btn email-digest-mock__btn--primary">Scan inbox</span>
      <span class="email-digest-mock__btn">Today</span>
    </div>
  </div>
  <div class="email-digest-mock__week-grid">
    <div class="email-digest-mock__week-day">
      <div class="email-digest-mock__week-day-head"><b>MON</b> 28</div>
      <div class="email-digest-mock__week-evt email-digest-mock__week-evt--meeting">
        <div class="email-digest-mock__week-evt-time">10:00</div>
        <div class="email-digest-mock__week-evt-title">1:1 with Sam</div>
        <div class="email-digest-mock__week-evt-src">↩ Calendly invite</div>
      </div>
    </div>
    <div class="email-digest-mock__week-day">
      <div class="email-digest-mock__week-day-head"><b>TUE</b> 29</div>
      <div class="email-digest-mock__week-evt email-digest-mock__week-evt--deadline">
        <div class="email-digest-mock__week-evt-time">EOD</div>
        <div class="email-digest-mock__week-evt-title">Submit Q2 OKRs</div>
        <div class="email-digest-mock__week-evt-src">↩ Lina, Apr 24</div>
      </div>
    </div>
    <div class="email-digest-mock__week-day email-digest-mock__week-day--today">
      <div class="email-digest-mock__week-day-head"><b>WED</b> 30</div>
    </div>
    <div class="email-digest-mock__week-day">
      <div class="email-digest-mock__week-day-head"><b>THU</b> 1</div>
      <div class="email-digest-mock__week-evt email-digest-mock__week-evt--meeting">
        <div class="email-digest-mock__week-evt-time">15:00</div>
        <div class="email-digest-mock__week-evt-title">Sprint review</div>
        <div class="email-digest-mock__week-evt-src">↩ Lina, today</div>
      </div>
    </div>
    <div class="email-digest-mock__week-day">
      <div class="email-digest-mock__week-day-head"><b>FRI</b> 2</div>
      <div class="email-digest-mock__week-evt email-digest-mock__week-evt--deadline">
        <div class="email-digest-mock__week-evt-time">EOD</div>
        <div class="email-digest-mock__week-evt-title">API contract sign-off</div>
        <div class="email-digest-mock__week-evt-src">↩ Marco, Apr 26</div>
      </div>
      <div class="email-digest-mock__week-evt email-digest-mock__week-evt--info">
        <div class="email-digest-mock__week-evt-time">23:59</div>
        <div class="email-digest-mock__week-evt-title">Vercel team renews</div>
        <div class="email-digest-mock__week-evt-src">↩ no-reply@vercel</div>
      </div>
    </div>
  </div>
</div>

*FIG.05: a slice of the calendar view. Each tile keeps a thread reference (`↩ source`) so the original email is one click away. Today is dim because nothing extracted there yet.*

The job-board surface is the second specialized view. Job-related emails are noisy the way newsletters are noisy, but unlike newsletters they carry state: applied, acknowledged, interview scheduled, interviewed, offer, closed. The classifier groups job emails into applications keyed on company plus role, detects stage transitions from the message content (a "we would like to schedule a call" moves the card right), and lets me override any auto-decision because once is enough for a recruiter to write something the model misreads. Cards carry company, role, latest stage, optional deadline countdown, priority chip (rose for "extremely high" through zinc for low), and a "needs action" indicator when the most recent email asks for a reply or a date. Merging two cards is one click when the same recruiter splits one application across two threads.

<div class="email-digest-mock email-digest-mock--jobs" aria-label="Job board kanban mockup">
  <div class="email-digest-mock__kanban">
    <div class="email-digest-mock__kcol email-digest-mock__kcol--applied">
      <div class="email-digest-mock__kcol-head"><span>APPLIED</span><b>4</b></div>
      <div class="email-digest-mock__job-card">
        <div class="email-digest-mock__job-co">FabFitFun</div>
        <div class="email-digest-mock__job-role">AI Solutions Architect</div>
        <div class="email-digest-mock__job-meta">
          <span class="email-digest-mock__job-pri email-digest-mock__job-pri--medium">medium</span>
          <span class="email-digest-mock__job-time">3d ago</span>
        </div>
      </div>
      <div class="email-digest-mock__job-card">
        <div class="email-digest-mock__job-co">Origence</div>
        <div class="email-digest-mock__job-role">AI Solution Architect</div>
        <div class="email-digest-mock__job-meta">
          <span class="email-digest-mock__job-pri email-digest-mock__job-pri--high">high</span>
          <span class="email-digest-mock__job-time">5d ago</span>
        </div>
      </div>
    </div>
    <div class="email-digest-mock__kcol email-digest-mock__kcol--ack">
      <div class="email-digest-mock__kcol-head"><span>ACKNOWLEDGED</span><b>2</b></div>
      <div class="email-digest-mock__job-card">
        <div class="email-digest-mock__job-co">Whip Media</div>
        <div class="email-digest-mock__job-role">Jr. AI Developer</div>
        <div class="email-digest-mock__job-meta">
          <span class="email-digest-mock__job-pri email-digest-mock__job-pri--high">high</span>
          <span class="email-digest-mock__job-time">2d ago</span>
        </div>
      </div>
    </div>
    <div class="email-digest-mock__kcol email-digest-mock__kcol--int">
      <div class="email-digest-mock__kcol-head"><span>INTERVIEW</span><b>2</b></div>
      <div class="email-digest-mock__job-card email-digest-mock__job-card--action">
        <div class="email-digest-mock__job-co">Snowball</div>
        <div class="email-digest-mock__job-role">AI Developer (Agentic)</div>
        <div class="email-digest-mock__job-meta">
          <span class="email-digest-mock__job-pri email-digest-mock__job-pri--xhigh">extremely high</span>
          <span class="email-digest-mock__job-action">needs reply</span>
        </div>
      </div>
    </div>
    <div class="email-digest-mock__kcol email-digest-mock__kcol--done">
      <div class="email-digest-mock__kcol-head"><span>INTERVIEWED</span><b>1</b></div>
      <div class="email-digest-mock__job-card">
        <div class="email-digest-mock__job-co">Tapio</div>
        <div class="email-digest-mock__job-role">AI Workflow Architect</div>
        <div class="email-digest-mock__job-meta">
          <span class="email-digest-mock__job-pri email-digest-mock__job-pri--medium">medium</span>
          <span class="email-digest-mock__job-time">awaiting</span>
        </div>
      </div>
    </div>
    <div class="email-digest-mock__kcol email-digest-mock__kcol--offer">
      <div class="email-digest-mock__kcol-head"><span>OFFER</span><b>0</b></div>
      <div class="email-digest-mock__kcol-empty">· no cards ·</div>
    </div>
    <div class="email-digest-mock__kcol email-digest-mock__kcol--closed">
      <div class="email-digest-mock__kcol-head"><span>CLOSED</span><b>3</b></div>
      <div class="email-digest-mock__job-card email-digest-mock__job-card--muted">
        <div class="email-digest-mock__job-co">Google</div>
        <div class="email-digest-mock__job-role">Customer Engineer, Cloud AI</div>
        <div class="email-digest-mock__job-meta">
          <span class="email-digest-mock__job-pri email-digest-mock__job-pri--low">rejected</span>
        </div>
      </div>
    </div>
  </div>
</div>

*FIG.06: the application Kanban. Columns are stages; chips are priority; cards collapse multiple emails per company+role into one application object so the inbox does not have to.*

The pipeline behind these surfaces was eating three Sonnet spawns per prefetch cycle: classification of new emails (Step 2b), confirmation of maybe-work threads against the job board (Step 3), and refresh of stale dashboard briefings (Step 4). PROD averaged 150 to 300 Anthropic threads per day, the bulk of them from this loop. The three steps share inputs, share Sonnet, and emit JSON with no downstream side effects. After running them as separate spawns long enough to gather a baseline, I rolled them into one.

Two tempting alternatives lost when I sketched the math. Sharing a Claude CLI session id across spawns with `--resume` replays the entire jsonl history into messages on every call, and the prefetch tasks carry no semantic continuity to amortize that cost: input tokens go up roughly threefold, and the prompt cache stays cold because the five-minute cache TTL is shorter than the one to three hour prefetch interval. Time-debouncing the cycle to coalesce email bursts saves a few spawns a day but adds up to five minutes of classification latency on the user-facing list, which is the wrong knob to turn. Merging the three prompts into one spawn was the only path that wins on every axis I cared about.

```text
                  3 spawns    merged    delta
total latency        46.9s     36.3s    -23%
spawns / cycle           3         1    -67%
cache create        23,033     8,429    -63%
cache read          19,032     9,516    -50%
cost / cycle       $0.1199   $0.0677    -44%
```

*FIG.07: five real emails, same Sonnet model, same JSON shape; fewer than half the cost. The classifier and the job confirmer matched the 3-spawn baseline 5 out of 5; the briefings came back more precise, because the merged call grouped on the categories it had just computed instead of the ones stuck in the DB from the previous cycle.*

The merged path is gated behind three hedges. The spawn uses `--system-prompt` to fully replace Claude Code's default prompt, never `--append-system-prompt`, because appending leaves the default "coding assistant" preamble in front of the strict JSON schema and dilutes it (`daily-digest.ts:282` already carries a comment about exactly that failure mode). The parser handles each top-level key (`classifications`, `jobs`, `briefings`) independently: a partial response writes the keys it got and leaves the missing ones for the next prefetch cycle to retry, since the trigger conditions (`needsLLM`, `maybe_work` queue, stale briefing) are still satisfied. And when the merged prompt exceeds 100K characters of user content (about 25K tokens), the pipeline falls back to the original three-spawn path; `classifyEmailsWithLLM`, `drainMaybeWorkQueue`, and `refreshStaleBriefings` are kept in place both for that fallback and for caller-driven flows like `forceClassifyAsJob` (right-click on a thread to force a job classification) and Ask AI (which deliberately keeps a real `--resume` chat session because that one is genuinely conversational).

After three weeks of running this on a real inbox the daily total holds at fifteen minutes: roughly three minutes morning, three at noon, three at night for reading, plus two minutes per session for sending and replying. Eighty to one hundred forty threads a week pass through the classifier; I correct 0.7% of them by hand. The Calendar view turns "wait when was that deadline" into a click, and the Job board turns a job-search inbox from a stream into a tracked pipeline.

The deployment URL is private, gated to my account. If you want a walk-through, ask.
