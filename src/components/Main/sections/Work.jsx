import { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import * as THREE from 'three';
import 'swiper/css';

import { projects } from '../../../Pages/WorkData'
import WorkMedia from './WorkMedia';

function Work() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const buttonRef = useRef(null);
  const sliderRef = useRef(null);
  const swiperRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  /* ─────────────────────────────────────
     WebGL (기존 로직 유지)
  ───────────────────────────────────── */
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const video = videoRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
    camera.position.z = 1.8;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    video.play().catch(() => { });
    const vTex = new THREE.VideoTexture(video);

    const vertexShader = `
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform vec2 uVideoResolution;
      void main() {
        float screenAspect = uResolution.x / uResolution.y;
        float videoAspect  = uVideoResolution.x / uVideoResolution.y;
        vec2 scale = vec2(1.0);
        scale.x = screenAspect / videoAspect;
        vUv = (uv - 0.5) * scale + 0.5;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform sampler2D uTex;
      uniform vec2  uMouse;
      uniform float uHover;
      varying vec2  vUv;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main() {
        vec2 uv = vUv;
        vec2 m  = uMouse;
        if (uHover > 0.001) {
          float gridSize  = 24.0;
          vec2  cell      = floor(uv * gridSize);
          vec2  cellCenter = (cell + 0.5) / gridSize;
          float dist      = length(cellCenter - m);
          float influence = smoothstep(0.35, 0.0, dist) * uHover;
          float angle = hash(cell) * 6.28318;
          uv += vec2(cos(angle), sin(angle)) * 0.012 * influence;
          float brightness = 1.0 + 0.4 * smoothstep(0.28, 0.0, dist) * uHover;
          vec4 col = texture2D(uTex, clamp(uv, vec2(0.0), vec2(1.0)));
          col.rgb *= brightness;
          gl_FragColor = col;
          return;
        }
        gl_FragColor = texture2D(uTex, clamp(uv, vec2(0.0), vec2(1.0)));
      }
    `;

    const uniforms = {
      uTex: { value: vTex },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uVideoResolution: { value: new THREE.Vector2(1920, 1080) },
    };

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    video.onloadedmetadata = () => {
      uniforms.uVideoResolution.value.set(video.videoWidth, video.videoHeight);
    };

    const rot = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let velX = 0, velY = 0;
    let hoverTween = null;

    const handleMouseEnter = () => {
      hoverTween?.kill();
      hoverTween = gsap.to(uniforms.uHover, { value: 1, duration: 0.5, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      isDragging = false;
      hoverTween?.kill();
      hoverTween = gsap.to(uniforms.uHover, { value: 0, duration: 0.8, ease: 'power2.out' });
      gsap.to(target, { x: 0, y: 0, duration: 1.2, ease: 'power3.out' });
    };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      gsap.to(uniforms.uMouse.value, { x, y, duration: 0.5 });
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      velX = dx; velY = dy;
      target.y += dx * 0.008;
      target.x -= dy * 0.008;
      target.x = Math.max(-0.7, Math.min(0.7, target.x));
    };

    const handleMouseDown = (e) => {
      isDragging = true;
      lastX = e.clientX; lastY = e.clientY;
      velX = 0; velY = 0;
      container.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = 'grab';
      const inertiaY = target.y + velX * 0.04;
      const inertiaX = Math.max(-0.7, Math.min(0.7, target.x - velY * 0.04));
      gsap.to(target, {
        x: inertiaX, y: inertiaY, duration: 0.6, ease: 'power2.out',
        onComplete: () => { gsap.to(target, { x: 0, y: 0, duration: 1.4, ease: 'power3.out' }); },
      });
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const vFov = (camera.fov * Math.PI) / 180;
      const planeH = 2 * Math.tan(vFov / 2) * camera.position.z;
      const planeW = planeH * camera.aspect;
      mesh.scale.set(planeW, planeH, 1);
    };
    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      rot.x += (target.x - rot.x) * 0.1;
      rot.y += (target.y - rot.y) * 0.1;
      mesh.rotation.x = rot.x;
      mesh.rotation.y = rot.y;
      if (video.readyState >= video.HAVE_CURRENT_DATA) vTex.needsUpdate = true;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    const rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(rafId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  /* ─────────────────────────────────────
     Swiper & Scroll
  ───────────────────────────────────── */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (buttonRef.current) {
      gsap.fromTo(buttonRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: buttonRef.current, start: 'top 95%' },
        }
      );
    }

    const onWheel = (e) => {
      const swiper = swiperRef.current;
      const slider = sliderRef.current;
      if (!swiper || !slider) return;
      const rect = slider.getBoundingClientRect();
      if (!(rect.top < window.innerHeight && rect.bottom > 0)) return;
      if (swiper.isEnd && e.deltaY > 0) return;
      if (swiper.isBeginning && e.deltaY < 0) return;
      e.preventDefault();
      swiper.translateTo(swiper.translate - e.deltaY * 1.5, 200, false, true);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <section className="work" ref={sectionRef} id='work'>
      <div className="work__header inner">
        <h2 className="work__title"><span>Work</span> <br /> preview</h2>
        <div className="work__desc">
          <p>Code meets creative motion.<br /> I build robust, interactive web experiences with precision.</p>
          <span>Scroll for more</span>
        </div>
      </div>

      <div className="work__hero" ref={containerRef} style={{ cursor: 'grab' }}>
        <video
          ref={videoRef}
          autoPlay loop muted playsInline
          style={{ display: 'none' }}
          src="/src/assets/images/main/work_hero00.mp4"
        />
        <canvas ref={canvasRef} id="glCanvas" />
      </div>

      <div className="work__slider" ref={sliderRef}>
        <Swiper
          modules={[FreeMode]}
          direction="horizontal"
          slidesPerView={1.2}
          freeMode={{ enabled: true, momentum: false }}
          onSwiper={(s) => { swiperRef.current = s; }}
          breakpoints={{
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3 },
          }}
          className="work__slide"
        >
          {projects.slice(0, 4).map((project) => (
            <SwiperSlide key={project.id}>
              <Link to={`/work/${project.id}`} className="work__item-link">
                <div className="work__img">
                  <img src={project.thumb} alt={project.titlekr} />
                </div>
                <div className="work__info">
                  <span className="work__id">PROJECT {project.id.split('-')[1]}</span>
                  <p className="work__name">{project.titlekr}</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="work__media">
        <WorkMedia></WorkMedia>
      </div>

      {/* 버튼 클릭 시 AllWork 페이지로 이동 */}
      <Link to="/AllWork" className="work__button" ref={buttonRef}>
        <span>View all projects</span>
      </Link>
    </section>
  );
}

export default Work;