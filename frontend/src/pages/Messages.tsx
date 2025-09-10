import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  IconButton,
  Box,
  Divider,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  participantName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

const Messages = () => {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Fetch conversations from API
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participantName: 'Future Ventures',
        lastMessage: 'Looking forward to discussing your startup!',
        timestamp: '2024-09-10T10:00:00Z',
        unread: true,
      },
      // Add more mock conversations
    ];
    setConversations(mockConversations);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    if (selectedConversation) {
      // TODO: Fetch messages for selected conversation from API
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: 'other',
          content: 'Hi! I'm interested in learning more about your startup.',
          timestamp: '2024-09-10T09:30:00Z',
        },
        {
          id: '2',
          senderId: 'me',
          content: 'Thanks for reaching out! What would you like to know?',
          timestamp: '2024-09-10T09:35:00Z',
        },
        // Add more mock messages
      ];
      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // TODO: Send message to API
    const mockMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, mockMessage]);
    setNewMessage('');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>

      <Grid container spacing={2} sx={{ height: 'calc(100vh - 200px)' }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', overflow: 'auto' }}>
            <List>
              {conversations.map((conversation) => (
                <React.Fragment key={conversation.id}>
                  <ListItem
                    button
                    selected={selectedConversation === conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <ListItemAvatar>
                      <Avatar>{conversation.participantName[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={conversation.participantName}
                      secondary={conversation.lastMessage}
                      primaryTypographyProps={{
                        fontWeight: conversation.unread ? 700 : 400,
                      }}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Messages */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                {/* Messages List */}
                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.senderId === 'me' ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: message.senderId === 'me' ? 'primary.main' : 'grey.100',
                          color: message.senderId === 'me' ? 'white' : 'text.primary',
                          maxWidth: '70%',
                        }}
                      >
                        <Typography variant="body1">{message.content}</Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>

                {/* Message Input */}
                <Box
                  component="form"
                  onSubmit={handleSendMessage}
                  sx={{
                    p: 2,
                    backgroundColor: 'background.default',
                    borderTop: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs>
                      <TextField
                        fullWidth
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item>
                      <IconButton
                        type="submit"
                        color="primary"
                        disabled={!newMessage.trim()}
                      >
                        <SendIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography color="text.secondary">
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messages;
