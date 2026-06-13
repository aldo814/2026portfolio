import React, { useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from './WorkData';
import HeroBackground from "./HeroBackground";
import '../style/work.scss';

gsap.registerPlugin(ScrollTrigger);

const AllWork = () => {
  const navigate = useNavigate();
  const gridRef = useRef(null);

  const isBackAction = useMemo(() => !!sessionStorage.getItem("scrollY"), []);
  const savedScrollY = useRef(Number(sessionStorage.getItem("scrollY") || 0));

  // 스크롤 복원
  useEffect(() => {
    if (!isBackAction) {
      window.scrollTo(0, 0);
      return;
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScrollY.current, behavior: "instant" });
        sessionStorage.removeItem("scrollY");
      });
    });
  }, [isBackAction]);

  const goDetail = (id) => {
    sessionStorage.setItem("scrollY", String(window.scrollY));
    navigate(`/work/${id}`);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const workItems = gsap.utils.toArray(".allWork__item");

      // 뒤로가기 or 탭변경 시 애니메이션 없이 즉시 보여주기
      if (isBackAction) {
        gsap.set(".allWork__subtitle, .allWork__title, .allWork__item", {
          y: 0, opacity: 1, filter: "blur(0px)", x: 0
        });
        workItems.forEach(item => {
          const img = item.querySelector("img");
          if (img) gsap.set(img, { clipPath: "inset(0% 0% 0% 0%)", scale: 1 });
        });
        ScrollTrigger.refresh();

        // 마우스 이벤트만 등록
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

        if (projects.length > 1 && window.innerWidth > 768) {
          gsap.to(".allWork__item:nth-child(2n)", {
            y: -60,
            scrollTrigger: { trigger: ".allWork__grid", start: "top bottom", end: "bottom top", scrub: 1.2 }
          });
        }
        return;
      }

      /* 신규 진입 시에만 실행되는 애니메이션 */
      gsap.set(".allWork__subtitle", { y: 30, opacity: 0 });
      gsap.set(".allWork__title", { y: 80, opacity: 0, filter: "blur(15px)" });
      gsap.set(".allWork__item", { y: 50, opacity: 0 });

      const mainTl = gsap.timeline();
      mainTl
        .to(".allWork__subtitle", { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" })
        .to(".allWork__title", { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power4.out" }, "-=0.3")
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

      if (projects.length > 1 && window.innerWidth > 768) {
        gsap.to(".allWork__item:nth-child(2n)", {
          y: -60,
          scrollTrigger: { trigger: ".allWork__grid", start: "top bottom", end: "bottom top", scrub: 1.2 }
        });
      }
    }, gridRef);

    return () => ctx.revert();
  }, [isBackAction]);

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
        <section className="allWork__list">
          <ul className="allWork__grid">
            {projects.map((project) => (
              <li className="allWork__item" key={project.id} onClick={() => goDetail(project.id)}>
                <div className="allWork__thumb">
                  <img src={project.thumb} alt={project.title} />
                </div>
                <div className="allWork__info">
                  <ul className="allWork__stack">
                    {project.stack?.map((stack) => (
                      <li key={stack}>{stack}</li>
                    ))}
                  </ul>
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
