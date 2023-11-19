# tests/integration/post-fragments-unsupported-type.hurl

#Authenticated POST to v1/fragments/
POST http://localhost:8080/v1/fragments
#we'll be sending an unsupported fragment type
Content-Type: application/msword

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Fragment Data
`This is some unsupported data!`

# We expect to get back an HTTP 415 since the fragment data is unsupported
HTTP/1.1 415
[Asserts]
jsonpath "$.status" == "error"
