# Queue Management System

A responsive, real-time queue management frontend application built with Next.js and GraphQL. This application demonstrates a queue system that allows users to join queues, check their status in real-time, and join rooms when available.

![Queue Management System](public/queue-screenshot.png)

## Features

- **User Generation**: Create individual or bulk users (up to 100) to join the queue
- **Real-time Status Updates**: Automatic polling every 10 seconds to check queue status
- **Status Visualization**: Color-coded cards to represent different queue statuses:
  - Grey: Initial queueing state
  - Yellow: In queue/checking status
  - Green: Successfully joined room
  - Red: Not eligible to join
- **Dynamic Room Access**: Join rooms when user status becomes available
- **Responsive Design**: Fully responsive UI that works on mobile, tablet, and desktop
- **GraphQL Integration**: Uses GraphQL mutations for all API operations
- **Error Handling**: Automatically removes users from the queue if errors occur during status checks

## Technology Stack

- **Frontend**: Next.js (App Router)
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **API Communication**: GraphQL with graphql-request
- **Form Handling**: React Hook Form
- **Utilities**: classnames for conditional styling

## API Endpoints

The application interacts with the following GraphQL mutations:

1. **Start Queueing**
```graphql
mutation StartQueueing($productCode: String) {
  startQueueing(productCode: $productCode) {
    success
    message
    data {
      queueId
    }
  }
}
```

2. **Check Queue Status**
```graphql
mutation CheckQueueStatus($queueId: String) {
  checkQueueStatus(queueId: $queueId) {
    success
    message
    data {
      queue_id
      is_available
      estimated_time
    }
  }
}
```

3. **Enter Queue Room**
```graphql
mutation EnterQueueRoom($queueId: String) {
  enterQueueRoom(queueId: $queueId) {
    success
    message
  }
}
```

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, create a `.env.local` file with your GraphQL endpoint:

```
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-api-endpoint.com/graphql
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
      └── graphql.js     # GraphQL client and queries
```

## Key Features Explained

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

## Development

### Adding New Features

To add new features or modify existing ones:

1. Update the GraphQL queries/mutations in `lib/graphql.js`
2. Modify state management in `contexts/QueueContext.js`
3. Update UI components as needed

### Customizing Styles

The application uses Tailwind CSS for styling. You can customize the appearance by:

1. Modifying classes in component files
2. Extending the Tailwind config in `tailwind.config.js`

## License

[MIT](LICENSE)
