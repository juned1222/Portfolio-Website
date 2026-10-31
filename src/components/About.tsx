import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          Computer Science undergraduate passionate about C++, Object-Oriented Programming (OOPs), Web Technologies (HTML, CSS), and Graphic Designing. Dedicated to clean algorithmic problem solving, structured software design, and crafting visually compelling user interfaces and digital experiences.
        </p>
        <div className="about-details">
          <div className="about-detail-item">
            <span className="about-detail-label">Education</span>
            <span className="about-detail-value">Acropolis Institute of Technology and Research, Indore</span>
          </div>
          <div className="about-detail-item">
            <span className="about-detail-label">Program</span>
            <span className="about-detail-value">B.Tech CSE (2nd Year, 3rd Semester) · CGPA: 7.8</span>
          </div>
          <div className="about-detail-item">
            <span className="about-detail-label">Languages</span>
            <span className="about-detail-value">Hindi, English</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
