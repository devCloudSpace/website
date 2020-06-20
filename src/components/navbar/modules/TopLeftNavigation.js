import React from 'react';
import { Stack, ButtonLink } from '@kiwicom/orbit-components/';
import { MenuHamburger } from '@kiwicom/orbit-components/lib/icons';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import LogoButton from '../../buttons/LogoButton';
import { companyLogoImagePath } from '../../../../utils/constants/imagePaths';
import styled from 'styled-components';
import NavSearchBar from '../../search/modules/NavSearchBar';

const SearchBarContainer = styled.div`
  min-width: 350px;
  margin-right: 15px !important;
`;
const TopLeftNavigation = ({ onHamburgerClick }) => {
  const { isDesktop, isTablet } = useMediaQuery();
  return (
    <Stack direction="row" shrink spacing="tight">
      {isDesktop || isTablet ? (
        <>
          <LogoButton src={companyLogoImagePath} height={45} href={'/'} />
          {isDesktop && (
            <SearchBarContainer>
              <NavSearchBar />
            </SearchBarContainer>
          )}
          <ButtonLink transparent type="secondary" href={'/'}>
            Wishes
          </ButtonLink>
          <ButtonLink transparent type="secondary" href={'/donations'}>
            Donations
          </ButtonLink>
        </>
      ) : (
        <ButtonLink iconLeft={<MenuHamburger />} transparent type="secondary" onClick={onHamburgerClick} />
      )}
    </Stack>
  );
};

export default TopLeftNavigation;
