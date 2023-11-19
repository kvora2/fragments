# tests/integration/404.hurl

#URL with non-existing route
GET http://localhost:8080/some-route

# Getting back an HTTP 1.1 404 since its non-existing route we are requesting author
HTTP/1.1 404

#Checks for performing against the response
[Asserts]
#We will be expecting response status in JSON format for e.g. {"status": "error", ...}
jsonpath "$.status" == "error"
#checking for type of response message
jsonpath "$.error.message" isString
