import styled, { keyframes } from "styled-components";
import { Brain, Cpu, Zap } from "lucide-react";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const HeaderContainer = styled.header`
  width: 100%;
  background: linear-gradient(90deg, #1a73e8, #6a11cb, #2575fc);
  background-size: 300% 300%;
  animation: ${gradientAnimation} 6s ease infinite;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 4%; /* Réduit encore le padding pour compresser la hauteur */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 5px 8%; /* Réduit encore le padding pour les petits écrans */
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* Réduit l'espace entre le logo et le texte */
`;

const Title = styled.h1`
  font-family: "Orbitron", sans-serif;
  font-size: 1.2rem; /* Réduit davantage la taille du titre */
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px; /* Réduit l'espacement des lettres */
  margin: 0;
  text-transform: uppercase;
  text-shadow: 0 0 8px rgba(37, 117, 252, 0.5); /* Légèrement réduit le flou de l'ombre */
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Subtitle = styled.p`
  font-size: 0.7rem; /* Réduit encore la taille de la police du sous-titre */
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px; /* Réduit l'espacement des lettres */
  margin-top: 2px; /* Réduit l'espace au-dessus du sous-titre */
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px; /* Réduit encore l'espace entre les icônes */
  color: white;
  opacity: 0.8;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <LogoContainer>
        <IconWrapper>
          <Brain size={32} />
          <Cpu size={32} />
          <Zap size={32} />
        </IconWrapper>
        <div>
          <Title>Blog IA</Title>
          <Subtitle>Documents Générés par IA</Subtitle>
        </div>
      </LogoContainer>
    </HeaderContainer>
  );
};

export default Header;
