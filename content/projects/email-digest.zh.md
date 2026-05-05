任何一只活跃邮箱的邮件量，先是一个分流问题，然后才是写作问题。每个会话需要一个快速判定（现在做、等等、忽略），里面一批又想要一句回信。EmailDigest 是我做的一个 AI 邮件客户端，让分流花几分钟、写信只点一下。产品本身是通用的；我自己跑的配置把它框在一个 Gmail label 上，让助手不会越过这个收件箱边界，但同一套 UI 在任何 IMAP 可达的账户上都能用。

我给自己写的需求很具体：每天总开销压到 15 分钟以内，并且不再用脑子记谁在等我回信。狗粮三周下来，收件箱分别承载了 81、137、48 条会话。一个典型的周稳定在 80–120 之间，峰值在 140 左右。没有助手，哪怕中位数那一周也是每天 15 个以上判断分布在早中晚三轮，外加「我到底回过那条没」这种工作记忆负担。

<div class="email-digest-mock email-digest-mock--hero" aria-label="EmailDigest 三栏界面 mockup">
  <div class="email-digest-mock__sidebar">
    <div class="email-digest-mock__sidebar-brand">ED</div>
    <div class="email-digest-mock__sidebar-item email-digest-mock__sidebar-item--active" title="收件箱">📥</div>
    <div class="email-digest-mock__sidebar-item" title="日历">📅</div>
    <div class="email-digest-mock__sidebar-item" title="Ask AI">✦</div>
    <div class="email-digest-mock__sidebar-item" title="设置">⚙</div>
  </div>
  <div class="email-digest-mock__list">
    <div class="email-digest-mock__tabs">
      <span class="email-digest-mock__tab email-digest-mock__tab--active">紧急 · 3</span>
      <span class="email-digest-mock__tab">待办 · 9</span>
      <span class="email-digest-mock__tab">参考 · 22</span>
      <span class="email-digest-mock__tab">全部 · 81</span>
    </div>
    <div class="email-digest-mock__row email-digest-mock__row--selected">
      <span class="email-digest-mock__dot email-digest-mock__dot--urgent"></span>
      <div class="email-digest-mock__row-main">
        <div class="email-digest-mock__row-head">
          <span class="email-digest-mock__row-from">Lina Park</span>
          <span class="email-digest-mock__row-time">10:32</span>
        </div>
        <div class="email-digest-mock__row-subject">Sprint review 改到周四</div>
        <div class="email-digest-mock__row-summary">▸ 时间往后挪一天，让你确认新时段。</div>
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
        <div class="email-digest-mock__row-subject">4 月团队账单</div>
        <div class="email-digest-mock__row-summary">▸ 4 月 28 日扣款 $24.00；附件是收据。</div>
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
        <div class="email-digest-mock__row-subject">Re: API 契约问题</div>
        <div class="email-digest-mock__row-summary">▸ 想约 30 分钟会议把响应结构定下来。</div>
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
        <div class="email-digest-mock__row-subject">每日更新：Anthropic 与 agent stack</div>
        <div class="email-digest-mock__row-summary">▸ 可略读；无需行动；归到「稍后看」。</div>
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
        <div class="email-digest-mock__row-subject">提醒：明天和 Sam 的 1:1</div>
        <div class="email-digest-mock__row-summary">▸ 日历里已有；自动归为 Junk。</div>
        <span class="email-digest-mock__bucket email-digest-mock__bucket--junk">JUNK</span>
      </div>
    </div>
  </div>
  <div class="email-digest-mock__detail">
    <div class="email-digest-mock__detail-meta">
      <div class="email-digest-mock__detail-from">Lina Park &lt;lina@studio.co&gt;</div>
      <div class="email-digest-mock__detail-subject">Sprint review 改到周四</div>
      <div class="email-digest-mock__detail-time">今天，10:32</div>
    </div>
    <div class="email-digest-mock__detail-body">
      <p>嘿，周三的工程评审跟董事会准备撞了，所以 sprint review 推到 <b>周四下午 3 点</b>，同一间会议室。这个时间能行吗？不行的话我周五早上找个 30 分钟的空档。</p>
    </div>
    <div class="email-digest-mock__detail-draft">
      <div class="email-digest-mock__detail-draft-label">AI 草稿回信</div>
      <p>周四 3 点可以，我把下午的块挪一下。除了 sprint deck 之外还要带什么吗？</p>
      <div class="email-digest-mock__detail-draft-actions">
        <span class="email-digest-mock__btn email-digest-mock__btn--primary">在 Gmail 中打开</span>
        <span class="email-digest-mock__btn">编辑</span>
        <span class="email-digest-mock__btn email-digest-mock__btn--ghost">丢弃</span>
      </div>
    </div>
  </div>
</div>

*FIG.01：每个会话都带一句 AI 摘要，让我能跳过 80% 不打开的邮件。分屏 tab 按紧急程度路由。右栏预览正文，并在 LLM 觉得需要时给出一份草稿。草稿永远不自动发；点击会作为 Gmail 草稿打开。*

分类层做的活比视觉显示出来的要多。每条会话进来时先过一个 4-bucket 分类器（Primary、Track、News、Junk），再单独打一个紧急程度标签（urgent、action、FYI、low），后者用来路由到分屏 tab。分类器到目前为止处理过 281 封邮件，我显式纠正过 bucket 的有 2 封。这是 0.7% 的人工纠正率，是「我必须出手介入」的频率，不是模型的真实准确率（我并不会逮到每一次错分，特别是 FYI 长尾）。但方向性信号是：在列表层级上分类器值得信任，只在右栏看着不对劲时再回头查一查。

<div class="email-digest-mock email-digest-mock--card" aria-label="单条邮件卡片放大">
  <div class="email-digest-mock__row email-digest-mock__row--zoom">
    <span class="email-digest-mock__dot email-digest-mock__dot--urgent"></span>
    <div class="email-digest-mock__row-main">
      <div class="email-digest-mock__row-head">
        <span class="email-digest-mock__row-from">Marco Reyes</span>
        <span class="email-digest-mock__row-time">周二 4:12pm</span>
      </div>
      <div class="email-digest-mock__row-subject">Re: API 契约问题</div>
      <div class="email-digest-mock__row-summary">▸ 想本周约 30 分钟把响应结构和错误信封定下来。</div>
      <div class="email-digest-mock__row-meta">
        <span class="email-digest-mock__bucket email-digest-mock__bucket--primary">PRIMARY</span>
        <span class="email-digest-mock__chip email-digest-mock__chip--action">action</span>
        <span class="email-digest-mock__chip email-digest-mock__chip--mention">2 mentions</span>
      </div>
    </div>
  </div>
</div>

*FIG.02：单张卡片。bucket 是 LLM 给的分类；chip 是单封邮件的紧急度；mentions 是会话深度。摘要是 LLM 在分类的同时一并产出的一行，不是另一次调用。*

Ask AI 这条入口处理那些「单条会话回答不了」的查询。「我这周有什么 deadline」就是那个典型问题。没有它，我就得翻三周的标题行去找日期词。有它，agent 通过 RAG 检索相关 chunk，返回一个有引用的 grounded 列表。

<div class="email-digest-mock email-digest-mock--ask" aria-label="Ask AI 对话 mockup">
  <div class="email-digest-mock__chat-header">Ask AI · 在我的收件箱上做 agentic RAG</div>
  <div class="email-digest-mock__chat-msg email-digest-mock__chat-msg--user">
    我这周有什么 deadline？
  </div>
  <div class="email-digest-mock__chat-msg email-digest-mock__chat-msg--ai">
    <p>过去 7 天的邮件里浮现出三个 deadline：</p>
    <ol>
      <li><b>周四 3pm</b> · 跟 Lina 的 sprint review <span class="email-digest-mock__chat-cite">[#a4f1]</span></li>
      <li><b>周五 EOD</b> · 跟 Marco 的 API 契约定稿 <span class="email-digest-mock__chat-cite">[#7c2e]</span></li>
      <li><b>周日 23:59</b> · Vercel team 计划自动续费 <span class="email-digest-mock__chat-cite">[#9b18]</span></li>
    </ol>
    <p class="email-digest-mock__chat-meta">基于 3 封邮件 grounding。点任意 [#id] 打开来源会话。</p>
  </div>
</div>

*FIG.03：Ask AI 通过 Sonnet 在收件箱上跑一轮 agentic RAG。回答带上邮件 ID 引用，让答案可验证，而不是一份幻觉日历。*

第四块是日历抽取。大多数 deadline 藏在段落里（「这个我们周五 EOD 之前要」），大多数日历工具找不到它们。分类器看到日期短语时会建议一张日历卡片，一键确认放进日历条上。

<div class="email-digest-mock email-digest-mock--cal" aria-label="日历事件抽取 mockup">
  <div class="email-digest-mock__cal-source">
    <div class="email-digest-mock__cal-from">Lina Park · 10:32</div>
    <div class="email-digest-mock__cal-text">「……sprint review 推到 <b>周四下午 3 点</b>。同一间会议室。」</div>
  </div>
  <div class="email-digest-mock__cal-arrow">→</div>
  <div class="email-digest-mock__cal-tile">
    <div class="email-digest-mock__cal-tile-day">周四</div>
    <div class="email-digest-mock__cal-tile-time">3:00 至 4:00 pm</div>
    <div class="email-digest-mock__cal-tile-title">Sprint review</div>
    <div class="email-digest-mock__cal-tile-source">从 Lina 的回信中抽取</div>
  </div>
</div>

*FIG.04：正文里的日期和会议时间会自动拉进日历视图；deadline 不再藏在会话里。*

抽取只是日历这条故事的一半。另一半是 `/calendar` 上的真实日历视图：一张 FullCalendar 网格，向后看半年、向前看 30 天，范围限定在分类器从 Primary 和 Track 会话里刮出来的事件。每张瓦片保留指向源邮件的反向引用，所以两周后我看到「sprint review 周四 3 点」时真正想问的那个问题（「这是哪来的」）只在一次点击之外。扫描是按需的：我按一下按钮，LLM 处理最近未处理的那一批，新瓦片就出现。

<div class="email-digest-mock email-digest-mock--week" aria-label="日历周视图 mockup">
  <div class="email-digest-mock__week-head">
    <div class="email-digest-mock__week-title">4 月 28 日 至 5 月 2 日</div>
    <div class="email-digest-mock__week-actions">
      <span class="email-digest-mock__btn email-digest-mock__btn--primary">扫描收件箱</span>
      <span class="email-digest-mock__btn">今天</span>
    </div>
  </div>
  <div class="email-digest-mock__week-grid">
    <div class="email-digest-mock__week-day">
      <div class="email-digest-mock__week-day-head"><b>一</b> 28</div>
      <div class="email-digest-mock__week-evt email-digest-mock__week-evt--meeting">
        <div class="email-digest-mock__week-evt-time">10:00</div>
        <div class="email-digest-mock__week-evt-title">跟 Sam 的 1:1</div>
        <div class="email-digest-mock__week-evt-src">↩ Calendly 邀请</div>
      </div>
    </div>
    <div class="email-digest-mock__week-day">
      <div class="email-digest-mock__week-day-head"><b>二</b> 29</div>
      <div class="email-digest-mock__week-evt email-digest-mock__week-evt--deadline">
        <div class="email-digest-mock__week-evt-time">EOD</div>
        <div class="email-digest-mock__week-evt-title">提交 Q2 OKR</div>
        <div class="email-digest-mock__week-evt-src">↩ Lina, 4 月 24 日</div>
      </div>
    </div>
    <div class="email-digest-mock__week-day email-digest-mock__week-day--today">
      <div class="email-digest-mock__week-day-head"><b>三</b> 30</div>
    </div>
    <div class="email-digest-mock__week-day">
      <div class="email-digest-mock__week-day-head"><b>四</b> 1</div>
      <div class="email-digest-mock__week-evt email-digest-mock__week-evt--meeting">
        <div class="email-digest-mock__week-evt-time">15:00</div>
        <div class="email-digest-mock__week-evt-title">Sprint review</div>
        <div class="email-digest-mock__week-evt-src">↩ Lina, 今天</div>
      </div>
    </div>
    <div class="email-digest-mock__week-day">
      <div class="email-digest-mock__week-day-head"><b>五</b> 2</div>
      <div class="email-digest-mock__week-evt email-digest-mock__week-evt--deadline">
        <div class="email-digest-mock__week-evt-time">EOD</div>
        <div class="email-digest-mock__week-evt-title">API 契约定稿</div>
        <div class="email-digest-mock__week-evt-src">↩ Marco, 4 月 26 日</div>
      </div>
      <div class="email-digest-mock__week-evt email-digest-mock__week-evt--info">
        <div class="email-digest-mock__week-evt-time">23:59</div>
        <div class="email-digest-mock__week-evt-title">Vercel team 续费</div>
        <div class="email-digest-mock__week-evt-src">↩ no-reply@vercel</div>
      </div>
    </div>
  </div>
</div>

*FIG.05：日历视图的一段切片。每张瓦片保留一个会话引用（`↩ source`），原始邮件离一次点击。今天那一格暗色，是因为还没抽到事件。*

求职板是第二个专门视图。求职邮件像 newsletter 一样吵，但跟 newsletter 不同，它有状态：投递、已读回执、已约面、面完、offer、关闭。分类器把求职邮件按公司加岗位做主键归到「应聘」上，从邮件内容里检测阶段切换（一句「我们想约个电话」会让卡片向右移动），并且让我覆写任何自动决定，因为只要遇过一次招聘者写出来让模型读错的句子，就值得保留这个开关。卡片携带公司、岗位、最新阶段、可选的 deadline 倒数、优先级 chip（玫红表示「极高」一直到锌灰表示低）、以及当最近一封邮件请求回复或日期时的「需要行动」指示。当同一招聘者把一份应聘拆到两个会话里时，合并两张卡片是一次点击。

<div class="email-digest-mock email-digest-mock--jobs" aria-label="求职板看板 mockup">
  <div class="email-digest-mock__kanban">
    <div class="email-digest-mock__kcol email-digest-mock__kcol--applied">
      <div class="email-digest-mock__kcol-head"><span>已投递</span><b>4</b></div>
      <div class="email-digest-mock__job-card">
        <div class="email-digest-mock__job-co">FabFitFun</div>
        <div class="email-digest-mock__job-role">AI Solutions Architect</div>
        <div class="email-digest-mock__job-meta">
          <span class="email-digest-mock__job-pri email-digest-mock__job-pri--medium">中</span>
          <span class="email-digest-mock__job-time">3 天前</span>
        </div>
      </div>
      <div class="email-digest-mock__job-card">
        <div class="email-digest-mock__job-co">Origence</div>
        <div class="email-digest-mock__job-role">AI Solution Architect</div>
        <div class="email-digest-mock__job-meta">
          <span class="email-digest-mock__job-pri email-digest-mock__job-pri--high">高</span>
          <span class="email-digest-mock__job-time">5 天前</span>
        </div>
      </div>
    </div>
    <div class="email-digest-mock__kcol email-digest-mock__kcol--ack">
      <div class="email-digest-mock__kcol-head"><span>已读回执</span><b>2</b></div>
      <div class="email-digest-mock__job-card">
        <div class="email-digest-mock__job-co">Whip Media</div>
        <div class="email-digest-mock__job-role">Jr. AI Developer</div>
        <div class="email-digest-mock__job-meta">
          <span class="email-digest-mock__job-pri email-digest-mock__job-pri--high">高</span>
          <span class="email-digest-mock__job-time">2 天前</span>
        </div>
      </div>
    </div>
    <div class="email-digest-mock__kcol email-digest-mock__kcol--int">
      <div class="email-digest-mock__kcol-head"><span>面试中</span><b>2</b></div>
      <div class="email-digest-mock__job-card email-digest-mock__job-card--action">
        <div class="email-digest-mock__job-co">Snowball</div>
        <div class="email-digest-mock__job-role">AI Developer (Agentic)</div>
        <div class="email-digest-mock__job-meta">
          <span class="email-digest-mock__job-pri email-digest-mock__job-pri--xhigh">极高</span>
          <span class="email-digest-mock__job-action">需要回复</span>
        </div>
      </div>
    </div>
    <div class="email-digest-mock__kcol email-digest-mock__kcol--done">
      <div class="email-digest-mock__kcol-head"><span>已面试</span><b>1</b></div>
      <div class="email-digest-mock__job-card">
        <div class="email-digest-mock__job-co">Tapio</div>
        <div class="email-digest-mock__job-role">AI Workflow Architect</div>
        <div class="email-digest-mock__job-meta">
          <span class="email-digest-mock__job-pri email-digest-mock__job-pri--medium">中</span>
          <span class="email-digest-mock__job-time">等待</span>
        </div>
      </div>
    </div>
    <div class="email-digest-mock__kcol email-digest-mock__kcol--offer">
      <div class="email-digest-mock__kcol-head"><span>OFFER</span><b>0</b></div>
      <div class="email-digest-mock__kcol-empty">· 暂无 ·</div>
    </div>
    <div class="email-digest-mock__kcol email-digest-mock__kcol--closed">
      <div class="email-digest-mock__kcol-head"><span>已关闭</span><b>3</b></div>
      <div class="email-digest-mock__job-card email-digest-mock__job-card--muted">
        <div class="email-digest-mock__job-co">Google</div>
        <div class="email-digest-mock__job-role">Customer Engineer, Cloud AI</div>
        <div class="email-digest-mock__job-meta">
          <span class="email-digest-mock__job-pri email-digest-mock__job-pri--low">已拒</span>
        </div>
      </div>
    </div>
  </div>
</div>

*FIG.06：应聘看板。列是阶段；chip 是优先级；卡片把同一公司加岗位下的多封邮件折叠成一个应聘对象，让收件箱不必承载这件事。*

这些表面后面那条流水线，本来在每个 prefetch 周期里要吃掉三次 Sonnet spawn：新邮件分类（Step 2b）、对求职板做疑似工作会话的二次确认（Step 3）、过期的 dashboard briefing 刷新（Step 4）。线上日均 150 到 300 次 Anthropic 线程，绝大部分来自这一圈循环。三步共享输入、共享 Sonnet、产出 JSON 且没有下游副作用。把它们当独立 spawn 跑久了攒到一份基线之后，我把它们合成一次。

两个看起来诱人的替代方案在我把数学画出来时输了。用 `--resume` 在 spawn 之间复用一个 Claude CLI 会话 ID，每次调用都把整个 jsonl 历史回放成 messages，而 prefetch 的几个任务彼此没有可摊销的语义连续性：input token 大致涨到三倍，prompt cache 又是凉的，因为 5 分钟 cache TTL 比 1 到 3 小时的 prefetch 间隔短。在循环上做时间 debounce 把邮件批次合并能省每天几次 spawn，但给用户面前的列表加上最多 5 分钟分类延迟，是个错的旋钮。把三段 prompt 合成一次 spawn 是唯一在我关心的每条轴上都赢的路径。

```text
                  3 spawns    merged    delta
total latency        46.9s     36.3s    -23%
spawns / cycle           3         1    -67%
cache create        23,033     8,429    -63%
cache read          19,032     9,516    -50%
cost / cycle       $0.1199   $0.0677    -44%
```

*FIG.07：5 封真实邮件、同一个 Sonnet 模型、同一份 JSON 形状；成本不到一半。分类器和工作会话二次确认对 5 个样本与 3-spawn 基线 5/5 一致；briefing 反而更精确，因为合并调用是在它当下刚算出来的分类上做归组，而不是 DB 里上一轮残留的分类。*

合并那条路径背后挂了三道护栏。spawn 用 `--system-prompt` 完全替换 Claude Code 的默认 prompt，绝不用 `--append-system-prompt`，因为 append 会把默认那段「coding assistant」前导留在严格 JSON schema 之前，把它稀释（`daily-digest.ts:282` 行就有一条针对这个失败模式的注释）。parser 对每个顶层 key（`classifications`、`jobs`、`briefings`）独立处理：拿到的 key 写下来、缺的 key 留给下一次 prefetch 重试，因为触发条件（`needsLLM`、`maybe_work` 队列、stale briefing）依然成立。当合并 prompt 的用户内容超过 100K 字符（约 25K token）时，流水线 fallback 回原本的三 spawn 路径；`classifyEmailsWithLLM`、`drainMaybeWorkQueue`、`refreshStaleBriefings` 留着既是为这条 fallback，也是为那些 caller 触发的流，比如 `forceClassifyAsJob`（在某条会话上右键强制归到求职）和 Ask AI（这条故意保留一个真正的 `--resume` 聊天会话，因为它本质上就是对话式的）。

在真邮箱上跑了三周，每天总开销稳在 15 分钟左右：早上读 3 分钟、中午 3 分钟、晚上 3 分钟，外加每段 2 分钟用来发和回。每周 80 到 140 条会话过分类器；我手工纠正其中 0.7%。日历视图把「那条 deadline 是什么时候」变成一次点击；求职板把求职邮箱从一条流变成一条被跟踪的管线。

部署 URL 是私有的，仅限我自己账户。如果想看演示，问我。
