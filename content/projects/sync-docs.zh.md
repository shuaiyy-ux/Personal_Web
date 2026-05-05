我的项目文件夹里散着一长串 MD 文档：架构笔记、postmortem、playbook、PRD 风格的 spec、半成型的 plan。每一份都是辛苦换来的一点 context，但新开一个 Claude Code session 看不见它们，因为每个 session 只能看见它被打开的那个项目。sync-docs 是我写的一条 `/sync-docs` slash command，扫遍 `~/Downloads`、`~/Documents`、`~/projects`、`~/code` 下所有的 MD 文件，按内容哈希去重，分九个类别，最后产出一份 `claude-knowledge/context.md` 可以当作任何后续 session 的 priming 拉进来。它跑成 Claude Code skill（一份放在 `~/.claude/commands/sync-docs.md` 的 markdown，Claude 按上面的 step 逐条执行），不是二进制工具。状态存在 `claude-knowledge/hashes.json`，下一次跑只动改过的文件。

不那么显然的设计决定是「什么算文件的身份」。v1 用路径做身份。我一开始重新整理目录（这种事我经常做，把项目从 `~/Downloads/foo` 挪到 `~/Downloads/archive/foo` 或者干脆挪到另一个 scan root），索引就把每一次移动当成「删 + 新增」处理，每个被挪的文件都要重新跑一次 LLM 读 takeaway。增量索引最值钱的那部分缓存（title 和 takeaway）每次重组目录就被扔掉一次。v2 把身份改成 MD5 哈希。路径只是会跟着移动而更新的标签。内容没改就是同一个身份，不重读。

```
对 previous hashes 里每条 (old_path, old_hash) 且 old_path 已不存在：
  candidates = 新文件列表里 hash 等于 old_hash 且不在 previous index 中的路径
  如果 len == 1            -> 唯一 move（文件名可以变，内容才是身份）
  否则 len > 1：
    same_name = candidates 里 basename 等于 old_path basename 的子集
    如果 len(same_name) == 1 -> 标记移动到那一个（文件名作 tiebreaker）
    否则                     -> 模糊，记日志、当作删除
  否则 len == 0              -> 删除
```

*FIG.01：move 检测算法。文件名不要求一致。`mv old/notes.md new/guide.md` 仍被识别为 move，因为哈希没变。文件名只在多个新路径共享同一哈希这种少见情况下作为 tiebreaker 介入。*

多 root 扫描是让基于内容的 move 在实际中能跑通的关键。如果只有 `~/Downloads` 在 scope，一个项目挪到了 `~/projects`，算法会看到旧路径消失而没有任何候选，于是回退到「删除」。要让 hash 命中触发，move 的两端必须都在 scope 里。默认四个 root 覆盖我实际放代码的四个地方；传参数可覆盖。每个条目带一个 `previous_paths` 字段记录移动链，限制最多 5 条，让 `~/Downloads/foo -> ~/projects/foo -> ~/projects/archive/foo` 这样的轨迹能在 `hashes.json` 里追溯。

分类是两遍跑、刻意做得便宜。第一遍用文件名加路径组件规则。比如 Architecture 分类只有当路径里带 `/architecture/` 或 `/design/` 这样的真路径组件时才命中、不是只看文件名后缀。这一条规则消掉了 v1 时一类常见误报：任何文件名以 `-architecture.md` 结尾的都被归到 Architecture，不管它实际上是不是讲架构。第一遍落到 `Other` 的，再跑第二遍：把缓存里的 takeaway 小写后做子串匹配：`lesson|pitfall|gotcha|postmortem` 提升到 Engineering Lessons；`playbook|manifesto|methodology|规范|心得` 提升到 Personal Knowledge；以此类推。第二遍用的是已经缓存好的 takeaway，所以零额外 LLM 调用。

```
noise 排除（hash 之前就过滤掉）：
  .specify/  .cursor/  .github/  node_modules/  .venv/  .git/
  LICENSE.md  CHANGELOG.md  CONTRIBUTING.md
  CODE_OF_CONDUCT.md  SECURITY.md
  claude-knowledge/   （避免自己索引自己的输出）
```

*FIG.02：noise 排除清单。AI 工具的样板（.specify、.cursor）、GitHub 仓库 metadata、几份每个仓库都有的标准文件，本身没承载真实的项目知识，留下来只会稀释索引。输出目录把自己排除掉，避免重跑时把上一次输出当输入。*

输出的章节顺序很重要，因为 context.md 有 2000 行硬上限，超了要按优先级砍。Project Profiles（每个项目的 `CLAUDE.md` 或根级 `README.md`）和 Personal Knowledge（playbook、规范、方法论）排在最前，因为它们是新 session 启动时最能用上的 priming material。Engineering Lessons、Architecture、Product Specs、Security、Dev Guides、Planning 跟在后面当 reference。Other 排最后，超限时第一个被砍。Engineering Lessons 和 Architecture 是第二个被砍的目标，按 takeaway 长度从大到小裁剪；Project Profiles 和 Personal Knowledge 永远不动。

留下的形态正是 README 写的那个 property：O(changed) 的增量文档索引器，把内容哈希当身份，输出直接落进 AI 的 context；目录想怎么重组就怎么重组、知识库自己跟着走。没改的文件下一次同步零成本；移动了的只更新 path 字段；编辑过的才花一次 LLM 读 takeaway。同名不同内容的文件（我手上有 10 个不同项目的 `CLAUDE.md`，内容彼此不同）按名字分别列出，不被合并。整个 skill 是一份不到 400 行的 markdown，唯一的持久态是 `hashes.json`，schema 加了版本兼容：v1 的 `scan_root`（单数）字段被自动当作 `scan_roots: [scan_root]` 读，不需要写迁移脚本。

已知边界讲清楚：这是单机索引器，每个 MD 文件读前 2000 个字符（`head -c`）让 LLM 给一段 takeaway。不解析代码、不跟链接走、不处理二进制附件，对哪些项目「有意思」也没意见。9 个分类是我自己的口味，套到别人的文件系统上一定不合。但它能干好我需要的那件事：把散落的 MD 变成一个新 session 能真的加载的东西。
