import React, { useState, useEffect } from 'react';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';
import { npo } from '../../../../utils/constants/userType';
import ProfileDetails from './ProfileDetails';

const ProfilePanelWrapper = styled.div`
  padding: 30px 25px 30px 30px;
  ${media.desktop(css`
    padding: 50px 25px 30px 40px;
  `)};
`;

const ProfilePanel = ({ user }) => {
  return (
    <ProfilePanelWrapper>
      <ProfileDetails
        profileImageUrl={user ? user.profileImageUrl : ''}
        npoOrgName={user ? (user.organization ? user.organization.name : '') : ''}
        userRating={user ? user.reviewRating : ''}
        npoOrgAddress={user ? (user.organization ? user.organization.address : '') : ''}
        npoContact={user ? (user.organization ? user.organization.contact : '') : ''}
        userType={npo}
      />
    </ProfilePanelWrapper>
  );
};

export default ProfilePanel;
