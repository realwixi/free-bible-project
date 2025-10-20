
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
    <p>If you want to collaborate or contribute, kindly reach out at <a href="https://github.com/realwixi" target="_blank" rel="noopener noreferrer" style={{color:'#222',fontWeight:600}}>github.com/realwixi</a>.</p>
  </div>
);

export default About;
