import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from './WorkData';
import HeroBackground from "./HeroBackground";
import { Link } from 'lucide-react';
import '../style/work.scss';

gsap.registerPlugin(ScrollTrigger);

const WorkDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const detailRef = useRef(null);

  const data = projects.find(item => item.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleBack = () => {
    sessionStorage.setItem("scrollY", String(window.scrollY || "0"));
    navigate(-1);
  };

  if (!data) return <div className="error">Project not found</div>;

  const hasSingleImage = data.subimg && data.subimg.length === 1;
  const hasMultipleImages = data.subimg && data.subimg.length > 1;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      gsap.set(".work-detail__hero h1", { y: 100, opacity: 0, filter: "blur(20px)" });
      gsap.set(".work-detail__btn", { x: -50, opacity: 0 });
      gsap.set(".work-detail__img", { opacity: 0, y: 80 });
      gsap.set(".work-detail__header li", { y: 20, opacity: 0 });
      gsap.set(".work-detail__desc > *", { y: 40, opacity: 0 });
      gsap.set(".spec-group", { x: 30, opacity: 0 });

      tl.to(".work-detail__hero h1", {
        y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power4.out"
      })
        .to(".work-detail__btn", {
          x: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)"
        }, "-=0.8")
        .to(".work-detail__img", {
          y: 0, opacity: 1, duration: 1.5, ease: "expo.out"
        }, "-=0.6");

      gsap.to(".work-detail__header li", {
        y: 0, opacity: 1, stagger: 0.2,
        scrollTrigger: { trigger: ".work-detail__header", start: "top 90%" }
      });

      gsap.to(".work-detail__desc > *", {
        y: 0, opacity: 1, stagger: 0.2, duration: 1,
        scrollTrigger: { trigger: ".work-detail__desc", start: "top 85%" }
      });

      gsap.to(".spec-group", {
        x: 0, opacity: 1, stagger: 0.3, duration: 1, ease: "power2.out",
        scrollTrigger: { trigger: ".work-detail__spec", start: "top 85%" }
      });

      const rows = gsap.utils.toArray(".masonry-row");
      rows.forEach((row) => {
        const bigItem = row.querySelector(".item--big");
        const rightGroup = row.querySelector(".right");

        gsap.fromTo(bigItem,
          { opacity: 0, y: 100, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power4.out",
            scrollTrigger: { trigger: row, start: "top 80%" }
          }
        );

        if (rightGroup) {
          gsap.fromTo(rightGroup,
            { opacity: 0, x: 100 },
            {
              opacity: 1, x: 0, duration: 1.5, ease: "expo.out",
              scrollTrigger: { trigger: row, start: "top 75%" }
            }
          );
        }
      });

      gsap.fromTo(".last-btn",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, scrollTrigger: { trigger: ".last-btn", start: "top 95%" } }
      );

    }, detailRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [id]);

  return (
    <div className="work-detail" ref={detailRef}>
      <section className="work-detail__hero">
        <HeroBackground />
        <div className="inner">
          <button className='work-detail__btn' onClick={handleBack}>Back to All Work</button>
          <h1>{data.title}</h1>
        </div>
      </section>

      <div className="sub-inner">
        <div className="work-detail__img">
          <img src={data.img} alt={data.title} />
        </div>
      </div>

      <div className="work-detail__content">
        <div className="sub-inner">
          <ul className="work-detail__header">
            <li>{data.category}</li>
            <li>{data.date}</li>
          </ul>
          <div className="work-detail__desc">
            <h2>{data.titlekr}</h2>
            <p>{data.desc}</p>
            {data.links && data.links.length > 0 && (
              <div className="work-detail__links">
                <h4>작업 사이트</h4>
                <ul>
                  {data.links.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="work-detail__desc__btn__sub"
                      >
                        {link.name}
                        <Link />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <ul className="work-detail__desc__btn">
              {data.git && (
                <li><a href={data.git} target="_blank" rel="noreferrer" className='work-detail__desc__btn__git'>Code</a></li>
              )}
              {data.view && (
                <li><a href={data.view} target="_blank" rel="noreferrer" className='work-detail__desc__btn__view'>View</a></li>
              )}
            </ul>
          </div>
          <div className="work-detail__spec">
            <div className="spec-group">
              <h4 className="spec-group__title">Role</h4>
              <ul className="spec-group__list">
                {data.role?.map((r, idx) => <li key={idx}>{r}</li>)}
              </ul>
            </div>
            <div className="spec-group">
              <h4 className="spec-group__title">Skills</h4>
              <ul className="spec-group__btn__list">
                {data.stack?.map((s, idx) => <li key={idx}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {data.subimg && data.subimg.length > 0 && (
          <div className="my-masonry">
            <div className="sub-inner">
              <div className="my-masonry-custom">
                <div className="masonry-row">
                  <div className={`item item--big ${hasSingleImage ? 'item--full' : ''}`}>
                    <img src={data.subimg[0]} alt="main sub" />
                  </div>
                  {hasMultipleImages && (
                    <div className="right">
                      {data.subimg.slice(1).map((imgUrl, idx) => (
                        <div className="item item--small" key={idx}>
                          <img src={imgUrl} alt={`sub ${idx}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="sub-inner">
        <button className='work-detail__btn last-btn' onClick={handleBack}>Back to All Work</button>
      </div>
    </div>
  );
};

export default WorkDetail;