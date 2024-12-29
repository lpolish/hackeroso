# Hackeroso

Hackeroso is a modern Hacker News client with integrated task management capabilities. It provides a sleek interface for browsing tech news, discussions, and managing personal tasks.

## Features

- Browse top stories, new submissions, ask HN, show HN, and job postings
- Integrated task management system
- Dark mode support
- Responsive design for mobile and desktop
- Search functionality
- User profiles and comment threads

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/lpolish/hackeroso.git
   cd hackeroso
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_API_URL=https://hacker-news.firebaseio.com/v0
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Browsing Stories

- The home page displays top stories
- Use the navigation menu to switch between different story types (New, Ask, Show, Jobs)
- Click on a story title to view its details and comments

### Task Management

- Access the task manager from the navigation menu
- Add new tasks using the form at the top of the task page
- Drag and drop tasks to reorder or change their status
- Edit task details by clicking on a task

### Search

- Use the search bar in the header to find stories and comments
- Results are paginated and can be filtered

## Contributing

We welcome contributions to Hackeroso! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch: \`git checkout -b feature/your-feature-name\`
3. Make your changes and commit them: \`git commit -m 'Add some feature'\`
4. Push to the branch: \`git push origin feature/your-feature-name\`
5. Submit a pull request

Please ensure your code adheres to the existing style and passes all tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Hacker News API
- Next.js
- React
- Tailwind CSS
- shadcn/ui components

Thank you for using and contributing to Hackeroso!

