import React, { useState, useEffect } from 'react';
import Categories from '../modules/Categories';
import BlackText from '../../text/BlackText';
import { Grid } from '@kiwicom/orbit-components/lib';
import { DONATIONS_BATCH_SIZE } from '../../../../utils/api/constants';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure, connectInfiniteHits } from 'react-instantsearch-dom';
import DonationsHitWrapper from '../modules/DonationsHitWrapper';
import { getByCategoryIdAndStatus } from '../../../../utils/algolia/filteringRules';
import { donationsSortByRule } from '../../../../utils/algolia/sortByRules';
import dynamic from 'next/dynamic';
const DonationsSortFilterPanel = dynamic(() => import('../modules/DonationsSortFilterPanel'), {
  ssr: false,
});

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);
const DonationsInfiniteHit = connectInfiniteHits(DonationsHitWrapper);

const ViewCategoryContainer = styled.div`
  width: 90vw;
  max-width: 1280px;
  margin: 0 auto;
  margin-top: 25px;
  margin-bottom: 40px;
`;

const DonationsContainer = styled.div`
  width: fit-content;
  margin: 0 auto;
  ${media.largeMobile(css`
    margin: 0;
    width: 100%;
  `)}
`;

const GridSectionContainer = styled.div`
  margin-top: 20px;
`;

const ViewCategoryPage = ({ categoryDetails, sortByQuery }) => {
  const category = categoryDetails;
  const [sortBy, setSortBy] = useState(sortByQuery ? sortByQuery : donationsSortByRule().defaultRefinement);
  const [latLngFilter, setLatLngFilter] = useState('');

  const onLatLngUpdated = (latLng) => {
    setLatLngFilter(latLng);
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="donations">
      <ViewCategoryContainer>
        <Categories type="donations" />

        <Grid
          columnGap="20px"
          desktop={{
            columns: '1fr 6fr',
          }}
          rows="1fr auto"
        >
          <GridSectionContainer>
            <DonationsSortFilterPanel
              sortItems={donationsSortByRule().items}
              sortDefaultRefinement={sortBy}
              category={category}
              onLatLngUpdated={onLatLngUpdated}
            />
          </GridSectionContainer>

          <GridSectionContainer>
            <BlackText style={{ marginBottom: '10px' }} size="large">
              {category.name}
            </BlackText>

            {/* Algolia */}
            <Configure
              filters={getByCategoryIdAndStatus(category.id, 'pending')}
              hitsPerPage={DONATIONS_BATCH_SIZE}
              aroundLatLng={latLngFilter}
              aroundRadius={10000}
            />
            <DonationsContainer>
              {/* Desktop,Tablet,Mobile has infinite scrolling  */}
              <DonationsInfiniteHit category={category} minHitsPerPage={DONATIONS_BATCH_SIZE} />
            </DonationsContainer>
          </GridSectionContainer>
        </Grid>
      </ViewCategoryContainer>
    </InstantSearch>
  );
};

export default ViewCategoryPage;
