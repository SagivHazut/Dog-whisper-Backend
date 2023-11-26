Dog Trainer Website Backend

Description

The Dog Trainer Website Backend serves as the server-side component for the Dog Trainer website. It is built using Node.js, Express, MongoDB, and Mongoose. This backend supports user authentication, admin panel functionalities, and handles the logic for managing user calendars, reviews, and dog breeds information.

Features

- User Authentication:

  - Enables users to register and log in securely.
  - Implements token-based authentication using JSON Web Tokens (JWT).

- Admin Panel:

  - Provides an admin interface to manage and control all users.
  - Allows admins to set training days for each user.

- User Calendars:

  - Displays personalized calendars for users, showing their training schedule for the week.
  - Allows admins to set the training days for individual users.

- Reviews:

  - Supports a review system where users can post their feedback on the homepage.
  - Admins can manage and moderate user reviews.

- Dog Breeds Information:
  - Manages information about various dog breeds.
  - Provides details and images for users to explore.

Project Structure

models/

- ContactData.js
- DogData.js
- User.js

routes/

- ContactDataRoute.js
- dogsApis.js
- Users.js

.env
.gitignore
db.js
package-lock.json
package.json
README.md
server.js

Getting Started

1. Clone the Repository:
   `bash git clone https://github.com/your-username/dog-trainer-backend.git`

2.install Dependencies:
`npm install`

3. Set Up MongoDB:
   Create a MongoDB database and configure the connection in db.js.

4.Run the Server:
` npm start`
