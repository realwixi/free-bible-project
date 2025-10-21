const About = () => (
  <div className="about-page" style={{
    maxWidth: '600px',
    margin: '80px auto',
    padding: '2rem',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 24px rgba(0,0,0,0.08)',
    textAlign: 'center',
    color: '#222',
    fontSize: '1.15rem',
    fontWeight: 500
  }}>
    <h2 style={{marginBottom: '1.2rem'}}>About This Project</h2>
    <p>This is the <strong>Free Bible Project</strong> — an open source initiative to make Bible reading, note-taking, and sharing accessible to everyone.</p>
    <p>This project is not possible without the works of all the other individuals who contributed to each thing and who made it publicly and freely available.</p>
    <p><strong>Free Bible Project</strong> does not take credit; we simply integrated and made existing work accessible to the public. This is our contribution to society.</p>
  </div>
);

export default About;