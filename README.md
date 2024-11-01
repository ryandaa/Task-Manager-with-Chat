# Task Manager Project

Welcome to the Task Manager project! Follow these instructions to get your development environment set up.

## Prerequisites

Before starting, make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/get-npm) or [Yarn](https://yarnpkg.com/) as the package manager
- [Supabase](https://supabase.io/) account (for database services)

## Installation Steps

1. **Clone the Repository**

   ```sh
   git clone <your-repository-url>
   cd task-manager-project
   ```

2. **Install Dependencies**

   If you are using npm:
   
   ```sh
   npm install
   ```
   
   Or if you are using Yarn:
   
   ```sh
   yarn install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory of the project and add the following variables:

   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_KEY=your_supabase_anon_key
   ```

   Replace `your_supabase_url` and `your_supabase_anon_key` with the credentials from your Supabase account.

4. **Start the Development Server**

   To start the server, run:

   ```sh
   npm start
   ```
   
   Or if you are using Yarn:
   
   ```sh
   yarn start
   ```

   This command will start the application, and it should be accessible at `http://localhost:3000` in your browser.

5. **Build for Production**

   To create an optimized production build, run:

   ```sh
   npm run build
   ```
   
   Or with Yarn:
   
   ```sh
   yarn build
   ```

   The production-ready files will be generated in the `build` folder.

## Common Issues

- **Port Already in Use**: If you encounter an error about port 3000 being in use, you can specify a different port:
  
  ```sh
  PORT=3001 npm start
  ```

- **Missing Environment Variables**: Make sure your `.env` file is correctly configured with the required Supabase keys.

## Additional Notes

- Make sure to set up your Supabase database properly to match the tables expected in the project (e.g., `Tasks`, `TaskAssignments`, `TaskMessages`, `Users`).
- The project may use specific packages as listed in `requirements.txt`, please refer to that to ensure compatibility.

## Contributing

If you want to contribute, feel free to fork the repository, make changes, and submit a pull request.

## License

This project is licensed under the MIT License.