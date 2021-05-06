import styled from "styled-components";

const StyledFooter = styled.footer`
  margin-top: 80px;
  height: 80px;
  width: 100%;
  background-color: #f2ff80;
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
