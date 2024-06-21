import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, IconButton, Grid, Typography, Container, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const EmailForm = () => {
    const [name, setName] = useState('');
    const [emails, setEmails] = useState(['']);
    const [formMessage, setFormMessage] = useState('');
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

    const handleEmailChange = (index, event) => {
        const newEmails = [...emails];
        newEmails[index] = event.target.value;
        setEmails(newEmails);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleAddEmail = () => {
        setEmails([...emails, '']);
    };

    const handleDeleteEmail = (index) => {
        if (emails.length === 1) {
            setFormMessage('At least one email is required.');
            return;
        }
        const newEmails = [...emails];
        newEmails.splice(index, 1);
        setEmails(newEmails);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (name.trim() !== '' && emails.some(email => email.trim() !== '')) {
            const validEmails = emails.filter(email => email.trim() !== '');

            axios.post(`${API_URL}/users`, { name, emails: validEmails })
                .then(response => {
                    setName('');
                    setEmails(['']);
                    setFormMessage('Form submitted successfully.');
                })
                .catch(error => {
                    setFormMessage('Error submitting form.');
                });
        } else {
            setFormMessage('User name and at least one email are required.');
        }
    };

    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    User Email Form
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={handleNameChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    {emails.map((email, index) => (
                        <Grid key={index} container spacing={2} alignItems="center">
                            <Grid item xs={10}>
                                <TextField
                                    type="email"
                                    label={`Email ${index + 1}`}
                                    value={email}
                                    onChange={(e) => handleEmailChange(index, e)}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2}>
                                {index > 0 && (
                                    <IconButton onClick={() => handleDeleteEmail(index)} aria-label="delete email">
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Grid>
                        </Grid>
                    ))}
                    <Button type="button" onClick={handleAddEmail} variant="outlined" sx={{ mt: 2 }}>
                        Add Another Email
                    </Button>
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, ml: 2 }}>
                        Submit
                    </Button>
                    {formMessage && <Typography variant="body1" sx={{ mt: 2 }}>{formMessage}</Typography>}
                </form>
            </Box>
        </Container>
    );
};

export default EmailForm;
