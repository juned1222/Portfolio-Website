import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLoading } from "../../context/LoadingProvider";
import { setProgress } from "../Loading";
import { setCharTimeline, setAllTimeline } from "../utils/GsapScroll";
import "../styles/HeroCharacter.css";
import gsap from "gsap";

const Scene = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    // 1. Loading Progress Integration
    let progress = setProgress((value) => setLoading(value));

    // Preload the high-res 3D character asset
    const img = new Image();
    img.src = "/images/hero-character.webp";

    const onImageReady = () => {
      progress.loaded().then(() => {
        // Smooth entrance reveal
        if (cardRef.current && haloRef.current) {
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 35, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }
          );
          gsap.fromTo(
            haloRef.current,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out", delay: 0.2 }
          );
        }
      });
    };

    if (img.complete) {
      onImageReady();
    } else {
      img.onload = onImageReady;
      img.onerror = onImageReady;
    }

    // 2. Setup Dummy 3D Timeline Rig to preserve full GSAP scroll compatibility
    const dummyRoot = new THREE.Object3D();
    const dummyPlane = new THREE.Object3D();
    dummyPlane.name = "Plane004";
    const dummyMonitor = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshBasicMaterial()
    );
    dummyMonitor.material.name = "Material.027";
    dummyPlane.add(dummyMonitor);
    dummyRoot.add(dummyPlane);

    const dummyScreenLight = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshStandardMaterial()
    );
    dummyScreenLight.name = "screenlight";
    dummyRoot.add(dummyScreenLight);

    const dummyNeck = new THREE.Object3D();
    dummyNeck.name = "spine005";
    dummyRoot.add(dummyNeck);

    const camera = new THREE.PerspectiveCamera(14.5, 1, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);

    setCharTimeline(dummyRoot, camera);
    setAllTimeline();

    // 3. Smooth 60fps 3D Mouse Parallax & Breathing Animation
    let targetX = 0;
    let targetY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let currentTransX = 0;
    let currentTransY = 0;
    let animationFrameId: number;
    let startTime = performance.now();

    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth) * 2 - 1; // -1 to 1
      targetY = (e.clientY / innerHeight) * 2 - 1; // -1 to 1

      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const glareX = ((e.clientX - rect.left) / rect.width) * 100;
        const glareY = ((e.clientY - rect.top) / rect.height) * 100;
        cardRef.current.style.setProperty("--glare-x", `${glareX}%`);
        cardRef.current.style.setProperty("--glare-y", `${glareY}%`);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        targetX = (touch.clientX / window.innerWidth) * 2 - 1;
        targetY = (touch.clientY / window.innerHeight) * 2 - 1;
      }
    };

    const onTouchEnd = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    const renderLoop = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;

      // Gentle organic breathing float
      const floatOffset = Math.sin(elapsed * 1.6) * 7;

      // Silky smooth interpolation (LERP)
      currentRotX += (-targetY * 10 - currentRotX) * 0.08;
      currentRotY += (targetX * 14 - currentRotY) * 0.08;
      currentTransX += (targetX * 16 - currentTransX) * 0.08;
      currentTransY += (targetY * 10 - currentTransY) * 0.08;

      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1100px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg) translate3d(${currentTransX}px, ${currentTransY + floatOffset}px, 30px)`;
      }

      if (haloRef.current) {
        const pulse = 1 + Math.sin(elapsed * 2.0) * 0.035;
        haloRef.current.style.transform = `translate(-50%, -50%) translate3d(${-currentTransX * 0.45}px, ${-currentTransY * 0.45}px, -40px) scale(${pulse})`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [setLoading]);

  return (
    <div className="character-container">
      <div className="character-model" ref={containerRef}>
        <div className="hero-3d-container">
          <div className="hero-3d-wrapper">
            {/* Glowing Neon Purple Circular Halo */}
            <div className="hero-halo-glow" ref={haloRef} />

            {/* 3D Interactive Parallax Character Card */}
            <div className="hero-character-card" ref={cardRef}>
              <img
                src="/images/hero-character.webp"
                alt="Juned Shaikh - 3D Developer Avatar"
                className="hero-character-img"
                draggable={false}
              />
              <div className="hero-glare-effect" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scene;