import {
  architecture,
  categoryCases,
  categoryMeta,
  gameCases,
  musicCases,
  soundCases,
  soundMatchingArchitecture,
  tabs,
} from "./data.js?v=20260826f";
import {
  getEffectComponent,
  getEffectInstance,
  getRegisteredEffectComponents,
  mountEffects,
} from "./effects.js?v=20260826l";
import {
  DEFAULT_SOUND_MATCH_THRESHOLD,
  matchGameAudioPoints,
  rankSoundCards,
} from "./sound-library.js?v=20260826e";
import { GAME_FILTER_TAGS, rankGameCards } from "./game-library.js?v=20260826a";

const app = document.querySelector("#app");
const invalidCases = Object.entries(categoryCases).flatMap(([category, cases]) => cases.flatMap((item) => {
  const component = getEffectComponent(item.component);
  const valid = component
    && item.id === item.component
    && component.category === category
    && component.hash === `#/${category}/${item.id}`;
  return valid ? [] : [`${category}/${item.id}`];
}));

if (invalidCases.length) {
  throw new Error(`Invalid effect component mapping: ${invalidCases.join(", ")}`);
}

const caseHash = (item) => getEffectComponent(item.component).hash;

function icon(name) {
  const paths = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5m6 6-6-6 6-6"/>',
    external: '<path d="M15 4h5v5M20 4l-9 9"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    play: '<path d="m8 5 11 7-11 7Z"/>',
    replay: '<path d="M4 8v-4m0 0h4M4 4l3.2 3.2a7 7 0 1 1-1 8.5"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>',
    download: '<path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14"/>',
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

function header(active = "") {
  return `
    <header class="site-header">
      <a class="brand" href="#/" aria-label="返回首页">
        <span>FX</span><i></i><span>LAB</span>
      </a>
      <nav aria-label="主导航">
        ${tabs.map((tab) => `<a href="#/${tab.id}" ${active === tab.id ? 'aria-current="page"' : ""}>${tab.title}</a>`).join("")}
      </nav>
      <span class="edition">WEB STUDY / 2026</span>
    </header>`;
}

function motionAsset(asset) {
  if (!asset) return "";
  return `
    <video class="motion-asset" ${asset.filter ? `style="filter: ${asset.filter}"` : ""} data-motion muted loop playsinline preload="metadata" aria-hidden="true">
      <source src="${asset.src}" type="video/mp4" />
    </video>`;
}

function lyricStage(item) {
  if (!item.lyrics?.length) return "";
  return `
    <section class="lyric-stage" data-lyric-duration="${item.lyricDuration}" aria-label="${item.lyricWork}歌词">
      <header>
        <span>PUBLIC DOMAIN LYRIC</span>
        <strong>${item.lyricWork}</strong>
        <small>${item.lyricAuthor}</small>
      </header>
      <div class="lyric-window">
        <div class="lyric-lines">
          ${item.lyrics.map((line, index) => `<p data-lyric-line data-index="${index}">${line}</p>`).join("")}
        </div>
      </div>
      <footer>
        <span data-lyric-current>01</span>
        <i><b data-lyric-progress></b></i>
        <span>${String(item.lyrics.length).padStart(2, "0")}</span>
        <a href="${item.motion.url}" target="_blank" rel="noreferrer">${item.motion.title} / ${item.motion.project}</a>
      </footer>
    </section>`;
}

function homeView() {
  return `
    <main class="home-view">
      ${header()}
      <section class="home-intro" aria-labelledby="home-title">
        <p>OPEN SOURCE EFFECTS STUDY</p>
        <h1 id="home-title">FX LAB</h1>
        <span>视觉与声音的实时实验档案</span>
      </section>
      <div class="portal-grid">
        ${tabs.map((tab) => `
          <a class="portal-panel portal-${tab.id}" href="#/${tab.id}">
            ${motionAsset(tab.motion)}
            <canvas data-effect="${tab.preview}" ${tab.motion ? 'data-media-layer="true"' : ""} aria-hidden="true"></canvas>
            <span class="panel-shade"></span>
            <span class="portal-index">${tab.order}</span>
            <span class="portal-copy">
              <small>${tab.eyebrow}</small>
              <strong>${tab.title}</strong>
              <em>${tab.subtitle}</em>
              <span class="circle-arrow">${icon("arrow")}</span>
            </span>
          </a>`).join("")}
      </div>
    </main>`;
}

function caseCard(item) {
  const href = caseHash(item);
  const gameAttributes = item.tags?.length
    ? ` data-game-card data-game-id="${item.id}" data-game-tags="${escapeHtml(item.tags.join(" "))}"`
    : "";
  return `
    <article class="case-card"${gameAttributes}>
      <a href="${href}" class="case-visual" aria-label="查看 ${item.title} 效果">
        ${motionAsset(item.motion)}
        <canvas data-component="${item.component}" data-intensity="${item.motion ? "0.45" : "0.78"}" ${item.motion ? 'data-media-layer="true"' : ""} aria-hidden="true"></canvas>
        <span class="case-index">${item.index}</span>
        ${item.track ? `<span class="case-track">${item.track}</span><span class="live-input"><i></i> INTERACTIVE</span>` : ""}
        <span class="case-open">${icon("arrow")}</span>
        ${item.lyric ? `<span class="preview-lyric">${item.lyric}</span>` : ""}
        ${item.interaction ? `<span class="sr-only">交互方式：${item.interaction}</span>` : ""}
      </a>
      <div class="case-copy">
        <div>
          <p>${item.subtitle}</p>
          <h2><a href="${href}">${item.title}</a></h2>
        </div>
        <p class="case-summary">${item.summary}</p>
        ${item.tags?.length ? `<div class="case-tags">${item.tags.map((tag) => `<small>${tag}</small>`).join("")}</div>` : ""}
        <div class="case-meta">
          <span>${item.sourceName}</span>
          ${item.track ? `<span>${item.track}</span>` : ""}
          ${item.motion ? `<span>VISUAL / ${item.motion.project}</span>` : ""}
          <span>${item.license}</span>
        </div>
      </div>
    </article>`;
}

function gameBrowserControls() {
  return `
    <section class="game-browser-panel" aria-label="游戏特效筛选">
      <label class="game-search">
        ${icon("search")}
        <span class="sr-only">搜索游戏特效</span>
        <input type="search" data-game-search placeholder="搜索效果、玩法、机制或英文名称" autocomplete="off" />
      </label>
      <div class="game-filters" aria-label="游戏特效标签">
        <button type="button" data-game-filter="all" aria-pressed="true">全部</button>
        ${GAME_FILTER_TAGS.map((tag) => `<button type="button" data-game-filter="${tag}" aria-pressed="false">${tag}</button>`).join("")}
      </div>
      <span class="game-result-count"><b data-game-count>${gameCases.length}</b> EFFECTS</span>
    </section>`;
}

function architectureSection() {
  return `
    <section class="architecture" aria-labelledby="architecture-title">
      <div class="architecture-heading">
        <p>RECOMMENDED MVP ARCHITECTURE</p>
        <h2 id="architecture-title">实时歌词语义管线</h2>
        <span>词典规则保证速度与可控性，语义模型只处理未命中的歌词；渲染器不依赖模型，可独立降级。</span>
      </div>
      <ol class="pipeline">
        ${architecture.map(([index, title, note]) => `
          <li>
            <span>${index}</span>
            <strong>${title}</strong>
            <small>${note}</small>
          </li>`).join("")}
      </ol>
      <div class="stack-line">
        <span>PLAYER</span><b><a href="https://github.com/TCeramic/OpenLyricSync" target="_blank" rel="noreferrer">OpenLyricSync</a> / 自有时间轴</b>
        <span>NLP</span><b><a href="https://github.com/fxsjy/jieba" target="_blank" rel="noreferrer">jieba</a> + <a href="https://github.com/shibing624/text2vec" target="_blank" rel="noreferrer">text2vec</a></b>
        <span>RENDER</span><b>Canvas / <a href="https://github.com/tsparticles/tsparticles" target="_blank" rel="noreferrer">tsParticles</a> / <a href="https://github.com/mrdoob/three.js" target="_blank" rel="noreferrer">Three.js</a> / <a href="https://github.com/jberg/butterchurn" target="_blank" rel="noreferrer">Butterchurn</a></b>
      </div>
    </section>`;
}

function formatDuration(value) {
  const minutes = Math.floor(value / 60);
  const seconds = Math.round(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function soundCard(item) {
  const href = caseHash(item);
  const searchText = [item.title, item.subtitle, item.audioCategoryLabel, ...item.keywords, ...item.useCases].join(" ");
  return `
    <article class="sound-card" data-sound-card data-sound-id="${item.id}" data-category="${item.audioCategory}" data-search="${escapeHtml(searchText)}">
      <div class="sound-card-visual">
        <a href="${href}" aria-label="查看 ${item.title} 音效详情">
          <canvas data-component="${item.component}" data-intensity="0.72" aria-hidden="true"></canvas>
        </a>
        <span class="sound-card-index">${item.index}</span>
        <span class="sound-duration">${formatDuration(item.audio.duration)}</span>
        <button class="sound-play" type="button" data-sound-preview data-audio-src="${item.audio.src}" aria-label="试听 ${item.title}">
          <i>${icon("play")}</i>
        </button>
      </div>
      <div class="sound-card-copy">
        <p>${item.audioCategoryLabel} / ${item.subtitle}</p>
        <h2><a href="${href}">${item.title}</a></h2>
        <span>${item.summary}</span>
        <div class="sound-tags">${item.useCases.map((useCase) => `<small>${useCase}</small>`).join("")}</div>
        <footer><span>${item.audio.format}</span><span>${item.license}</span></footer>
      </div>
    </article>`;
}

function soundMatchingSection() {
  return `
    <section class="sound-matcher" aria-labelledby="sound-matcher-title">
      <header>
        <div>
          <p>REUSE DECISION GATEWAY</p>
          <h2 id="sound-matcher-title">音效点匹配器</h2>
        </div>
        <label class="threshold-control">
          <span>复用阈值 <output data-threshold-output>${DEFAULT_SOUND_MATCH_THRESHOLD.toFixed(2)}</output></span>
          <input type="range" min="0.40" max="0.90" step="0.01" value="${DEFAULT_SOUND_MATCH_THRESHOLD}" data-sound-threshold />
        </label>
      </header>
      <div class="matcher-workspace">
        <label class="matcher-input">
          <span>游戏音效点 / 每行一个</span>
          <textarea data-sound-points rows="6" placeholder="金币落入背包的奖励提示\n玩家撞碎玻璃护盾\n巨型机甲落地的低频冲击"></textarea>
        </label>
        <button class="match-button" type="button" data-match-sounds>分析匹配 ${icon("arrow")}</button>
        <div class="match-results" data-match-results aria-live="polite">
          <span>WAITING FOR AUDIO POINTS</span>
        </div>
      </div>
      <ol class="sound-pipeline">
        ${soundMatchingArchitecture.map(([index, title, note]) => `
          <li><span>${index}</span><strong>${title}</strong><small>${note}</small></li>`).join("")}
      </ol>
      <footer class="matcher-api">
        <span>INTEGRATION</span>
        <code>window.__FX_LAB__.soundLibrary.match(points, { threshold: 0.62 })</code>
      </footer>
    </section>`;
}

function soundLibraryView() {
  const meta = categoryMeta.sound;
  const categories = [...new Map(soundCases.map((item) => [item.audioCategory, item.audioCategoryLabel])).entries()];
  return `
    <main class="catalog-view sound-catalog">
      ${header("sound")}
      <section class="sound-hero">
        <canvas data-component="${meta.preview}" data-intensity="0.88" aria-hidden="true"></canvas>
        <div class="sound-hero-copy">
          <p>${meta.eyebrow}</p>
          <h1>${meta.title}</h1>
          <span>${meta.description}</span>
        </div>
        <div class="sound-search-panel">
          <label class="sound-search">
            ${icon("search")}
            <span class="sr-only">搜索游戏音效</span>
            <input type="search" data-sound-search placeholder="搜索事件、情绪、材质或英文标签" autocomplete="off" />
          </label>
          <div class="sound-filters" aria-label="音效分类">
            <button type="button" data-sound-filter="all" aria-pressed="true">全部</button>
            ${categories.map(([id, label]) => `<button type="button" data-sound-filter="${id}" aria-pressed="false">${label}</button>`).join("")}
          </div>
          <span class="sound-result-count"><b data-sound-count>${soundCases.length}</b> SOUNDS</span>
        </div>
      </section>
      <section class="sound-grid" id="sound-grid" aria-label="游戏音效库">
        ${soundCases.map((item) => soundCard(item)).join("")}
        <p class="sound-no-results" data-sound-empty hidden>没有匹配的音效</p>
      </section>
      ${soundMatchingSection()}
      <footer class="site-footer"><span>FX LAB / ${meta.order}</span><a href="#/">返回总览 ${icon("arrow")}</a></footer>
    </main>`;
}

function categoryView(category) {
  if (category === "sound") return soundLibraryView();
  const meta = categoryMeta[category];
  const cases = categoryCases[category];
  return `
    <main class="catalog-view ${category}-catalog">
      ${header(category)}
      <section class="catalog-hero">
        ${motionAsset(meta.motion)}
        <canvas data-component="${meta.preview}" data-intensity="${meta.motion ? "0.35" : "0.6"}" ${meta.motion ? 'data-media-layer="true"' : ""} aria-hidden="true"></canvas>
        <div class="catalog-heading">
          <p>${meta.eyebrow}</p>
          <h1>${meta.title}</h1>
          <span>${meta.description}</span>
        </div>
        <a class="scroll-cue" href="#case-grid">EXPLORE <i></i></a>
      </section>
      ${category === "game" ? gameBrowserControls() : ""}
      <section class="case-grid" id="case-grid" aria-label="${meta.title}案例">
        ${cases.map((item) => caseCard(item)).join("")}
        ${category === "game" ? '<p class="game-no-results" data-game-empty hidden>没有匹配的游戏特效</p>' : ""}
      </section>
      ${category === "music" ? architectureSection() : ""}
      <footer class="site-footer"><span>FX LAB / ${meta.order}</span><a href="#/">返回总览 ${icon("arrow")}</a></footer>
    </main>`;
}

function soundDetailView(item, cases) {
  const currentIndex = cases.indexOf(item);
  const next = cases[(currentIndex + 1) % cases.length];
  const prev = cases[(currentIndex - 1 + cases.length) % cases.length];
  return `
    <main class="detail-view sound-detail">
      <canvas class="detail-canvas" data-component="${item.component}" data-intensity="1.18" aria-label="${item.title} 波形视觉"></canvas>
      <div class="detail-shade"></div>
      <header class="detail-header">
        <a class="icon-button" href="#/sound" aria-label="关闭音效">${icon("close")}</a>
        <span>${item.index} / ${item.subtitle}</span>
        <a class="source-link" href="${item.sourceUrl}" target="_blank" rel="noreferrer">SOURCE ${icon("external")}</a>
      </header>
      <section class="detail-copy sound-detail-copy">
        <p>${item.audioCategoryLabel} · ${item.license}</p>
        <h1>${item.title}</h1>
        <span>${item.summary}</span>
        <div class="detail-sound-tags">${item.useCases.map((useCase) => `<small>${useCase}</small>`).join("")}</div>
      </section>
      <aside class="sound-detail-player">
        <audio data-detail-audio src="${item.audio.src}" preload="metadata"></audio>
        <button class="sound-detail-toggle" type="button" data-detail-sound-toggle aria-label="播放 ${item.title}">${icon("play")}</button>
        <label>
          <span class="sr-only">播放进度</span>
          <input type="range" min="0" max="100" step="0.1" value="0" data-detail-sound-progress />
        </label>
        <span data-detail-sound-time>0:00 / ${formatDuration(item.audio.duration)}</span>
        <a class="sound-download" href="${item.audio.src}" download aria-label="下载 ${item.title}">${icon("download")}</a>
      </aside>
      <aside class="detail-note">
        <span>LICENSE / SOURCE NOTE</span>
        <p>${item.notes}</p>
      </aside>
      <nav class="case-nav" aria-label="音效切换">
        <a href="${caseHash(prev)}">${icon("back")}<span><small>PREVIOUS</small>${prev.title}</span></a>
        <a href="${caseHash(next)}"><span><small>NEXT</small>${next.title}</span>${icon("arrow")}</a>
      </nav>
    </main>`;
}

function detailView(category, id) {
  const cases = categoryCases[category] || [];
  const item = cases.find((entry) => entry.id === id);
  if (!item) return notFoundView();
  if (category === "sound") return soundDetailView(item, cases);
  const component = getEffectComponent(item.component);
  const customDetail = component.detailMarkup?.({ item, icon }) || "";
  const currentIndex = cases.indexOf(item);
  const next = cases[(currentIndex + 1) % cases.length];
  const prev = cases[(currentIndex - 1 + cases.length) % cases.length];
  return `
    <main class="detail-view ${category}-detail ${customDetail ? "has-custom-detail" : ""} ${component.controlsMarkup ? "has-custom-controls" : ""}" data-detail-component="${item.component}">
      ${motionAsset(item.motion)}
      <canvas class="detail-canvas" data-component="${item.component}" data-intensity="${item.motion ? "0.55" : "1"}" ${item.motion ? 'data-media-layer="true"' : ""} aria-label="${item.interaction || `${item.title} 动态效果`}"></canvas>
      <div class="detail-shade"></div>
      <header class="detail-header">
        <a class="icon-button" href="#/${category}" aria-label="关闭案例">${icon("close")}</a>
        <span>${item.index} / ${item.subtitle}</span>
        <a class="source-link" href="${item.sourceUrl}" target="_blank" rel="noreferrer">SOURCE ${icon("external")}</a>
      </header>
      ${customDetail || `
        <section class="detail-copy">
          <p>${item.status} · ${item.license}</p>
          <h1>${item.title}</h1>
          ${item.lyric && !item.lyrics ? `<blockquote>${item.lyric}</blockquote>` : ""}
          <span>${item.summary}</span>
        </section>
        ${lyricStage(item)}
        <aside class="detail-note">
          <span>REFERENCE / IMPLEMENTATION NOTE</span>
          <p>${item.notes}</p>
          ${item.motion ? `<a class="asset-credit" href="${item.motion.url}" target="_blank" rel="noreferrer">PRESET: ${item.motion.title} / ${item.motion.license}</a>` : ""}
        </aside>
        ${item.interaction ? `<div class="interaction-status" aria-hidden="true"><i></i><span>LIVE INPUT</span></div>` : ""}
      `}
      <div class="effect-controls" aria-label="效果控制">
        <button class="icon-button" type="button" data-action="toggle" aria-label="暂停效果">${icon("pause")}</button>
        <button class="icon-button" type="button" data-action="replay" aria-label="重新播放">${icon("replay")}</button>
        ${component.controlsMarkup?.({ item, icon }) || ""}
        <label>
          <span>INTENSITY</span>
          <input type="range" min="0.45" max="1.7" step="0.05" value="1" data-action="intensity" />
        </label>
      </div>
      <nav class="case-nav" aria-label="案例切换">
        <a href="${caseHash(prev)}">${icon("back")}<span><small>PREVIOUS</small>${prev.title}</span></a>
        <a href="${caseHash(next)}"><span><small>NEXT</small>${next.title}</span>${icon("arrow")}</a>
      </nav>
    </main>`;
}

function notFoundView() {
  return `
    <main class="not-found">
      ${header()}
      <section><p>404 / SIGNAL LOST</p><h1>页面不存在</h1><a class="ghost-button" href="#/">${icon("back")} 返回总览</a></section>
    </main>`;
}

function parseRoute() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (!parts.length) return { view: "home" };
  if (["game", "music", "sound"].includes(parts[0])) {
    return parts[1]
      ? { view: "detail", category: parts[0], id: parts[1] }
      : { view: "category", category: parts[0] };
  }
  return { view: "not-found" };
}

function bindControls(lyricTimeline, detailController) {
  const canvas = document.querySelector(".detail-canvas");
  if (!canvas) return;
  const instance = getEffectInstance(canvas);
  const video = document.querySelector(".detail-view .motion-asset");
  const toggle = document.querySelector('[data-action="toggle"]');
  const replay = document.querySelector('[data-action="replay"]');
  const intensity = document.querySelector('[data-action="intensity"]');
  toggle?.addEventListener("click", () => {
    const paused = instance.toggle();
    lyricTimeline?.setPaused(paused);
    detailController?.setPaused?.(paused);
    if (video) {
      video.dataset.manualPaused = paused ? "true" : "false";
      paused ? video.pause() : video.play().catch(() => {});
    }
    toggle.innerHTML = icon(paused ? "play" : "pause");
    toggle.setAttribute("aria-label", paused ? "播放效果" : "暂停效果");
  });
  replay?.addEventListener("click", () => {
    instance.replay();
    lyricTimeline?.replay();
    detailController?.replay?.();
    if (video) {
      video.currentTime = 0;
      video.dataset.manualPaused = "false";
      video.play().catch(() => {});
    }
    toggle.innerHTML = icon("pause");
    toggle.setAttribute("aria-label", "暂停效果");
  });
  intensity?.addEventListener("input", (event) => instance.setIntensity(event.target.value));
}

let activePreviewAudio;
let activePreviewButton;
let previewFrameId = 0;

function stopSoundPreview() {
  cancelAnimationFrame(previewFrameId);
  previewFrameId = 0;
  activePreviewAudio?.pause();
  if (activePreviewButton) {
    activePreviewButton.classList.remove("is-playing");
    activePreviewButton.style.setProperty("--audio-progress", "0deg");
    activePreviewButton.querySelector("i").innerHTML = icon("play");
  }
  activePreviewAudio = null;
  activePreviewButton = null;
}

function playSoundPreview(button) {
  if (button === activePreviewButton && activePreviewAudio && !activePreviewAudio.paused) {
    activePreviewAudio.pause();
    button.classList.remove("is-playing");
    button.querySelector("i").innerHTML = icon("play");
    return;
  }
  stopSoundPreview();
  const audio = new Audio(button.dataset.audioSrc);
  activePreviewAudio = audio;
  activePreviewButton = button;
  button.classList.add("is-playing");
  button.querySelector("i").innerHTML = icon("pause");
  const paintProgress = () => {
    if (activePreviewAudio !== audio) return;
    const progress = Number.isFinite(audio.duration) && audio.duration ? audio.currentTime / audio.duration : 0;
    button.style.setProperty("--audio-progress", `${progress * 360}deg`);
    previewFrameId = requestAnimationFrame(paintProgress);
  };
  audio.addEventListener("ended", stopSoundPreview, { once: true });
  audio.play().then(() => { previewFrameId = requestAnimationFrame(paintProgress); }).catch(stopSoundPreview);
}

function renderMatchResults(container, results) {
  if (!results.length) {
    container.innerHTML = "<span>NO AUDIO POINTS</span>";
    return;
  }
  container.innerHTML = results.map((result) => result.decision === "reuse" ? `
    <article class="match-result is-reuse">
      <span>${escapeHtml(result.id)} · ${(result.confidence * 100).toFixed(0)}%</span>
      <strong>${escapeHtml(result.description)}</strong>
      <p>复用 <a href="${caseHash(result.sound)}">${result.sound.title}</a></p>
    </article>` : `
    <article class="match-result is-generate">
      <span>${escapeHtml(result.id)} · ${(result.confidence * 100).toFixed(0)}%</span>
      <strong>${escapeHtml(result.description)}</strong>
      <p>建议独立生成</p>
      <code>${escapeHtml(result.prompt)}</code>
    </article>`).join("");
}

function mountSoundLibrary(root) {
  const cards = [...root.querySelectorAll("[data-sound-card]")];
  if (!cards.length) return;
  const search = root.querySelector("[data-sound-search]");
  const count = root.querySelector("[data-sound-count]");
  const empty = root.querySelector("[data-sound-empty]");
  const filterButtons = [...root.querySelectorAll("[data-sound-filter]")];
  let activeCategory = "all";

  const updateCards = () => {
    const query = search.value.trim();
    const ranked = new Map(rankSoundCards(query, soundCases, { threshold: query ? 0.18 : 0 })
      .map(({ card, score }, index) => [card.id, { score, index }]));
    let visibleCount = 0;
    cards.forEach((card) => {
      const match = ranked.get(card.dataset.soundId);
      const visible = Boolean(match) && (activeCategory === "all" || card.dataset.category === activeCategory);
      card.hidden = !visible;
      card.style.order = match?.index ?? soundCases.length;
      if (visible) visibleCount += 1;
    });
    count.textContent = visibleCount;
    empty.hidden = visibleCount !== 0;
  };

  search.addEventListener("input", updateCards);
  filterButtons.forEach((button) => button.addEventListener("click", () => {
    activeCategory = button.dataset.soundFilter;
    filterButtons.forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
    updateCards();
  }));
  root.querySelectorAll("[data-sound-preview]").forEach((button) => {
    button.addEventListener("click", () => playSoundPreview(button));
  });

  const threshold = root.querySelector("[data-sound-threshold]");
  const thresholdOutput = root.querySelector("[data-threshold-output]");
  threshold?.addEventListener("input", () => { thresholdOutput.textContent = Number(threshold.value).toFixed(2); });
  root.querySelector("[data-match-sounds]")?.addEventListener("click", () => {
    const points = root.querySelector("[data-sound-points]").value
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean);
    const results = matchGameAudioPoints(points, soundCases, { threshold: Number(threshold.value) });
    renderMatchResults(root.querySelector("[data-match-results]"), results);
  });
}

function mountGameLibrary(root) {
  const cards = [...root.querySelectorAll("[data-game-card]")];
  if (!cards.length) return;
  const search = root.querySelector("[data-game-search]");
  const count = root.querySelector("[data-game-count]");
  const empty = root.querySelector("[data-game-empty]");
  const filterButtons = [...root.querySelectorAll("[data-game-filter]")];
  let activeTag = "all";

  const updateCards = () => {
    const query = search.value.trim();
    const ranked = new Map(rankGameCards(query, gameCases, { threshold: query ? 0.22 : 0 })
      .map(({ card, score }, index) => [card.id, { score, index }]));
    let visibleCount = 0;
    cards.forEach((card) => {
      const match = ranked.get(card.dataset.gameId);
      const tags = card.dataset.gameTags.split(" ");
      const visible = Boolean(match) && (activeTag === "all" || tags.includes(activeTag));
      card.hidden = !visible;
      card.style.order = match?.index ?? gameCases.length;
      if (visible) visibleCount += 1;
    });
    count.textContent = visibleCount;
    empty.hidden = visibleCount !== 0;
  };

  search.addEventListener("input", updateCards);
  filterButtons.forEach((button) => button.addEventListener("click", () => {
    activeTag = button.dataset.gameFilter;
    filterButtons.forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
    updateCards();
  }));
}

function bindSoundDetail(root) {
  const audio = root.querySelector("[data-detail-audio]");
  if (!audio) return;
  const toggle = root.querySelector("[data-detail-sound-toggle]");
  const progress = root.querySelector("[data-detail-sound-progress]");
  const time = root.querySelector("[data-detail-sound-time]");
  const total = formatDuration(soundCases.find((item) => item.audio.src === audio.getAttribute("src"))?.audio.duration || 0);
  const setButtonState = (playing) => {
    toggle.innerHTML = icon(playing ? "pause" : "play");
    toggle.setAttribute("aria-label", playing ? "暂停音效" : "播放音效");
  };
  toggle.addEventListener("click", () => {
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  });
  audio.addEventListener("play", () => setButtonState(true));
  audio.addEventListener("pause", () => setButtonState(false));
  audio.addEventListener("ended", () => { audio.currentTime = 0; setButtonState(false); });
  audio.addEventListener("timeupdate", () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    progress.value = duration ? (audio.currentTime / duration) * 100 : 0;
    time.textContent = `${formatDuration(audio.currentTime)} / ${duration ? formatDuration(duration) : total}`;
  });
  progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  });
}

let motionObserver;
let lyricFrameId = 0;
let activeDetailController = null;
let renderedRoute = null;
let scrollRestoreTimerId = 0;
let scrollRestoreVersion = 0;
let capturedCategoryNavigation = null;
const categoryScrollPositions = new Map();
const defaultScrollBehavior = document.documentElement.style.scrollBehavior;

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

function rememberCategoryScroll() {
  if (renderedRoute?.view !== "category") return;
  categoryScrollPositions.set(renderedRoute.category, window.scrollY);
}

function restoreRouteScroll(route) {
  clearTimeout(scrollRestoreTimerId);
  const restoreVersion = ++scrollRestoreVersion;
  const savedPosition = route.view === "category"
    ? categoryScrollPositions.get(route.category)
    : undefined;
  const targetPosition = savedPosition ?? 0;
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, targetPosition);
  scrollRestoreTimerId = window.setTimeout(() => {
    requestAnimationFrame(() => {
      if (restoreVersion !== scrollRestoreVersion) return;
      window.scrollTo(0, targetPosition);
      requestAnimationFrame(() => {
        if (restoreVersion === scrollRestoreVersion) {
          document.documentElement.style.scrollBehavior = defaultScrollBehavior;
        }
      });
    });
  }, 0);
}

function mountMotion(root) {
  motionObserver?.disconnect();
  const videos = [...root.querySelectorAll("video[data-motion]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  motionObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (reduceMotion || target.dataset.manualPaused === "true" || !isIntersecting) {
        target.pause();
      } else {
        target.play().catch(() => {});
      }
    });
  }, { rootMargin: "120px" });
  videos.forEach((video) => motionObserver.observe(video));
}

function mountLyricTimeline(root) {
  cancelAnimationFrame(lyricFrameId);
  const stage = root.querySelector("[data-lyric-duration]");
  if (!stage) return null;
  const lines = [...stage.querySelectorAll("[data-lyric-line]")];
  const lineGroup = stage.querySelector(".lyric-lines");
  const windowElement = stage.querySelector(".lyric-window");
  const currentLabel = stage.querySelector("[data-lyric-current]");
  const progressBar = stage.querySelector("[data-lyric-progress]");
  const duration = Number(stage.dataset.lyricDuration) * 1000;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let startedAt = performance.now();
  let pausedAt = 0;
  let paused = false;
  let activeIndex = -1;

  const paint = (now) => {
    const elapsed = paused ? pausedAt : now - startedAt;
    const position = reduceMotion ? 0 : ((elapsed % duration) + duration) % duration;
    const lineDuration = duration / lines.length;
    const nextIndex = Math.min(lines.length - 1, Math.floor(position / lineDuration));
    const lineProgress = (position - nextIndex * lineDuration) / lineDuration;

    lines.forEach((line, index) => {
      line.classList.toggle("is-active", index === nextIndex);
      line.classList.toggle("is-past", index < nextIndex);
      line.style.setProperty("--lyric-progress", `${index === nextIndex ? lineProgress * 100 : 0}%`);
    });

    if (nextIndex !== activeIndex) {
      activeIndex = nextIndex;
      currentLabel.textContent = String(activeIndex + 1).padStart(2, "0");
      const activeLine = lines[activeIndex];
      const centered = windowElement.clientHeight * 0.48 - activeLine.offsetTop - activeLine.offsetHeight / 2;
      lineGroup.style.transform = `translate3d(0, ${Math.min(0, centered)}px, 0)`;
    }
    progressBar.style.transform = `scaleX(${position / duration})`;
    lyricFrameId = requestAnimationFrame(paint);
  };

  lyricFrameId = requestAnimationFrame(paint);
  return {
    setPaused(nextPaused) {
      if (paused === nextPaused) return;
      if (nextPaused) pausedAt = performance.now() - startedAt;
      else startedAt = performance.now() - pausedAt;
      paused = nextPaused;
    },
    replay() {
      startedAt = performance.now();
      pausedAt = 0;
      paused = false;
      activeIndex = -1;
    },
  };
}

function render() {
  const capturedCurrentNavigation = renderedRoute?.view === "category"
    && capturedCategoryNavigation?.category === renderedRoute.category
    && capturedCategoryNavigation.hash === location.hash;
  if (!capturedCurrentNavigation) rememberCategoryScroll();
  capturedCategoryNavigation = null;
  activeDetailController?.destroy?.();
  activeDetailController = null;
  stopSoundPreview();
  const route = parseRoute();
  if (route.view === "home") app.innerHTML = homeView();
  else if (route.view === "category") app.innerHTML = categoryView(route.category);
  else if (route.view === "detail") app.innerHTML = detailView(route.category, route.id);
  else app.innerHTML = notFoundView();
  mountEffects(app);
  mountMotion(app);
  const lyricTimeline = mountLyricTimeline(app);
  if (route.view === "detail") {
    const canvas = app.querySelector(".detail-canvas");
    const component = getEffectComponent(route.id);
    activeDetailController = component?.mountDetail?.({
      root: app,
      instance: canvas ? getEffectInstance(canvas) : null,
    }) || null;
  }
  bindControls(lyricTimeline, activeDetailController);
  mountGameLibrary(app);
  mountSoundLibrary(app);
  bindSoundDetail(app);
  renderedRoute = route;
  restoreRouteScroll(route);
}

app.addEventListener("click", (event) => {
  const link = event.target.closest?.('a[href^="#/"]');
  if (!link || renderedRoute?.view !== "category") return;
  rememberCategoryScroll();
  capturedCategoryNavigation = {
    category: renderedRoute.category,
    hash: link.getAttribute("href"),
  };
}, { capture: true });

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", render);

// Exposed for lightweight browser smoke tests.
window.__FX_LAB__ = {
  gameCases,
  musicCases,
  soundCases,
  soundLibrary: {
    threshold: DEFAULT_SOUND_MATCH_THRESHOLD,
    search: (query, options) => rankSoundCards(query, soundCases, options),
    match: (points, options) => matchGameAudioPoints(points, soundCases, options),
  },
  gameLibrary: {
    tags: GAME_FILTER_TAGS,
    search: (query, options) => rankGameCards(query, gameCases, options),
  },
  components: getRegisteredEffectComponents().map(({ id, category, hash }) => ({ id, category, hash })),
  render,
};
