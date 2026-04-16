# Blog Plan — 2026-04-16 → 2026-05-16

按项目 group，每周 1-2 篇，素材全部来自 `~/Downloads/claude-knowledge/registry.md`。

---

## Week 1 — 本站 / 开发流程 (04/16–04/23)

### Post 1: 用 sync-docs 把 311 个 MD 变成一个知识库 ⭐ 开篇
- **Slug**: `sync-docs-knowledge-base`
- **素材**: `~/.claude/commands/sync-docs.md`、`claude-knowledge/registry.md`、`CLAUDE-TEMPLATE.md`、`hashes.json`
- **角度**: 为什么做、10 步扫描算法、去重/分类逻辑、同名不同内容、过期检测、最终输出长啥样
- **Tags**: `tooling`, `claude-code`, `knowledge-base`

---

## Week 2 — Pixel_video / couple_rate (04/23–04/30)

### Post 2: 做一个 iOS 情侣评分 App 踩的 7 个坑
- **Slug**: `swiftui-animation-7-bugs`
- **素材**: `Pixel_video/experience/01..07`、`avoid-bugs.md`、`7in7_architecture_requirements.md`
- **角度**: 项目背景 → 7 个 bug 串成故事 → SwiftUI + Timer + Haptic 的并发坑
- **Tags**: `iOS`, `SwiftUI`, `project-log`

---

## Week 3 — clawapp / Hive (04/30–05/07)

### Post 3: Hive — 从 0 到 1 做一个 Agent 平台
- **Slug**: `hive-agent-platform`
- **素材**: `Hive_Product_Spec_v3.md`、`tech-spec.md`、`usecase.md`、`user_journey_ideal.md`、`ROADMAP.md`、`nemoclaw_integration_logic.md`
- **角度**: 产品视角 — 为什么做、架构选型、核心 use case
- **Tags**: `product`, `agents`, `architecture`

### Post 4: Hive 后端踩坑合集
- **Slug**: `hive-backend-lessons`
- **素材**: `backend-deployment-lessons.md`、`postgresql-enum-migration.md`、`sqlalchemy-async-pitfalls.md`、`websocket-realtime-verification.md`、`prompt-based-tool-calling.md`、`cli-proxy-inference.md`、`agent-evaluation-architecture.md`
- **角度**: 工程视角 — 同一个项目的 6-7 个坑
- **Tags**: `backend`, `agents`, `debugging`

---

## Week 4 — CM-social-platforms (05/07–05/16)

### Post 5: 多平台视频分发系统 — 抖音 / 小红书 / B 站 / 快手
- **Slug**: `multi-platform-video-distribution`
- **素材**: `product-vision.md`、4 个平台的 `cli-contract.md` + `SKILL.md`、`2026-03-25-browser-cli-unification-design.md`、`persona.md`
- **角度**: 产品愿景 → CLI 统一设计 → 分平台对接 → 人设运营
- **Tags**: `automation`, `CLI`, `social-media`

---

## 后续 Pipeline (5 月下旬起可接)

- **Vigil** — 多 Session Agent 编排
- **Cortex / PACT** — Agent Mesh 产品复盘
- **EmailDigest** — 本地优先草稿 + 分类管线
- **Capstone** — FaaS 车辆调度
- **EternaPin** — 语音克隆 + 情感控制

---

## 发布节奏

- 每周一更 + 周四一更
- 每篇都要做中文版 (`body.zh.html`)
- 发之前跑一遍：`md_to_body.py` → 注册到 `posts.json` → `generate_posts.py` → 检查 `vite.config.ts` 有没有重复
