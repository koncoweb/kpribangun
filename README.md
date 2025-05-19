# Welcome to your Lovable project KPRI BANGUN

## Project info

**URL**: https://lovable.dev/projects/ed981e0c-17f6-4cab-b716-5fa0d164692d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ed981e0c-17f6-4cab-b716-5fa0d164692d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Option 1: Deploy with Lovable

Simply open [Lovable](https://lovable.dev/projects/ed981e0c-17f6-4cab-b716-5fa0d164692d) and click on Share -> Publish.

### Option 2: Deploy to Netlify

This project is configured for easy deployment to Netlify. Follow these steps:

1. **Set up environment variables**:
   - Copy `.env.example` to `.env.local` for local development
   - In Netlify, add the following environment variables in your site settings:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

2. **Deploy using Netlify CLI**:
   ```sh
   # Install Netlify CLI if you haven't already
   npm install -g netlify-cli
   
   # Login to your Netlify account
   netlify login
   
   # Initialize a new Netlify site
   netlify init
   
   # Deploy to production
   netlify deploy --prod
   ```

3. **Deploy via Netlify UI**:
   - Go to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect to your GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

4. **Configure redirects**:
   - The included `netlify.toml` file already contains the necessary redirect rules for a single-page application

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
