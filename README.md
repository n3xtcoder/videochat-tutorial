## Setup

All of the API server code is in the folder `./server`. To start development:

```
cd server
yarn install # or npm install
cp .env.example .env # Edit this with the right Twillio credentials
node .
```

The API will run at http://localhost:3000 

## Using the API

There are two example users by default:

1. username: doctor
2. username patient

Both use the password "password" for testing purposes.

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

## Challenge Process

Once you are running the API: 
1. Add your code to ./ui. 
2. Within this folder, feel free to use yarn or npm or any other tools and frameworks you require. 
3. To submit a solution, make a pull request with your changes.
4. Don't forget to include documentation on how to run your UI.


## Teaser challenge - make a login page

For a quick and easy challenge to begin, first create a login form for the users. The form must:

- submit JSON the the /user endpoint in a POST
- capture the JWT and store it locally somehow for the next request
- Demonstrate the call to /token returns 200 (passes authorisation)

Don't forget to employ validation, tooltips, and any other UI techniques to make the form user friendly. Design is not the main focus but make sure the UI is clean and easy to use.