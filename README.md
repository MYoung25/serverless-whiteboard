# Serverless Whiteboard

### Cloudflare Products Used
- Pages -> ./client (https://serverless-whiteboard.pages.dev)
- Workers -> ./src
- Durable Objects + WebSockets -> ./src/whiteboard.ts
- KV Store -> ./src/whiteboardModel.ts
- cloudflared for testing on mobile

## Demo Instructions
### Solo Mode
1) Go to https://serverless-whiteboard.pages.dev and enter a desired whiteboard id.
2) Draw
3) Refresh the page, enter the same whiteboard id, and see your old work!

### Collaboration Mode
1) Go to https://serverless-whiteboard.pages.dev and enter a desired whiteboard id.
2) Open another window and enter the same whiteboard id.
3) Draw on either whiteboard and see your work on both!

