import React, { useState, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import Marquee from "react-fast-marquee";
import "./styles/TechStack.css";

// Technology & design icons
import {
  SiCplusplus,
  SiHtml5,
  SiCss3,
} from "react-icons/si";
import { TbHierarchy2, TbPalette } from "react-icons/tb";
import { HiOutlineSparkles, HiOutlineCube } from "react-icons/hi2";

export interface TechItem {
  name: string;
  category: "programming" | "web" | "design";
  categoryLabel: string;
  icon: React.ReactNode;
  color: string;
  glow: string;
  description: string;
  level: string;
}

const techItems: TechItem[] = [
  {
    name: "C++",
    category: "programming",
    categoryLabel: "Core CS & Systems",
    icon: <SiCplusplus />,
    color: "#00599C",
    glow: "rgba(0, 89, 156, 0.45)",
    description: "Standard Template Library (STL), memory management, computational logic, and algorithmic problem solving (DSA).",
    level: "Advanced Practice",
  },
  {
    name: "Object-Oriented Programming (OOPs)",
    category: "programming",
    categoryLabel: "Software Architecture",
    icon: <TbHierarchy2 />,
    color: "#a855f7",
    glow: "rgba(168, 85, 247, 0.45)",
    description: "Encapsulation, Abstraction, Inheritance, Polymorphism, modular class design, and SOLID architectural principles.",
    level: "Proficient",
  },
  {
    name: "HTML5",
    category: "web",
    categoryLabel: "Web Core",
    icon: <SiHtml5 />,
    color: "#E34F26",
    glow: "rgba(227, 79, 38, 0.45)",
    description: "Semantic markup, accessible DOM structure, modern HTML5 API standards, form validation, and SEO best practices.",
    level: "Advanced",
  },
  {
    name: "CSS3",
    category: "web",
    categoryLabel: "Styling & Layouts",
    icon: <SiCss3 />,
    color: "#1572B6",
    glow: "rgba(21, 114, 182, 0.45)",
    description: "Flexbox, CSS Grid, responsive design, keyframe animations, glassmorphism, micro-interactions, and modern styling systems.",
    level: "Advanced",
  },
  {
    name: "Graphic Designing",
    category: "design",
    categoryLabel: "Creative & Visuals",
    icon: <TbPalette />,
    color: "#EC4899",
    glow: "rgba(236, 72, 153, 0.45)",
    description: "UI/UX layout design, creative visual branding, typography, color harmony, vector assets, and digital media design.",
    level: "Creative & Proficient",
  },
];

// Helper to generate dynamic high-res glowing badge textures for physics spheres
function createSkillTexture(title: string, color: string, bg: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // Background gradient
    const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
    grad.addColorStop(0, bg);
    grad.addColorStop(0.7, "#0f0b18");
    grad.addColorStop(1, "#08050e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Glowing border ring
    ctx.beginPath();
    ctx.arc(256, 256, 200, 0, Math.PI * 2);
    ctx.lineWidth = 14;
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 35;
    ctx.stroke();

    // Inner subtle ring
    ctx.beginPath();
    ctx.arc(256, 256, 175, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.shadowBlur = 0;
    ctx.stroke();

    // Centered skill text
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px Geist, Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, 256, 256);

    // Subtitle indicator
    ctx.shadowBlur = 0;
    ctx.font = "bold 20px Geist, sans-serif";
    ctx.fillStyle = color;
    ctx.fillText("SKILL ARSENAL", 256, 320);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);
const spheres = [...Array(20)].map(() => ({
  scale: [0.8, 1, 0.9, 1.15][Math.floor(Math.random() * 4)],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    delta = Math.min(0.1, delta);
    if (!api.current) return;
    const impulse = vec
      .copy(api.current.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );
    api.current.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(18), r(18) - 20, r(18) - 8]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3() }: { vec?: THREE.Vector3 }) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

interface TechStackProps {
  isDesktopView?: boolean;
}

const TechStack: React.FC<TechStackProps> = ({ isDesktopView = true }) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "3d">("grid");

  const materials = useMemo(() => {
    const skillConfigs = [
      { name: "C++", color: "#38bdf8", bg: "#034078" },
      { name: "OOPs", color: "#c084fc", bg: "#4a154b" },
      { name: "HTML5", color: "#fb923c", bg: "#7c2d12" },
      { name: "CSS3", color: "#60a5fa", bg: "#1e3a8a" },
      { name: "DESIGN", color: "#f472b6", bg: "#831843" },
    ];
    return skillConfigs.map((cfg) => {
      const texture = createSkillTexture(cfg.name, cfg.color, cfg.bg);
      return new THREE.MeshPhysicalMaterial({
        map: texture,
        emissive: "#ffffff",
        emissiveMap: texture,
        emissiveIntensity: 0.4,
        metalness: 0.6,
        roughness: 0.7,
        clearcoat: 0.3,
      });
    });
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return techItems;
    return techItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="techstack-section" id="skills">
      <div className="techstack-ambient"></div>

      {/* Header */}
      <div className="techstack-header">
        <div className="techstack-badge">
          <span className="techstack-badge-dot"></span>
          <span>Core Competencies</span>
        </div>
        <h2 className="techstack-title">
          Technical <span>Skills</span>
        </h2>
        <p className="techstack-subtitle">
          Specialized in C++ algorithms, Object-Oriented software design, semantic HTML, modern CSS styling, and creative graphic design.
        </p>
      </div>

      {/* Controls: Category Filters & Mode Switcher */}
      <div className="techstack-controls">
        {/* Category Filters (Active in Grid Mode) */}
        {viewMode === "grid" && (
          <div className="techstack-categories">
            {[
              { id: "all", label: "All Skills" },
              { id: "programming", label: "C++ & OOPs" },
              { id: "web", label: "HTML & CSS" },
              { id: "design", label: "Graphic Design" },
            ].map((cat) => (
              <button
                key={cat.id}
                className={`techstack-cat-btn ${
                  activeCategory === cat.id ? "active" : ""
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Desktop View Mode Toggle */}
        {isDesktopView && (
          <div className="techstack-view-toggle">
            <button
              className={`techstack-toggle-btn ${
                viewMode === "grid" ? "active" : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              <HiOutlineSparkles /> Interactive Grid
            </button>
            <button
              className={`techstack-toggle-btn ${
                viewMode === "3d" ? "active" : ""
              }`}
              onClick={() => setViewMode("3d")}
            >
              <HiOutlineCube /> 3D Physics View
            </button>
          </div>
        )}
      </div>

      {/* Content: Grid View */}
      {viewMode === "grid" || !isDesktopView ? (
        <div className="techstack-grid">
          {filteredItems.map((tech) => (
            <div
              key={tech.name}
              className="tech-card"
              style={
                {
                  "--tech-color": tech.color,
                  "--tech-glow": tech.glow,
                } as React.CSSProperties
              }
            >
              <div className="tech-card-top">
                <div className="tech-icon-wrap">{tech.icon}</div>
                <span className="tech-badge-cat">{tech.categoryLabel}</span>
              </div>
              <div className="tech-card-body">
                <h3>{tech.name}</h3>
                <p>{tech.description}</p>
              </div>
              <div className="tech-card-footer">
                <span>Proficiency</span>
                <span className="tech-level">{tech.level}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Content: 3D Physics Playground Mode (Desktop) */
        <div className="tech-3d-wrapper">
          <div className="tech-3d-hint">
            💡 Move your mouse to push &amp; interact with the floating skill spheres
          </div>
          <Canvas
            shadows
            gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
            camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
            onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
            className="tech-canvas"
          >
            <ambientLight intensity={1.2} />
            <spotLight
              position={[20, 20, 25]}
              penumbra={1}
              angle={0.25}
              color="white"
              castShadow
              shadow-mapSize={[512, 512]}
            />
            <directionalLight position={[0, 5, -4]} intensity={2} />
            <Physics gravity={[0, 0, 0]}>
              <Pointer />
              {spheres.map((props, i) => (
                <SphereGeo
                  key={i}
                  {...props}
                  material={
                    materials[i % materials.length]
                  }
                />
              ))}
            </Physics>
            <Environment
              files="/models/char_enviorment.hdr"
              environmentIntensity={0.5}
              environmentRotation={[0, 4, 2]}
            />
            <EffectComposer enableNormalPass={false}>
              <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
            </EffectComposer>
          </Canvas>
        </div>
      )}

      {/* Infinite Skills Marquee */}
      <div className="techstack-ticker">
        <Marquee speed={45} gradient={false} pauseOnHover={true}>
          {[
            "C++ (Data Structures & Algorithmic Problem Solving)",
            "Object-Oriented Programming (OOPs Architecture)",
            "Semantic HTML5 Web Structure",
            "Modern CSS3 Animations & Responsive Design",
            "Graphic Designing & Creative Visual Identity",
            "UI/UX & Digital Media Design",
            "Clean Code & Modular Object Design",
            "Problem Solving & Computational Logic",
          ].map((item, idx) => (
            <div className="ticker-item" key={idx}>
              <span className="ticker-dot">✦</span>
              <span>{item}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default TechStack;
