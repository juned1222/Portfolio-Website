import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          Computer Science undergraduate with practical exposure to AI-enabled applications, API integration, frontend development and problem solving. Interested in AI, developer communities and building practical technology solutions. Seeking opportunities to contribute, learn and engage with emerging AI technologies.
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
