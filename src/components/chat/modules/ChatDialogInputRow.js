import React, { useState, useEffect, useCallback } from 'react';
import { Button, Stack, InputField } from '@kiwicom/orbit-components/lib';
import ChatButton from '../../../components/buttons/ChatButton';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import Gallery from '@kiwicom/orbit-components/lib/icons/Gallery';
import { useDropzone } from 'react-dropzone';

const InputRowContainer = styled.div`
  width: 95%;
  margin: 0 auto;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const ImageUpload = () => {
  const onUpload = useCallback((uploadedFiles) => {
    /**
     * TODO: upload the image and display in chat
     */
    console.log(uploadedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop: onUpload });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Gallery size="normal" />
    </div>
  );
};

const ChatDialogInputRow = () => {
  /**
   * TODO: handle send message and display in chat
   */
  const handleSendMessage = () => console.log('send message');
  return (
    <InputRowContainer>
      <Stack direction="row" justify="between" align="center">
        <ImageUpload />
        <InputField placeholder="Type your messages here..." />
        <Button size="small" onClick={handleSendMessage} asComponent={ChatButton}>
          Send
        </Button>
      </Stack>
    </InputRowContainer>
  );
};

export default ChatDialogInputRow;
