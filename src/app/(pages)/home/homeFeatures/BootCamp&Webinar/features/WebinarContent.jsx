import Image from 'next/image';
import styled from 'styled-components';
import Pro from '../../../../../../assets/image/avatar-design.png';
import Boy from '../../../../../../assets/image/boy.png';

const Container = styled.div`
  display: flex;
  width: 1200px;
  position: relative;
  left: -290px;
  justify-content: center;
  padding: 50px;
  background-color: #151b25; /* Updated background color */
`;

const Card = styled.div`
  background-color: #124559; /* Updated card color */
  color: white;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  width: 450px;
  margin: 0 20px;
  padding: 20px;
  position: relative;
`;

const Label = styled.div`
  position: absolute;
  top: 10px;
  left: 6px;
  background-color: ${props => props.bgColor || '#ff5700'};
  color: white;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 0.9rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-top: 20px;
`;

const Description = styled.p`
  margin: 10px 0;
`;

const InfoList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 10px 0;
  li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 0.9rem;
    &:before {
      content: '✔️';
      margin-right: 10px;
      color: #00ff8c;
    }
  }
`;

const ExploreButton = styled.button`
  background-color: white;
  color: #58b4d1;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 1.5rem;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  &:hover {
    background-color: #58b4d1;
    color: white ;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 50px;
  h1 {
    font-size: 2.5rem;
    color: #000000;
  }
  span {
    color: #ff6f61;
    display: block;
    margin-top: 10px;
    font-size: 1.2rem;
  }
`;

const CardImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 0;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
`;

const App = () => {
  return (
    <>
<h1 className="text-4xl mx-auto font-bold text-blue-900 mb-9 text-center">Enhanced Courses for Exponential Growth in Skills</h1>
<Container>
        <Card>
          <Label bgColor="#8a5a44">Newly Launched for Students</Label>
          <CardImage>
            <Image src={Boy} alt="Avatar" />
          </CardImage>
          <Title>PulseZest-Learning Zesty Tech</Title>
          <Description>2 years program for 1st to pre-final year college students</Description>
          <InfoList>
            <li>Get job assistance</li>
            <li>Complete CS education</li>
            <li>2 year flexible student track</li>
          </InfoList>
          <ExploreButton>Explore Offers</ExploreButton>
        </Card>
        <Card>
          <Label bgColor="#2b2d42">For Professionals</Label>
          <CardImage>
            <Image src={Pro} alt="Avatar" />
          </CardImage>
          <Title>Job Bootcamp</Title>
          <Description>Extensive program for working professionals for get Dream Jobs</Description>
          <InfoList>
            <li>Get job assistance</li>
            <li>FSD/Data career tracks</li>
            <li>9 months intensive bootcamp</li>
          </InfoList>
          <ExploreButton>Join Webinar</ExploreButton>
        </Card>
      </Container>
    </>
  );
}

export default App;
