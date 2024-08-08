import Head from 'next/head';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 50px;
  width: 150%;
  background-color: #151b25;
  color: white;
  font-family: Arial, sans-serif;
`;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 50px;
  bottom: -1950px;
  background-color: #1a1a1a;
  padding: 20px;
  border-radius: 10px;
`;

const SidebarButton = styled.button`
  background-color: grey;
  color: #001524;
  padding: 10px;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background-color: #58b4d1;
    color: white;
  }

  ${({ active }) =>
    active &&
    `
    background-color: #58b4d1;
    color: white;
  `}
`;

const Content = styled.div`
  flex: 1;
  margin-right: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
`;

const InfoList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 20px 0;
  li {
    margin: 10px 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const Metrics = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: #126782;
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
  gap: 20px;

`;

const Metric = styled.div`
  text-align: center;
  font-size: 1rem; `;

const FormContainer = styled.div`
  flex: 1;
  background-color: #008083;
  padding: 30px;
  border-radius: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #d88e45;
  color: white;
  padding: 10px;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Home() {
  const [activeSection, setActiveSection] = useState('full-stack');

  const renderContent = () => {
    if (activeSection === 'full-stack') {
      return (
        <>
          <Title>Full Stack Web Development Bootcamp</Title>
          <p>
            Available in two formats MERN & Spring-boot, learn by practice and making real world projects.
          </p>
          <InfoList>
            <li>✓ Placement Assistance</li>
            <li>✓ 1:1 Mentorship</li>
            <li>✓ Faculty from MAANG</li>
          </InfoList>
          <Metrics>
            <Metric>
              <div>90%</div>
              <div>Placement Rate</div>
            </Metric>
            <Metric>
              <div>1200+</div>
              <div>Hiring Partners</div>
            </Metric>
            <Metric>
              <div>128%</div>
              <div>Average Hike</div>
            </Metric>
            <Metric>
              <div>1.5 L+</div>
              <div>Learners</div>
            </Metric>
          </Metrics>
        </>
      );
    } else if (activeSection === 'data-analyst') {
      return (
        <>
          <Title>Data Analyst Bootcamp</Title>
          <p>
            Learn data analysis techniques, tools, and methodologies. Prepare for a career in data analytics with hands-on projects.
          </p>
          <InfoList>
            <li>✓ Data Analysis Techniques</li>
            <li>✓ Tools & Methodologies</li>
            <li>✓ Real-World Projects</li>
          </InfoList>
          <Metrics>
            <Metric>
              <div>85%</div>
              <div>Placement Rate</div>
            </Metric>
            <Metric>
              <div>1000+</div>
              <div>Hiring partners</div>
            </Metric>
            <Metric>
              <div>115%</div>
              <div>Average Hike</div>
            </Metric>
            <Metric>
              <div>1.2 L+</div>
              <div>Learners</div>
            </Metric>
          </Metrics>
        </>
      );
    }
  };

  return (
    <>
      <Head>
        <title>Bootcamp</title>
      </Head>
      <SidebarContainer>
        <SidebarButton active={activeSection === 'full-stack'} onClick={() => setActiveSection('full-stack')}>
          Full Stack
        </SidebarButton>
        <SidebarButton active={activeSection === 'data-analyst'} onClick={() => setActiveSection('data-analyst')}>
          Data Analyst
        </SidebarButton>
      </SidebarContainer>
      <Container>
        <Content>
          {renderContent()}
        </Content>
        <FormContainer>
  <h2>Book a <span style={{ color: '#f27059' }}>Free live webinar</span> to know more</h2>
  <Form>
    <Input type="text" placeholder="Enter name" required />
    <Input type="email" placeholder="Email" required />
    <Input type="tel" placeholder="Phone number" required />
    <div>
      <p>Experience:</p>
      <div style={{ marginBottom: '10px' }}>
        <input type="radio" id="technical" name="experience" value="technical" />
        <label htmlFor="technical" style={{ marginLeft: '10px' }}>Working Professional - Technical Roles</label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input type="radio" id="non-technical" name="experience" value="non-technical" />
        <label htmlFor="non-technical" style={{ marginLeft: '10px' }}>Working Professional - Non Technical</label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input type="radio" id="final-year" name="experience" value="final-year" />
        <label htmlFor="final-year" style={{ marginLeft: '10px' }}>College Student - Final Year</label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input type="radio" id="pre-final" name="experience" value="pre-final" />
        <label htmlFor="pre-final" style={{ marginLeft: '10px' }}>College Student - 1st to Pre-final Year</label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input type="radio" id="others" name="experience" value="others" />
        <label htmlFor="others" style={{ marginLeft: '10px' }}>Others</label>
      </div>
    </div>
    <Button type="submit">Continue booking webinar</Button>
  </Form>
</FormContainer>

      </Container>
    </>
  );
}
