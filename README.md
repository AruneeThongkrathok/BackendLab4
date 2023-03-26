# BackendLab4

This is a Node.js application using the Express.js framework. It serves as an authentication system that allows registered users to access different pages based on their assigned roles. It also has an admin page that only the administrator can access to view all registered users.
It can register new users and redirect users to their own profile.

## Getting Started

- Clone the repository.
- Install dependencies by running npm install in the command line.
- Create a .env file and set a value for TOKEN.
- Run node server.js in the command line to start the server.

## Dependencies

- express: This is a web framework that simplifies the process of building web applications.
- sqlite3: This is a library that provides a lightweight disk-based database.
- jwt: This is a library for JSON Web Tokens.
- body-parser: This is a middleware for parsing incoming request bodies.
- bcrypt: This is a library for hashing and comparing passwords.

## Usage

After starting the server, access the web application by visiting http://localhost:3000/.
Enter a valid username and password to login.
The app will redirect you to the identify page where you can enter your credentials.
Based on your assigned role, you will be redirected to the appropriate page.
Admin users can access the admin page to view all registered users.

## Code Structure

- The server.js file contains the server-side code.
- The database.js file contains code for connecting to the SQLite database.
- The views folder contains EJS templates that define the UI for the various pages.

## Testing for grade 3,4 and 5

Please note that the testing requirements for different grades may vary due to the use of a fixed database for grades 3 and 4.

### You can test grade 3 & 4 requirements by following these steps:

To test for requirements for grade 3 and 4, comment out the code block that uses bcrypt to compare passwords, and uncomment the code block that doesn't use bcrypt function in server.js. There is a description comments in server.js that says where the code should be commented out and uncommented to run the code for specific grade requirements.

1. Start the server by running 'node src/server.js' command in the terminal.
2. Open your web browser and go to http://localhost:3000/login.
3. Use the following credentials to login. Username and password can be found in database.js
4. Once logged in, you will be redirected to the dashboard page. From here, you can navigate to different pages based on your access rights using URL paths in the browser.

#### URL paths for different roles:

- http://localhost:3000/student1
- http://localhost:3000/student2
- http://localhost:3000/admin
- http://localhost:3000/teacher

### You can test grade 5 requirements by following these steps:

To test for the requirements for grade 5, comment out the code block that generates a token for a user and uncomment the code block that uses bcrypt to compare passwords in server.js. There is a description comments in server.js that says where the code should be commented out and uncommented to run the code for specific grade requirements.

1. Start the server by running 'node src/server.js' command in the terminal
2. Register a new user by clicking on the "Register" button on the homepage and filling in the required information.
3. Login with the new user credentials.
4. You should be directed to the user's page, which displays information about the user.
5. Test the features required for grade 5.
6. Once you are done testing, shut down the server.
7. When you start the server again, the database will be empty and you will need to repeat steps 2-4 to test grade 5 requirements again.
