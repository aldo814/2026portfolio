import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

function Hero() {
  const canvasRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const currentContainer = canvasRef.current;
    currentContainer.appendChild(renderer.domElement);

    const mouse = { x: 0, y: 0 };
    const smoothed = { x: 0, y: 0 };

    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
      const geometry = new TextGeometry("UI/UX\nPUBLISHER\nDEVELOPER", {
        font: font, size: 15, height: 1, curveSegments: 4,
      });
      geometry.center();

      const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: 0x000000, wireframe: true, transparent: true, opacity: 0.1,
      }));
      scene.add(mesh);

      const line = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial({ color: 0x000000 })
      );
      scene.add(line);

      camera.position.z = 50;

      let reqId;
      const animate = () => {
        reqId = requestAnimationFrame(animate);
        smoothed.x += (mouse.x - smoothed.x) * 0.06;
        smoothed.y += (mouse.y - smoothed.y) * 0.06;
        mesh.rotation.y = smoothed.x * 0.6;
        mesh.rotation.x = smoothed.y * 0.3;
        line.rotation.y = mesh.rotation.y;
        line.rotation.x = mesh.rotation.x;
        renderer.render(scene, camera);
      };
      animate();
    });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      if (currentContainer && currentContainer.contains(renderer.domElement)) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, []);

  // ── 텍스트 3D 드래그 인터랙션 ──────────────────
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const state = {
      dragging: false, lastX: 0, lastY: 0,
      rotX: 0, rotY: 0, velX: 0, velY: 0,
      hoverX: 0, hoverY: 0, mouseX: 0, mouseY: 0,
      rafId: null,
    };

    const loop = () => {
      state.rafId = requestAnimationFrame(loop);
      if (!state.dragging) {
        state.velX *= 0.90; state.velY *= 0.90;
        state.rotX += state.velX; state.rotY += state.velY;
        state.hoverX += (state.mouseY * -8 - state.hoverX) * 0.06;
        state.hoverY += (state.mouseX * 12 - state.hoverY) * 0.06;
      }
      el.style.transform = `perspective(900px) rotateX(${state.rotX + state.hoverX}deg) rotateY(${state.rotY + state.hoverY}deg)`;
    };
    state.rafId = requestAnimationFrame(loop);

    const onMouseMove = (e) => {
      state.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      state.mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      if (state.dragging) {
        const dx = e.clientX - state.lastX;
        const dy = e.clientY - state.lastY;
        state.velX = dy * 0.35; state.velY = dx * 0.35;
        state.rotX += state.velX; state.rotY += state.velY;
        state.lastX = e.clientX; state.lastY = e.clientY;
      }
    };

    const onMouseDown = (e) => {
      state.dragging = true;
      state.lastX = e.clientX; state.lastY = e.clientY;
      state.velX = 0; state.velY = 0;
      el.style.cursor = 'grabbing';
    };

    const onMouseUp = () => {
      state.dragging = false;
      el.style.cursor = 'grab';
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      cancelAnimationFrame(state.rafId);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <section className="hero" id='hero'>
      <div className="hero__canvas" ref={canvasRef} />
      <div className="inner">
        <div className="hero__text-group" ref={textRef}>
          <h2 className="hero__title">
            UI/UX Design ·<br />
            Publishing ·<br />
            Developer
          </h2>
          <p className="hero__desc">portfolio</p>
        </div>
      </div>
    </section>
  );
}

export default Hero; 