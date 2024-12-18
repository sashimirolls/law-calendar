# Acuity Scheduling Integration

This project integrates with Acuity Scheduling to display available time slots.

## Development

```bash
npm install
npm run dev
```

## Deployment

This project can be deployed to both Netlify and Vercel.

### Environment Variables

Set the following environment variables in your deployment platform:

- `ACUITY_API_KEY`
- `ACUITY_USER_ID`
- `APPOINTMENT_TYPE`

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Use these build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. The build settings will be automatically detected
3. API routes are in the `api` directory