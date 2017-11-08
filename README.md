# Schön Digital Labs & N3xtcoder - React VS Vue challenge!

This repository has been created as a starting point for our workshop. In the workshop we will learn to create a peer2peer video chat using Twillio. We will explore various UI edge cases such as disconnection and connection degradation in addition to anciliary features such as text chat.

Before the event, participants should follow the steps below in Setup section. To gain free admission, participants can submit a *Pull Request* with their solution to the *Teaser Challenge* below.

## Setup

All of the API server code is in the folder `./server`. To start development:

```
cd server
yarn install # or npm install (some warnings may occur, but usually nothing fatal)
cp .env.example .env # Edit this with the right Twillio credentials
node .
```

## Using the API

The API will run at http://localhost:3000 and provide two endpoints:

### User

POST /user *Authenticates the user and provides a JWT*
Request body:
```
{ 
  "username":"patient",
  "password":"password"
}
```
Responses:

200 Success - *The authentication was successful*
Example body:
```
{ 
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJwYXRpZW50IiwicGFzc3dvcmQiOiJwYXNzd29yZCIsImRpc3BsYXlOYW1lIjoiSG9tZXIgU2ltcHNvbiIsInJvbGUiOiJwYXRpZW50IiwiaWF0IjoxNTA4NzYxNDA0LCJleHAiOjE1MDg4NDc4MDR9.VDIbyyDpV8_g_KjWQw4H6UDPpvSuYjpjxM1hZ-ukpZ0"
}
```

404 Not found - *The user could not be found*
401 Unauthorized - *Authentication failed*

### Token

GET /token *Retrieves a token for Twillio*
Headers: 
`Authorization: Bearer <JWT>`

Responses:
200 Success
```
{ 
  "identity": "patient",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJwYXRpZW50IiwicGFzc3dvcmQiOiJwYXNzd29yZCIsImRpc3BsYXlOYW1lIjoiSG9tZXIgU2ltcHNvbiIsInJvbGUiOiJwYXRpZW50IiwiaWF0IjoxNTA4NzYxNDA0LCJleHAiOjE1MDg4NDc4MDR9.VDIbyyDpV8_g_KjWQw4H6UDPpvSuYjpjxM1hZ-ukpZ0"
}
```
401 Unauthorized - *Invalid JWT*
400 Bad Request

### Curl example
```
# Login and capture the JWT
curl -H "Content-Type: application/json" \
     -XPOST \
     http://localhost:3000/user \
     -d '{"username":"patient", "password":"password"}'

# Get the twillio token to start your session
curl -H "Content-Type: application/json" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJwYXRpZW50IiwicGFzc3dvcmQiOiJwYXNzd29yZCIsImRpc3BsYXlOYW1lIjoiSG9tZXIgU2ltcHNvbiIsInJvbGUiOiJwYXRpZW50IiwiaWF0IjoxNTA4NzYxNDA0LCJleHAiOjE1MDg4NDc4MDR9.VDIbyyDpV8_g_KjWQw4H6UDPpvSuYjpjxM1hZ-ukpZ0" \
     http://localhost:3000/token
```

## Development/Testing

There are two example users by default:

1. username: doctor
2. username patient

Both use the password "password" for testing purposes.

## Challenge Process

Once you are running the API: 
1. Add your code to ./ui. 
2. Within this folder, feel free to use yarn or npm or any other tools and frameworks you require. 
3. To submit a solution, make a pull request with your changes.
4. Don't forget to include documentation on how to run your UI.
5. You should not need to change any code inside `./server` but if you decide to, please comment as to why.


## Teaser challenge - make a login page

For a quick and easy challenge to begin, first create a login form for the users. The form must:

- Submit JSON the the /user endpoint in a POST
- Capture the JWT and store it locally somehow for the next request
- Demonstrate the call to /token returns 200 (passes authorisation)

Don't forget to employ validation, tooltips, and any other UI techniques to make the form user friendly. Design is not the main focus but make sure the UI is clean and easy to use.

## Testing with https / between devices
 
When developing a peer2peer video chat you may find it useful to test communication between devices and share links to your dev environment with those devices and other users. Ngrok is a tool to create a secure http(s) tunnel to your development environment which enables you to conveniently do this kind of testing. Here's how to use it:
 
1. Install [ngrok](https://ngrok.com/)
```
npm install ngrok -g
```
2. Setup a tunnel to the development server
```
ngrok http 3000
```
3. Copy the ngrok url from the output and distribute it to someone else.
