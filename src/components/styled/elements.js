import styled from "styled-components";

export const ContainerWithBackground = styled.div`
  border-radius: 5px;
  background-color: ${({ theme }) => theme.secondaryBackgroundColor};
`;
