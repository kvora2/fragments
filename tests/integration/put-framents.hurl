# tests/integration/put-fragments.hurl

# Authenticated POST to /v1/fragments
# No need to set content type since data will be json type and which is automatically set
POST http://localhost:8080/v1/fragments
content-type: text/plain; charset=utf-8
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# sending a text body as fragment
`Some dope data`

# We expect to get back an HTTP 201
HTTP/1.1 201

# Capture the Location URL into a variable named `url` and 'fragmentID' from 'url'
[Captures]
fragment_url: header "Location"
fragment_id: jsonpath "$.fragment.id"


PUT {{fragment_url}}
content-type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# updating fragment
`some other updated dope data`
# We expect to get back an HTTP 201
HTTP/1.1 200

# We have various assertions about the response that we want to check
[Asserts]
#expecting status to be 'ok'
jsonpath "$.status" == "ok"
# Our fragment ids use UUIDs, see https://ihateregex.io/expr/uuid/
jsonpath "$.fragment.id" == {{fragment_id}}
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
# 15 is the length of our json fragment data
