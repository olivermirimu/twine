# twine

A command line application hat allows a user to make posts and carry out other twitter related account functionality using a command line interface.

## Getting started

### Setup

- Clone the repository `git clone https://github.com/olivermirimu/twine.git`
- Run `npm install` in the project root directory, to install the required dependancies.

               **OR**

- Run the following command, to install from npm:

  ```
  npm install
  ```

### Configuration

- Configure the consumer API. You will be promted for your twitter developer api key and secret. (These shall be stored in your repective OS's credential manager).

  ```
  twine configure consumer
  ```

- Configure your Account. You will be promted to open a browser where you will login into your twitter account.
  ```
  Run twine configure account
  ```

### Functionalityy

- You can then interact with twitter using the following commands:
  > - To lookup specific user:
  ```
  twine lookup <username>
  ```
  > - To lookup
