import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

function Skills() {
  const sectionRef = useRef(null); // 섹션 전체 Ref
  const titleRef = useRef(null); // 타이틀 Ref
  const itemsRef = useRef([]); // 스킬 아이템들 Ref 배열

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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // 🌟 타이틀 & 아이템 순차 등장 타임라인
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%", // 섹션이 뷰포트 70% 위치에 올 때 시작
          toggleActions: "play none none none"
        }
      });

      // 1. 초기 상태 세팅
      gsap.set(titleRef.current, { y: 50, opacity: 0, filter: 'blur(10px)' });
      gsap.set(itemsRef.current, { y: 60, opacity: 0, filter: 'blur(10px)' });

      // 2. 애니메이션 시퀀스 실행
      tl
        // [1단계: 타이틀] 흐릿함이 사라지며 위로 등장
        .to(titleRef.current, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: "power4.out"
        })

        // [2단계: 스킬 아이템] 타이틀 등장 후 1개씩 순차적으로(Stagger) 등장
        .to(itemsRef.current, {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          stagger: {
            each: 0.1, // 각 아이템 간의 간격 (초 단위, 이전 0.08에서 늘려 한개씩 느낌 강조)
            from: "start" // 처음부터 순서대로
          },
          ease: "expo.out"
        }, '-=0.5'); // 타이틀 애니메이션이 끝나기 0.5초 전에 아이템 등장 시작

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 🌟 마우스 호버 (기존 고급 인터랙션 유지)
  const onHoverSkill = (e, targetLevel) => {
    const item = e.currentTarget;
    const border = item.querySelector('.skills__border-path');
    const num = item.querySelector('.skills__num');
    const desc = item.querySelector('.skills__desc');

    const totalLength = border.getTotalLength();
    const drawLength = (targetLevel / 100) * totalLength;

    gsap.killTweensOf(border);
    gsap.set(border, { strokeDasharray: totalLength, strokeDashoffset: totalLength });
    gsap.to(border, {
      strokeDashoffset: totalLength - drawLength,
      duration: 1.5,
      ease: "power3.inOut"
    });

    const count = { val: 0 };
    gsap.to(count, {
      val: targetLevel,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => { num.innerText = Math.floor(count.val); }
    });

    gsap.fromTo(desc, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.2 });
  };

  const onLeaveSkill = (e) => {
    const item = e.currentTarget;
    const border = item.querySelector('.skills__border-path');
    const num = item.querySelector('.skills__num');
    const totalLength = border.getTotalLength();

    gsap.to(border, { strokeDashoffset: totalLength, duration: 0.5, ease: "power2.in" });
    gsap.to(num, { opacity: 0.5, duration: 0.3, onComplete: () => { num.innerText = "0"; gsap.set(num, { opacity: 1 }); } });
  };

  return (
    <section className="skills" ref={sectionRef} id='skills'>
      <div className="inner">
        {/* 타이틀 Ref 연결 */}
        <h2 className="skills__title" ref={titleRef}><span>My</span> skill</h2>

        <div className="skills__cont">
          {/* 첫 번째 줄 */}
          <div className="skills__row row1">
            {skillsRow1.map((skill, index) => (
              <div
                key={`row1-${index}`}
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
            ))}
          </div>

          {/* 두 번째 줄 */}
          <div className="skills__row row2">
            {skillsRow2.map((skill, index) => (
              <div
                key={`row2-${index}`}
                className={`skills__item ${skill.isBlack ? 'skills__item--black' : ''}`}
                ref={el => itemsRef.current[skillsRow1.length + index] = el}
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;