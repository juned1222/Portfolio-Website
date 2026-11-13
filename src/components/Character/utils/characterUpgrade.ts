import * as THREE from "three";
import { GLTF } from "three-stdlib";

/**
 * Creates a high-resolution, cartoon-realistic eye texture.
 * Features:
 * - Pure white sclera with subtle top ambient shading
 * - Deep amethyst/violet gradient iris with radial striations
 * - Dark pupil with glossy white specular catchlight
 * - Relaxed, confident half-lidded upper rim
 */
function createStylizedEyeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  const cx = 256;
  const cy = 256;

  // 1. Sclera (Eye White)
  ctx.fillStyle = "#f8f9fc";
  ctx.fillRect(0, 0, 512, 512);

  // Soft ambient shadow at top of eye
  const scleraGrad = ctx.createLinearGradient(0, 0, 0, 512);
  scleraGrad.addColorStop(0, "rgba(20, 15, 30, 0.25)");
  scleraGrad.addColorStop(0.35, "rgba(20, 15, 30, 0.05)");
  scleraGrad.addColorStop(0.5, "transparent");
  ctx.fillStyle = scleraGrad;
  ctx.fillRect(0, 0, 512, 512);

  // 2. Outer Iris Limbal Ring
  const irisRadius = 145;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, irisRadius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Vibrant purple/violet radial gradient
  const irisGrad = ctx.createRadialGradient(cx, cy, 25, cx, cy, irisRadius);
  irisGrad.addColorStop(0, "#c084fc"); // bright lilac center
  irisGrad.addColorStop(0.45, "#9333ea"); // electric purple mid
  irisGrad.addColorStop(0.82, "#6b21a8"); // deep amethyst
  irisGrad.addColorStop(1.0, "#2e1065"); // dark limbal border
  ctx.fillStyle = irisGrad;
  ctx.fillRect(cx - irisRadius, cy - irisRadius, irisRadius * 2, irisRadius * 2);

  // Subtle radial striations for realism
  ctx.strokeStyle = "rgba(216, 180, 254, 0.28)";
  ctx.lineWidth = 2;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 24) {
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 45, cy + Math.sin(a) * 45);
    ctx.lineTo(cx + Math.cos(a) * (irisRadius - 8), cy + Math.sin(a) * (irisRadius - 8));
    ctx.stroke();
  }

  // 3. Pupil
  const pupilRadius = 56;
  ctx.fillStyle = "#0c0814";
  ctx.beginPath();
  ctx.arc(cx, cy, pupilRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Dark limbal ring stroke
  ctx.strokeStyle = "#250d4f";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, irisRadius, 0, Math.PI * 2);
  ctx.stroke();

  // 4. Crisp glossy specular highlights (Catchlights)
  // Primary highlight (upper right)
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cx + 42, cy - 42, 24, 0, Math.PI * 2);
  ctx.fill();

  // Secondary soft bounce highlight (lower left)
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.beginPath();
  ctx.arc(cx - 38, cy + 42, 12, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a high-res facial diffuse/subsurface texture for natural warm cartoon skin
 * with a confident, slight smirk.
 */
function createStylizedFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Warm, natural cartoon-realistic skin base tone
  ctx.fillStyle = "#f5ccb9";
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft cheek flush & warm contour
  const flushGrad = ctx.createRadialGradient(512, 540, 100, 512, 540, 480);
  flushGrad.addColorStop(0, "rgba(244, 114, 120, 0.12)");
  flushGrad.addColorStop(0.6, "rgba(235, 130, 110, 0.08)");
  flushGrad.addColorStop(1.0, "transparent");
  ctx.fillStyle = flushGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft jaw and chin contour
  const jawGrad = ctx.createLinearGradient(0, 600, 0, 1024);
  jawGrad.addColorStop(0, "transparent");
  jawGrad.addColorStop(0.7, "rgba(180, 100, 80, 0.1)");
  jawGrad.addColorStop(1, "rgba(140, 70, 55, 0.18)");
  ctx.fillStyle = jawGrad;
  ctx.fillRect(0, 600, 1024, 424);

  // Confident slight smirk mouth line
  // Left corner slightly upturned in a relaxed, confident smile
  ctx.strokeStyle = "rgba(165, 75, 75, 0.75)";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(430, 750);
  ctx.quadraticCurveTo(512, 770, 595, 742); // right side curved up slightly
  ctx.stroke();

  // Subtle upper lip shading
  ctx.fillStyle = "rgba(210, 95, 95, 0.28)";
  ctx.beginPath();
  ctx.ellipse(512, 746, 75, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Soft bottom lip warm fullness
  ctx.fillStyle = "rgba(225, 105, 105, 0.35)";
  ctx.beginPath();
  ctx.ellipse(512, 774, 60, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Subtle nose bridge & soft tip highlight
  const noseGrad = ctx.createRadialGradient(512, 580, 10, 512, 580, 65);
  noseGrad.addColorStop(0, "rgba(255, 240, 235, 0.3)");
  noseGrad.addColorStop(0.7, "rgba(230, 120, 100, 0.12)");
  noseGrad.addColorStop(1, "transparent");
  ctx.fillStyle = noseGrad;
  ctx.beginPath();
  ctx.arc(512, 580, 65, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates a curved, smoothly tapering stylized 3D hair spike geometry.
 */
function createCurvedSpikeGeometry(
  length: number,
  baseRadius: number,
  curve: THREE.Vector3,
  radialSegs = 8,
  heightSegs = 6
): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= heightSegs; i++) {
    const t = i / heightSegs;
    const x = curve.x * t * t;
    const y = length * t + curve.y * t * t;
    const z = curve.z * t * t;
    points.push(new THREE.Vector3(x, y, z));
  }

  const path = new THREE.CatmullRomCurve3(points);
  const geom = new THREE.BufferGeometry();
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= heightSegs; i++) {
    const t = i / heightSegs;
    const center = path.getPoint(t);
    const tangent = path.getTangent(t).normalize();

    let r = 0;
    if (t < 0.25) {
      r = THREE.MathUtils.lerp(baseRadius * 0.7, baseRadius, t / 0.25);
    } else {
      r = THREE.MathUtils.lerp(baseRadius, 0.012, Math.pow((t - 0.25) / 0.75, 1.3));
    }

    const up = new THREE.Vector3(0, 1, 0);
    let normal = new THREE.Vector3().crossVectors(tangent, up).normalize();
    if (normal.lengthSq() < 0.001) normal = new THREE.Vector3(1, 0, 0);
    const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

    for (let j = 0; j <= radialSegs; j++) {
      const angle = (j / radialSegs) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const px = center.x + (normal.x * cos + binormal.x * sin) * r;
      const py = center.y + (normal.y * cos + binormal.y * sin) * r;
      const pz = center.z + (normal.z * cos + binormal.z * sin) * r;
      positions.push(px, py, pz);

      const nx = normal.x * cos + binormal.x * sin;
      const ny = normal.y * cos + binormal.y * sin;
      const nz = normal.z * cos + binormal.z * sin;
      normals.push(nx, ny, nz);

      uvs.push(j / radialSegs, t);
    }
  }

  for (let i = 0; i < heightSegs; i++) {
    for (let j = 0; j < radialSegs; j++) {
      const a = i * (radialSegs + 1) + j;
      const b = (i + 1) * (radialSegs + 1) + j;
      const c = (i + 1) * (radialSegs + 1) + (j + 1);
      const d = i * (radialSegs + 1) + (j + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  return geom;
}

/**
 * Builds the voluminous stylish spiky hairstyle inspired by the reference image.
 * Attached to headBone (spine006) so it turns seamlessly with mouse look!
 */
function buildVoluminousSpikyHair(hairMaterial: THREE.Material): THREE.Group {
  const hairGroup = new THREE.Group();
  hairGroup.name = "stylishVoluminousHair";

  // Base scalp volume
  const scalpGeom = new THREE.SphereGeometry(1.08, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.65);
  scalpGeom.scale(1.05, 1.15, 1.12);
  const scalp = new THREE.Mesh(scalpGeom, hairMaterial);
  scalp.position.set(0, 0.28, -0.05);
  scalp.castShadow = true;
  scalp.receiveShadow = true;
  hairGroup.add(scalp);

  // Stylized Spikes configuration: [length, baseRadius, curveX, curveY, curveZ, posX, posY, posZ, rotX, rotY, rotZ]
  const spikesConfig: Array<[number, number, [number, number, number], [number, number, number], [number, number, number]]> = [
    // Top Crown Spikes (Voluminous, stylishly spiky & messy)
    [0.95, 0.32, [0.05, 0.15, -0.25], [0, 1.18, 0.05], [-0.15, 0, 0.05]],
    [0.88, 0.30, [-0.15, 0.12, -0.2], [-0.28, 1.12, 0.1], [-0.1, -0.15, 0.2]],
    [0.92, 0.30, [0.18, 0.14, -0.18], [0.32, 1.14, 0.08], [-0.08, 0.18, -0.22]],
    [0.82, 0.28, [-0.08, 0.18, -0.3], [0.05, 1.05, -0.22], [-0.35, 0.05, 0]],
    [0.78, 0.26, [0.15, 0.15, -0.28], [0.25, 0.98, -0.3], [-0.4, 0.2, -0.1]],
    [0.76, 0.26, [-0.2, 0.12, -0.25], [-0.3, 0.96, -0.28], [-0.38, -0.2, 0.1]],

    // Front Fringe / Bangs (Framing forehead naturally like reference)
    [0.68, 0.25, [0.08, -0.12, 0.18], [0.08, 0.95, 0.68], [0.65, 0.12, -0.1]],
    [0.62, 0.23, [-0.14, -0.08, 0.16], [-0.22, 0.92, 0.65], [0.62, -0.18, 0.15]],
    [0.64, 0.24, [0.22, -0.1, 0.14], [0.34, 0.9, 0.62], [0.58, 0.25, -0.2]],
    [0.55, 0.20, [-0.18, -0.05, 0.12], [-0.48, 0.82, 0.55], [0.52, -0.35, 0.28]],
    [0.56, 0.21, [0.18, -0.06, 0.12], [0.52, 0.8, 0.52], [0.48, 0.38, -0.25]],

    // Upper Sides & Temple Wings
    [0.72, 0.28, [0.25, 0.08, -0.05], [0.72, 0.85, 0.18], [0.1, 0.3, -0.5]],
    [0.74, 0.28, [-0.25, 0.08, -0.05], [-0.72, 0.85, 0.18], [0.1, -0.3, 0.5]],
    [0.68, 0.26, [0.22, -0.05, -0.12], [0.82, 0.65, -0.05], [-0.1, 0.45, -0.6]],
    [0.68, 0.26, [-0.22, -0.05, -0.12], [-0.82, 0.65, -0.05], [-0.1, -0.45, 0.6]],

    // Back & Lower Silhouette (Gives dense, premium volumetric profile)
    [0.75, 0.28, [0, -0.15, -0.22], [0, 0.68, -0.72], [-0.7, 0, 0]],
    [0.7, 0.26, [0.18, -0.12, -0.18], [0.38, 0.62, -0.68], [-0.65, 0.3, -0.2]],
    [0.7, 0.26, [-0.18, -0.12, -0.18], [-0.38, 0.62, -0.68], [-0.65, -0.3, 0.2]],
    [0.62, 0.24, [0, -0.2, -0.15], [0, 0.35, -0.78], [-0.85, 0, 0]],
  ];

  spikesConfig.forEach(([len, rad, [cx, cy, cz], [px, py, pz], [rx, ry, rz]]) => {
    const spikeGeom = createCurvedSpikeGeometry(len, rad, new THREE.Vector3(cx, cy, cz));
    const spike = new THREE.Mesh(spikeGeom, hairMaterial);
    spike.position.set(px, py, pz);
    spike.rotation.set(rx, ry, rz);
    spike.castShadow = true;
    spike.receiveShadow = true;
    hairGroup.add(spike);
  });

  return hairGroup;
}

/**
 * Creates the minimal developer-style `</>` symbol in 3D geometry.
 * Subtle, clean, luminous purple, attached to the hoodie chest.
 */
function buildDeveloperBrandingBadge(): THREE.Group {
  const badgeGroup = new THREE.Group();
  badgeGroup.name = "developerHoodieBadge";

  const symbolMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#d8b4fe"), // soft lavender highlight
    emissive: new THREE.Color("#9333ea"), // electric neon purple glow
    emissiveIntensity: 2.8,
    roughness: 0.22,
    metalness: 0.15,
  });

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.035,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.008,
    bevelThickness: 0.008,
  };

  // Helper: Create bracket `<` or `>`
  const createBracketShape = (isLeft: boolean) => {
    const s = new THREE.Shape();
    const dir = isLeft ? -1 : 1;
    const w = 0.12 * dir;
    const h = 0.15;
    const t = 0.035;

    s.moveTo(0, h);
    s.lineTo(w, 0);
    s.lineTo(0, -h);
    s.lineTo(0, -h + t * 1.45);
    s.lineTo(w - t * dir * 1.45, 0);
    s.lineTo(0, h - t * 1.45);
    s.closePath();
    return s;
  };

  // Helper: Create slash `/`
  const createSlashShape = () => {
    const s = new THREE.Shape();
    const w = 0.032;
    const h = 0.18;
    const slant = 0.065;

    s.moveTo(-slant - w / 2, -h);
    s.lineTo(-slant + w / 2, -h);
    s.lineTo(slant + w / 2, h);
    s.lineTo(slant - w / 2, h);
    s.closePath();
    return s;
  };

  // 1. Left Bracket `<`
  const leftGeom = new THREE.ExtrudeGeometry(createBracketShape(true), extrudeSettings);
  const leftMesh = new THREE.Mesh(leftGeom, symbolMaterial);
  leftMesh.position.set(-0.16, 0, 0);
  badgeGroup.add(leftMesh);

  // 2. Slash `/`
  const slashGeom = new THREE.ExtrudeGeometry(createSlashShape(), extrudeSettings);
  const slashMesh = new THREE.Mesh(slashGeom, symbolMaterial);
  slashMesh.position.set(0, 0, 0);
  badgeGroup.add(slashMesh);

  // 3. Right Bracket `>`
  const rightGeom = new THREE.ExtrudeGeometry(createBracketShape(false), extrudeSettings);
  const rightMesh = new THREE.Mesh(rightGeom, symbolMaterial);
  rightMesh.position.set(0.16, 0, 0);
  badgeGroup.add(rightMesh);

  // Subtle dark purple backplate to make the symbol pop against hoodie cloth
  const plateGeom = new THREE.PlaneGeometry(0.55, 0.42);
  const plateMat = new THREE.MeshBasicMaterial({
    color: 0x180f2b,
    transparent: true,
    opacity: 0.45,
  });
  const plate = new THREE.Mesh(plateGeom, plateMat);
  plate.position.set(0, 0, -0.015);
  badgeGroup.add(plate);

  // Scale to fit cleanly on the chest
  badgeGroup.scale.set(0.65, 0.65, 0.65);
  return badgeGroup;
}

/**
 * Creates 3D oversized hoodie collar volume and hanging drawstrings with silver eyelets.
 */
function buildHoodieCollarAndStrings(hoodieMaterial: THREE.Material): THREE.Group {
  const collarGroup = new THREE.Group();
  collarGroup.name = "oversizedHoodieDetails";

  // 1. Oversized Hood Collar Roll
  const collarGeom = new THREE.TorusGeometry(0.68, 0.22, 12, 28);
  collarGeom.scale(1.22, 0.95, 1.45);
  const collarMesh = new THREE.Mesh(collarGeom, hoodieMaterial);
  collarMesh.rotation.x = Math.PI / 2 + 0.15;
  collarMesh.position.set(0, 11.9, 0.12);
  collarMesh.castShadow = true;
  collarMesh.receiveShadow = true;
  collarGroup.add(collarMesh);

  // Silver metallic material for eyelets and aglets
  const silverMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#e9d5ff"),
    metalness: 0.92,
    roughness: 0.18,
  });

  // 2. Left and Right Drawstrings
  const stringGeom = new THREE.CylinderGeometry(0.018, 0.018, 1.25, 8);
  const agletGeom = new THREE.CylinderGeometry(0.026, 0.026, 0.16, 8);
  const ringGeom = new THREE.TorusGeometry(0.05, 0.016, 8, 16);

  [-0.24, 0.24].forEach((xPos, idx) => {
    // Silver Eyelet Ring at hood collar
    const ring = new THREE.Mesh(ringGeom, silverMat);
    ring.position.set(xPos, 11.72, 0.58);
    ring.rotation.x = 0.35;
    ring.rotation.y = idx === 0 ? 0.15 : -0.15;
    collarGroup.add(ring);

    // Hanging string
    const stringMesh = new THREE.Mesh(stringGeom, hoodieMaterial);
    stringMesh.position.set(xPos * 0.92, 11.12, 0.65);
    stringMesh.rotation.x = 0.1;
    stringMesh.rotation.z = idx === 0 ? 0.04 : -0.04;
    collarGroup.add(stringMesh);

    // Silver metallic tip (aglet)
    const aglet = new THREE.Mesh(agletGeom, silverMat);
    aglet.position.set(xPos * 0.92, 10.45, 0.72);
    aglet.rotation.x = 0.1;
    collarGroup.add(aglet);
  });

  return collarGroup;
}

/**
 * Main function: Upgrades the hero character to match the reference image.
 * Preserves the existing scene, bones, animations, and controls.
 */
export function upgradeHeroCharacter(
  _gltf: GLTF,
  character: THREE.Object3D,
  _scene: THREE.Scene
) {
  // 1. Premium Materials Definition
  // Skin Material: warm, healthy cartoon skin with soft subsurface sheen
  const faceTexture = createStylizedFaceTexture();
  const skinMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#fce4d6"),
    roughness: 0.48,
    metalness: 0.0,
    clearcoat: 0.15,
    clearcoatRoughness: 0.45,
    sheen: 0.65,
    sheenColor: new THREE.Color("#ff9f8a"),
  });

  const faceMaterial = new THREE.MeshPhysicalMaterial({
    map: faceTexture,
    color: new THREE.Color("#ffffff"),
    roughness: 0.48,
    metalness: 0.0,
    clearcoat: 0.18,
    clearcoatRoughness: 0.4,
    sheen: 0.6,
    sheenColor: new THREE.Color("#ff9f8a"),
  });

  // Eyes Material: deep purple/amethyst gradient with glistening cornea reflection
  const eyeTexture = createStylizedEyeTexture();
  const eyeMaterial = new THREE.MeshPhysicalMaterial({
    map: eyeTexture,
    roughness: 0.08,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });

  // Eyebrows Material: defined matte black
  const eyebrowMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#18141f"),
    roughness: 0.75,
    metalness: 0.0,
  });

  // Hoodie Material: deep luxury charcoal black fleece with subtle violet rim sheen
  const hoodieMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#0f0e15"),
    roughness: 0.88,
    metalness: 0.03,
    sheen: 0.6,
    sheenColor: new THREE.Color("#581c87"),
  });

  // Hair Material: rich black with purple specular sheen
  const hairMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#110f17"),
    roughness: 0.62,
    metalness: 0.05,
    clearcoat: 0.35,
    clearcoatRoughness: 0.3,
    sheen: 0.55,
    sheenColor: new THREE.Color("#6b21a8"),
  });

  // 2. Apply Upgraded Materials to Existing Model Meshes
  character.traverse((child: any) => {
    if (child.isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Identify by node name
      const name = mesh.name;
      if (name === "Plane.007" || name.includes("Face")) {
        // Face mesh
        mesh.material = faceMaterial;
      } else if (name === "EYEs.001" || name.includes("Eye") && !name.includes("brow")) {
        // Eyes
        mesh.material = eyeMaterial;
      } else if (name === "Eyebrow" || name.includes("brow")) {
        // Eyebrows
        mesh.material = eyebrowMaterial;
      } else if (name === "Ear.001" || name === "Neck" || name === "Hand") {
        // Skin elements
        mesh.material = skinMaterial;
      } else if (name === "BODY.SHIRT") {
        // Oversized hoodie
        mesh.material = hoodieMaterial;
      } else if (name === "Pant") {
        // Pants matching dark aesthetic
        mesh.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#14121b"),
          roughness: 0.85,
        });
      }
    }
  });

  // 3. Upgrade Hairstyle: Hide old blocky hair and add voluminous stylish spiky hair
  const oldHair = character.getObjectByName("hair");
  if (oldHair) {
    oldHair.visible = false;
  }

  const headBone = character.getObjectByName("spine006") || character.getObjectByName("spine.006");
  if (headBone) {
    const stylishHair = buildVoluminousSpikyHair(hairMaterial);
    // Position to sit naturally on head
    stylishHair.position.set(0, 0.45, 0.08);
    stylishHair.scale.set(0.98, 0.98, 0.98);
    headBone.add(stylishHair);
  }

  // 4. Add Oversized Hoodie Details: 3D Collar & Hanging Drawstrings
  const chestBone = character.getObjectByName("spine003") || character.getObjectByName("spine.003");
  const hoodieDetails = buildHoodieCollarAndStrings(hoodieMaterial);
  character.add(hoodieDetails);

  // 5. Add Minimal Developer-Style `</>` Branding Symbol on Left Chest
  const badge = buildDeveloperBrandingBadge();
  // Positioned on the left chest of the hoodie
  // (viewer's right, character's left: x ~ 0.85, y ~ 11.0, z ~ 0.62)
  badge.position.set(0.86, 11.05, 0.62);
  badge.rotation.set(-0.12, 0.18, -0.06);

  if (chestBone) {
    // If attached to chestBone, convert world position to local bone space or attach directly to character
    // Attaching to character maintains exact positioning and moves with torso scroll animations
    character.add(badge);
  } else {
    character.add(badge);
  }

  console.log("Hero Character upgraded successfully to reference design.");
}

