import React from 'react';
import styled, { css } from 'styled-components';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import WishInformation from '../modules/WishInformation';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import Map from '../modules/Map';
import NpoInformation from '../../postDetails/UserInfoCard';

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;
  box-sizing: border-box;
`;

const RightPanel = styled.div`
  padding: 30px 30px 30px 30px;
`;

const LeftPanel = styled.div`
  height: 320px;
  width: 100%;

  ${media.desktop(css`
    width: 100%;
    min-height: 640px;
  `)};
`;

const WishPage = ({ wishDetails, user }) => {
  const wish = wishDetails;
  const categoryTags = wish.categories.map((category) => category.name);
  const loginUserId = user == null ? '' : user.user.userId;

  return (
    <Wrapper>
      <Grid desktop={{ columns: '1fr 1fr', gap: '10px' }}>
        <LeftPanel id="map">
          <Map
            lat={wish.organization.latitude}
            lng={wish.organization.longitude}
            orgName={wish.organization.name}
            orgAddress={wish.organization.address}
          />
        </LeftPanel>
        <RightPanel>
          <WishInformation
            loginUserId={loginUserId}
            wishUserId={wish.user.userId}
            wishUserName={wish.user.userName}
            profileImageUrl={wish.user.profileImageUrl}
            orgName={wish.organization.name}
            wishId={wish.wishesId}
            title={wish.title}
            description={wish.description}
            status={wish.status}
            categoryTags={categoryTags}
          />
          <NpoInformation
            postType="wish"
            postUserId={wish.user.userId}
            postUserName={wish.user.userName}
            profileImageUrl={wish.user.profileImageUrl}
            orgName={wish.organization.name}
          />
        </RightPanel>
      </Grid>
    </Wrapper>
  );
};

export default WishPage;