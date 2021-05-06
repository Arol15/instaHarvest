import styled from "styled-components";

export const Flex = styled.div`
  display: flex;
  justify-content: ${(props) =>
    props["justify-content"] ? props["justify-content"] : "center"};
`;

export const FlexRow = styled(Flex)`
  flex-flow: row wrap;
`;

export const FlexColumn = styled(Flex)`
  flex-flow: column wrap;
`;
