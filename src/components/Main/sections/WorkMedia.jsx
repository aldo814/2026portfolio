import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function WorkMedia() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseState = useRef({ isPressed: false, x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 200, 1500);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 0, 700);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    const createTextTexture = (text, isKey = false) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const fontSize = isKey ? 48 : 60;
      const fontWeight = isKey ? 'bold' : 'normal';
      context.font = `${fontWeight} ${fontSize}px "Courier New", Courier, monospace`;
      const metrics = context.measureText(text);
      const padding = 20;
      canvas.width = metrics.width + padding * 2;
      canvas.height = fontSize + padding * 2;
      context.font = `${fontWeight} ${fontSize}px "Courier New", Courier, monospace`;
      context.textBaseline = 'middle';
      context.textAlign = 'center';

      if (isKey) {
        context.strokeStyle = '#ffffff';
        context.lineWidth = 4;
        context.fillStyle = 'rgba(20, 20, 20, 0.8)';
        const r = 10;
        const W = canvas.width, H = canvas.height;
        context.beginPath();
        context.moveTo(r, 0);
        context.lineTo(W - r, 0);
        context.quadraticCurveTo(W, 0, W, r);
        context.lineTo(W, H - r);
        context.quadraticCurveTo(W, H, W - r, H);
        context.lineTo(r, H);
        context.quadraticCurveTo(0, H, 0, H - r);
        context.lineTo(0, r);
        context.quadraticCurveTo(0, 0, r, 0);
        context.closePath();
        context.fill();
        context.stroke();
        context.fillStyle = '#ffffff';
      } else {
        context.fillStyle = '#ffffff';
      }
      context.fillText(text, canvas.width / 2, canvas.height / 2 + 5);
      return new THREE.CanvasTexture(canvas);
    };

    const textElements = ['HTML', 'CSS', 'JS', 'React', 'Three.js', 'WebGL', 'Git', 'Scss', 'portfolio'];
    const specialTagName = ['<eun-yoeng />'];
    const keyElements = ['Shift', 'Ctrl', 'Alt', 'Enter', 'BackSpace', 'Space', 'Tab', 'Esc'];

    const addSpritesToScene = (elements, isKey = false, countPerElement = 1, scaleMultiple = 1) => {
      elements.forEach((text) => {
        const texture = createTextTexture(text, isKey);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, fog: true });
        for (let i = 0; i < countPerElement; i++) {
          const sprite = new THREE.Sprite(material);
          const c = texture.image;
          sprite.scale.set(c.width * 0.5 * scaleMultiple, c.height * 0.5 * scaleMultiple, 1);
          sprite.position.set(
            (Math.random() - 0.5) * 1600,
            (Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 1500 - 200
          );
          objectsGroup.add(sprite);
        }
      });
    };

    addSpritesToScene(textElements, false, 5, 1);
    addSpritesToScene(specialTagName, false, 3, 1.8);
    addSpritesToScene(keyElements, true, 3, 1.2);

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 3000;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 2000;
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMaterial = new THREE.PointsMaterial({ size: 1.5, color: 0xffffff, transparent: true, opacity: 0.5 });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const handleMouseMove = (e) => {
      mouseState.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseState.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const handleMouseDown = (e) => { if (e.button === 0) mouseState.current.isPressed = true; };
    const handleMouseUp = () => { mouseState.current.isPressed = false; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const clock = new THREE.Clock();
    let frameId;

    // lookAt 목표를 오프셋으로 관리 (카메라 로컬 기준)
    const lookOffset = new THREE.Vector3(0, 0, 0);
    const direction = new THREE.Vector3();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05); // delta 상한선으로 튀는 현상 방지
      const state = mouseState.current;

      // 1. lookAt 오프셋 계산 (카메라 위치 기준 상대 좌표)
      const sensitivity = state.isPressed ? 3.0 : 1.0;
      const targetOffsetX = state.x * 250 * sensitivity;
      const targetOffsetY = state.y * 180 * sensitivity;

      lookOffset.x += (targetOffsetX - lookOffset.x) * 0.05;
      lookOffset.y += (targetOffsetY - lookOffset.y) * 0.05;

      // 2. lookAt 먼저 적용 (카메라 위치 + 오프셋 + 전방 방향)
      const lookTarget = new THREE.Vector3(
        camera.position.x + lookOffset.x,
        camera.position.y + lookOffset.y,
        camera.position.z - 500 // 항상 전방을 바라봄
      );
      camera.lookAt(lookTarget);

      // 3. lookAt 이후 getWorldDirection → 전진 방향 정확하게 반영
      if (state.isPressed) {
        camera.getWorldDirection(direction);
        camera.position.addScaledVector(direction, 350 * delta);

        // z가 너무 앞으로 가면 뒤로 리셋 (x, y도 같이 초기화해 튀는 현상 방지)
        if (camera.position.z < -800) {
          camera.position.set(0, 0, 700);
          lookOffset.set(0, 0, 0);
        }
      }

      // 4. 파티클 회전
      particles.rotation.y += 0.015 * delta;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      objectsGroup.traverse((obj) => {
        if (obj.isSprite) {
          obj.material.map.dispose();
          obj.material.dispose();
        }
      });
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className="developer-universe-v2-container"
      ref={containerRef}
      style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', backgroundColor: '#000' }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center',
        color: '#ffffff', fontFamily: '"Courier New", Courier, monospace', fontSize: '14px',
        pointerEvents: 'none', opacity: 0.7
      }}>
        <span>[ Move Mouse ] Look Around</span>
        <span style={{ margin: '0 15px' }}>|</span>
        <span>[ Hold Click ] Move Forward & Fast Rotation</span>
      </div>
    </div>
  );
}

export default WorkMedia;