import styled from 'styled-components';
import { colors } from '@constants/colors';

const ChatSeePostButton = styled.button`
  background: ${colors.chatSeePostButtonBackground};

  :active {
    background: ${colors.chatSeePostButtonHoverActive};
  }

  :hover {
    background: ${colors.chatSeePostButtonHoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px ${colors.chatSeePostButtonFocus};
  }

  :focus:not(:focus-visible) {
    box-shadow: 0 0 0 3px ${colors.chatSeePostButtonFocus};
    background: ${colors.chatSeePostButtonHoverActive};
  }
`;

export default ChatSeePostButton;
