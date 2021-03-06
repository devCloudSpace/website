import React from 'react';
import ViewAllWishesPage from '@components/category/pages/ViewAllWishesPage';
import dynamic from 'next/dynamic';
import SessionProvider from '@components/session/modules/SessionProvider';
import { isAuthenticated } from '@utils/authentication/authentication';
import Header from '@components/header';
import { WISHES } from '@constants/search';

const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});
const BottomNavigation = dynamic(() => import('@components/navbar/modules/BottomNavigation'), {
  ssr: false,
});
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ query, req, res }) {
  let user = await isAuthenticated(req, res);
  return {
    props: {
      sortByQuery: query.sortBy ? query.sortBy : null,
      query: query.q ? query.q : '',
      user,
    },
  };
}

const ViewAllWishes = ({ sortByQuery, user, query }) => {
  return (
    <SessionProvider user={user}>
      <Header title={`All | Wishes`} />
      <TopNavigationBar showNews={true} searchDefaultIndex={WISHES} />
      <ViewAllWishesPage sortByQuery={sortByQuery} query={query} />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default ViewAllWishes;
