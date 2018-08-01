# Project Name

- KATA-BOOM


## Description

Platform in which users can solve easy-level katas and send them as a challenge to his/her friends.


## User Stories

  **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault

  **500:** As an anon/user I can see a 500 page if I try to reach a page and I can't because there is a server error
  
  **Signup:** As an anon I can sign up in the platform so that I can do a kata
  
  **Login:** As a anon I can login to the platform so that I can do a kata
  
  **Logout:** As a user I can logout from the platform so I can stop using it 

  **Get Kata:** As a user I want to go to the selected kata to be able to do it
 
  **Type Solution:** As a user I want to type my possible kata solution to the editor in the platform

  **Check Kata:** As a user I want to check if my solution to the kata passess all required tests

  **Submit Kata:** As a user I want to submit my kata if it has passed all required tests

  **See Profile:** As a user I want to be able to see my profile and the katas I have already done


## Backlog

  **Look for Friends:** As a user I would like to look for my friends in the platform

  **Add Friend:** As a user I would like to add my friends to my friends' list

  **Send Kata to Friend:** As a user I would like to send a kata challenge to a friend

  **Receive Kata from Friend:** As a user I would like to receive a kata challenge from a friend

  **Accet Kata Challenge:** As a user I would like to accept a kata challenge

  **See Friends' Profile:** As a user I would like to see my friends' profiles and the katas they have already done

  **Comment on Katas:** As a user I would like to comment on my own and on my friends' katas

  **See Katas Comments:** As a user I would like to see my friends comments on the katas

  **Edit Comments:** As a user I would like to see edit my comments

  **Remove Comments:** As a user I would like to remove comments on my katas

  
# Client

## Routes

  - / - Homepage
  - /auth/signup - Signup form
  - /auth/login - Login form
  - /profile - Details of user, list of katas and option to get kata
  - /kata/:id - Description of kata and editor to solve kata

  ### Backlog

  - /profile/friend/:id - Friend's profile

## Services

- Auth Service
  - auth.login(user)
  - auth.signup(user)
  - auth.logout()
  - auth.getMe()

- Kata Service
  - kata.getOne(id)
  - kata.check(id, solution)
  - kata.submit(id, solution)  

## Pages

- 404 Page
- 500 Page
- Sign in Page
- Log in Page
- Home Page
- Kata Detail Page
- Profile Page

## Components

- Navbar component
- Kata Card component
- Login/Signup form component

## IO

- Kata Card shows kata details
- Kata List lists all katas done by a user
- Login/Sign up form outputs the form to the parent component

## Guards

- /: init auth
- /login: anon 
- /signup: anon 
- /profile: user
- /kataId: user

# Server

## Models

  User model

  ```
  User {
    username: {
      type: string,
      required: true,
      unique: true
    },
    email: {
      type: string,
      required: true,
      unique: true
    },
    password: {
      type: string,
      required: true
    },
    finishedKata: [
      kataId: {
        type: ObjectId,
        ref: Kata,
        required: true
      },
      solution: {
        type: string,
        required: true
      }
    ]
  }
  ```

  Kata model

  ```
  Kata {
  name: {
    type: string,
    required: true
  },
  description: {
    type: string,
    required: true
  }
}
```

## API Endpoints/Backend Routes

  - GET /auth/me
  - POST /auth/signup
  - POST /auth/login
  - POST /auth/logout

  - GET /profile
  - GET /kata/:id
  - POST /kata/:id/check
  - POST /kata/:id/submit