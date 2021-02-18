# API Reference

- [REST](#REST)

  - [AUTH](#AUTH)
  - [ACCOUNT](#ACCOUNT)
  - [USERS](#USERS)
  - [CHAT](#CHAT)
  - [PRODUCT](#PRODUCT)

- [Hooks](#Hooks)

  - [useRequest](#useRequest)
  - [useModal](#useModal)

- [Components](#Components)
  - [Spinner](#Spinner)

## REST

_[M] - mandatory; [D:] - default value_,

---

### AUTH

**/api/auth**

#### /signup

**POST**

**header**

```
Content-Type: application/json
```

**request body**

```json
{
  "email": "[M]",
  "first_name": "[M]",
  "password": "[M]",
  "state": "[M]",
  "city": "[M]",
  "username": "",
  "last_name": "",
  "image_url": "[D: 'https://img.icons8.com/doodle/148/000000/test-account.png']",
  "user_role": "[D: 'user']",
  "address": "",
  "lgt": "[D: 0]",
  "lat": "[D: 0]",
  "zip_code": "[D: 0]"
}
```

**response:**

**201**

```json
{
  "access_token": "",
  "refresh_token": ""
}
```

\***\*409\*\***

```json
{
    "error": "The user with email {email} already exists"
}

{
    "error": "The user with username {username} already exists'"
}

```

---

#### /login

**POST**

**header:**

```
Content-Type: application/json
```

**request body**

```json
{
  "login": "[M - username or email]",
  "password": "[M]"
}
```

**response:**

**200**

```json
{
  "access_token": "",
  "refresh_token": ""
}
```

**401**

```json

{
    "error": "The user with email {login} does not exist"
}

{
    "error": "The user with username {login} does not exist"
}

{
    "error": "Wrong password"
}


```

#### /resend_email

**POST**

**header:**

```
Authorization: Bearer [ACCESS_TOKEN]
```

**response:**

**200**

```json
{}
```

**404**

```json
{}
```

#### /confirm/<token>

**GET**

**response:**

**200**

```json
{
  "msg": "Email confirmed"
}
```

**404**

```json
{}
```

#### /refresh

**POST**

**header:**

```
Authorization: Bearer [REFRESH_TOKEN]
```

**response:**

**200**

```json
{
  "access_token": ""
}
```

---

### ACCOUNT

**/api/account**

#### /get_profile

**POST**

**header:**

```
Content-Type: application/json
Authorization: Bearer [ACCESS_TOKEN]
```

**request body**

```json
{
  "password": "[M]"
}
```

**response:**

**200**

```json
{}
```

**404**

```json
{}
```

**401**

```json
{
  "msg": "Token has expired"
}
```

#### /change_pass'

**PATCH**

**header:**

```
Content-Type: application/json
Authorization: Bearer [ACCESS_TOKEN(FRESH)]
```

**request body**

```json
{
  "password": "[M]"
}
```

**response:**

**200**

```json
{
  "msg": "Password updated"
}
```

**404**

```json
{}
```

**401**

```json
{
    "msg": "Token has expired"
}

{
    "msg": "Fresh token required"
}
```

#### /edit_profile

**PATCH**

**header:**

```
Content-Type: application/json
Authorization: Bearer [ACCESS_TOKEN]
```

**request body**

_Any of these fields:_

```json
{
  "first_name": "",
  "last_name": "",
  "image_url": ""
}
```

**response:**

**200**

```json
{
  "msg": "Profile updated"
}
```

**404**

```json
{}
```

**401**

```json
{
  "msg": "Token has expired"
}
```

#### /edit_username

**PATCH**

**header:**

```
Content-Type: application/json
Authorization: Bearer [ACCESS_TOKEN(FRESH)]
```

**request body**

```json
{
  "username": "[M]"
}
```

**response:**

**200**

```json
{
  "msg": "Username updated"
}
```

**404**

```
json {}
```

**401**

```json
{
    "msg": "Token has expired"
}

{
    "msg": "Fresh token required"
}
```

**409**

```json
{
  "msg": "The user with username {username} already exists"
}
```

#### /request_change_email

**POST**

**header:**

```
Content-Type: application/json
Authorization: Bearer [ACCESS_TOKEN(FRESH)]
```

**request body**

```json
{
  "new_email": "[M]"
}
```

**response:**

**200**

```json
{
  "msg": "A confirmation e-mail was sent to your {new_email} address. Please follow the instructions in the e-mail to confirm your new email"
}

**404**

```

json {}

````

**401**

```json
{
    "msg": "Token has expired"
}

{
    "msg": "Fresh token required"
}
````

**409**

```json
{
  "msg": "The user with email {new_email} already exists"
}
```

#### /confirm/<token>

**GET**

**response:**

**200**

```json
{
  "msg": "Email confirmed"
}
```

**404**

```
json {}
```

---

### USERS

**/api/users**

---

### CHAT

**/api/chat**

#### /get_user_chats

**POST**

**header:**

```
Content-Type: application/json
Authorization: Bearer [ACCESS_TOKEN]
```

**response:**

**200**

```json

{
    "chats" :[
        {
            "chat_id": "",
            "created_at": "",
            "recipient_id"
        },
    ]
}
```

#### /send_message

**POST**

**header:**

```
Content-Type: application/json
Authorization: Bearer [ACCESS_TOKEN]
```

**request body:**

```json
{
  "recipient_id": "[M]",
  "body": "[M]"
}
```

**response:**

**200**

```json
{
  "chat_id": ""
}
```

#### /get_chat_messages

**POST**

**header:**

```
Content-Type: application/json
Authorization: Bearer [ACCESS_TOKEN]
```

**request body:**

```json
{
  "chat_id": "[M]"
}
```

**response:**

**200**

```json
{
  "chats": [
    {
      "created_at": "",
      "sender_id": "",
      "body": ""
    }
  ]
}
```

### Product

**/api/products**

#### /add-product

**POST**

**header:**

```
Content-Type: application/json
Authorization: Bearer [ACCESS_TOKEN]
```

#### /all-products

#### /product-per-user

---

## Hooks

### useRequest

```js
const [isLoading, data, error, errorNum, sendRequest] = useRequest();
```

**isLoading** - is _true_ while waiting for a response from server

**data** - _(object)_, response from a server if request is successful

**error** - _(string)_, error message

**errorNum** - only for 401 (Authorization denied) and 403 (Not enough privileges) errors

**sendRequest** - function to send request

```js
sendRequest(url, method, body, isJwt);
```

**isJwt** - _bool_, default is `false`, if `true` tries to send request with token from local storage

#### example:

```js
const [isLoading, data, error, errorNum, sendRequest] = useRequest();

const onSubmit = (formData) => {
  sendRequest("api/auth/login", "post", formData);
};

useEffect(() => {
  if (data) {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    history.push("/profile");
  }
}, [data]);
```

### useModal

```js
const [modal, showModal] = useModal({
    withBackdrop: //bool,
    useTimer: //bool,
    inPlace: //bool,
    timeOut: //int(milliseconds) for timer (default 5000 ms)
  });
```

**modal** - react element

**showModal** - function to show modal

```js
showModal(children, classes);
```

**children** - element to add to modal

**classes** - _(string)_ css classes

#### Example:

```js
const [modal, showModal] = useModal({
  withBackdrop: false,
  useTimer: true,
  timeOut: 10000,
  inPlace: false,
});

useEffect(() => {
  if (error) {
    showModal(error, "mdl-error");
  } else if (data && data.msg) {
    showModal(data.msg, "mdl-ok");
  }
}, [error, errorNum, data]);

return { modal };
```

---

## Components

###
