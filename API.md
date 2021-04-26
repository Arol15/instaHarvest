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
  - [useForm](#useForm)
  - [useUploadImages](#useUploadImages)
  - [useWidth](#useWidth)
  - [useElementPosition](#useElementPosition)

- [Components](#Components)
  - [Spinner](#Spinner)

## REST

_[M] - mandatory; [D:] - default value_,

---

### AUTH

**/api/auth**

#### /signup

**POST**

**request body**

```json
{
  "email": "[M]",
  "first_name": "[M]",
  "password": "[M]",
  "state": "[M]",
  "city": "[M]",
  "username": ""
}
```

**response:**

**201**

```json
{}
```

**409**

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
{}
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

#### /logout

**POST**

**response:**

**200**

```json
{}
```

#### /resend_email

**POST**

**cookies:**

```
session
```

**response:**

**200**

```json
{
  "msg": "A confirmation email has been sent"
}
```

**404**

```json
{}
```

**406**

```json
{ "error": "Sorry, you can resend confirmation email in { ... } minutes" }
```

#### /reset_password

**POST**

**request body**

```json
{
  "email": ""
}
```

**200**

```json
{
  "msg": "A reset password email has been sent"
}
```

**401**

```json
{
  "error": "The user with email {email} does not exist"
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

```json
{}
```

#### /reset_password_confirm

**POST**

**request body**

```json
{
  "token": "",
  "password": ""
}
```

**200**

```json
{
  "msg": "A new password has been saved"
}
```

**404**

```json
{
  "error": "Can not find the user"
}
```

**406**

```json
{
  "error": "The token is not valid or expired"
}
```

---

### ACCOUNT

**/api/account**

#### /get_profile

**POST**

**cookies:**

```
session
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

**cookies:**

```
session
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

**cookies:**

```
session
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

**cookies:**

```
session
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

**cookies:**

```
session
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

**cookies:**

```
session
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

**cookies:**

```
session
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

**cookies:**

```
session
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

#### /add_product

**POST**

**cookies:**

```
session
```

#### /all-products

#### /product-per-user

---

## Hooks

### useRequest

```js
const {
  isLoading,
  data,
  error,
  errorNum,
  sendRequest,
  uploadStatus,
} = useRequest();
```

#### Return:

**isLoading** - [bool] is _true_ while waiting for a response from server

**data** - [object] - response from a server if request is successful

**error** - [string] - error message

**errorNum** - [int] - error status number

**sendRequest** - [func] - function to send request

**uploadStatus** - [int] - shows how much data is uploaded

```js
sendRequest(url, method, body);
```

**url** - [string]
**method** - [string]
**body** - [object]
**upload** - [bool] (optional) - If `true` sets timeout of the request to null and allows wait until file is uploaded

#### example:

```js
const {
  isLoading,
  data,
  error,
  errorNum,
  sendRequest,
  uploadStatus,
} = useRequest();

const onSubmit = (formData) => {
  sendRequest("/api/auth/login", "post", formData);
};

useEffect(() => {
  if (data) {
    history.push("/profile");
  }
}, [data]);
```

### useModal

```js
const [modal, showModal, closeModal, isOpen] = useModal({
    withBackdrop
    useTimer,
    inPlace,
    timeOut,
    disableClose
  });
```

#### Arguments:

**withBackdrop** - [bool]

**useTimer** - [bool]

**inPlace** - [bool] - show modal inside the element

**timeOut** - [int] (default: 5000 ms) if **useTimer** is `true` - how long the modal is shown on the screen

**disableClose** - [bool] (default: `false`) - if `true`, modal can be closed only by clicking on 'x' button

#### Return:

**modal** - created react element

**showModal** - [func] function to show the modal

**closeModal** - [func] function to close the modal

**isOpen** - [bool] state of the modal, `true` if modal is open

```js
showModal(children, classes);
```

**children** - element to add to modal

**classes** - [string] css classes

#### Example:

```js
const [modal, showModal, closeModal, isOpen] = useModal({
  withBackdrop: false,
  useTimer: true,
  timeOut: 10000,
  inPlace: false,
  disableClose: true,
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

### useForm

```js
const [
  setFormData,
  handleSubmit,
  handleInputChange,
  formData,
  formErrors,
] = useForm(formData, onSubmit, formValidation);
```

#### Arguments:

**setFormData** - [func] function to update form fields state

**handleSubmit** - [func] starts validation and if validation passed, sends request

**handleInputChange** - [func] updates form fields state

**formData** - [object] form fields state

**formErrors** - [object] if validation didn't pass, contains errors

#### Return:

**formData** - initial form fields

**onSubmit** - function to execute after validation

**formValidation** - function to validate form fields

### useUploadImages

Creates drag and drop container for images

```js
const [uploadImagesContainer, filesToSend] = useUploadImages({
  multipleImages,
});
```

#### Argument:

**multipleImages** - [bool] (optional) - default `false` - Allows to drop and load more then one image, max 4 images

#### Return:

**uploadImagesContainer** = [JSX element] - Drag and drop container

**filesToSend** = [array] - List of `File` objects

---

### useWidth

Checks current width of the screen and returns **isDesktop** true if width is greater then **breakpoint**

```js
const [isDesktop] = useWidth(breakpoint);
```

#### Argument:

**breakpoint** - [int] (optional) - default is 600 px

#### Return:

**isDesktop** = [bool] - `true` if width of the screen greater then `breakpoint`

---

### useElementPosition

Keeps track of the next and previous items inside of the **ref** element

```js
const [
  hasItemsOnLeft,
  hasItemsOnRight,
  scrollLeft,
  scrollRight,
] = useElementPosition(ref);
```

#### Argument:

**ref** - reference to the JSX element

#### Return:

**hasItemsOnLeft** - [bool] - `true` if there is an element to the left of the referenced element

**hasItemsOnRight** - [bool] - `true` if there is an element to the right of the referenced element

**scrollLeft** - [fn] - scrolls to the position of the element positioned to the left of the referenced element

**scrollRight** - scrolls to the position of the element positioned to the right of the referenced element

---

## Components

###

```

```
