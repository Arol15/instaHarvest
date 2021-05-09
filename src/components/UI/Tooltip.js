import styled from "styled-components/macro";

const TooltipText = styled.span`
  height: fit-content;
  max-width: 70px;
  visibility: hidden;
  opacity: 0;
  background-color: ${({ theme }) => theme.menuBackgroundColor};
  color: hsl(0, 0%, 100%);
  font-size: 12px;
  word-wrap: normal;
  word-break: keep-all;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  transition: all 500ms ease-in-out;
  bottom: 15px;
  left: 100%;
  position: absolute;
  z-index: 1;
  overflow-x: hidden;
`;

const TooltipBody = styled.span`
  position: relative;
  overflow-x: hidden;
  &:hover ${TooltipText} {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = ({ children, text, style }) => {
  return (
    <>
      {!text ? (
        children
      ) : (
        <TooltipBody>
          {children}
          <TooltipText style={style}>{text}</TooltipText>
        </TooltipBody>
      )}
    </>
  );
};

export default Tooltip;
