import Hero from "./sections/Hero";
import About from "./sections/About";
import Portfolio from "./sections/Work";
import Skills from "./sections/Skills";
import Contact from "./sections/Contact";
import '../../style/main.scss';

function Main() {
  return (
    <>
      <div className="main">
        <Hero />
        <About />
        <Skills />
        <Portfolio />
        <Contact />
      </div>
    </>
  );
}

export default Main;