import React, { useState, useEffect } from 'react';
import { Stack, Text } from '@kiwicom/orbit-components/lib';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';
import api from '../../../../utils/api';
import { npo as npoProfileType } from '../../../../utils/constants/userType';
import useUser from '../../session/modules/useUser';

import ProfileHeaderBar from '../modules/ProfileHeaderBar';
import ReviewPanel from '../modules/ReviewPanel';
import ProfilePanel from '../modules/ProfilePanel';
import PastWishesPanel from '../modules/PastWishesPanel';
import Header from '../../header';

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;
  box-sizing: border-box;
  padding-top: 0px;
  padding-bottom: 30px;
`;

const NpoProfilePage = ({ userId }) => {
  const [isShowPastWishes, setIsShowPastWishes] = useState(true);
  const [isShowReviews, setIsShowReviews] = useState(false);
  const [isMine, setIsMine] = useState(false);
  const [npo, setNpo] = useState(null);
  const user = useUser();

  const fetchUserInfo = () => {
    api.users.getNPO(userId).then((userDoc) => {
      if (userDoc.exists) {
        setIsMine(isMyProfile(userDoc));
        setNpo(userDoc.data());
      } else {
        setIsMine(false);
      }
    });
  };

  const isMyProfile = (userDoc) => {
    if (user) {
      return userDoc.data().userId === user.userId;
    }
    return false;
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user]);

  return (
    <Wrapper>
      <Header title={npo ? npo.name : 'Profile'}/>
      <Grid desktop={{ columns: '1fr 5fr' }}>
        <ProfilePanel user={npo} />
        <Stack>
          <ProfileHeaderBar
            profileType={npoProfileType}
            isShowPastPosts={isShowPastWishes}
            isShowReviews={isShowReviews}
            setIsShowPastPosts={setIsShowPastWishes}
            setIsShowReviews={setIsShowReviews}
            isMine={isMine}
          />
          {isShowReviews && <ReviewPanel />}
          {isShowPastWishes && <PastWishesPanel isMine={isMine} userId={userId} />}
        </Stack>
      </Grid>
    </Wrapper>
  );
};

export default NpoProfilePage;
