大多数早起闹钟都在同一步翻车。用户在床上，贪睡按钮一指可达，早上 6:30 的意志力不是 app 能依赖的资产。WakeUp 的设计绕开了这场谈判：闹钟只在相机看到目标物品时才停，没看到就一直响。产品假设就一句话：「逼用户离床、走到一个具体的物品前、举起相机」。其他一切都是为这条假设服务的实现。

<div class="product-screens">
  <figure>
    <img src="/projects/wakeup/screens/01-onboarding.jpeg" alt="WakeUp 引导页：渐变闹钟图标和「一个让你必须起床的闹钟」标语" />
    <figcaption>引导页 · 起床承诺</figcaption>
  </figure>
  <figure>
    <img src="/projects/wakeup/screens/02-list-empty.jpeg" alt="空闹钟列表，带渐变 + 按钮" />
    <figcaption>闹钟列表 · 空状态</figcaption>
  </figure>
  <figure>
    <img src="/projects/wakeup/screens/03-alarm-edit.jpeg" alt="新建闹钟面板：时间选择、重复日、标签、铃声、贪睡开关" />
    <figcaption>新建闹钟 · 时间 / 重复 / 标签 / 铃声</figcaption>
  </figure>
  <figure>
    <img src="/projects/wakeup/screens/04-camera.jpeg" alt="相机取景框，顶部「拍摄 马桶」标签显示这次随机抽到的目标" />
    <figcaption>拍摄目标 · 这次抽到马桶</figcaption>
  </figure>
  <figure>
    <img src="/projects/wakeup/screens/05-failure.jpeg" alt="拍摄失败遮罩：在一只星巴克杯上覆盖红叉和「未识别到目标物品」文字，提示用户重试" />
    <figcaption>未命中 · 再试一次</figcaption>
  </figure>
</div>

*FIG.01：日常闭环的四个屏。引导页卖的是契约，列表是家，编辑器是一张原生选择器面板，相机是关掉响铃的唯一通道。*

最难守的一条产品不变量是随机性。每次闹钟响，app 在三类目标里均匀随机抽一个：马桶、一件锅具（煎锅、炖锅、水壶、汤碗等等）、一只盛水容器（水瓶、马克杯、玻璃杯、水壶）。相机界面顶部那个标签会告诉你这次抽到的是哪个。这是「有用闹钟」和「没用闹钟」的分水岭。如果目标永远是马桶，意志坚定的用户会把马桶座的照片放在床头柜上糊弄过去。三类目标每次现抽，唯一能赢的办法就是真的站起来走到厨房或卫生间，看骰子怎么落。随机性就是产品本身，故意不给用户开放配置。

第二个产品决定是把一切「正常 app 会加的兜底」全部删掉。iOS 26 之前的闹钟 app 都活在通知幻觉里：你排队下发 64 条本地通知，希望其中一条能弹出横幅把人吵醒；你跑后台音频，祈祷专注模式或静音模式不把它静掉；你在 app 里搭一个「响铃 View」，用户强退就能跳过。iOS 26 加入了 AlarmKit，一个有真正闹钟通道的系统框架，整套兼容层一夜之间可以删掉。系统接管了全屏提醒、绕过专注模式和静音键的音频、锁屏和灵动岛的 Live Activity、被杀进程后的唤醒、重启后的恢复。app 代码缩成一层薄薄的包装。这些从外面看不见，这正是要点：用户只感觉到「这个闹钟真的会响，怎么都会响」。

第三个产品决定是关闭契约，也是产品上最吃力的一条。系统提醒上的「停止」按钮绑定到一个名为 `DismissByPhotoIntent` 的 AppIntent，它只做一件事：把 app 打开到相机界面。它不停闹钟。闹钟会穿过相机界面、穿过每一次失败拍摄、穿过每一次模糊的尝试一直响，直到本机分类器在目标物品上返回一次命中，app 才调用 `stop()`。机制后果是：从「闹钟响」到「闹钟静」之间不存在不经过一次成功拍照的路径。体验后果是：用户一个早上就学会了这件事，不再尝试钻空子。

```text
shipped, not in scope:
  - 云端识别（app 里完全没有网络层）
  - 用户自选目标（随机就是产品）
  - 视频流连续识别（必须按下快门）
  - 任何非相机的关闭路径（这是产品不变量）
```

*FIG.02：明确写在 spec 里的 out-of-scope 清单。这里每一条都是「让 app 更好用」的功能请求会建议的东西，每一条都会击垮核心假设。*

隐私保证是从同一架构里推出来的。图像捕获到内存、交给 Apple 本机的 `VNClassifyImageRequest` 分类、然后释放。app 里没有网络层。没有分析 SDK。分类器对一份手工挑选的接受标识列表（`toilet_seat`、`frying_pan`、`water_bottle` 等）返回一个置信分数，照片就没了。产品文案写的是 `图像只在本机识别，不上传、不保存`，代码层面强制如此。

在真机上跑了三周，每天早上闭环都成立。系统提醒永远会触发（专注、静音键、勿扰全部绕过）。分类器对抽到的目标第一次命中率大约九成，失败模式是光线不好、物体只露半边的角度。「在床上醒过来按掉」这种失败模式没有了，被替换成「真的走到厨房，把相机对准水壶」，结果证明这是比任何意志力设计都更可靠的一条「让我离床」原语。

---

**App Store 资源**：<a href="/projects/wakeup/privacy/" target="_blank" rel="noopener" lang="en">Privacy Policy</a> · <a href="/projects/wakeup/privacy/" target="_blank" rel="noopener">隐私政策</a>
