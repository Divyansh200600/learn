import styled from 'styled-components';
import { FaChalkboardTeacher, FaUserTie, FaBriefcase, FaQuestionCircle, FaVideo } from 'react-icons/fa';

const BenefitsContainer = styled.div`
  background-color: #012a4a;
  padding: 50px;
  color: white;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitCard = styled.div`
  background-color: #2a6f97;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
`;

const Icon = styled.div`
  font-size: 2rem;
  color: white;
`;

const BenefitTitle = styled.h3`
  font-size: 1.2rem;
  color: white;
  margin: 0;
  font-weight: bold;
  text-align: center;
`;

const BenefitDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: white;
  text-align: center;
`;

const BenefitsSection = () => {
  return (
    <BenefitsContainer>
      <h1 className="text-5xl mx-auto font-bold text-white-900 mb-9 text-center">Job Bootcamp Benefits</h1>
      <BenefitsGrid>
        <BenefitCard>
          <Icon><FaChalkboardTeacher /></Icon>
          <BenefitTitle>1:1 Expert Session</BenefitTitle>
          <BenefitDescription>Connects theoretical understanding with practical implementation through their insights</BenefitDescription>
        </BenefitCard>
        <BenefitCard>
          <Icon><FaUserTie /></Icon>
          <BenefitTitle>Expert Faculty with 15+ Years of Experience</BenefitTitle>
          <BenefitDescription>Top-tier education enriched by practical knowledge and innovation</BenefitDescription>
        </BenefitCard>
        <BenefitCard>
          <Icon><FaBriefcase /></Icon>
          <BenefitTitle>Case Studies to Make You Job Ready</BenefitTitle>
          <BenefitDescription>Hands-on learning to spark creative problem-solving</BenefitDescription>
        </BenefitCard>
        <BenefitCard>
          <Icon><FaQuestionCircle /></Icon>
          <BenefitTitle>Quick Doubt Support</BenefitTitle>
          <BenefitDescription>Personalised assistance for a clear understanding of concepts</BenefitDescription>
        </BenefitCard>
        <BenefitCard>
          <Icon><FaVideo /></Icon>
          <BenefitTitle>Live Classes</BenefitTitle>
          <BenefitDescription>Learn by practice with instant feedback</BenefitDescription>
        </BenefitCard>
      </BenefitsGrid>
    </BenefitsContainer>
  );
};

export default BenefitsSection;
