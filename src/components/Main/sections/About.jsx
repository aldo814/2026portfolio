import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react'; // useGSAP 훅 사용 권장 (설치 안 되어 있다면 npm i @gsap/react)

gsap.registerPlugin(ScrollTrigger);

function About() {
  const sectionRef = useRef(null);

  // GitHub Pages 하위 경로 대응을 위한 베이스 URL
  const baseUrl = import.meta.env.BASE_URL;

  const careerData = [
    { company: "노스글로벌", period: "2025.10 - 현재" },
    { company: "인키움", period: "2021.03 - 2024.05" },
    { company: "피디소프트", period: "2019.01 - 2020.06" },
    { company: "진성히크", period: "2018.03 - 2018.08" }
  ];

  useGSAP(() => {
    // ── 애니메이션 시퀀스 설정 (타임라인) ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    });

    // 1. 초기 상태 세팅
    gsap.set('.about__img', { y: 100, opacity: 0, rotationY: 45 });
    gsap.set('.about__title span, .about__name, .about__desc, .about__subtitle', {
      y: 40, opacity: 0, filter: 'blur(5px)'
    });
    gsap.set('.about__capability-item', { scale: 0, opacity: 0 });
    gsap.set('.about__career-item', { x: -30, opacity: 0 });

    // 2. 애니메이션 실행 시퀀스
    tl.to('.about__img', {
      y: 0, opacity: 1, rotationY: 0, duration: 1.2, ease: 'power4.out'
    })
      .to('.about__title span', {
        y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out'
      }, '-=0.8')
      .to('.about__capability-item', {
        scale: 1, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'back.out(1.7)'
      }, '-=0.5')
      .to(['.about__name', '.about__desc'], {
        y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.1, ease: 'expo.out'
      }, '-=0.3')
      .to('.about__career-box .about__subtitle', {
        y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out'
      }, '-=0.2')
      .to('.about__career-item', {
        x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out'
      }, '-=0.3');

  }, { scope: sectionRef }); // scope를 지정하면 내부 요소 선택이 훨씬 깔끔해집니다.

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="inner">
        <div className="about__img">
          <img src={`${baseUrl}images/main/about_me.png`} alt="김은영 사진" />
        </div>
        <div className="about__cont">
          <h2 className="about__title"><span>About</span> Me</h2>
          <div className="about__profile-box">
            <ul className="about__capability-list">
              <li className="about__capability-item">UI/UX Designer</li>
              <li className="about__capability-item">Publisher</li>
              <li className="about__capability-item">Developer</li>
            </ul>
            <h3 className="about__name">김은영</h3>
            <p className="about__desc">
              디자인과 퍼블리싱을 중심으로, 사용자 경험을 최우선으로 생각합니다.<br />
              아름답고 기능적인 웹 경험을 제공하며, 웹 접근성과 마크업 완성도를 중요하게 여깁니다.<br />
              유연한 사고와 열린 마음으로 협업하며, 프론트엔드 개발 역량도 꾸준히 배워가고 있습니다.
            </p>
          </div>

          <div className="about__career-box">
            <h4 className="about__subtitle">Career</h4>
            <ul className="about__career-list">
              {careerData.map((item, index) => (
                <li key={index} className="about__career-item">
                  <span className="company">{item.company}</span>
                  <span className="period">{item.period}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;