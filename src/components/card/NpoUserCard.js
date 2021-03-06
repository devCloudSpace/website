import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import ProfileAvatar from '@components/imageContainers/ProfileAvatar';
import BlackText from '@components/text/BlackText';
import GreyText from '@components/text/GreyText';
import BlueButton from '@components/buttons/BlueButton';
import { Button } from '@kiwicom/orbit-components/lib';
import { colors } from '@constants/colors';

const BorderContainer = styled.div`
  border-radius: 5px;
  border: 1px solid ${colors.nposCard.border};
  transition: border-color 0.1s ease-in-out;
  display: flex;
  flex-direction: column;
  width: 340px;

  :hover {
    border-color: ${colors.nposCard.borderHover};
  }
`;

const Anchor = styled.a`
  padding: 16px;
  color: #111;
  flex-grow: 1;
  text-decoration: none;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 16px;
`;

const CardProfileImage = styled.div`
  margin-right: 16px;
`;

const CardHeaderContent = styled.div`
  max-width: calc(100% - 80px);
`;

const ThreeLineTextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-word;
`;

const OneLineTextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-word;
`;

const CardButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const NpoUserCard = ({ userId, name, organization, profileImageUrl, href, onClick }) => {
  const onCardClicked = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <BorderContainer>
      <Anchor href={href} onClick={onCardClicked}>
        <CardHeader>
          <CardProfileImage>
            <ProfileAvatar imageUrl={profileImageUrl?.small} height="64" width="64" />
          </CardProfileImage>

          <CardHeaderContent>
            <ThreeLineTextContainer>
              <BlackText weight="bold" size="medium">
                {organization?.name}
              </BlackText>
            </ThreeLineTextContainer>

            <OneLineTextContainer>
              <GreyText weight="normal" size="small">
                {name}
              </GreyText>
            </OneLineTextContainer>

            <OneLineTextContainer>
              <GreyText weight="normal" size="small">
                {organization?.sector}
              </GreyText>
            </OneLineTextContainer>
          </CardHeaderContent>
        </CardHeader>

        <CardButtonContainer>
          <Button fullWidth={true} size="small" asComponent={BlueButton} onClick={onClick}>
            View Profile
          </Button>
        </CardButtonContainer>
      </Anchor>
    </BorderContainer>
  );
};

NpoUserCard.propTypes = {
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  organization: PropTypes.object.isRequired,
  profileImageUrl: PropTypes.object.isRequired,
  href: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default NpoUserCard;
