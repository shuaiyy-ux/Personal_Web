## TL;DL

I was the project manager and technical lead for a three-month UCI capstone with Hyundai Capital America. We built FaaS AI, a working vehicle allocation tool for HCA's Fleet-as-a-Service team. The product helps operators choose where grounded vehicles should move next, compares nearest-dealer routing against optimized allocation, lets a human override the recommendation, and uses an agent to explain tradeoffs or propose reroutes.

The outcome was concrete. We presented a live demo to HCA, won Best Capstone for the year in our program, and handed over a deployable package with data specs, scoring notes, benchmark evidence, and installation docs. Because this was a client-sponsored project, I generalize exact batch sizes, model parameters, and dollar assumptions for confidentiality; the page keeps the validation structure, baseline comparison, and directional business impact. Thank you to UCI for the capstone structure, and to Hyundai Capital America, especially the business, mobility, data science, and operations stakeholders who gave us the problem, feedback, and presentation time.

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

*FIG.01: Award, role, validation source, and business impact. The benchmark figures use HCA-sponsored synthetic data; operating assumptions are generalized.*

## The Problem

HCA needs to decide where grounded vehicles should go across a dealer network. The simple answer is "send the car to the closest dealer." That is easy to explain, but it ignores utilization, rented demand, dealer capacity, distance, and property tax. A farther dealer can be the better destination if it has stronger demand or lower tax exposure. A dealer at capacity should block manual assignment unless a future waitlist signal justifies seeding inventory.

The business goal was clear. The available data was not perfect. HCA did not provide two inputs that would close a true dollar-profit formula: rental revenue per car per month and carrier cost per mile. I treated that as a product constraint, not a footnote. The page and dashboard avoid fake-dollar KPIs and use rank, comparison, and method-level evidence instead.

## What We Built

<section class="hca-viz hca-agent-loop" aria-label="Agentic allocation decision loop">
  <div class="hca-loop__center">
    <span class="hca-loop__kicker">Agentic AI</span>
    <strong>Human-in-the-loop allocation agent</strong>
    <span>Reads allocation state, proposes reroutes, waits for operator approval.</span>
  </div>
  <ol class="hca-loop__steps">
    <li>
      <span>01</span>
      <strong>Allocation state</strong>
      <small>Selected vehicles, dealer capacity, solver output, manual overrides.</small>
    </li>
    <li>
      <span>02</span>
      <strong>Context check</strong>
      <small>Constraint request, affected vehicles, current method, dealer status.</small>
    </li>
    <li>
      <span>03</span>
      <strong>Reroute proposal</strong>
      <small>Alternate dealers with tradeoff reason and capacity warning.</small>
    </li>
    <li>
      <span>04</span>
      <strong>Human approval</strong>
      <small>Apply suggestion, reject it, or keep the solver recommendation.</small>
    </li>
  </ol>
</section>

*FIG.02: Allocation state moves from solver output to agent recommendation to operator approval. The agent can suggest reroutes, but approval stays with the user.*

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

*FIG.03: Product scope across dashboard review, weekly allocation, agent reroute, and handoff materials.*

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
      <span>Capacity warning</span><span>One dealer is near its slot limit; operator review required before confirmation.</span>
    </div>
  </div>
</section>

*FIG.04: Recreated allocation result table with algorithm modes, ranked dealer choices, and capacity notes. Values are synthetic and labels are generalized.*

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

*FIG.05: Recreated agent panel for a restricted-destination reroute. Vehicle and dealer labels are generalized.*

The agent had context from the allocation state: selected vehicles, current method, latest solver output, manual overrides, and dealer status. In the live demo I asked it to avoid a restricted destination state. It identified affected cars, proposed alternate destinations, and let me apply those suggestions instead of manually editing each row.

## Decisions I Owned

I spent most of my time turning a technical optimizer into a product that business users could trust. The largest product decision was keeping the baseline visible. The nearest-dealer baseline gave HCA a familiar reference point, while ILP and bucket mode made the tradeoff more explicit. I also kept chat off the Home page because an executive summary should not invite open-ended questions before the agent earns trust.

<section class="hca-viz hca-tradeoff" aria-label="Allocation method tradeoff matrix">
  <div class="hca-tradeoff__header"></div>
  <div class="hca-tradeoff__header">Nearest dealer</div>
  <div class="hca-tradeoff__header">ILP</div>
  <div class="hca-tradeoff__header">Agent</div>
  <div class="hca-tradeoff__header">Human override</div>

  <div class="hca-tradeoff__axis">Distance</div>
  <div class="hca-dot hca-dot--strong"></div>
  <div class="hca-dot hca-dot--strong"></div>
  <div class="hca-dot hca-dot--medium"></div>
  <div class="hca-dot hca-dot--medium"></div>

  <div class="hca-tradeoff__axis">Demand</div>
  <div class="hca-dot hca-dot--weak"></div>
  <div class="hca-dot hca-dot--strong"></div>
  <div class="hca-dot hca-dot--medium"></div>
  <div class="hca-dot hca-dot--weak"></div>

  <div class="hca-tradeoff__axis">Utilization</div>
  <div class="hca-dot hca-dot--weak"></div>
  <div class="hca-dot hca-dot--strong"></div>
  <div class="hca-dot hca-dot--medium"></div>
  <div class="hca-dot hca-dot--weak"></div>

  <div class="hca-tradeoff__axis">Capacity</div>
  <div class="hca-dot hca-dot--weak"></div>
  <div class="hca-dot hca-dot--strong"></div>
  <div class="hca-dot hca-dot--strong"></div>
  <div class="hca-dot hca-dot--strong"></div>

  <div class="hca-tradeoff__axis">Tax exposure</div>
  <div class="hca-dot hca-dot--weak"></div>
  <div class="hca-dot hca-dot--strong"></div>
  <div class="hca-dot hca-dot--medium"></div>
  <div class="hca-dot hca-dot--weak"></div>

  <div class="hca-tradeoff__axis">Business constraint</div>
  <div class="hca-dot hca-dot--none"></div>
  <div class="hca-dot hca-dot--medium"></div>
  <div class="hca-dot hca-dot--strong"></div>
  <div class="hca-dot hca-dot--strong"></div>
</section>

*FIG.06: Decision responsibility by method. Nearest dealer covers proximity, ILP handles optimization signals, the agent handles exception reroutes, and the operator approves.*

The score surface also had to be honest. Raw score is not dollars and cannot be compared across vehicles. A Los Angeles car and a Miami car face different dealer networks, so I used rank and method comparison instead of pretending every score was a finance KPI. HCA engineering also needed a data contract, so the handoff named the synthetic inputs and the path for replacing them with real operational data.

## Evidence and Handoff

The final benchmark used HCA-sponsored synthetic data across repeated batch tests. Compared with the nearest-dealer baseline, optimized allocation produced a double-digit improvement in the benchmark objective and lowered estimated tax exposure. The annualized tax-exposure reduction was in the six-figure range in the synthetic tests. I keep the exact batch sizes, model weights, and dollar assumptions generalized because the project was client-sponsored; the important evidence is the validation structure, baseline comparison, and directional business impact.

The handoff package mattered as much as the demo. We delivered a deployable app, documentation, scoring notes, a data source spec, validation CSVs, and setup scripts. HCA stakeholders immediately discussed extensions into waitlists, real-time utilization, remarketing, pricing, insurance, title, registration, and other OEM-approved use cases. That was the strongest signal that the product was framed correctly: the conversation moved from "does this work" to "what should we plug in next."
