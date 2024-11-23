import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { ChevronUp } from "lucide-react";

const BackToTopButton = ({ targetId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef(null);

  // Fonction pour scroller en haut du conteneur cible
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Gérer la visibilité du bouton en fonction de la position de scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (scrollContainerRef.current) {
        setIsVisible(scrollContainerRef.current.scrollTop > 300);
      }
    };

    const container = document.getElementById(targetId);
    if (container) {
      scrollContainerRef.current = container;
      container.addEventListener("scroll", toggleVisibility);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", toggleVisibility);
      }
    };
  }, [targetId]);

  return (
    isVisible && (
      <ScrollToTopButton onClick={scrollToTop}>
        <ChevronUp size={24} />
      </ScrollToTopButton>
    )
  );
};

export default BackToTopButton;

const ScrollToTopButton = styled.button`
  z-index: 2000;
  position: fixed;
  bottom: 20px;
  right: 30px;
  width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.8);
  color: #000;
  border: none;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease, transform 0.3s ease;

  &:hover {
    opacity: 1;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;
