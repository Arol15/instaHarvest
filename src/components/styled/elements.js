import styled from "styled-components";

export const ContainerWithBackground = styled.div`
  border-radius: 5px;
  background-color: ${({ theme }) => theme.secondaryBackgroundColor};
`;

export const ContainerWithBorder = styled.div`
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.borderColor};
`;
