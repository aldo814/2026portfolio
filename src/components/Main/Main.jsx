import Hero from "./sections/Hero";
import About from "./sections/About";
import Portfolio from "./sections/Work";
import Skills from "./sections/Skills";
import Contact from "./sections/Contact";
import '../../style/main.scss';

function Main() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Portfolio />
      <Contact />
    </>
  );
}

export default Main;