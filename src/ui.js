import { BIOME_ORDER, BIOMES, COLLECTIBLES, COSMETICS, PHOTO_SUBJECTS, currentChapter } from './content.js';
import { calculateInventoryValue, requirementProgress } from './progression.js';

const iconForRequirement = (requirement) => (requirement.kind === 'photo' ? '📷' : '🤲');

export class GameUI {
  constructor(root) {
    this.root = root;
    this.callbacks = {};
    this.joystick = { x: 0, y: 0 };
    this.photoUrls = new Map();
    this.toastTimer = null;
    this.dialogAction = null;
    this.renderShell();
    this.cacheElements();
    this.bindBaseEvents();
  }

  renderShell() {
    this.root.innerHTML = `
      <main class="game-shell">
        <div id="canvas-mount" class="canvas-mount" aria-label="Globular Roam 3D world"></div>

        <section id="start-screen" class="screen-layer start-screen">
          <div class="start-card paper-card">
            <div class="eyebrow">A tiny planet is waiting</div>
            <h1><span>Globular</span> Roam</h1>
            <p class="subtitle">First Orbit</p>
            <div class="planet-mark" aria-hidden="true">
              <span class="planet-ring"></span>
              <span class="planet-dot dot-one"></span>
              <span class="planet-dot dot-two"></span>
              <span class="camera-glyph">📷</span>
            </div>
            <p class="start-copy">Photograph wildlife, plants, trees, and landmarks while helping four local rangers fill the field guide.</p>
            <label class="name-field">
              <span>Explorer name</span>
              <input id="player-name" maxlength="18" autocomplete="off" value="Roamer" />
            </label>
            <div class="custom-row" aria-label="Choose a jacket color">
              <span>Jacket</span>
              <button class="swatch active" data-shirt="#e86e50" style="--swatch:#e86e50" aria-label="Coral jacket"></button>
              <button class="swatch" data-shirt="#4b91c7" style="--swatch:#4b91c7" aria-label="Blue jacket"></button>
              <button class="swatch" data-shirt="#5aa66c" style="--swatch:#5aa66c" aria-label="Green jacket"></button>
              <button class="swatch" data-shirt="#9a70c4" style="--swatch:#9a70c4" aria-label="Purple jacket"></button>
            </div>
            <button id="start-button" class="primary-button">Begin first orbit <span>→</span></button>
            <button id="continue-button" class="text-button hidden">Continue saved expedition</button>
            <p class="controls-note">Move with the thumbstick or WASD · Camera with C · Interact with E</p>
          </div>
        </section>

        <section id="hud" class="hud hidden" aria-live="polite">
          <header class="top-hud">
            <div class="location-card glass-card">
              <span id="biome-emoji" class="location-emoji">🌿</span>
              <div><span class="micro-label">CURRENT REGION</span><strong id="biome-name">Clover Commons</strong></div>
            </div>
            <div class="resource-card glass-card">
              <span>🔔</span><strong id="bells-count">0</strong>
            </div>
          </header>

          <aside class="objective-card glass-card">
            <div class="objective-heading">
              <span class="micro-label">FIRST ORBIT</span>
              <button id="field-guide-button" class="icon-button" aria-label="Open field guide">📖</button>
            </div>
            <strong id="objective-title">Meet Mira</strong>
            <div id="objective-list" class="objective-list"></div>
            <div id="stamp-row" class="stamp-row"></div>
          </aside>

          <div id="joystick-wrap" class="joystick-wrap">
            <div id="joystick-base" class="joystick-base">
              <div id="joystick-knob" class="joystick-knob"></div>
            </div>
          </div>

          <div class="action-cluster">
            <button id="context-button" class="round-action context-action hidden" aria-label="Interact">
              <span id="context-icon">✦</span><small id="context-label">Interact</small>
            </button>
            <button id="camera-button" class="round-action camera-action" aria-label="Open camera">
              <span>📷</span><small>Camera</small>
            </button>
          </div>

          <nav class="utility-nav glass-card">
            <button id="outfitter-button" aria-label="Open outfitter">🎒<span>Outfitter</span></button>
            <button id="settings-button" aria-label="Open settings">⚙️<span>Settings</span></button>
            <button id="fullscreen-button" aria-label="Toggle fullscreen">⛶<span>Full screen</span></button>
          </nav>
        </section>

        <section id="camera-overlay" class="camera-overlay hidden">
          <div class="viewfinder-corners" aria-hidden="true"></div>
          <div id="reticle" class="reticle"><span></span></div>
          <div id="camera-focus-label" class="camera-focus-label">Look for nearby subjects</div>
          <button id="camera-close" class="camera-close" aria-label="Close camera">×</button>
          <div class="camera-instructions">Drag to frame · center a subject in the circle</div>
          <button id="shutter-button" class="shutter-button" aria-label="Take photograph"><span></span></button>
          <div id="camera-flash" class="camera-flash"></div>
        </section>

        <section id="photo-result" class="photo-result hidden">
          <div class="photo-polaroid">
            <img id="photo-preview" alt="Your field-guide photograph" />
            <div>
              <span id="photo-result-kicker">NEW DISCOVERY</span>
              <strong id="photo-result-name"></strong>
            </div>
          </div>
        </section>

        <section id="modal-layer" class="modal-layer hidden">
          <div class="modal-card paper-card">
            <button id="modal-close" class="modal-close" aria-label="Close">×</button>
            <div id="modal-content"></div>
            <button id="modal-action" class="primary-button">Continue</button>
          </div>
        </section>

        <section id="guide-layer" class="modal-layer hidden">
          <div class="guide-card paper-card">
            <header>
              <div><span class="eyebrow">Your expedition record</span><h2>Field Guide</h2></div>
              <button id="guide-close" class="modal-close static" aria-label="Close field guide">×</button>
            </header>
            <div id="guide-progress" class="guide-progress"></div>
            <div id="guide-grid" class="guide-grid"></div>
          </div>
        </section>

        <section id="outfitter-layer" class="modal-layer hidden">
          <div class="outfitter-card paper-card">
            <header>
              <div><span class="eyebrow">Trade finds for trail gear</span><h2>Orbit Outfitter</h2></div>
              <button id="outfitter-close" class="modal-close static" aria-label="Close outfitter">×</button>
            </header>
            <div id="inventory-summary" class="inventory-summary"></div>
            <button id="sell-button" class="secondary-button">Sell gathered treasures</button>
            <div id="cosmetic-list" class="cosmetic-list"></div>
          </div>
        </section>

        <section id="settings-layer" class="modal-layer hidden">
          <div class="settings-card paper-card" role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <header>
              <div><span class="eyebrow">Make roaming comfortable</span><h2 id="settings-title">Settings</h2></div>
              <button id="settings-close" class="modal-close static" aria-label="Close settings">×</button>
            </header>
            <div class="settings-list">
              <button id="sound-setting" class="setting-row" type="button" role="switch" aria-checked="true">
                <span class="setting-icon" aria-hidden="true">🔊</span>
                <span><strong>Sound</strong><small>Camera and expedition feedback</small></span>
                <span id="sound-setting-value" class="setting-value">On</span>
              </button>
              <button id="motion-setting" class="setting-row" type="button" role="switch" aria-checked="false">
                <span class="setting-icon" aria-hidden="true">🌿</span>
                <span><strong>Reduced motion</strong><small>Calms movement, flashes, and transitions</small></span>
                <span id="motion-setting-value" class="setting-value">Off</span>
              </button>
            </div>
            <p class="settings-note">Changes are saved automatically for this expedition.</p>
          </div>
        </section>

        <section id="finale-layer" class="finale-layer hidden">
          <div class="finale-stars" aria-hidden="true">✦ · ✧ · ✦ · ✧ · ✦</div>
          <div class="finale-card paper-card">
            <span class="finale-icon">🌍</span>
            <span class="eyebrow">Expedition complete</span>
            <h2>First Orbit</h2>
            <p id="finale-copy"></p>
            <div id="finale-stamps" class="finale-stamps"></div>
            <div class="reward-callout"><span>👑</span><div><small>NEW KEEPSAKE</small><strong>First Orbit Crown</strong></div></div>
            <button id="keep-roaming-button" class="primary-button">Keep roaming</button>
          </div>
        </section>

        <div id="toast" class="toast hidden" role="status" aria-live="polite"></div>
      </main>
    `;
  }

  cacheElements() {
    const ids = [
      'canvas-mount', 'start-screen', 'player-name', 'start-button', 'continue-button', 'hud',
      'biome-emoji', 'biome-name', 'bells-count', 'objective-title', 'objective-list', 'stamp-row',
      'field-guide-button', 'joystick-base', 'joystick-knob', 'context-button', 'context-icon',
      'context-label', 'camera-button', 'outfitter-button', 'settings-button', 'fullscreen-button', 'camera-overlay',
      'camera-focus-label', 'reticle', 'camera-close', 'shutter-button', 'camera-flash',
      'photo-result', 'photo-preview', 'photo-result-kicker', 'photo-result-name', 'modal-layer',
      'modal-content', 'modal-action', 'modal-close', 'guide-layer', 'guide-close', 'guide-grid',
      'guide-progress', 'outfitter-layer', 'outfitter-close', 'inventory-summary', 'sell-button',
      'cosmetic-list', 'settings-layer', 'settings-close', 'sound-setting', 'sound-setting-value',
      'motion-setting', 'motion-setting-value', 'finale-layer', 'finale-copy', 'finale-stamps',
      'keep-roaming-button', 'toast',
    ];
    for (const id of ids) this[id] = document.getElementById(id);
  }

  bind(callbacks) {
    this.callbacks = callbacks;
  }

  bindBaseEvents() {
    document.querySelectorAll('[data-shirt]').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelectorAll('[data-shirt]').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
      });
    });
    this['start-button'].addEventListener('click', () => {
      const shirt = document.querySelector('[data-shirt].active')?.dataset.shirt || '#e86e50';
      this.callbacks.start?.({ playerName: this['player-name'].value.trim() || 'Roamer', shirt, fresh: true });
    });
    this['continue-button'].addEventListener('click', () => this.callbacks.start?.({ fresh: false }));
    this['camera-button'].addEventListener('click', () => this.callbacks.camera?.());
    this['camera-close'].addEventListener('click', () => this.callbacks.closeCamera?.());
    this['shutter-button'].addEventListener('click', () => this.callbacks.shutter?.());
    this['context-button'].addEventListener('click', () => this.callbacks.context?.());
    this['field-guide-button'].addEventListener('click', () => this.callbacks.fieldGuide?.());
    this['guide-close'].addEventListener('click', () => this.hideFieldGuide());
    this['outfitter-button'].addEventListener('click', () => this.callbacks.outfitter?.());
    this['outfitter-close'].addEventListener('click', () => this.hideOutfitter());
    this['sell-button'].addEventListener('click', () => this.callbacks.sell?.());
    this['settings-button'].addEventListener('click', () => this.callbacks.settings?.());
    this['settings-close'].addEventListener('click', () => this.hideSettings());
    this['sound-setting'].addEventListener('click', () => {
      const enabled = this['sound-setting'].getAttribute('aria-checked') !== 'true';
      this.callbacks.settingChange?.('sound', enabled);
    });
    this['motion-setting'].addEventListener('click', () => {
      const enabled = this['motion-setting'].getAttribute('aria-checked') !== 'true';
      this.callbacks.settingChange?.('reducedMotion', enabled);
    });
    this['fullscreen-button'].addEventListener('click', () => this.callbacks.fullscreen?.());
    this['modal-close'].addEventListener('click', () => this.closeDialog());
    this['modal-action'].addEventListener('click', () => {
      const action = this.dialogAction;
      this.closeDialog();
      action?.();
    });
    this['keep-roaming-button'].addEventListener('click', () => {
      this['finale-layer'].classList.add('hidden');
      this.callbacks.keepRoaming?.();
    });
    this.bindJoystick();
    this.bindCameraAim();
  }

  bindJoystick() {
    let pointerId = null;
    const update = (event) => {
      const rect = this['joystick-base'].getBoundingClientRect();
      const radius = rect.width / 2;
      let x = (event.clientX - (rect.left + radius)) / radius;
      let y = (event.clientY - (rect.top + radius)) / radius;
      const length = Math.hypot(x, y);
      if (length > 1) {
        x /= length;
        y /= length;
      }
      this.joystick.x = x;
      this.joystick.y = -y;
      this['joystick-knob'].style.transform = `translate(calc(-50% + ${x * radius * 0.46}px), calc(-50% + ${y * radius * 0.46}px))`;
    };
    const release = () => {
      pointerId = null;
      this.joystick.x = 0;
      this.joystick.y = 0;
      this['joystick-knob'].style.transform = 'translate(-50%, -50%)';
    };
    this['joystick-base'].addEventListener('pointerdown', (event) => {
      pointerId = event.pointerId;
      this['joystick-base'].setPointerCapture(pointerId);
      update(event);
    });
    this['joystick-base'].addEventListener('pointermove', (event) => {
      if (event.pointerId === pointerId) update(event);
    });
    this['joystick-base'].addEventListener('pointerup', release);
    this['joystick-base'].addEventListener('pointercancel', release);
  }

  bindCameraAim() {
    let pointer = null;
    let last = null;
    this['camera-overlay'].addEventListener('pointerdown', (event) => {
      if (event.target.closest('button')) return;
      pointer = event.pointerId;
      last = { x: event.clientX, y: event.clientY };
      this['camera-overlay'].setPointerCapture(pointer);
    });
    this['camera-overlay'].addEventListener('pointermove', (event) => {
      if (event.pointerId !== pointer || !last) return;
      const dx = (event.clientX - last.x) / window.innerWidth;
      const dy = (event.clientY - last.y) / window.innerHeight;
      last = { x: event.clientX, y: event.clientY };
      this.callbacks.aim?.(dx * 1.7, -dy * 1.7);
    });
    const end = () => { pointer = null; last = null; };
    this['camera-overlay'].addEventListener('pointerup', end);
    this['camera-overlay'].addEventListener('pointercancel', end);
  }

  configureStart(save) {
    this['player-name'].value = save.playerName || 'Roamer';
    const shirtButton = document.querySelector(`[data-shirt="${save.appearance?.shirt}"]`);
    if (shirtButton) {
      document.querySelectorAll('[data-shirt]').forEach((item) => item.classList.remove('active'));
      shirtButton.classList.add('active');
    }
    this['continue-button'].classList.toggle('hidden', !save.started);
    this.applySettings(save.settings);
  }

  enterGame() {
    this['start-screen'].classList.add('hidden');
    this.hud.classList.remove('hidden');
  }

  updateHUD({ save, biomeId, context }) {
    const biome = BIOMES[biomeId];
    this['biome-emoji'].textContent = biome.emoji;
    this['biome-name'].textContent = biome.name;
    this['bells-count'].textContent = save.bells;
    const chapter = currentChapter(save.stamps);
    if (chapter === 'return_home') {
      this['objective-title'].textContent = 'Return to Mira in Clover Commons';
      this['objective-list'].innerHTML = '<div class="objective-complete">Your field guide is ready to present.</div>';
    } else {
      const targetBiome = BIOMES[chapter];
      this['objective-title'].textContent = chapter === biomeId
        ? `${targetBiome.ranger.name}’s request`
        : `Travel to ${targetBiome.name}`;
      this['objective-list'].innerHTML = targetBiome.requirements.map((requirement) => {
        const amount = requirementProgress(save, requirement);
        const done = amount >= requirement.count;
        return `<div class="${done ? 'done' : ''}"><span>${done ? '✓' : iconForRequirement(requirement)}</span><span>${requirement.label}</span></div>`;
      }).join('');
    }
    this['stamp-row'].innerHTML = BIOME_ORDER.map((id) => {
      const earned = save.stamps.includes(id);
      return `<span class="stamp ${earned ? 'earned' : ''}" title="${BIOMES[id].stamp}">${earned ? BIOMES[id].emoji : '○'}</span>`;
    }).join('');
    if (context) {
      this['context-button'].classList.remove('hidden');
      this['context-icon'].textContent = context.icon;
      this['context-label'].textContent = context.label;
    } else {
      this['context-button'].classList.add('hidden');
    }
  }

  setCameraMode(active) {
    this['camera-overlay'].classList.toggle('hidden', !active);
    this.hud.classList.toggle('camera-hidden', active);
    document.documentElement.classList.toggle('camera-active', active);
    if (!active) this.setCameraFocus(null);
  }

  setCameraFocus(focus) {
    const valid = Boolean(focus?.valid);
    this.reticle.classList.toggle('locked', valid);
    if (!focus) {
      this['camera-focus-label'].textContent = 'Look for nearby subjects';
    } else if (valid) {
      const subject = focus.subject.photoSubject || focus.subject.species;
      this['camera-focus-label'].textContent = `${subject.emoji} ${subject.name} · Ready`;
    } else {
      const subject = focus.subject.photoSubject || focus.subject.species;
      this['camera-focus-label'].textContent = `${subject.name} · Center the subject`;
    }
  }

  flash() {
    if (this.reducedMotion) return;
    this['camera-flash'].classList.remove('flash');
    void this['camera-flash'].offsetWidth;
    this['camera-flash'].classList.add('flash');
  }

  showPhotoResult({ previewUrl, subject, species, isNew }) {
    const display = subject || species;
    this['photo-preview'].src = previewUrl;
    this['photo-result-kicker'].textContent = isNew ? 'NEW DISCOVERY' : 'ANOTHER LOVELY SHOT';
    this['photo-result-name'].textContent = `${display.emoji} ${display.name}`;
    this['photo-result'].classList.remove('hidden');
    setTimeout(() => this['photo-result'].classList.add('hidden'), 2100);
  }

  showDialog({ eyebrow = 'Local request', speaker, emoji, title, body, actionLabel = 'Continue', onAction, dismissible = true }) {
    this['modal-content'].innerHTML = `
      <span class="eyebrow">${eyebrow}</span>
      <div class="speaker-mark">${emoji || '✦'}</div>
      <h2>${title}</h2>
      ${speaker ? `<strong class="speaker-name">${speaker}</strong>` : ''}
      <p>${body}</p>
    `;
    this['modal-action'].textContent = actionLabel;
    this['modal-close'].classList.toggle('hidden', !dismissible);
    this.dialogAction = onAction;
    this['modal-layer'].classList.remove('hidden');
  }

  closeDialog() {
    this['modal-layer'].classList.add('hidden');
    this.dialogAction = null;
    this.callbacks.modalClosed?.();
  }

  async showFieldGuide(save, loadPhoto) {
    this['guide-layer'].classList.remove('hidden');
    const discovered = Object.keys(save.discoveries).length;
    const total = Object.keys(PHOTO_SUBJECTS).length;
    this['guide-progress'].innerHTML = `<strong>${discovered} / ${total}</strong><span>subjects photographed</span><div><i style="width:${(discovered / total) * 100}%"></i></div>`;
    this['guide-grid'].innerHTML = Object.values(PHOTO_SUBJECTS).map((subject) => {
      const found = Boolean(save.discoveries[subject.id]);
      return `
        <article class="guide-entry ${found ? 'found' : 'unknown'}" data-guide-id="${subject.id}">
          <div class="guide-image"><span>${found ? subject.emoji : '?'}</span></div>
          <div><small>${BIOMES[subject.biome].emoji} ${BIOMES[subject.biome].shortName} · ${subject.category}</small>
          <strong>${found ? subject.name : 'Undiscovered'}</strong>
          <p>${found ? subject.note : 'Find this subject somewhere on your orbit.'}</p></div>
        </article>
      `;
    }).join('');
    await Promise.all(Object.keys(save.discoveries).map(async (subjectId) => {
      const blob = await loadPhoto(subjectId);
      if (!blob || !this['guide-layer'].isConnected) return;
      const entry = this['guide-grid'].querySelector(`[data-guide-id="${subjectId}"] .guide-image`);
      if (!entry) return;
      if (this.photoUrls.has(subjectId)) URL.revokeObjectURL(this.photoUrls.get(subjectId));
      const url = URL.createObjectURL(blob);
      this.photoUrls.set(subjectId, url);
      entry.innerHTML = `<img src="${url}" alt="${PHOTO_SUBJECTS[subjectId]?.name || 'Field-guide subject'} photograph" />`;
    }));
  }

  hideFieldGuide() {
    this['guide-layer'].classList.add('hidden');
    this.callbacks.modalClosed?.();
  }

  showOutfitter(save) {
    this['outfitter-layer'].classList.remove('hidden');
    const inventory = Object.entries(save.inventory).filter(([, count]) => count > 0);
    const total = calculateInventoryValue(save.inventory, COLLECTIBLES);
    this['inventory-summary'].innerHTML = inventory.length
      ? inventory.map(([id, count]) => `<span>${COLLECTIBLES[id].emoji} ${COLLECTIBLES[id].name} ×${count}</span>`).join('') + `<strong>Worth ${total} bells</strong>`
      : '<span>Your gathering pouch is empty.</span>';
    this['sell-button'].disabled = inventory.length === 0;
    this['cosmetic-list'].innerHTML = Object.values(COSMETICS)
      .filter((item) => item.price !== null)
      .map((item) => {
        const owned = save.unlockedCosmetics.includes(item.id);
        const equipped = save.equippedCosmetic === item.id;
        return `<button data-cosmetic="${item.id}" ${!owned && save.bells < item.price ? 'disabled' : ''}>
          <span>${item.emoji}</span><div><strong>${item.name}</strong><small>${owned ? (equipped ? 'Equipped' : 'Owned') : `${item.price} bells`}</small></div>
        </button>`;
      }).join('');
    this['cosmetic-list'].querySelectorAll('[data-cosmetic]').forEach((button) => {
      button.addEventListener('click', () => this.callbacks.cosmetic?.(button.dataset.cosmetic));
    });
  }

  hideOutfitter() {
    this['outfitter-layer'].classList.add('hidden');
    this.callbacks.modalClosed?.();
  }

  applySettings(settings = {}) {
    this.reducedMotion = Boolean(settings.reducedMotion);
    document.documentElement.classList.toggle('reduced-motion', this.reducedMotion);
  }

  updateSettingsPanel(settings) {
    const soundEnabled = Boolean(settings.sound);
    const motionReduced = Boolean(settings.reducedMotion);
    this['sound-setting'].setAttribute('aria-checked', String(soundEnabled));
    this['sound-setting-value'].textContent = soundEnabled ? 'On' : 'Off';
    this['motion-setting'].setAttribute('aria-checked', String(motionReduced));
    this['motion-setting-value'].textContent = motionReduced ? 'On' : 'Off';
  }

  showSettings(save) {
    this.updateSettingsPanel(save.settings);
    this['settings-layer'].classList.remove('hidden');
    this['settings-close'].focus({ preventScroll: true });
  }

  hideSettings() {
    this['settings-layer'].classList.add('hidden');
    this.callbacks.modalClosed?.();
    this['settings-button'].focus({ preventScroll: true });
  }

  showFinale(save) {
    this['finale-copy'].textContent = `${save.playerName}, you crossed every region, helped every ranger, and filled the first pages of a field guide that is entirely your own.`;
    this['finale-stamps'].innerHTML = BIOME_ORDER.map((id) => `<span>${BIOMES[id].emoji}<small>${BIOMES[id].shortName}</small></span>`).join('');
    this['finale-layer'].classList.remove('hidden');
  }

  toastMessage(message, tone = 'default') {
    clearTimeout(this.toastTimer);
    this.toast.textContent = message;
    this.toast.dataset.tone = tone;
    this.toast.classList.remove('hidden');
    this.toastTimer = setTimeout(() => this.toast.classList.add('hidden'), 2500);
  }
}
