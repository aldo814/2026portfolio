import emailjs from 'emailjs-com';

const sendEmail = (e) => {
  e.preventDefault();

  emailjs.sendForm(
    'YOUR_SERVICE_ID',
    'YOUR_TEMPLATE_ID',
    e.target,
    'YOUR_PUBLIC_KEY'
  )
    .then(() => {
      alert('문의가 완료되었습니다.');
    })
    .catch(() => {
      alert('실패');
    });
};