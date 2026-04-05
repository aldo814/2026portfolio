import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from './WorkData';
import HeroBackground from "./HeroBackground";
import '../style/work.scss';

gsap.registerPlugin(ScrollTrigger);

const AllWork = () => {
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();
  const categories = ['All', '디자인', '퍼블리싱'];
  const gridRef = useRef(null);

  // [중요] 세션 스토리지에 값이 있는지 처음에 딱 한 번만 체크하여 고정
  const isBackAction = useMemo(() => !!sessionStorage.getItem("scrollY"), []);
  const isTabChange = useRef(false);
  const savedScrollY = useRef(Number(sessionStorage.getItem("scrollY") || 0));

  useEffect(() => {
    if (!isBackAction) return;
    const restoreScroll = () => {
      window.scrollTo({ top: savedScrollY.current, behavior: "instant" });
      sessionStorage.removeItem("scrollY");
    };
    requestAnimationFrame(() => { requestAnimationFrame(restoreScroll); });
  }, [isBackAction]);

  const goDetail = (id) => {
    sessionStorage.setItem("scrollY", String(window.scrollY));
    navigate(`/work/${id}`);
  };

  const handleTabChange = (cat) => {
    isTabChange.current = true;
    setActiveTab(cat);
  };

  const filteredProjects = activeTab === 'All'
    ? projects
    : projects.filter(item => item.categorykr === activeTab);

  useLayoutEffect(() => {
    const tabChange = isTabChange.current;
    isTabChange.current = false;

    const ctx = gsap.context(() => {
      const workItems = gsap.utils.toArray(".allWork__item");

      // 뒤로가기로 왔거나 탭을 바꿨을 때는 애니메이션 완전 배제
      if (isBackAction || tabChange) {
        gsap.set(".allWork__subtitle, .allWork__title, .allWork__tab, .allWork__item", {
          y: 0, opacity: 1, filter: "blur(0px)", x: 0
        });

        workItems.forEach(item => {
          const img = item.querySelector("img");
          if (img) gsap.set(img, { clipPath: "inset(0% 0% 0% 0%)", scale: 1 });
        });

        ScrollTrigger.refresh();
        return; // 아래 애니메이션 로직 실행 안 함
      }

      /* 처음 신규 진입 시에만 실행되는 애니메이션 */
      gsap.set(".allWork__subtitle", { y: 30, opacity: 0 });
      gsap.set(".allWork__title", { y: 80, opacity: 0, filter: "blur(15px)" });
      gsap.set(".allWork__tab", { x: -100, opacity: 0 });
      gsap.set(".allWork__item", { y: 50, opacity: 0 });

      const mainTl = gsap.timeline();
      mainTl
        .to(".allWork__subtitle", { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" })
        .to(".allWork__title", { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power4.out" }, "-=0.3")
        .to(".allWork__tab", { x: 0, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }, "-=0.5")
        .to(".allWork__item", {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power4.out",
          onComplete: () => ScrollTrigger.refresh()
        }, "-=0.3");

      workItems.forEach((item) => {
        const img = item.querySelector("img");
        if (img) {
          gsap.set(img, { clipPath: "inset(50% 50% 50% 50%)", scale: 1.3 });
          gsap.to(img, {
            clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.2, ease: "expo.out",
            scrollTrigger: { trigger: item, start: "top 95%" }
          });
        }
      });

      // 마우스 이벤트 및 패럴랙스는 공통 적용
      workItems.forEach((item) => {
        const onMouseMove = (e) => {
          const rect = item.getBoundingClientRect();
          const rotateX = (e.clientY - rect.top) / rect.height - 0.5;
          const rotateY = (e.clientX - rect.left) / rect.width - 0.5;
          gsap.to(item, { rotationX: rotateX * 10, rotationY: rotateY * -10, transformPerspective: 1000, duration: 0.4 });
        };
        const onMouseLeave = () => gsap.to(item, { rotationX: 0, rotationY: 0, duration: 0.6 });
        item.addEventListener("mousemove", onMouseMove);
        item.addEventListener("mouseleave", onMouseLeave);
      });

      if (filteredProjects.length > 1 && window.innerWidth > 768) {
        gsap.to(".allWork__item:nth-child(2n)", {
          y: -60,
          scrollTrigger: { trigger: ".allWork__grid", start: "top bottom", end: "bottom top", scrub: 1.2 }
        });
      }
    }, gridRef);

    return () => ctx.revert();
  }, [filteredProjects, isBackAction]); // 의존성에 isBackAction 추가

  return (
    <div className="allWork" ref={gridRef}>
      <section className="allWork__hero">
        <HeroBackground />
        <div className="inner">
          <p className="allWork__subtitle">Selected Projects</p>
          <h2 className="allWork__title">all-work</h2>
        </div>
      </section>

      <div className="inner">
        <section className="allWork__tab">
          <ul className="allWork__tab-list">
            {categories.map((cat) => (
              <li
                key={cat}
                className={`allWork__tab-item ${activeTab === cat ? 'allWork__tab-item--active' : ''}`}
                onClick={() => handleTabChange(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </section>

        <section className="allWork__list">
          <ul className="allWork__grid">
            {filteredProjects.map((project) => (
              <li className="allWork__item" key={project.id} onClick={() => goDetail(project.id)}>
                <div className="allWork__thumb">
                  <img src={project.thumb} alt={project.title} />
                </div>
                <div className="allWork__info">
                  <span className="allWork__category">{project.categorykr?.toUpperCase()}</span>
                  <h3 className="allWork__name">{project.title}</h3>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AllWork;