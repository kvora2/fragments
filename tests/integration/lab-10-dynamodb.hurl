# tests/integration/lab-10-dynamodb.hurl

#----------------1--------------#
# Authenticated POST to /v1/fragments
# No need to set content type since data will be json type and which is automatically set
POST http://localhost:8080/v1/fragments
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# sending a JSON body as fragment
```json
{ "service": "DynamoDB" }
```

#----------------2--------------#
# We expect to get back an HTTP 201
HTTP/1.1 201

# Capture the Location URL into a variable named `url` and 'fragmentID' from 'url'
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

#----------------3--------------#
# 2. Try to GET the fragment we just posted by its URL
GET {{fragment1_url}}/info

[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
content-type: application/json; charset=utf-8
[Asserts]
#expecting status to be 'ok'
jsonpath "$.status" == "ok"
# Our fragment ids use UUIDs, see https://ihateregex.io/expr/uuid/
jsonpath "$.fragment.id" == "{{fragment1_id}}"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
#jsonpath "$.fragment.created" isString
#jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"
# 15 is the length of our json fragment data
jsonpath "$.fragment.size" == 26

#----------------4--------------#
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
content-type: text/markdown; charset=utf-8
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# sending a JSON body as fragment
```
DynamoDB is **great**.
```

#----------------5--------------#
# We expect to get back an HTTP 201
HTTP/1.1 201

# Capture the Location URL into a variable named `url`
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

#----------------6--------------#
# 2. Try to GET the fragment we just posted by its URL
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
content-type: text/markdown; charset=utf-8
[Asserts]
#expecting status to be 'ok'
jsonpath "$.status" == "ok"
# Our fragment ids use UUIDs, see https://ihateregex.io/expr/uuid/
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
#jsonpath "$.fragment.created" isString
#jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"
# 15 is the length of our json fragment data
jsonpath "$.fragment.size" == 23

#----------------7--------------#
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" includes "{{fragment1_id}}"
jsonpath "$.fragments" includes "{{fragment2_id}}"

#----------------8--------------#
DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1
 
#----------------9--------------#
HTTP/1.1 200

#----------------10--------------#
GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

#----------------11--------------#
HTTP/1.1 404

#----------------12--------------#

