import React from 'react';
import dynamic from 'next/dynamic';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../utils/authentication/authentication';
import api from '../../utils/api';
import ChatPage from '../../src/components/chat/pages/ChatPage';
import { donations, wishes } from '../../utils/constants/postType';
const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});

/**
 * URL when viewing all of your chats, or viewing all of your chats for a particular post that you created
 *
 * viewing all of your chats: /chat
 * viewing all of your chats for a particular post you created: /chat?postId=[postId]
 */
export async function getServerSideProps({ params, req, res, query }) {
  const user = await isAuthenticated(req, res);
  if (!user) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }

  const postId = query.postId ? query.postId : null;
  const isViewingChatsForMyPost = postId ? true : false;
  const postType = user.user.donor ? donations : wishes;

  /**
   * Check if logged in user is the post owner, if chats for a particular post is queried
   */
  if (postId) {
    const rawPost = await api[postType].get(postId).catch((err) => console.error(err));
    if (!rawPost.exists) {
      // given postId does not exist
      res.writeHead(302, { Location: '/' });
      res.end();
    }
    const post = rawPost.data();
    if (post.user.userId !== user.user.userId) {
      // logged in user is not the owner
      res.writeHead(302, { Location: '/' });
      res.end();
    }
  }
  return {
    props: {
      postId,
      user,
      isViewingChatsForMyPost,
      postType,
    },
  };
}

const ViewOwnChats = ({ user, postId, isViewingChatsForMyPost, postType }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />
      <ChatPage user={user} postId={postId} isViewingChatsForMyPost={isViewingChatsForMyPost} postType={postType} />
    </SessionProvider>
  );
};

export default ViewOwnChats;
