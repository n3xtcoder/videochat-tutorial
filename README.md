## Setup

All of the API server code is in the folder `./server`. To start development:

```
cd server
cp .env.example .env # Edit this with the right Twillio credentials
node .
```
Add your code to ./ui


## Using the API

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