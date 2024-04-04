import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import SceneManager from '..';


class Loader {
  private scm: SceneManager;
  private loaderTexture: THREE.TextureLoader;
  private loaderGLTF: GLTFLoader;
  private loaderFBX: FBXLoader;

  constructor(scm: SceneManager) {
    console.log('[Initialization] Loader')
    this.scm = scm;
    this.loaderTexture = new THREE.TextureLoader();
    this.loaderGLTF = new GLTFLoader();
    this.loaderFBX = new FBXLoader();
  }

  public loadTexture(url: string) {
    return this.loaderTexture.load(url);
  }

  public loadModel(url: string, callback: (model: THREE.Group, animations: THREE.AnimationClip[]) => void, errorCallback?: (error: ErrorEvent) => void) {
    this.loaderGLTF.load(
      url,
      (gltf: GLTF) => {
          const model = gltf.scene;
          const animations = gltf.animations;
          callback(model, animations);
      },
      undefined,
      errorCallback
    );
  }
  public loadModelAsync(url: string): Promise<[THREE.Group, THREE.AnimationClip[]]> {
    return new Promise((resolve, reject) => {
        this.loaderGLTF.load(
            url,
            (gltf: GLTF) => {
              console.log(gltf)
              const model = gltf.scene;
              const animations = gltf.animations;
              console.log(animations)
              resolve([model, animations]);
            },
            undefined,
            (error) => {
              reject(error);
            }
        );
    });
  }

  public loadModelFbxAsync(url: string): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
        this.loaderFBX.load(
            url,
            (model) => {
              resolve(model);
            },
            undefined,
            (error) => {
              reject(error);
            }
        );
    });
  }
}

export default Loader;