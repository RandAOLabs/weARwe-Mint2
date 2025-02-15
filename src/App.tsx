import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { Character } from './components/Character';
import { MintSection } from './components/MintSection';
import { LeftNFTs } from './components/LeftNFTs';
import { RightNFTs } from './components/RightNFTs';

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-image: url('/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: 300px; /* Space for the character */
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const ThreeWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

function App() {
  const [currentPhase, setCurrentPhase] = useState<'OG' | 'FCFS' | 'PUBLIC' | 'NOT_STARTED'>('NOT_STARTED');
  const [timeLeft, setTimeLeft] = useState<{ og: string; fcfs: string; public: string }>({
    og: '',
    fcfs: '',
    public: ''
  });
  const [totalMinted, setTotalMinted] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();

      // OG and FCFS start time: Feb 7th, 17:00 UTC
      const ogStartDate = new Date(Date.UTC(2025, 1, 7, 17, 0, 0));

      // OG ends after 48 hours: Feb 9th, 17:00 UTC
      const ogEndDate = new Date(Date.UTC(2025, 1, 9, 17, 0, 0));

      // FCFS ends after 2 hours: Feb 7th, 19:00 UTC
      const fcfsEndDate = new Date(Date.UTC(2025, 1, 7, 19, 0, 0));

      // Public starts when FCFS ends: Feb 7th, 19:00 UTC
      const publicStartDate = fcfsEndDate;

      const calculateTimeUntilStart = (startDate: Date) => {
        const difference = startDate.getTime() - now.getTime();
        if (difference <= 0) return '';

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds > 0) parts.push(`${seconds}s`);

        return parts.join(' ');
      };

      const calculateTimeRemaining = (endDate: Date) => {
        const difference = endDate.getTime() - now.getTime();
        if (difference <= 0) return '';

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds > 0) parts.push(`${seconds}s`);

        return parts.join(' ');
      };

      // Determine current phase
      if (now < ogStartDate) {
        setCurrentPhase('NOT_STARTED');
      } else if (now < ogEndDate) {
        setCurrentPhase('OG');
      } else if (now < fcfsEndDate) {
        setCurrentPhase('FCFS');
      } else {
        setCurrentPhase('PUBLIC');
      }

      setTimeLeft({
        og: now < ogStartDate ? calculateTimeUntilStart(ogStartDate) :
          now < ogEndDate ? calculateTimeRemaining(ogEndDate) : '',
        fcfs: now < ogStartDate ? calculateTimeUntilStart(ogStartDate) :
          now < fcfsEndDate ? calculateTimeRemaining(fcfsEndDate) : '',
        public: now < publicStartDate ? calculateTimeUntilStart(publicStartDate) : ''
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <AppContainer>
      <ContentWrapper>
        <MintSection
          currentPhase={currentPhase}
          timeLeft={timeLeft}
        />
      </ContentWrapper>
      <ThreeWrapper>
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <pointLight position={[-10, 10, -10]} intensity={0.5} />
          <LeftNFTs />
          <RightNFTs />
        </Canvas>
      </ThreeWrapper>
      <Character />
    </AppContainer>
  );
}

export default App;
