import styled from "styled-components/macro";

const StyledFooter = styled.footer`
  margin-top: 80px;
  height: 80px;
  width: 100%;
  background: ${({ theme }) => theme.mainColor};
  background-image: ${({ theme }) => `linear-gradient(
    135deg,
    ${theme.mainColor2} 0%,
    ${theme.mainColor} 54%,
    ${theme.mainColor2} 98%`} 
  );
  position: relative;
  bottom: 0;
  left: 0;
  text-align: center;

  div {
    margin-top: 50px;
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <div>© 2021 InstaHarvest</div>
    </StyledFooter>
  );
};

export default Footer;
