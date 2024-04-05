import * as THREE from 'three';

import ObjectGroup from '../engine/ObjectGroup';

export default class Sky extends ObjectGroup {
  clouds: Clouds[] = [];
  particles: Particles;

  constructor() {    
    super();
    this.name = 'sky';
    console.log('[OBJECT] Sky loaded');

    const loader = this.smc.getLoader();
    const skyTexture = loader.loadTexture('./textures/sky.png');
    const cloud1Texture = loader.loadTexture('./textures/cloud_1.png');
    const cloud2Texture = loader.loadTexture('./textures/cloud_2.png');
    const particlesTexture = loader.loadTexture('./textures/particles.png');

    const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.DoubleSide });
    const skyGeometry = new THREE.SphereGeometry(300, 32, 32);
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    this.add(sky);

    const clouds1 = new Clouds(cloud1Texture, 200, 50);
    const clouds2 = new Clouds(cloud2Texture, 100, 50);
    this.clouds = [clouds1, clouds2];
    this.particles = new Particles(particlesTexture, 9000);
    this.add(clouds1, clouds2, this.particles);
  }

  update(dt: number) {
    this.clouds.forEach((cloud) => {
      cloud.update(dt);
    })
    this.particles.update(dt);
  }
}

class Clouds extends THREE.Points {
  cloudGeometry: THREE.BufferGeometry
  animationSpeed = 0.008;

  constructor(cloudTexture: THREE.Texture, radius: number, numClouds: number) {
    const cloudMaterial = new THREE.PointsMaterial({
        size: 80,
        map: cloudTexture,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
    });

    const cloudGeometry = new THREE.BufferGeometry();

    const positions = [];
    for (let i = 0; i < numClouds; i++) {
        const phi = Math.acos(-1 + (2 * i) / numClouds);
        const theta = Math.sqrt(numClouds * Math.PI) * phi;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        positions.push(x, y, z);
    }

    cloudGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    super(cloudGeometry, cloudMaterial);

    this.cloudGeometry = cloudGeometry;
  }

  update(dt: number) {
    const positions = this.cloudGeometry.getAttribute('position');
  
    for (let i = 0; i < positions.count; i++) {
        positions.setXYZ(i, positions.getX(i) - this.animationSpeed, positions.getY(i), positions.getZ(i));
        if (positions.getX(i) < -200) {
            positions.setXYZ(i, 100, positions.getY(i), positions.getZ(i));
        }
    }
    positions.needsUpdate = true;
  }
}

class Particles extends THREE.Points {
  particleSpeed = 0.01;
  initialPositions: any[];

  constructor(texture: THREE.Texture, numParticles: number) {
      super();
      const geometry = new THREE.BufferGeometry();

      const positions = [];
      const sizes = [];
      for (let i = 0; i < numParticles; i++) {
          const particlePosition = new THREE.Vector3(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
          );

          positions.push(particlePosition.x, particlePosition.y, particlePosition.z);

          const size = Math.random() * 10 + 5;
          sizes.push(size);
      }

      this.initialPositions = positions;
  
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
          size: 10,
          map: texture,
          transparent: true,
          opacity: 0.8,
          depthWrite: false,
      });

      const particles = new THREE.Points(geometry, material);
      this.add(particles);
  }

  update(dt: number) {
      if (this.children.length > 0 && this.children[0] instanceof THREE.Points) {
          const points = this.children[0] as THREE.Points;
          const geometry = points.geometry as THREE.BufferGeometry;
          const positions = geometry.getAttribute('position') as THREE.BufferAttribute;

          const positionsArray = positions.array as any;

          for (let i = 0; i < positionsArray.length; i += 3) {
              positionsArray[i + 2] -= this.particleSpeed * dt;
              if (positionsArray[i + 2] < -1000) {
                  positionsArray[i] = this.initialPositions[i];
                  positionsArray[i + 1] = this.initialPositions[i + 1];
                  positionsArray[i + 2] = this.initialPositions[i + 2];
              }
          }
          positions.needsUpdate = true;
      }
  }
}