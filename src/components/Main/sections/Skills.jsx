import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Skills() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const itemsRef = useRef([]);

  const skillsRow1 = [
    { name: 'Photoshop', icon: 'ico_ps.svg', level: 90, desc: '디자인 시안 제작 및 웹용 이미지 최적화, 합성 숙련' },
    { name: 'Figma', icon: 'ico_figma.svg', level: 85, desc: '컴포넌트 기반 UI 설계 및 개발 협업용 프로토타입 제작' },
    { name: 'Html5', icon: 'ico_html.svg', level: 95, desc: '웹 표준과 시맨틱 마크업을 준수하는 구조 설계' },
    { name: 'Css3', icon: 'ico_css.svg', level: 95, desc: 'Flex/Grid 레이아웃 및 애니메이션을 활용한 동적 UI 구현' },
    { name: 'Jquery', icon: 'ico_jquery.svg', level: 90, desc: '다양한 플러그인 활용 및 DOM 제어를 통한 인터랙션 구현' },
    { name: 'Javascript', icon: 'ico_js.svg', level: 60, isBlack: true, desc: '바닐라 JS를 활용한 UI 인터랙션 구현' },
  ];

  const skillsRow2 = [
    { name: 'React.Js', icon: 'ico_react.svg', level: 50, desc: '재사용성을 고려한 컴포넌트 설계 및 UI 구조 구현', isBlack: true },
    { name: 'Php', icon: 'ico_php.svg', level: 50, desc: 'CodeIgniter 환경의 게시판 구조 이해 및 데이터 연동 활용' },
    { name: 'Bootstrap', icon: 'ico_boot.svg', level: 80, desc: '그리드 시스템을 활용한 신속한 반응형 레이아웃 구축' },
    { name: 'Git Hub', icon: 'ico_git.svg', level: 80, desc: 'GitHub Desktop을 활용한 버전 관리 및 기초 협업 프로세스 이행' },
    { name: '웹접근성', icon: 'ico_wa.svg', level: 100, desc: '접근성 표준 준수 및 웹접근성 인증 마크 획득 실무 경험' },
    { name: 'Scss', icon: 'ico_sass.svg', level: 80, desc: '변수와 믹스인을 활용한 체계적이고 효율적인 스타일 관리' },
  ];

  const allSkills = [...skillsRow1, ...skillsRow2];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // 타이틀 & 아이템 등장 애니메이션
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none"
        }
      });

      gsap.set(titleRef.current, { y: 50, opacity: 0, filter: 'blur(10px)' });
      gsap.set(itemsRef.current, { y: 60, opacity: 0, filter: 'blur(10px)' });

      tl
        .to(titleRef.current, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: "power4.out"
        })
        .to(itemsRef.current, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8,
          stagger: { each: 0.1, from: "start" },
          ease: "expo.out"
        }, '-=0.5');

      // 모바일 전용 — 스크롤 시 숫자 카운트업 자동 실행
      if (window.innerWidth <= 768) {
        itemsRef.current.forEach((item, index) => {
          if (!item) return;
          const num = item.querySelector('.skills__num');
          const targetLevel = allSkills[index]?.level;
          if (!num || !targetLevel) return;

          ScrollTrigger.create({
            trigger: item,
            start: "top 85%",
            once: true, // 한 번만 실행
            onEnter: () => {
              const count = { val: 0 };
              gsap.to(count, {
                val: targetLevel,
                duration: 1.2,
                ease: "power2.out",
                onUpdate: () => { num.innerText = Math.floor(count.val); }
              });
            }
          });
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // PC hover 인터랙션
  const onHoverSkill = (e, targetLevel) => {
    if (window.innerWidth <= 768) return; // 모바일에서는 hover 비활성화
    const item = e.currentTarget;
    const border = item.querySelector('.skills__border-path');
    const num = item.querySelector('.skills__num');
    const desc = item.querySelector('.skills__desc');
    const totalLength = border.getTotalLength();
    const drawLength = (targetLevel / 100) * totalLength;

    gsap.killTweensOf(border);
    gsap.set(border, { strokeDasharray: totalLength, strokeDashoffset: totalLength });
    gsap.to(border, { strokeDashoffset: totalLength - drawLength, duration: 1.5, ease: "power3.inOut" });

    const count = { val: 0 };
    gsap.to(count, {
      val: targetLevel, duration: 1.2, ease: "power2.out",
      onUpdate: () => { num.innerText = Math.floor(count.val); }
    });

    gsap.fromTo(desc, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.2 });
  };

  const onLeaveSkill = (e) => {
    if (window.innerWidth <= 768) return; // 모바일에서는 비활성화
    const item = e.currentTarget;
    const border = item.querySelector('.skills__border-path');
    const num = item.querySelector('.skills__num');
    const totalLength = border.getTotalLength();

    gsap.to(border, { strokeDashoffset: totalLength, duration: 0.5, ease: "power2.in" });
    gsap.to(num, {
      opacity: 0.5, duration: 0.3,
      onComplete: () => { num.innerText = "0"; gsap.set(num, { opacity: 1 }); }
    });
  };

  const renderSkillItem = (skill, index) => (
    <div
      key={`skill-${index}`}
      className={`skills__item ${skill.isBlack ? 'skills__item--black' : ''}`}
      ref={el => itemsRef.current[index] = el}
      onMouseEnter={(e) => onHoverSkill(e, skill.level)}
      onMouseLeave={onLeaveSkill}
    >
      <div className="skills__default">
        <div className="skills__icon"><img src={`/src/assets/images/main/${skill.icon}`} alt={skill.name} /></div>
        <p className="skills__name">{skill.name}</p>
      </div>
      <div className="skills__hover">
        <svg className="skills__border" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect className="skills__border-path" x="0" y="0" width="100" height="100" />
        </svg>
        <p className="skills__name">{skill.name}</p>
        <div className="skills__num-wrap">
          <span className="skills__num">0</span><span className="unit">%</span>
        </div>
        <p className="skills__desc">{skill.desc}</p>
      </div>
    </div>
  );

  return (
    <section className="skills" ref={sectionRef} id='skills'>
      <div className="inner">
        <h2 className="skills__title" ref={titleRef}><span>My</span> skill</h2>
        <div className="skills__cont">
          <div className="skills__row row1">
            {skillsRow1.map((skill, index) => renderSkillItem(skill, index))}
          </div>
          <div className="skills__row row2">
            {skillsRow2.map((skill, index) => renderSkillItem(skill, skillsRow1.length + index))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;