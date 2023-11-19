# tests/integration/post-fragments-unauthenticated.hurl

# UnAuthenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain; charset=utf-8
# Body of the request goes in ```...``` when it's a string
`Ignorant data!`

# We expect to get back an HTTP 201
HTTP/1.1 401

[Asserts]
#expecting status to be 'ok'
jsonpath "$.status" == "error"
# ensuring that there is an err msg
jsonpath "$.error.message" isString
