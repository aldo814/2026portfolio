import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. 부모 요소 크기 측정
    const parent = mountRef.current;
    let width = parent.offsetWidth;
    let height = parent.offsetHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 기존 캔버스 정리 및 추가
    parent.innerHTML = "";
    parent.appendChild(renderer.domElement);

    // 2. Particles 생성
    const count = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const original = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      const value = (Math.random() - 0.5) * 10;
      positions[i] = value;
      original[i] = value;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      size: 0.03,
      color: "#000",
      transparent: true,
      opacity: 0.5
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. ScrollTrigger (부모 영역 기준으로 작동)
    const st = ScrollTrigger.create({
      trigger: parent, // 부모 요소를 트리거로 설정
      start: "top top",
      end: "bottom top",
      scrub: 2,
      onUpdate: (self) => {
        const progress = self.progress;
        const pos = geometry.attributes.position.array;
        for (let i = 0; i < pos.length; i += 3) {
          pos[i] = original[i] * (1 + progress * 2.5);
          pos[i + 1] = original[i + 1] * (1 + progress * 2.5);
          pos[i + 2] = original[i + 2] * (1 + progress * 2.5);
        }
        geometry.attributes.position.needsUpdate = true;
        particles.rotation.y = progress * Math.PI;
      }
    });

    // 4. Resize 대응 (부모 크기 다시 계산)
    const handleResize = () => {
      width = parent.offsetWidth;
      height = parent.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // 5. Animation Loop
    let frameId;
    const animate = () => {
      particles.rotation.x += 0.0005;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      st.kill();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // 부모를 꽉 채우는 스타일 적용
  const style = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    pointerEvents: "none",
    overflow: "hidden"
  };

  return <div className="hero-bg" ref={mountRef} style={style} />;
};

export default HeroBackground;