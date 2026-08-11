import * as THREE from 'three';

const CAPTURE_WIDTH = 480;
const CAPTURE_HEIGHT = 270;

export class PhotographySystem {
  constructor({ renderer, scene, camera, wildlife, subjects, onFocusChanged }) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.subjects = subjects || wildlife;
    this.onFocusChanged = onFocusChanged;
    this.focus = null;
    this.forcedSubjectId = null;
    this.visibleSubjects = [];
    this.aim = { x: 0, y: 0 };
    this.target = new THREE.WebGLRenderTarget(CAPTURE_WIDTH, CAPTURE_HEIGHT, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });
    this.projected = new THREE.Vector3();
    this.worldPosition = new THREE.Vector3();
  }

  resetAim() {
    this.aim.x = 0;
    this.aim.y = 0;
  }

  forceSubject(subjectId) {
    this.forcedSubjectId = subjectId || null;
  }

  adjustAim(dx, dy) {
    this.aim.x = THREE.MathUtils.clamp(this.aim.x + dx, -1, 1);
    this.aim.y = THREE.MathUtils.clamp(this.aim.y + dy, -0.65, 0.65);
  }

  update(playerPosition) {
    const candidates = [];
    for (const subject of this.subjects) {
      if (subject.collected || subject.root.visible === false) continue;
      subject.focus.getWorldPosition(this.worldPosition);
      const distance = this.worldPosition.distanceTo(playerPosition);
      if (distance > 11) continue;
      this.projected.copy(this.worldPosition).project(this.camera);
      if (this.projected.z < -1 || this.projected.z > 1) continue;
      const centerDistance = Math.hypot(this.projected.x, this.projected.y);
      candidates.push({
        subject,
        distance,
        centerDistance,
        screen: { x: this.projected.x, y: this.projected.y },
        valid: distance <= 9.5 && centerDistance <= 0.38,
      });
    }
    candidates.sort((a, b) => {
      if (this.forcedSubjectId) {
        const aId = a.subject.photoSubject?.id || a.subject.species?.id;
        const bId = b.subject.photoSubject?.id || b.subject.species?.id;
        if (aId === this.forcedSubjectId && bId !== this.forcedSubjectId) return -1;
        if (bId === this.forcedSubjectId && aId !== this.forcedSubjectId) return 1;
      }
      return a.centerDistance - b.centerDistance || a.distance - b.distance;
    });
    this.visibleSubjects = candidates;
    const previous = this.focus?.subject.id;
    this.focus = candidates[0] || null;
    if (previous !== this.focus?.subject.id) this.onFocusChanged?.(this.focus);
    return this.focus;
  }

  async capture() {
    const previousTarget = this.renderer.getRenderTarget();
    const previousAspect = this.camera.aspect;
    this.camera.aspect = CAPTURE_WIDTH / CAPTURE_HEIGHT;
    this.camera.updateProjectionMatrix();
    this.renderer.setRenderTarget(this.target);
    this.renderer.render(this.scene, this.camera);

    const pixels = new Uint8Array(CAPTURE_WIDTH * CAPTURE_HEIGHT * 4);
    this.renderer.readRenderTargetPixels(this.target, 0, 0, CAPTURE_WIDTH, CAPTURE_HEIGHT, pixels);
    this.renderer.setRenderTarget(previousTarget);
    this.camera.aspect = previousAspect;
    this.camera.updateProjectionMatrix();

    const canvas = document.createElement('canvas');
    canvas.width = CAPTURE_WIDTH;
    canvas.height = CAPTURE_HEIGHT;
    const context = canvas.getContext('2d');
    const image = context.createImageData(CAPTURE_WIDTH, CAPTURE_HEIGHT);
    const rowBytes = CAPTURE_WIDTH * 4;
    for (let row = 0; row < CAPTURE_HEIGHT; row += 1) {
      const sourceStart = (CAPTURE_HEIGHT - row - 1) * rowBytes;
      image.data.set(pixels.subarray(sourceStart, sourceStart + rowBytes), row * rowBytes);
    }
    context.putImageData(image, 0, 0);

    const previewUrl = canvas.toDataURL('image/webp', 0.76);
    const [header, encoded] = previewUrl.split(',');
    const mime = header.match(/data:([^;]+)/)?.[1] || 'image/png';
    const bytes = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
    const blob = new Blob([bytes], { type: mime });
    return {
      blob,
      previewUrl,
      focus: this.focus,
    };
  }

  dispose() {
    this.target.dispose();
  }
}
