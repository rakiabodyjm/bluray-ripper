// import * as React from 'react';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
  Button,
  Divider,
  Paper,
  TextareaAutosize,
  TextField,
} from '@mui/material';
import { io, Socket } from 'socket.io-client';
import { uuid } from 'uuidv4';

const Home: NextPage = () => {
  const [socket, setSocket] = useState<Socket | undefined>();

  const [state, setState] = useState<{
    message?: string;
    name?: string;
  }>({
    name: undefined,
    message: undefined,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  useEffect(() => {
    if (timeoutRef) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      const socket = io('ws://192.168.254.189:1001', {
        extraHeaders: {
          ...(state.name && {
            name: state.name,
          }),
        },
      });
      setSocket(socket);
    }, 1000);
  }, [state.name]);

  useEffect(() => {
    socket?.on('client.typing', (args) => {
      console.log('args', args);
    });
    return () => {
      socket?.close();
    };
  }, [socket]);

  useEffect(() => {
    let nameLocalStorage = window?.localStorage.getItem('name') || uuid();

    if (nameLocalStorage) {
      setState((prev) => ({
        ...prev,
        name: nameLocalStorage!,
      }));
    }
  }, []);

  useEffect(() => {
    if (state.name) {
      window?.localStorage.setItem('name', state.name);
    }
  }, [state.name]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    socket?.emit('typing');
  }, [state.message]);

  const [_someoneTyping, setSomeoneTyping] = useState<false | string[]>(false);
  const someoneTyping = useMemo(() => {
    const typing = _someoneTyping
      ? _someoneTyping?.filter((ea) => ea !== state.name)
      : false;

    return typing && typing?.length > 0 ? typing : false;
  }, [_someoneTyping]);

  useEffect(() => {
    socket?.on('typing', (args: string) => {
      setSomeoneTyping((prev) => {
        if (prev) {
          if (prev.includes(args)) {
            return prev;
          } else {
            return [...prev, args];
          }
        } else {
          return [args];
        }
      });
    });
  }, [socket]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setSomeoneTyping(false);
    }, 2000);
  }, [someoneTyping]);

  const [chatBox, setChatBox] = useState<{ sender: string; message: string }[]>(
    [],
  );

  useEffect(() => {
    socket?.on('message', (args) => {
      setChatBox((prev) => [...prev, args]);
    });
  }, [socket]);

  function handleSubmit() {
    setState((prev) => {
      socket?.emit('message', state.message);
      if (messageBoxRef?.current) {
        messageBoxRef.current.value = '';
      }
      return {
        ...prev,
        message: undefined,
      };
    });
  }

  const messageBoxRef = useRef<HTMLInputElement | undefined>();
  return (
    <Container maxWidth="lg">
      <Box
        sx={[
          {
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 2,
          },
        ]}
      >
        <Typography variant="h6">Socket IO</Typography>

        <Divider />
        <Typography variant="body1">Name:</Typography>

        <TextField
          value={state.name}
          name="name"
          size="small"
          onChange={handleChange}
        />

        <Divider />

        <Typography variant="body1">Message:</Typography>

        <TextField
          id="message"
          name="message"
          onChange={handleChange}
          multiline
          rows={4}
          size="small"
          value={state.message}
          inputRef={(instance) => {
            if (instance) {
              messageBoxRef.current = instance;
            }
          }}
        />
        {someoneTyping && (
          <Typography variant="caption" color="textSecondary">
            {someoneTyping.join(', ')} is Typing...
          </Typography>
        )}

        <Button
          {...(!state.message && { disabled: true })}
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
        >
          Submit
        </Button>
      </Box>

      <Box>
        <Paper
          sx={{
            p: 2,
          }}
          variant="outlined"
        >
          {chatBox && chatBox?.length > 0 ? (
            chatBox?.map((ea, index, array) => (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems:
                    ea.sender === state.name ? 'flex-end' : 'flex-start',
                }}
                key={index + uuid()}
              >
                <Typography variant="caption">
                  {ea.sender === state.name ? 'You' : ea.sender}
                </Typography>
                <Typography variant="body2">{ea.message}</Typography>

                <Divider
                  sx={{
                    display: array.length - 1 === index ? 'none' : 'inherit',
                    my: 2,
                  }}
                />
              </Box>
            ))
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography color="textSecondary" variant="body2">
                No Messages
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
