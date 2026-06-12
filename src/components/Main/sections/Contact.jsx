import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

function Contact() {
  const [status, setStatus] = useState('');
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contRef = useRef(null);
  const formAreaRef = useRef(null);
  const formRef = useRef();

  // GitHub Pages 하위 경로 대응
  const baseUrl = import.meta.env.BASE_URL;

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "play none none none"
      }
    });

    // 초기 상태 설정
    gsap.set(titleRef.current, { y: 50, opacity: 0, filter: 'blur(10px)' });
    gsap.set(contRef.current, { x: -100, opacity: 0 });
    gsap.set(formAreaRef.current, { x: 100, opacity: 0 });

    tl.to(titleRef.current, {
      y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: "power4.out"
    })
      .to([contRef.current, formAreaRef.current], {
        x: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "expo.out"
      }, "-=0.6");
  }, { scope: sectionRef });

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus('loading');

    emailjs.sendForm(
      'service_tiytwqa',
      'template_ed0fq5u',
      formRef.current,
      'ubHSDQLdJXqHDITfs'
    )
      .then((result) => {
        setStatus('success');
        formRef.current.reset();
        setTimeout(() => setStatus(''), 10000);
      })
      .catch((error) => {
        setStatus('error');
      });
  };

  return (
    <section className="contact" id='contact' ref={sectionRef}>
      <div className="inner">
        <h2 className="contact__title" ref={titleRef}>Contact</h2>
        <div className="contact__wrap">
          <div className="contact__cont" ref={contRef}>
            <div className="contact__info">
              <h3 className="contact__heading">
                Have a <span className='stroke'>project</span> in mind?<br />
                Let’s build it together.
              </h3>
              <p className="contact__desc">구상하고 계신 프로젝트가 있으신가요?</p>
              <a href="mailto:0sister16@gmail.com" className="contact__email">0sister16@gmail.com</a>
            </div>
          </div>

          <div className="contact__form-area" ref={formAreaRef}>
            <form className="contact__form" ref={formRef} onSubmit={sendEmail}>
              <ul className='contact__form__list'>
                <li><input type="text" name="user_company" placeholder="회사명" className="contact__input" required /></li>
                <li><input type="text" name="user_name" placeholder="담당자명" className="contact__input" required /></li>
                <li><input type="tel" name="user_tel" placeholder="연락처" className="contact__input" /></li>
                <li><input type="email" name="user_email" placeholder="이메일" className="contact__input" required /></li>
                <li><input type="url" name="user_url" placeholder="웹사이트 URL" className="contact__input" /></li>
                <li>
                  <textarea name="message" placeholder="문의사항을 입력해주세요" className="contact__textarea" required></textarea>
                </li>
              </ul>

              <div className="contact__bottom">
                <button type="submit" className="contact__submit" disabled={status === 'loading'}>
                  <span>{status === 'loading' ? '전송 중...' : '문의하기'}</span>
                </button>

                <div className="contact__links">
                  <a href="https://github.com/aldo814" target="_blank" rel="noreferrer" className="contact__link">
                    <img src={`${baseUrl}images/main/ico_github.svg`} alt="깃허브" />
                  </a>
                  <a href="https://velog.io/@eunyoe/posts" target="_blank" rel="noreferrer" className="contact__link">
                    <img src={`${baseUrl}images/main/ico_velog.svg`} alt="블로그" />
                  </a>
                </div>
              </div>

              <div className="contact__status">
                {status === 'loading' && <p className="msg loading">메시지를 보내고 있습니다...</p>}
                {status === 'success' && <p className="msg success">문의가 전송되었습니다 👍 <br />곧 회신 드릴게요!</p>}
                {status === 'error' && <p className="msg error">전송에 실패했습니다 😢 <br />이메일로 직접 연락 부탁드립니다.</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;