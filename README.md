# Law Calendar Integration

A React application that integrates with Acuity Scheduling to display available appointment slots.

## Features

- Display available time slots from Acuity Scheduling
- Select multiple salespeople
- View overlapping availability
- Responsive design with Tailwind CSS

- 

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
ACUITY_API_KEY=your_api_key
ACUITY_USER_ID=your_user_id
APPOINTMENT_TYPE=your_appointment_type
```

## Deployment

### Netlify

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
3. Add environment variables in Netlify dashboard

### Vercel

1. Connect your GitHub repository to Vercel
2. The build settings will be automatically detected from `vercel.json`
3. Add environment variables in Vercel dashboard
4. API routes are automatically handled from the `api` directory

## API Routes

- `GET /api/availability`: Get available time slots
  - Query parameters:
    - `date`: Date in YYYY-MM-DD format
    - `calendarId`: Acuity calendar ID

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Netlify/Vercel for deployment
