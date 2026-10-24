import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container" id="career">
      <div className="career-container">
        <h2>
          Experience <span>&</span>
          <br /> Education
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Technical Team Member</h4>
                <h5>Smart India Hackathon (SIH) 2026</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Contributed to the technical development of an AI-assisted compliance screening solution, focusing on core frontend implementation. Worked with multiple AI tools, services, and APIs to turn project requirements into an intuitive, usable interface connecting frontend functionality with backend-driven features.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in Computer Science &amp; Engineering</h4>
                <h5>Acropolis Institute of Technology and Research, Indore</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              2nd Year, 3rd Semester (2025–Present). 1st Semester CGPA: 7.8. Focusing on core computer science subjects, algorithmic problem solving, active practice in C++ and Data Structures &amp; Algorithms, and frontend web development.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Class 12 — PCM (Science)</h4>
                <h5>Talent Public H.S. School</h5>
              </div>
              <h3>86.7%</h3>
            </div>
            <p>
              Completed Higher Secondary Certificate with Physics, Chemistry, and Mathematics, achieving 86.7% and establishing a strong quantitative and analytical foundation.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Class 10 Examination</h4>
                <h5>Talent Public H.S. School</h5>
              </div>
              <h3>2022</h3>
            </div>
            <p>
              Graduated secondary school with 85% distinction in 2022, demonstrating strong academic problem-solving abilities and scientific curiosity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
