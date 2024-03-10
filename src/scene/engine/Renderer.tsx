import * as THREE from 'three';
import SceneManager from '..';

class Renderer {
  private scm: SceneManager;
  public renderer: THREE.WebGLRenderer;

  constructor(scm: SceneManager) {
    console.log('[Initialization] Renderer');
    this.scm = scm;
  
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.setRendererSize();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 3;
    // this.renderer.setClearColor(0x7ec0ee, 1);
  }

  public setRendererSize(width = window.innerWidth, height = window.innerHeight) {
    this.renderer.setSize(width, height);
  }
}

export default Renderer;