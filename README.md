# Queue Management System

A responsive, real-time queue management frontend application built with Next.js and REST API. This application demonstrates a queue system that allows users to join queues, check their status in real-time, and join rooms when available.

![Queue Management System](public/queue-screenshot.png)

## Features

- **User Generation**: Create individual or bulk users (up to 100) to join the queue
- **Real-time Status Updates**: Automatic polling every 10 seconds to check queue status
- **Status Visualization**: Color-coded cards to represent different queue statuses:
  - Grey: Initial queueing state
  - Yellow: In queue/checking status
  - Green: Successfully joined room
  - Red: Not eligible to join
- **Time Tracking**: Shows when status was last checked with relative time display (e.g., "2 minutes ago")
- **Dynamic Room Access**: Join rooms when user status becomes available
- **Responsive Design**: Fully responsive UI that works on mobile, tablet, and desktop
- **REST API Integration**: Uses standard REST endpoints for all API operations
- **Error Handling**: Automatically removes users from the queue if errors occur during status checks

## Technology Stack

- **Frontend**: Next.js (App Router)
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **API Communication**: Fetch API for REST endpoints
- **Form Handling**: React Hook Form
- **Utilities**: classnames for conditional styling

## API Endpoints

The application interacts with the following REST endpoints:

1. **Start Queue**
```
POST ${baseUrl}/queue/start
Body: { product_code: string }
```

2. **Check Queue Status**
```
GET ${baseUrl}/queue/status/${queue_id}
```

3. **Enter Queue Room**
```
POST ${baseUrl}/queue/enter
Body: { queue_id: string }
```

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, create a `.env.local` file with your API endpoint:

```
NEXT_PUBLIC_API_URL=https://your-api-endpoint.com
```

Next, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Application Structure

```
src/
  ├── app/               # Next.js App Router
  │   ├── layout.js      # Root layout with QueueProvider
  │   ├── page.js        # Main page component
  │   └── globals.css    # Global CSS
  ├── components/
  │   ├── QueueForm.js   # Form to generate users
  │   ├── QueueList.js   # List of users in queue
  │   └── UserCard.js    # Individual user card component
  ├── contexts/
  │   └── QueueContext.js # State management for queue
  └── lib/
      └── rest.js        # REST API client
```

## Key Features Explained

### Time-Based Status Tracking

The system now shows how long ago a user's status was checked. This is displayed in a user-friendly format:
- "X seconds ago" for checks within the last minute
- "X minutes ago" for checks within the last hour
- The exact time for older checks

### Automatic Status Checking

The system automatically polls the API every 10 seconds to check the status of all users in the queue. This ensures that users are notified promptly when their status changes to "available".

### Bulk User Generation

For testing or high-volume scenarios, the application supports generating multiple users at once with the same product code. This is handled through parallel API calls for maximum efficiency.

### Responsive UI

The UI adapts seamlessly to different screen sizes:
- Mobile: Stacked layout with optimized controls
- Tablet: Two-column grid for user cards
- Desktop: Side-by-side layout for form and user list

### Error Handling

If a user's status check returns an error or fails, the user is automatically removed from the queue list, simulating a user who has left the room or whose session has expired.

### Robust API Client

The REST API client includes enhanced error handling and data transformation to ensure consistent response formats regardless of server implementation details. This makes the application more resilient to server variations.

## Development

### Adding New Features

To add new features or modify existing ones:

1. Update the REST endpoints in `lib/rest.js`
2. Modify state management in `contexts/QueueContext.js`
3. Update UI components as needed

### Customizing Styles

The application uses Tailwind CSS for styling. You can customize the appearance by:

1. Modifying classes in component files
2. Extending the Tailwind config in `tailwind.config.js`

## License

[MIT](LICENSE)
