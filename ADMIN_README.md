# Admin Dashboard

A comprehensive admin panel for managing the Talk Africa website content and settings.

## Features

### 🔐 Authentication

- Simple login system with session management
- Protected admin routes
- Demo credentials: `admin` / `password`

### 📝 Blog Management

- Create, edit, and delete blog posts
- Rich text editor with Quill.js
- Image upload functionality
- Post categories and status management
- Featured post selection
- Draft and published post states

### 📊 Dashboard Analytics

- Real-time statistics overview
- Post views tracking
- User engagement metrics
- Recent posts overview

### 🖼️ Media Management

- Image upload system
- File validation (type and size)
- Automatic file naming and organization

### 👥 User Management

- User overview (placeholder for future development)
- Role-based access control (future feature)

### ⚙️ Settings

- Site configuration management (placeholder)
- SEO settings (future feature)

## Getting Started

1. **Access the Admin Panel**

    ```
    http://localhost:5173/admin
    ```

2. **Login Credentials**
    - Username: `admin`
    - Password: `password`

3. **Creating a Blog Post**
    - Navigate to "Blog Posts" tab
    - Fill in the post details
    - Use the rich text editor for content
    - Upload a featured image
    - Set category and status
    - Click "Create Post"

4. **Managing Posts**
    - View all posts in the posts list
    - Edit posts by clicking the edit icon
    - Delete posts with confirmation
    - Filter by status and category

## API Endpoints

### Posts API (`/api/posts`)

- `GET` - Fetch all posts with optional filters
- `POST` - Create new post
- `PUT` - Update existing post
- `DELETE` - Delete post

### Upload API (`/api/upload`)

- `POST` - Upload images (max 5MB)

### Auth API

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

## File Structure

```
src/routes/admin/
├── +layout.server.ts     # Authentication middleware
├── +layout.svelte        # Admin layout wrapper
├── +page.svelte          # Main admin dashboard
├── login/
│   └── +page.svelte      # Login page
```

## Security Features

- Session-based authentication
- Protected routes with server-side checks
- File upload validation
- Input sanitization
- CSRF protection ready

## Future Enhancements

- [ ] Database integration (currently uses in-memory storage)
- [ ] Advanced user roles and permissions
- [ ] Email notifications
- [ ] Advanced analytics with charts
- [ ] SEO optimization tools
- [ ] Bulk operations
- [ ] Content scheduling
- [ ] Comment management
- [ ] Media library with search and filters

## Development Notes

- Uses SvelteKit for the framework
- Quill.js for rich text editing
- Tailwind CSS for styling
- TypeScript for type safety
- File uploads stored in `static/images/uploads/`

## Production Considerations

- Replace in-memory storage with a proper database
- Implement proper user authentication with hashing
- Add rate limiting for API endpoints
- Enable HTTPS and secure cookies
- Add comprehensive logging
- Implement backup strategies
- Add monitoring and alerting
