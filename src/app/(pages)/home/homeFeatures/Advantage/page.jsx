// Custom styles for glowing text
const glowingTextStyle = {
  color: '#1F2937', // Darker shade for better contrast
  fontWeight: 'bold',
};

// Animation styles
const animatedTableStyle = {
  animation: 'fadeIn 1s ease-in-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
};

const progressBarContainerStyle = {
  width: '80%',
  margin: '10px auto',
  backgroundColor: '#023047',
  borderRadius: '10px',
  color: '#ffffff',
  padding: '10px',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  gap: '5px', // Added gap to manage spacing between progress bars
};

const progressBarStyle = {
  height: '25px',
  borderRadius: '20px',
  textAlign: 'center',
  color: '#ffffff',
  fontWeight: 'bold',
  lineHeight: '25px',
};

const progressBar1Style = {
  ...progressBarStyle,
  backgroundImage: 'linear-gradient(to right, #3B82F6, #60A5FA, #93C5FD)',
  width: '95%', // Percentage filled
  marginLeft: '8px'
};

const progressBar2Style = {
  ...progressBarStyle,
  backgroundColor: '#9CA3AF', // Gray for better contrast
  width: '45%', // Percentage filled
  marginTop: '20px',
  marginRight: '25px'
};

const CoursePage = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      <h1 className="text-5xl font-bold text-blue-900 mb-9">Advantages of PulseZest-Learning</h1> {/* Updated text color */}
      <div style={{ width: '80%', margin: '20px auto', backgroundColor: '#ffffff', borderRadius: '10px', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', ...animatedTableStyle }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#264653', color: '#ffffff', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
              <th style={{ padding: '20px 10px', borderBottom: '2px solid #ffffff' }}></th>
              <th style={{ padding: '20px 10px', borderBottom: '2px solid #ffffff' }}>PULSE ZEST LEARNING</th>
              <th style={{ padding: '20px 10px', borderBottom: '2px solid #ffffff' }}>Other Courses</th>
              <th style={{ padding: '20px 10px', borderBottom: '2px solid #ffffff' }}>Free Resources</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '15px 10px', fontWeight: 'bold', ...glowingTextStyle }}>Fastest 1:1 Doubt Support</td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#10B981' }}>✓</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#EF4444' }}>✗</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#EF4444' }}>✗</span></td>
            </tr>
            <tr>
              <td style={{ padding: '15px 10px', fontWeight: 'bold', color: 'black', ...glowingTextStyle }}>Expert-led Sessions</td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#10B981' }}>✓</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#EF4444' }}>✗</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#EF4444' }}>✗</span></td>
            </tr>
            <tr>
              <td style={{ padding: '15px 10px', fontWeight: 'bold', ...glowingTextStyle }}>Lifetime Access</td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#10B981' }}>✓</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#EF4444' }}>✗</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#EF4444' }}>✗</span></td>
            </tr>
            <tr>
              <td style={{ padding: '15px 10px', fontWeight: 'bold', ...glowingTextStyle }}>Certification Included</td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#10B981' }}>✓</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#10B981' }}>✓</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#EF4444' }}>✗</span></td>
            </tr>
            <tr>
              <td style={{ padding: '15px 10px', fontWeight: 'bold', ...glowingTextStyle }}>Hands-on Projects</td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#10B981' }}>✓</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#EF4444' }}>✗</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#EF4444' }}>✗</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Progress Bars */}
      <div style={progressBarContainerStyle}>
        <p style={{ color: '#ffffff', marginBottom: '30px', display: 'flex', alignItems: 'center' }}>
          <img 
            src="1.png" 
            style={{ height: '2em', width: '2em', marginRight: '0.5em', color: 'white' }} 
            alt="PulseZest logo" 
          /> 
          PulseZest-Learning
        </p>
        <div style={progressBar1Style}>95%</div>
        <div style={{ ...progressBarContainerStyle, margin: '0' }}>
        <p style={{ color: '#ffffff' }}>Others</p>
        <div style={progressBar2Style}>45%</div>
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
