import * as THREE from 'three';

import ObjectGroup from '../engine/ObjectGroup';

const PLANE_SIZE = 40;
const GRASS_WIDTH = 0.1;
const GRASS_HEIGHT = 0.8;
const GRASS_HEIGHT_VARIATION = 0.6;
const GRASS_BLADES = 100000;

const timeUniform = { type: 'f', value: 0.0 };

export default class Ground extends ObjectGroup {
  grassInstances: THREE.Mesh[] = [];
  grassUniforms: {
    textures: { value: THREE.Texture[] },
    iTime: {
      type: string,
      value: number
    }
  }

  constructor() {    
    super();
    this.name = 'ground';
    console.log('[OBJECT] Ground loaded');

    const loader = this.smc.getLoader();
    const textureGrassInter = loader.loadTexture('./textures/grass_inter.jpg');
    const heightGrass = loader.loadTexture('./textures/grass_height.png');
    const alphaGrass = loader.loadTexture('./textures/grass_alpha.png');
    const textureGrass = loader.loadTexture('./textures/grass.jpg');

    this.grassUniforms = {
      textures: { value: [textureGrassInter] },
      iTime: timeUniform
    };

    const geometry = new THREE.PlaneGeometry(PLANE_SIZE + 15, PLANE_SIZE + 9);
    const material = new THREE.MeshStandardMaterial({
      color: 'gray',
      map: textureGrass,
      displacementMap: heightGrass,
      displacementScale: 1,
      alphaMap: alphaGrass,
      transparent: true
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, -1, 0);
    plane.rotateX(4.85)
    this.smc.add(plane);

    this.addGrass()
  }

  private async addGrass() {
    const positions = [];
    const uvs = [];
    const indices = [];
    const colors = [];

    const grassMaterial = new THREE.ShaderMaterial({
      uniforms: this.grassUniforms,
      vertexShader: grassShaderVert,
      fragmentShader: grassShaderFrag,
      vertexColors: true,
      side: THREE.DoubleSide
    });

    for (let i = 0; i < GRASS_BLADES; i++) {
      const VERTEX_COUNT = 5;
      const surfaceMin = PLANE_SIZE / 2 * -1;
      const surfaceMax = PLANE_SIZE / 2;
      const radius = PLANE_SIZE / 2;
  
      const r = radius * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
  
      const pos = new THREE.Vector3(x, 0, y);
  
      const uv = [convertRange(pos.x, surfaceMin, surfaceMax, 0, 1), convertRange(pos.z, surfaceMin, surfaceMax, 0, 1)];
  
      const blade = generateBlade(pos, i * VERTEX_COUNT, uv);
      blade.verts.forEach(vert => {
        positions.push(...vert.pos);
        uvs.push(...vert.uv);
        colors.push(...vert.color);
      });
      blade.indices.forEach(indice => indices.push(indice));
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geom.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
    geom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    // geom.computeFaceNormals();
  
    const mesh = new THREE.Mesh(geom, grassMaterial);
    this.add(mesh);
    this.grassInstances.push(mesh);
  }

  public update(dt: number) {
    timeUniform.value += 3.5;
  }
}

function convertRange (val: number, oldMin: number, oldMax: number, newMin: number, newMax: number) {
  return (((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
}

function generateBlade (center: THREE.Vector3, vArrOffset: number, uv: number[]) {
  const MID_WIDTH = GRASS_WIDTH * 0.5;
  const TIP_OFFSET = 0.1;
  const height = GRASS_HEIGHT + (Math.random() * GRASS_HEIGHT_VARIATION);

  const yaw = Math.random() * Math.PI * 2;
  const yawUnitVec = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
  const tipBend = Math.random() * Math.PI * 2;
  const tipBendUnitVec = new THREE.Vector3(Math.sin(tipBend), 0, -Math.cos(tipBend));

  // Find the Bottom Left, Bottom Right, Top Left, Top right, Top Center vertex positions
  const bl = new THREE.Vector3().addVectors(center, new THREE.Vector3().copy(yawUnitVec).multiplyScalar((GRASS_WIDTH / 2) * 1));
  const br = new THREE.Vector3().addVectors(center, new THREE.Vector3().copy(yawUnitVec).multiplyScalar((GRASS_WIDTH / 2) * -1));
  const tl = new THREE.Vector3().addVectors(center, new THREE.Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * 1));
  const tr = new THREE.Vector3().addVectors(center, new THREE.Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * -1));
  const tc = new THREE.Vector3().addVectors(center, new THREE.Vector3().copy(tipBendUnitVec).multiplyScalar(TIP_OFFSET));

  tl.y += height / 2;
  tr.y += height / 2;
  tc.y += height;

  // Vertex Colors
  const black = [0, 0, 0];
  const gray = [0.5, 0.5, 0.5];
  const white = [1.0, 1.0, 1.0];

  const verts = [
    { pos: bl.toArray(), uv: uv, color: black },
    { pos: br.toArray(), uv: uv, color: black },
    { pos: tr.toArray(), uv: uv, color: gray },
    { pos: tl.toArray(), uv: uv, color: gray },
    { pos: tc.toArray(), uv: uv, color: white }
  ];

  const indices = [
    vArrOffset,
    vArrOffset + 1,
    vArrOffset + 2,
    vArrOffset + 2,
    vArrOffset + 4,
    vArrOffset + 3,
    vArrOffset + 3,
    vArrOffset,
    vArrOffset + 2
  ];

  return { verts, indices };
}

const grassShaderFrag = `uniform sampler2D texture1;
uniform sampler2D textures[4];

varying vec2 vUv;
varying vec2 cloudUV;
varying vec3 vColor;

void main() {
  float contrast = 1.5;
  float brightness = 0.1;
  vec3 color = texture2D(textures[0], vUv).rgb * contrast;
  color = color + vec3(brightness, brightness, brightness);
  color = mix(color, texture2D(textures[1], cloudUV).rgb, 0.4);
  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.;
}`
const grassShaderVert = `varying vec2 vUv;
varying vec2 cloudUV;

varying vec3 vColor;
uniform float iTime;

void main() {
  vUv = uv;
  cloudUV = uv;
  vColor = color;
  vec3 cpos = position;

  float waveSize = 10.0f;
  float tipDistance = 0.3f;
  float centerDistance = 0.1f;

  if (color.x > 0.6f) {
    cpos.x += sin((iTime / 500.) + (uv.x * waveSize)) * tipDistance;
  }else if (color.x > 0.0f) {
    cpos.x += sin((iTime / 500.) + (uv.x * waveSize)) * centerDistance;
  }

  float diff = position.x - cpos.x;
  cloudUV.x += iTime / 20000.;
  cloudUV.y += iTime / 10000.;

  vec4 worldPosition = vec4(cpos, 1.);
  vec4 mvPosition = projectionMatrix * modelViewMatrix * vec4(cpos, 1.0);
  gl_Position = mvPosition;
}`