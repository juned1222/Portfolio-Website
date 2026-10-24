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

// Technology icons from react-icons
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiCplusplus,
  SiTailwindcss,
  SiHtml5,
  SiCss3,
  SiThreedotjs,
  SiGit,
  SiPostman,
  SiVercel,
} from "react-icons/si";
import { TbBrain } from "react-icons/tb";
import { HiOutlineSparkles, HiOutlineCube } from "react-icons/hi2";

export interface TechItem {
  name: string;
  category: "frontend" | "backend" | "languages" | "tools";
  categoryLabel: string;
  icon: React.ReactNode;
  color: string;
  glow: string;
  description: string;
  level: string;
}

const techItems: TechItem[] = [
  {
    name: "React",
    category: "frontend",
    categoryLabel: "Frontend",
    icon: <SiReact />,
    color: "#61DAFB",
    glow: "rgba(97, 218, 251, 0.35)",
    description: "Component architecture, hooks, state management, & SPA development.",
    level: "Advanced",
  },
  {
    name: "Next.js",
    category: "frontend",
    categoryLabel: "Full-Stack",
    icon: <SiNextdotjs />,
    color: "#ffffff",
    glow: "rgba(255, 255, 255, 0.25)",
    description: "Server-side rendering, App Router, hybrid static pages & SEO.",
    level: "Proficient",
  },
  {
    name: "TypeScript",
    category: "languages",
    categoryLabel: "Language",
    icon: <SiTypescript />,
    color: "#3178C6",
    glow: "rgba(49, 120, 198, 0.35)",
    description: "Type-safe codebases, interfaces, generics, & maintainable architecture.",
    level: "Intermediate",
  },
  {
    name: "JavaScript (ES6+)",
    category: "languages",
    categoryLabel: "Language",
    icon: <SiJavascript />,
    color: "#F7DF1E",
    glow: "rgba(247, 223, 30, 0.35)",
    description: "Asynchronous programming, DOM manipulation, closures, and modern syntax.",
    level: "Advanced",
  },
  {
    name: "C++",
    category: "languages",
    categoryLabel: "Core CS",
    icon: <SiCplusplus />,
    color: "#00599C",
    glow: "rgba(0, 89, 156, 0.4)",
    description: "Data Structures, Algorithms (DSA), competitive problem solving & memory.",
    level: "Active Practice",
  },
  {
    name: "Node.js",
    category: "backend",
    categoryLabel: "Backend",
    icon: <SiNodedotjs />,
    color: "#5FA04E",
    glow: "rgba(95, 160, 78, 0.35)",
    description: "Event-driven runtime, scalable backend services, and REST APIs.",
    level: "Proficient",
  },
  {
    name: "Express.js",
    category: "backend",
    categoryLabel: "Backend",
    icon: <SiExpress />,
    color: "#e2e8f0",
    glow: "rgba(226, 232, 240, 0.25)",
    description: "Middleware pipelines, routing, authentication, and HTTP endpoints.",
    level: "Proficient",
  },
  {
    name: "MongoDB",
    category: "backend",
    categoryLabel: "Database",
    icon: <SiMongodb />,
    color: "#47A248",
    glow: "rgba(71, 162, 72, 0.35)",
    description: "Document storage, Mongoose schemas, indexing, and aggregations.",
    level: "Intermediate",
  },
  {
    name: "MySQL",
    category: "backend",
    categoryLabel: "Database",
    icon: <SiMysql />,
    color: "#4479A1",
    glow: "rgba(68, 121, 161, 0.35)",
    description: "Relational modeling, SQL queries, normalization, and relational joins.",
    level: "Intermediate",
  },
  {
    name: "AI Workflows & APIs",
    category: "tools",
    categoryLabel: "AI & APIs",
    icon: <TbBrain />,
    color: "#c084fc",
    glow: "rgba(192, 132, 252, 0.4)",
    description: "Prompt workflows, AI compliance tools, and intelligent API integrations.",
    level: "Applied",
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    categoryLabel: "Styling",
    icon: <SiTailwindcss />,
    color: "#38BDF8",
    glow: "rgba(56, 189, 248, 0.35)",
    description: "Utility-first responsive layouts, themes, and sleek UI micro-interactions.",
    level: "Proficient",
  },
  {
    name: "HTML5 & CSS3",
    category: "frontend",
    categoryLabel: "Core Web",
    icon: (
      <span style={{ display: "inline-flex", gap: "4px" }}>
        <SiHtml5 />
        <SiCss3 />
      </span>
    ),
    color: "#E34F26",
    glow: "rgba(227, 79, 38, 0.35)",
    description: "Semantic web standards, accessibility, flexbox, CSS grid, and animations.",
    level: "Advanced",
  },
  {
    name: "Three.js / WebGL",
    category: "frontend",
    categoryLabel: "3D Graphics",
    icon: <SiThreedotjs />,
    color: "#d8b4fe",
    glow: "rgba(216, 180, 254, 0.35)",
    description: "Interactive 3D scenes, particle physics, shaders, and React Three Fiber.",
    level: "Intermediate",
  },
  {
    name: "Git & GitHub",
    category: "tools",
    categoryLabel: "Version Control",
    icon: <SiGit />,
    color: "#F05032",
    glow: "rgba(240, 80, 50, 0.35)",
    description: "Branching strategies, commits, collaboration, and pull requests.",
    level: "Proficient",
  },
  {
    name: "Postman",
    category: "tools",
    categoryLabel: "API Testing",
    icon: <SiPostman />,
    color: "#FF6C37",
    glow: "rgba(255, 108, 55, 0.35)",
    description: "API testing, automated endpoint collections, and response validation.",
    level: "Proficient",
  },
  {
    name: "Vercel",
    category: "tools",
    categoryLabel: "Cloud / DevOps",
    icon: <SiVercel />,
    color: "#f8fafc",
    glow: "rgba(248, 250, 252, 0.3)",
    description: "Continuous deployment, serverless functions, and edge network analytics.",
    level: "Proficient",
  },
];

// 3D Physics Balls Setup for the interactive playground mode
const textureLoader = new THREE.TextureLoader();
const imageUrls = [
  "/images/react2.webp",
  "/images/next2.webp",
  "/images/node2.webp",
  "/images/express.webp",
  "/images/mongo.webp",
  "/images/mysql.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
];
const textures = imageUrls.map((url) => textureLoader.load(url));
const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);
const spheres = [...Array(24)].map(() => ({
  scale: [0.75, 1, 0.85, 1.1][Math.floor(Math.random() * 4)],
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
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.35,
          metalness: 0.5,
          roughness: 0.9,
          clearcoat: 0.15,
        })
    );
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
          <span>Technical Arsenal</span>
        </div>
        <h2 className="techstack-title">
          Tech <span>Stack</span>
        </h2>
        <p className="techstack-subtitle">
          A structured toolkit of languages, modern frameworks, databases, and developer workflows I use to build scalable web applications.
        </p>
      </div>

      {/* Controls: Category Filters & Mode Switcher */}
      <div className="techstack-controls">
        {/* Category Filters (Active in Grid Mode) */}
        {viewMode === "grid" && (
          <div className="techstack-categories">
            {[
              { id: "all", label: "All Skills" },
              { id: "frontend", label: "Frontend" },
              { id: "backend", label: "Backend & DB" },
              { id: "languages", label: "Languages & Core" },
              { id: "tools", label: "Tools & AI" },
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
            💡 Move your mouse to push &amp; interact with the floating tech spheres
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
                    materials[Math.floor(Math.random() * materials.length)]
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
            "Full-Stack Development",
            "RESTful API Integration",
            "Data Structures & Algorithms (C++)",
            "Modern React & Next.js",
            "Clean Code & Architecture",
            "Responsive & Accessible UI",
            "AI-Enabled Workflows",
            "Database Systems (SQL & NoSQL)",
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
