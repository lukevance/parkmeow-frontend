import React, { useState } from 'react';
import { Box, Grommet, Heading, Paragraph, ResponsiveContext, Form, FormField, Clock, Button } from 'grommet';

const theme = {
  global: {
    colors: {
      brand: '#228BE6',
      button: '#74B4EE'
    },
    font: {
      family: 'EB Garamond',
      size: '18px',
      height: '20px',
    },
  },
};

function App() {
  // const [value, setValue] = useState(0);
  const [phone, setPhone] = useState(0);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [success, setSuccess] = useState(null);

  function verifyNumber(data) {
    setPhone(data.phone);
    fetch('https://53b8ae39a3ec.ngrok.io/send-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setVerifyStatus(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  function verifyCode(data) {
    data.phone = phone;
    console.log(data);
    fetch('https://53b8ae39a3ec.ngrok.io/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setAuthToken(data.auth_token);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  function createSession(data) {
    console.log(data);
    data.auth_token = authToken;
    data.amount = data.amount * 1;
    fetch('https://53b8ae39a3ec.ngrok.io/parking-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setSuccess(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <Grommet theme={theme}>
      <ResponsiveContext.Consumer>
        {size => {
          // const horizontalSpacing = (size === 'small') ? 'medium' : 'large';
          const topSpacing = (size === 'small') ? 'medium' : 'large';
          return (
            <Box fill>
              <Box direction='row' flex overflow={{ horizontal: 'hidden' }} margin={{bottom: 'large'}} fill>
                <Box
                  flex
                  align='center'
                  justify='center'
                  elevation='small'
                  margin={{top: topSpacing}}
                >
                  <Heading> Welcome to Park Right Meow! </Heading>
                  <Paragraph>
                    Verify your phone number, then pay right here, no download needed.
                  </Paragraph>
                  {!verifyStatus && !authToken ?
                    // Starting form
                    <Form 
                      onSubmit={({ value }) => verifyNumber(value)}
                    >
                      <FormField name="phone" label="Phone Number" required={true} />
                      <Button type="submit" label="Send Code" primary={true} padding={{bottom: 'medium'}}/>
                    </Form> : null
                  }
                  {verifyStatus && !authToken ?
                    // verify code form
                    <Form 
                      onSubmit={({ value }) => verifyCode(value)}
                    >
                      <FormField name="code" label="SMS Code" required={true} />
                      <Button type="submit" label="Verify" primary={true} padding={{bottom: 'medium'}}/>
                    </Form>
                    : null}
                  {authToken && !success ?  
                  // create parking session form
                  <Form 
                    onSubmit={({ value }) => createSession(value)}
                  >
                    <FormField name="license_plate" label="License Plate" required={true} />
                    <FormField name="location_code" label="Location Code" required={true} />
                    <FormField name="amount" label="Time to add (hours)" required={true} />
                    <Button type="submit" label="Add Time" primary={true} padding={{bottom: 'medium'}}/>
                  </Form>
                  : null
                }
                {authToken && success ? 
                <div>
                  <Paragraph>
                    Success! Your parking expires in {success[0].amount} hours.
                  </Paragraph>
                  <Clock type="digital" />
                </div>
                : null}
                
                </Box>
              </Box>
            </Box>
          )}
        }
      </ResponsiveContext.Consumer>
    </Grommet>
  );
}

export default App;
