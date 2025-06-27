# Guidelines - HTTP Response code and Message handling

This documents explains the guidelines to be followed with respect to Response codes and messages(Error, Info, Warnings) raised by external custom service.

## HTTP Response codes

Follow standard codes for HTTP status 
 - 2XX - success codes
 - 4XX - Error Due to client
 - 5XX- Error due to server

 ### 2XX response code

| Status      | Verb   | Response                                    | Description                                                                                          |
|-------------|--------|---------------------------------------------|------------------------------------------------------------------------------------------------------|
| `200 OK`    | `GET`  | Query: Requested resources for GET          | Represents successful operation                                                                      |
| `200 OK`    | `GET`  | Read: Requested resource for GET            | Represents successful operation                                                                      |                                                                    |
| `200 OK`    | `PATCH`| Updated resource (in full)                  | Represents successful operation                                                                      |
| `200 OK`    | `DELETE`| Representation of status (i.e., minimal payload with identifier, status) | Represents successful operation                                                                      |
| `201 Created`| `POST` | Created resource after the successful creation | Only used for successful create. The location header in response should also contain the URL to the resource. |
| `202 Accepted`| `POST`|                                             | This needs to be supported only where asynchronous operations are supported, i.e., request was received and will be processed asynchronously. |
| `202 Accepted`| `PATCH`|                                           | Represents successful operation                                                                      |                                                                    |
| `202 Accepted`| `DELETE`|                                          | Represents successful operation                                                                      |                                                                    |

### 4XX response code

| Status                     | Verb    | Response Body   | Description                                                                                                            |
|----------------------------|---------|-----------------|------------------------------------------------------------------------------------------------------------------------|
| `400 Bad Request`          | All     | Error Message   | Request cannot be processed as it (URL or request body) does not match what was defined for the API.                  |
| `401 Unauthorized`         | All     |                 | User is not authenticated. This error code would be sent at the API gateway. At the service implementation, if the JWT is not received or cannot be decoded, then this status **SHOULD** be raised. |
| `403 Forbidden`            | All     |                 | When the user is authenticated but does not have the authorizations to access the resource, then this error code is used. |
| `404 Not Found`            | All     |                 | When a user has authorizations to access a resource type, but the resource does not exist in the system then this error code is used. |
| `405 Not Allowed`          | All     |                 | If a specific HTTP verb is not supported by an API, then this status code should be returned when the consumer attempts to use that HTTP verb. |
| `412 Precondition Failed`  | `PATCH` | Error Message | When the client requests for an update of a resource based on the known state of the object (ETag / If-Match), the server checks for state conflict, and if a conflict exists, this response is sent. |
| `415 Unsupported Media Type` | All     |                 | When the client sends the payload in a content type that is not supported by the server, then this status code is returned. |
| `422 Unprocessable Content` | `POST`, `PATCH` | Error Message | This should also be used when the request body is syntactically correct but it was not able to be processed. For example, the request body fails business logic validation because of an invalid code value. |
| `428 Precondition Required` | `PATCH` |                 | If the precondition (`If-Match`) is missing in the header, this status is returned. For `PATCH`, this precondition (`If-Match`) is mandatory.

### 5xx Error Due to Server

| Status                       | Verb   | Response Body   | Description                                                                                                      |
|------------------------------|--------|-----------------|------------------------------------------------------------------------------------------------------------------|
| `500 Internal Server Error`   | All    | Error Message   | This error code is used in general for any exception or error that may be raised by the server. For exceptions that are raised by the service, the error has to be returned in a standard error format. |
| `501 Not Implemented`         | `GET`  | Error Message   | When a system query option is specified that is planned to be supported, but not yet implemented by the service. The details of the options not supported are returned in the error message. |
| `523 Upstream Server Error`   | All    | Error Message   | This error code is reserved for failed calls made to an external service. The specific reason for the failure (e.g. service unavailable) will be included in the response payload. |



## Errors and Info Messages
When an error is raised and a response has to be sent back, the service **SHALL** send only the error response in the payload.  
Warnings and Info messages **SHALL NOT** be part of the error response.  
Where required, warnings and info messages **MAY** be sent as part of the HTTP header.

### Error Response

When an error occurs, the response is sent as a single object `error` as shown below. When the service sends an error response, no other payload is sent back to consumer.

```json
{
  "error": {
    "code": "external.12345.ValidationsMessages",
    "message": "Invalid email address",
    "target": "{emailAddress}"
  }
}
```

If the error object has to return multiple errors, then a list of error details are sent. The primary error is defined in the root. The details, if present, contain the inner/secondary errors and do not include the primary error. The detailed error instances cannot have further child-level details.

```json
{
  "error": {
    "code": "projects.234567.Auth",
    "message": "insufficient authorizations for creating a projects",
    "details": [
      {
        "code": "projects.22345.Auth",
        "message": "insufficient authorizations for ..."
      }
    ]
  }
}
```

## Error Response Attributes

| Element | Element of | Mandatory | Description |
| --- | --- | --- | --- |
| `error` |  | Yes | Single instance object that represents the primary error. An error can contain other errors as a flattened array (refer to details). |
| `code` | `error` | Yes | Represents an error code. The error code is a combination of the group (service prefix) and error code integer (5 digits), with a dot (.) as the delimiter. |
| `message` | `error` | Yes | Description of the error message. The error message **SHALL** be localized using the standard language rules. |
| `details` | `error` | No | Array of error objects excluding details. The child errors should not contain further children (i.e., the element "details" is not permitted for child error objects). The primary error is not repeated in details. |
| `target` | `error` | No | Object that is used to provide reference to the target element that caused the error. The target may either identify the resource directly using the URL notation (or) may identify an element in the payload using the binding `{ … }` notation. |

**Note:** The error response **SHALL NOT** include warnings and info messages.

#### Target Element Specification

The URL notation is used to define the target resource and shall provide the complete URL path to the resource (i.e. `https://<application-url>/external-projectorder-service/projectorders/124/products`).

The binding notation is used to identify the element within the payload. The binding is enclosed in curly braces `{}` and the value is the attribute target path in the payload (i.e. `{id}`, `{amount/currency}`, `{products/1/name}`).


## Information Message Response

There could be cases where the service needs to send additional messages, like a warning or info. This may be required even when the service is responding with the expected payload — for example, sending info with `200 OK` or warnings along with error responses. A generic message response payload can be used in such situations to send the message via the HTTP header.

The info messages are sent as part of the response payload. These are included in the `m` (message) element of the payload.

The info messages do not stop the execution flow. These messages may or may not be displayed (or) acted upon, and hence a follow-up action should not be expected.

```json
{
  "info": {
    "message": "lead warning message",
    "target": "/leads/90299929",
    "severity": "WARNING",
    "details": [
      {
        "message": "phone number may be invalid",
        "target": "{phoneNumber}"
      },
      {
        "message": "another warning",
        "target": "{anotherAttribute}",
        "severity": "WARNING"
      }
    ]
  }
}
```

A code is not mandatory in info or warning messages.

## Info Response Attributes

| Element  | Element of | Mandatory | Description |
| ---      | ---       | ---      | ---         |
| `info`   |           | Yes      | Single instance object that represents the primary message. |
| `message`| `info`    | Yes      | Description of the info message.  |
| `details`| `info`    | No       | Array of info objects excluding details. The child messages should not contain further children (i.e., the element "details" is not permitted for child message objects). |
| `target` | `info`    | No       | Object that is used to provide reference to the target element that needs to be mapped to the message. The target may either identify the resource directly using the URL notation (or) may identify an element in the payload using the binding `{ … }` notation. |
| `severity`| `info`   | No       | Indicates the type of the information. Permitted values: `INFO`, `WARNING`, and `ERROR`. `INFO` is the default, and a message is considered as `INFO` if severity is not specified. |

**Note:** The severity `ERROR` should be used only if the create or update is successful, but there are errors that need to be conveyed as messages. These are not transactional / server errors.  
Do not use severity `ERROR` for server errors. Server errors **SHOULD ONLY** be returned as error objects, and the HTTP status should indicate an error. The severity `ERROR` is only for communicating a message to the user with an error icon!

The info message is only applicable for HTTP status 200 and 201








