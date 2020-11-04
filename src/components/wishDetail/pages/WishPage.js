import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import WishInformation from '../modules/WishInformation';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import Map from '../modules/Map';
import NpoInformation from '../../postDetails/UserInfoCard';
import { wishes } from '@constants/postType';
import { donor as donorType, npo as npoType } from '@constants/userType';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import BreadcrumbsPanel from '../../postDetails/BreadcrumbsPanel';
import useUser from '@components/session/modules/useUser';
import { viewedWishDetails } from '@utils/algolia/insights';
import SeasonalLargeTag from '@components/postDetails/SeasonalLargeTag';
import { useRemoteConfig } from '@components/remoteConfig/RemoteConfig';

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;
  box-sizing: border-box;
  ${media.desktop(css`
    padding-bottom: 40px;
  `)};
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

const BreadcrumbsWrapper = styled.div`
  padding: 15px 0px 15px 40px;
`;

const SeasonalContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const WishPage = ({ wishId, wishDetails, npoDetails, user, prevHref, categoryName }) => {
  const wish = wishDetails;
  const npo = npoDetails;
  const categoryTags = wish.categories.map((category) => category.name);
  const loginUserId = user == null ? '' : user.user.userId;
  const loginUserType = user == null ? '' : user.user.donor ? donorType : npoType;
  const userObject = useUser();
  const remoteConfig = useRemoteConfig();

  useEffect(() => {
    viewedWishDetails(userObject, wishId);
  }, []);

  console.log('wishKey', wish?.event?.key);
  console.log('currentEventKey', remoteConfig?.configs?.currentEvent?.key);
  return (
    <Wrapper>
      <Desktop>
        <BreadcrumbsWrapper>
          <BreadcrumbsPanel postType={wishes} prevHref={prevHref} categoryName={categoryName} />
        </BreadcrumbsWrapper>
      </Desktop>
      <Grid desktop={{ columns: '1fr 1fr', gap: '10px' }}>
        <LeftPanel id="map">
          <Map npoOrgName={wish.organization.name} locations={wish.locations} />
        </LeftPanel>
        <RightPanel>
          {remoteConfig?.configs?.currentEvent?.key &&
          wish?.event?.key &&
          remoteConfig?.configs?.currentEvent?.key === wish?.event?.key ? (
            <SeasonalContainer>
              <SeasonalLargeTag
                name={wish?.event?.name}
                iconUrl={wish?.event?.imageUrl}
                hashtag={wish?.event?.hashtag}
              />
            </SeasonalContainer>
          ) : null}

          <WishInformation
            loginUserId={loginUserId}
            loginUserType={loginUserType}
            wishUserId={wish.user.userId}
            wishUserName={wish.user.userName}
            profileImageUrl={wish.user.profileImageUrl}
            npoOrgName={wish.organization.name}
            wishId={wishId}
            title={wish.title}
            description={wish.description}
            status={wish.status}
            categoryTags={categoryTags}
          />
          <NpoInformation
            postType={wishes}
            postUserId={wish.user.userId}
            postUserName={wish.user.userName}
            profileImageUrl={wish.user.profileImageUrl}
            npoOrgName={wish.organization.name}
            isNpoVerifiedByAdmin={npo.isVerifiedByAdmin}
          />
        </RightPanel>
      </Grid>
    </Wrapper>
  );
};

export default WishPage;
