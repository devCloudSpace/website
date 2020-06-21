import React, { useState, useEffect } from 'react';
import { Stack, ButtonLink } from '@kiwicom/orbit-components/lib';
import ChatDialogUserRow from './ChatDialogUserRow';
import ChatDialogViewPostRow from './ChatDialogViewPostRow';
import ChatDialogMessages from './ChatDialogMessages';
import ChatDialogInputRow from './ChatDialogInputRow';
import BlackText from '../../text/BlackText';
import api from '../../../../utils/api';
import styled from 'styled-components';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const ChatDialogContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const MessageContainer = styled.div`
  width: fit-content;
  margin: 0 auto;
  margin-top: 40vh;
`;

const ChatDialogContent = ({
  loggedInUser,
  navBarHeight,
  selectedChatId,
  setSelectedChatId,
  isNewChat,
  setIsNewChat,
  post,
  chat,
  postId,
  postType,
}) => {
  const { isTablet } = useMediaQuery();
  let chatPostTitle, oppositeUserName, oppositeUserProfileImageUrl, chatPostType, chatPostId;
  const isCreatingNewChatForAPost = postId && isNewChat;

  // obtain post details accordingly
  if (isCreatingNewChatForAPost) {
    // get from post
    chatPostTitle = post.title;
    oppositeUserName = post.user.userName;
    oppositeUserProfileImageUrl = post.user.profileImageUrl;
    chatPostType = postType;
    chatPostId = postId;
  } else {
    // get from chat
    chatPostTitle = chat.post.title;
    const oppositeUser = chat.npo.id === loggedInUser.user.userId ? chat.donor : chat.npo;
    oppositeUserName = oppositeUser.name;
    oppositeUserProfileImageUrl = oppositeUser.profileImageUrl;
    chatPostType = chat.post.type;
    chatPostId = chat.post.id;
  }

  return (
    <>
      <Stack direction="column" spacing="none">
        {!isTablet && (
          <ButtonLink
            onClick={function () {
              setSelectedChatId(null);
            }}
            iconLeft={<ChevronLeft />}
            transparent
            type="secondary"
          />
        )}
        <ChatDialogUserRow
          postId={chatPostType}
          postType={chatPostType}
          rating={5} // apparently rating is not within the user in donations/wishes, default val for now
          name={oppositeUserName}
          profileImageUrl={oppositeUserProfileImageUrl}
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
          isNewChat={isNewChat}
          setIsNewChat={setIsNewChat}
        />
        <ChatDialogViewPostRow postType={chatPostType} postId={chatPostId} postTitle={chatPostTitle} />
        <ChatDialogMessages
          loggedInUser={loggedInUser}
          selectedChatId={selectedChatId}
          isNewChat={isNewChat}
          navBarHeight={navBarHeight}
        />
      </Stack>
      <ChatDialogInputRow
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        isNewChat={isNewChat}
        setIsNewChat={setIsNewChat}
        postType={chatPostType}
        postId={chatPostId}
      />
    </>
  );
};

const ChatDialog = ({
  loggedInUser,
  selectedChatId,
  setSelectedChatId,
  navBarHeight,
  isNewChat,
  setIsNewChat,
  postId,
  postType,
}) => {
  /**
   * note that the post is only needed when creating a new chat for a post, in order to get
   * details of the post, since there's no chat to reference to get the post data from.
   */
  const [post, setPost] = useState(null);

  /**
   * note that chat is used to obtain the details of the post, when there's already existing
   * messages for that chat.
   */
  const [chat, setChat] = useState(null);

  const isCreatingNewChatForAPost = postId && isNewChat;
  const hasSelectedChat = selectedChatId !== null;

  useEffect(() => {
    // when creating a new chat
    if (isCreatingNewChatForAPost) {
      api[postType].get(postId).then((rawPost) => {
        setPost(rawPost.data());
      });
    } else if (hasSelectedChat) {
      // when a chat has been selected
      api.chats.getChat(selectedChatId).then((rawChat) => {
        setChat(rawChat.data());
      });
    }
  }, []);

  // no chat selected yet and is not creating a new chat for a post
  if (!hasSelectedChat && !isNewChat) {
    return (
      <ChatDialogContainer>
        <MessageContainer>
          <BlackText>Select a chat to view the messages.</BlackText>
        </MessageContainer>
      </ChatDialogContainer>
    );
  }

  // when creating new post, but the post hasn't been populated yet
  if (post == null && isCreatingNewChatForAPost) {
    return null;
  }

  // when not creating new chat, but the chat hasn't been populated yet
  if (!isCreatingNewChatForAPost && chat == null) {
    return null;
  }

  return (
    <ChatDialogContainer>
      <ChatDialogContent
        loggedInUser={loggedInUser}
        navBarHeight={navBarHeight}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        isNewChat={isNewChat}
        setIsNewChat={setIsNewChat}
        post={post}
        chat={chat}
        postId={postId}
        postType={postType}
      />
    </ChatDialogContainer>
  );
};

export default ChatDialog;
