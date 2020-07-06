import React from 'react';
import dynamic from 'next/dynamic';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../utils/authentication/authentication';
import api from '../../utils/api';
import ChatPage from '../../src/components/chat/pages/ChatPage';
import { useRouter } from 'next/router';
const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});

/**
 *
 * URL when viewing all chats, creating a new chat or viewing an existing chat for a post
 * Viewing all chats: /chat
 * Viewing chats for a specific post: /chat?postId=[postId]&postType=[postType]
 *
 */
export async function getServerSideProps({ params, req, res, query }) {
  const user = await isAuthenticated(req, res);
  if (!user) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }

  const postId = query.postId ? query.postId : null;
  const postType = query.postType ? query.postType : null;
  let isViewingChatsForMyPost = false;

  /**
   * Check if logged in user is the post owner, if chats for a particular post is queried
   */
  if (postType && postId) {
    const rawPost = await api[postType].get(postId).catch((err) => console.error(err));
    if (!rawPost.exists) {
      // given postId does not exist
      res.writeHead(302, { Location: '/' });
      res.end();
    }
    const post = rawPost.data();
    isViewingChatsForMyPost = post.user.userId === user.user.userId;
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
  const router = useRouter();
  /**
   * Check if already created a chat for a post that is not yours
   */
  if (!isViewingChatsForMyPost) {
    api.chats
      .getChatsForPost(postId)
      .then((rawChat) => {
        if (rawChat.docs.length > 0) {
          const chat = rawChat.docs[0].data(); // assumption: should only have one chat since the chat is for another user's post
          router.push(`/chat/${chat.chatId}?postId=${postId}&postType=${postType}`);
        }
      })
      .catch(() => console.log('chat does not exist'));
  }

  return (
    <SessionProvider user={user}>
      <TopNavigationBar />
      <ChatPage user={user} postId={postId} isViewingChatsForMyPost={isViewingChatsForMyPost} postType={postType} />
    </SessionProvider>
  );
};

export default ViewOwnChats;
