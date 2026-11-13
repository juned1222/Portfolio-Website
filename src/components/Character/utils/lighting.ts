import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  const directionalLight = new THREE.DirectionalLight(0xc7a9ff, 0);
  directionalLight.intensity = 0;
  directionalLight.position.set(-0.47, -0.32, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  // Purple Neon Rim Light (Left) - outlines hair, left ear and shoulder
  const rimLightLeft = new THREE.DirectionalLight(0xa855f7, 0);
  rimLightLeft.position.set(-6, 14, -8);
  scene.add(rimLightLeft);

  // Purple Neon Rim Light (Right) - outlines hair, right ear and shoulder
  const rimLightRight = new THREE.DirectionalLight(0xc084fc, 0);
  rimLightRight.position.set(6, 15, -7);
  scene.add(rimLightRight);

  // Soft Warm Front-Fill Light - keeps facial features, eyes and expression crisp
  const frontFillLight = new THREE.DirectionalLight(0xffeedd, 0);
  frontFillLight.position.set(0, 13, 16);
  scene.add(frontFillLight);

  const pointLight = new THREE.PointLight(0xc2a4ff, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = true;
  scene.add(pointLight);

  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

  function setPointLight(screenLight: any) {
    if (screenLight.material.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 20;
    } else {
      pointLight.intensity = 0;
    }
  }
  const duration = 2;
  const ease = "power2.inOut";
  function turnOnLights() {
    gsap.to(scene, {
      environmentIntensity: 0.64,
      duration: duration,
      ease: ease,
    });
    gsap.to(directionalLight, {
      intensity: 1,
      duration: duration,
      ease: ease,
    });
    gsap.to(rimLightLeft, {
      intensity: 3.5,
      duration: duration,
      ease: ease,
    });
    gsap.to(rimLightRight, {
      intensity: 2.8,
      duration: duration,
      ease: ease,
    });
    gsap.to(frontFillLight, {
      intensity: 0.75,
      duration: duration,
      ease: ease,
    });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 2,
    });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;
