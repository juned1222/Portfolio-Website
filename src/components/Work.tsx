import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const projects = [
  {
    title: "AI Legal Metrology Compliance",
    category: "Smart India Hackathon 2026",
    tools: "HTML, CSS, UI Design, Problem Solving",
    description:
      "Frontend & technical user interface implementation for an automated package compliance screening solution at SIH 2026.",
    image: "/images/sih-project.svg",
    link: "https://github.com/juned1222",
  },
  {
    title: "Groundwater Health-Risk Research",
    category: "RAMSITA 2026 International Conf.",
    tools: "Hydrogeochemical Modeling, Health-Risk Assessment, Technical Research",
    description:
      "Certificate of Recognition at RAMSITA-2026 for distinguished research on Fluorinated Groundwater in MP with engineering mitigation strategies.",
    image: "/images/ramsita-research.svg",
    link: "https://www.linkedin.com/in/junedshaikh01",
  },
  {
    title: "Creative Web & UI Design",
    category: "Web & Graphic Design",
    tools: "HTML5, CSS3, Graphic Designing, UI/UX",
    description:
      "Designing responsive web layouts and creative digital assets with expressive visuals, modern CSS styling, and visual aesthetics.",
    image: "/images/web-dev.svg",
    link: "https://github.com/juned1222",
  },
  {
    title: "C++ & OOPs Problem Solving",
    category: "Core Computer Science",
    tools: "C++, OOPs, Data Structures, Algorithms",
    description:
      "Algorithmic problem solving, object-oriented architecture, modular design patterns, and computational efficiency in C++.",
    image: "/images/dsa-cpp.svg",
    link: "https://github.com/juned1222",
  },
];

const Work = () => {
  useGSAP(() => {
    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (!box || box.length === 0) return;
      const container = document.querySelector(".work-container");
      if (!container || !box[0].parentElement) return;
      const rectLeft = container.getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`, // Use actual scroll width
        scrub: true,
        pin: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          Projects <span>&amp; Research</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
                <p style={{ marginTop: "10px", fontSize: "14px", lineHeight: "20px", color: "#cbd5e1" }}>
                  {project.description}
                </p>
              </div>
              <WorkImage image={project.image} alt={project.title} link={project.link} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
