import React from 'react';
import api from '../../../utils/api';
import ViewCategoryPage from '../../../src/components/category/pages/WishesViewCategoryPage';
import dynamic from 'next/dynamic';
import SessionProvider from '../../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../../utils/authentication/authentication';
import { withRedux } from '../../../utils/withRedux';
import Error from 'next/error';
const TopNavigationBar = dynamic(() => import('../../../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});

export async function getServerSideProps({ params, query, req, res }) {
  const categoryDetails = await getCategoryDetails(params.categoryId);
  let user = await isAuthenticated(req, res);
  return {
    props: {
      categoryDetails,
      filterQuery: query.filter ? query.filter : null,
      user,
    },
  };
}

const getCategoryDetails = async (categoryId) => {
  const rawCategory = await api.categories.getById(categoryId).catch((err) => console.error(err));
  if (rawCategory.docs.length === 0) {
    return {};
  }
  return rawCategory.docs[0].data();
};

const ViewCategory = ({ categoryDetails, filterQuery, user }) => {
  console.log(categoryDetails);
  if (Object.keys(categoryDetails).length === 0) {
    return <Error />;
  }
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />
      <ViewCategoryPage categoryDetails={categoryDetails} filterQuery={filterQuery} />
    </SessionProvider>
  );
};

export default withRedux(ViewCategory);