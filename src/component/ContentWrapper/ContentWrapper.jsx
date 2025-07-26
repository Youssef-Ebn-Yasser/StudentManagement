import styled from 'styled-components';

const ContentWrapper = styled.div`
  transition: opacity 0.5s ease;
  opacity: ${({ $loading }) => ($loading ? 0 : 1)};
  pointer-events: ${({ $loading }) => ($loading ? 'none' : 'auto')};
`;

export default ContentWrapper;