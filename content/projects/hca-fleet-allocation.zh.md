## TL;DL

这是我在 UCI capstone 里为 Hyundai Capital America 做的三个月项目。我担任 project manager 和 technical lead。我们做了 FaaS AI，一个面向 HCA Fleet-as-a-Service 团队的车辆分配工具。它帮助运营人员判断停场车辆下一步应该流向哪里，对比最近经销商路线和优化分配结果，允许人手工覆盖建议，并用 agent 解释 tradeoff 或提出 reroute。

结果是可验证的。我们向 HCA 做了 live demo，拿到本专业年度 Best Capstone，并交付了一套可以部署的包，包括 data spec、scoring notes、benchmark evidence 和 installation docs。因为这是 client-sponsored project，我在这里对 exact batch size、model parameter 和 dollar assumption 做脱敏处理；页面保留 validation structure、baseline comparison 和 directional business impact。感谢 UCI 提供 capstone 机制，也感谢 Hyundai Capital America 的 business、mobility、data science、operations stakeholder 给出问题、反馈和最终展示机会。

<section class="hca-viz hca-impact" aria-label="HCA project impact summary">
  <div class="hca-impact__item hca-impact__item--lead">
    <span class="hca-impact__label">Recognition</span>
    <strong>Best Capstone</strong>
  </div>
  <div class="hca-impact__item">
    <span class="hca-impact__label">My role</span>
    <strong>PM + Tech Lead</strong>
  </div>
  <div class="hca-impact__item">
    <span class="hca-impact__label">Team</span>
    <strong>5 people</strong>
  </div>
  <div class="hca-impact__item">
    <span class="hca-impact__label">Validation data</span>
    <strong>HCA synthetic replay</strong>
  </div>
  <div class="hca-impact__item">
    <span class="hca-impact__label">Routing result</span>
    <strong>Better-ranked route mix</strong>
  </div>
  <div class="hca-impact__item">
    <span class="hca-impact__label">Annual tax estimate</span>
    <strong>~$300K/year lower</strong>
  </div>
</section>

*FIG.01：奖项、角色、验证来源和业务影响。Benchmark figures 使用 HCA-sponsored synthetic data；operating assumptions 已泛化。*

## 问题

HCA 需要决定停场车辆应该流向经销商网络里的哪个地点。最简单的答案是“送到最近的 dealer”。这个规则容易解释，但它忽略了 utilization、rented demand、dealer capacity、distance 和 property tax。更远的 dealer 可能因为需求更强或税务暴露更低而更合适。已经满容量的 dealer 应该阻止手工分配，除非未来 waitlist 信号证明它值得提前补车。

业务目标很清楚，但可用数据并不完美。HCA 没有提供两个能闭合真实美元利润公式的输入：每车每月租金收入、每英里承运成本。我把这件事当成产品约束，而不是脚注。页面和 dashboard 都避免 fake-dollar KPI，改用 rank、method comparison 和 benchmark evidence。

## 我们做了什么

<section class="hca-viz hca-agent-loop" aria-label="Agentic allocation decision loop">
  <div class="hca-loop__center">
    <span class="hca-loop__kicker">Agentic AI</span>
    <strong>Human-in-the-loop allocation agent</strong>
    <span>读取 allocation state，提出 reroute，等待 operator approval。</span>
  </div>
  <ol class="hca-loop__steps">
    <li>
      <span>01</span>
      <strong>Allocation state</strong>
      <small>已选车辆、dealer capacity、solver output、manual overrides。</small>
    </li>
    <li>
      <span>02</span>
      <strong>Context check</strong>
      <small>约束请求、受影响车辆、当前方法、dealer status。</small>
    </li>
    <li>
      <span>03</span>
      <strong>Reroute proposal</strong>
      <small>替代 dealer、tradeoff reason、capacity warning。</small>
    </li>
    <li>
      <span>04</span>
      <strong>Human approval</strong>
      <small>应用 suggestion，拒绝 suggestion，或保留 solver recommendation。</small>
    </li>
  </ol>
</section>

*FIG.02：Allocation state 从 solver output 进入 agent recommendation，再到 operator approval。Agent 可以建议 reroute，但 approval 留给用户。*

<section class="hca-viz hca-workflow" aria-label="Four screen product workflow">
  <article>
    <span>Home</span>
    <strong>Executive summary</strong>
    <i></i><i></i><i></i>
  </article>
  <article>
    <span>Fleet Inventory</span>
    <strong>Select grounded vehicles</strong>
    <i></i><i></i><i></i>
  </article>
  <article class="hca-workflow__focus">
    <span>Weekly Allocation</span>
    <strong>Compare methods and override</strong>
    <i></i><i></i><i></i>
  </article>
  <article>
    <span>Batch Overview</span>
    <strong>Confirm routes and load</strong>
    <i></i><i></i><i></i>
  </article>
</section>

*FIG.03：产品范围覆盖 dashboard review、weekly allocation、agent reroute 和 handoff materials。*

<section class="hca-viz hca-ui hca-ui-results" aria-label="Reconstructed allocation result UI">
  <div class="hca-ui__chrome">
    <span></span><span></span><span></span>
    <strong>Weekly Allocation</strong>
  </div>
  <div class="hca-ui__toolbar">
    <div>
      <span class="hca-ui__label">Algorithm</span>
      <span class="hca-ui__pill hca-ui__pill--active">Bucket ILP</span>
      <span class="hca-ui__pill">Additive ILP</span>
      <span class="hca-ui__pill">Nearest dealer</span>
    </div>
    <span class="hca-ui__pill hca-ui__pill--warn">Synthetic batch</span>
  </div>
  <div class="hca-ui__kpis">
    <div><span>Assigned</span><strong>All selected</strong></div>
    <div><span>Rank-1</span><strong>Majority</strong></div>
    <div><span>Distance</span><strong>Controlled tradeoff</strong></div>
    <div><span>Tax exposure</span><strong>Lower estimate</strong></div>
  </div>
  <div class="hca-ui__table">
    <div class="hca-ui__row hca-ui__row--head">
      <span>Vehicle group</span><span>Source</span><span>Recommendation</span><span>Choice</span>
    </div>
    <div class="hca-ui__row">
      <span>Selected vehicles</span><span>Grounding area A</span><span>Dealer group B</span><span class="hca-rank">Rank 1</span>
    </div>
    <div class="hca-ui__row">
      <span>Capacity-sensitive group</span><span>Grounding area C</span><span>Dealer group D</span><span class="hca-rank hca-rank--alt">Rank 2</span>
    </div>
    <div class="hca-ui__row hca-ui__row--note">
      <span>Capacity warning</span><span>一个 dealer 接近 slot limit，需要 operator 在确认前复核。</span>
    </div>
  </div>
</section>

*FIG.04：复现的 allocation result table，包含 algorithm modes、ranked dealer choices 和 capacity notes。Values 为 synthetic，labels 已泛化。*

<section class="hca-viz hca-ui hca-ui-agent" aria-label="Reconstructed agentic dialog UI">
  <div class="hca-ui__chrome">
    <span></span><span></span><span></span>
    <strong>Allocation Agent</strong>
  </div>
  <div class="hca-chat">
    <div class="hca-chat__bubble hca-chat__bubble--user">
      Avoid a restricted destination state for this batch.
    </div>
    <div class="hca-chat__bubble hca-chat__bubble--agent">
      I found affected vehicles in the current allocation state. Two recommendations should be rerouted before confirmation.
    </div>
    <div class="hca-agent-card">
      <span class="hca-ui__label">Suggested action</span>
      <strong>Apply alternate dealer group</strong>
      <small>Reason: preserves capacity guardrail while keeping the assignment within the optimized candidate set.</small>
    </div>
    <div class="hca-chat__actions">
      <span>Apply suggestion</span>
      <span>Keep current route</span>
    </div>
  </div>
</section>

*FIG.05：复现的 agent panel，展示 restricted-destination reroute。Vehicle 和 dealer labels 已泛化。*

Agent 拿到的是 allocation state：已选车辆、当前方法、最新 solver output、manual overrides、dealer status。Live demo 里我让它避开一个受限目的州。它找出受影响车辆，提出替代目的地，并允许我点击 suggestion 应用，而不是逐行手改。

## 我负责的关键决策

我大部分时间花在把技术 optimizer 变成业务用户可以相信的产品。最重要的产品决策是保留 baseline。Nearest-dealer baseline 给 HCA 一个熟悉的对照点，ILP 和 bucket mode 则把 tradeoff 展开。我也没有把 chat 放在 Home 页面，因为 executive summary 不应该在 agent 建立信任前引导开放式提问。

<section class="hca-viz hca-tool-trace" aria-label="Agent tool-call trace for reroute approval">
  <div class="hca-tool-trace__header">
    <span>agent.run</span>
    <strong>restricted_destination_reroute</strong>
  </div>
  <div class="hca-tool-trace__grid">
    <article class="hca-tool-trace__node hca-tool-trace__node--intent">
      <span>User intent</span>
      <strong>avoid restricted state</strong>
    </article>
    <article class="hca-tool-trace__node hca-tool-trace__node--context">
      <span>Context bundle</span>
      <code>selected_vins</code>
      <code>solver_result</code>
      <code>dealer_capacity</code>
      <code>current_allocations</code>
    </article>
    <article class="hca-tool-trace__runtime">
      <span>Agent runtime</span>
      <strong>tool-calling boundary</strong>
      <small>read tools + planning tools + gated mutation</small>
    </article>
    <article class="hca-tool-trace__node hca-tool-trace__node--calls">
      <span>Bounded tool calls</span>
      <code>get_allocation_state()</code>
      <code>check_destination_rules()</code>
      <code>rank_reroute_candidates()</code>
      <code>stage_allocation_patch()</code>
    </article>
    <article class="hca-tool-trace__node hca-tool-trace__node--gate">
      <span>Approval gate</span>
      <strong>operator reviews diff</strong>
    </article>
    <article class="hca-tool-trace__node hca-tool-trace__node--patch">
      <span>Assignment patch</span>
      <code>dealer_A -> dealer_B</code>
    </article>
  </div>
</section>

*FIG.06：Restricted-destination reroute 的 agent tool-call trace。Agent 读取 allocation context，调用 bounded tools，stage assignment patch，并在 mutation 前要求 operator approval。*

Score 表层也必须诚实。Raw score 不是美元，也不能跨车辆比较。Los Angeles 的车和 Miami 的车面对的是不同 dealer network，所以我使用 rank 和 method comparison，而不是把每个 score 包装成 finance KPI。HCA 工程团队也需要 data contract，因此 handoff 明确标出 synthetic input，以及将来用真实运营数据替换它们的路径。

## 证据和交付

最终 benchmark 使用 HCA-sponsored synthetic data，覆盖 repeated batch tests。和 nearest-dealer baseline 相比，optimized allocation 让 benchmark objective 出现 double-digit improvement，并降低 estimated tax exposure。Synthetic tests 里的 annualized tax-exposure reduction 是 six-figure range。我在这里对 exact batch size、model weight 和 dollar assumption 做脱敏处理，因为项目由 client sponsor；真正重要的 evidence 是 validation structure、baseline comparison 和 directional business impact。

Handoff 和 demo 一样重要。我们交付了可部署 app、documentation、scoring notes、data source spec、validation CSVs 和 setup scripts。HCA stakeholder 立刻开始讨论 waitlist、real-time utilization、remarketing、pricing、insurance、title、registration、更多 OEM-approved use case。这是最强的信号：对话已经从“它能不能工作”变成“下一步该接入什么参数”。
