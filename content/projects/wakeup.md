Most early-rise alarms fail at the same step. The user is in bed, the snooze button is one tap away, and willpower at 6:30 a.m. is not the asset the app can depend on. WakeUp is built around a single rule that takes the negotiation off the table: the alarm only stops when your camera sees a target object, and the system keeps ringing until you point it at one. The product hypothesis is "force the user out of bed, to a specific object, and have them aim a camera." Everything else is implementation in service of that.

<div class="product-screens">
  <figure>
    <img src="/projects/wakeup/screens/01-onboarding.jpeg" alt="WakeUp onboarding screen with the gradient alarm icon and the Chinese tagline 一个让你必须起床的闹钟" />
    <figcaption>Onboarding · 起床承诺</figcaption>
  </figure>
  <figure>
    <img src="/projects/wakeup/screens/02-list-empty.jpeg" alt="Empty alarm list with a gradient + button" />
    <figcaption>Alarm list · 空状态</figcaption>
  </figure>
  <figure>
    <img src="/projects/wakeup/screens/03-alarm-edit.jpeg" alt="New alarm sheet with time picker, repeat days, label, ringtone, snooze toggle" />
    <figcaption>新建闹钟 · 时间 / 重复 / 标签 / 铃声</figcaption>
  </figure>
  <figure>
    <img src="/projects/wakeup/screens/04-camera.jpeg" alt="Camera viewfinder with a 拍摄 马桶 pill at the top showing the random target for this ring" />
    <figcaption>拍摄目标 · 这次抽到马桶</figcaption>
  </figure>
  <figure>
    <img src="/projects/wakeup/screens/05-failure.jpeg" alt="Camera failure overlay: a red X with text 未识别到目标物品 over a Starbucks cup, prompting the user to try again" />
    <figcaption>未命中 · 再试一次</figcaption>
  </figure>
</div>

*FIG.01: the four screens of the daily loop. Onboarding sells the contract, the list is the home, the editor is one sheet of native pickers, the camera is the only path out of a ringing alarm.*

The product invariant that took the longest to defend is randomness. Every time the alarm fires, the app picks one of three targets uniformly at random: the toilet, a piece of cookware (frying pan, pot, kettle, soup bowl, etc.), or a water vessel (bottle, mug, cup, pitcher). The pill at the top of the camera screen tells you which one was drawn this morning. This is the difference between a useful alarm and a useless one. If the target were always the toilet, a determined user would put the toilet seat photo on their nightstand and tap through. With three categories drawn fresh each ring, the only winning move is to actually stand up and walk to the kitchen or the bathroom, depending on which way the dice fell. The randomness is the product, and it is intentionally not user-configurable.

The second product decision is the deletion of every workaround that a normal app would bolt on. Pre-iOS-26 alarm apps lived in a notification fiction: you queued sixty-four local notifications hoping one of them banner-buzzes the user awake, you ran background audio and hoped Focus or silent mode did not silence it, and you built a "RingingView" inside the app that the user could ignore by force-quitting. iOS 26 added AlarmKit, a system framework with a real alarm channel, and that whole compatibility layer became deletable. The system handles the full-screen alert, the audio that bypasses Focus and the silent switch, the Live Activity on the lock screen and Dynamic Island, the wake-from-killed-app, the restart resilience. The app code shrank to a thin wrapper. None of this is visible from the outside, which is the point: the user just experiences "this alarm actually rings, no matter what."

The dismissal contract is the third decision and the most product-load-bearing. The "Stop" button on the system alert is bound to an AppIntent named `DismissByPhotoIntent` that does exactly one thing: open the app to the camera. It does not stop the alarm. The alarm keeps ringing through the camera screen, through every failed shot, through every blurry attempt, until the on-device classifier returns a hit on the target object. Only then does the app call `stop()` on the alarm. The mechanical consequence is that there is no path from a ringing alarm to silence that does not pass through a successful photo. The experiential consequence is that the user learns this in one morning and stops trying to game it.

```text
shipped, not in scope:
  - cloud recognition (no network layer in the app at all)
  - user-selected target (random is the product)
  - continuous video recognition (you have to push the shutter)
  - any non-camera dismiss path (this is a product invariant)
```

*FIG.02: the explicit out-of-scope list, lifted from the project's spec doc. Every item here is something a "make this app more useful" feature request would suggest, and every item would defeat the core hypothesis.*

The privacy guarantee follows from the same architecture. The image is captured into memory, classified by Apple's on-device `VNClassifyImageRequest`, and released. There is no network layer in the app. There is no analytics SDK. The classifier returns a confidence score against a hand-curated list of accepted identifiers (`toilet_seat`, `frying_pan`, `water_bottle`, etc.) and the photo is gone. The product copy reads `图像只在本机识别，不上传、不保存` (images are classified on-device, not uploaded, not stored), and the codebase enforces it.

After three weeks of running this on a real iPhone the loop has held every morning. The system alert always fires (Focus, silent switch, do-not-disturb all bypassed). The classifier hits the drawn target on the first try roughly nine times out of ten, with the failure mode being poorly-lit angles where only an edge of the object is in the frame. The "wake up in bed and dismiss" failure mode is gone, and replacing it with "physically walk to the kitchen and aim a camera at the kettle" turned out to be a more reliable getting-out-of-bed primitive than any willpower-based design I had tried before.

---

**App Store resources**: <a href="/projects/wakeup/privacy/" target="_blank" rel="noopener">Privacy Policy</a> · <a href="/projects/wakeup/privacy/" target="_blank" rel="noopener" lang="zh">隐私政策</a>
