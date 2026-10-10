# 🎵 Music Streaming Platform

A full-stack music streaming web application built with **HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB**. The project aims to provide a simple and interactive platform for discovering songs and playing music through a browser-based interface.

> **Project status:** In development 🚧

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Database](#-database)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Learning Outcomes](#-learning-outcomes)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## 📖 Overview

The Music Streaming Platform is a learning-focused full-stack web development project designed to demonstrate how a frontend application communicates with a backend API and a database.

Users can interact with the music interface and play available audio tracks. The backend uses Express.js to provide API endpoints, while MongoDB stores song-related information.

The project is being developed incrementally, with plans to introduce additional music discovery and playlist features.

## ✨ Features

### Implemented

- 🎧 Browser-based music playback.
- 🎵 Song information displayed in the frontend.
- 🖥️ Frontend built using HTML, CSS, and vanilla JavaScript.
- ⚙️ REST API built with Node.js and Express.js.
- 🗄️ MongoDB database integration.
- 🔌 Frontend-to-backend API communication.
- 🔒 Environment variables excluded from version control.
- 📦 Backend dependency management using npm.

### Planned

- 🔍 Search songs by title or artist.
- ⏯️ Enhanced player controls and playback progress.
- ⏭️ Next and previous track controls.
- ❤️ Favourite songs.
- 📂 Playlist creation and management.
- 👤 User registration and authentication.
- 📱 Improved responsive design.
- ☁️ Online deployment.

*Planned features will be added as development progresses.*

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Web page structure |
| CSS3 | Styling and layout |
| JavaScript | Frontend interactions and API requests |
| Node.js | Backend JavaScript runtime |
| Express.js | Backend server and REST API |
| MongoDB | Database for song information |
| Mongoose | MongoDB object modelling, if used by the backend |
| Git and GitHub | Version control and source code hosting |
| npm | Backend package management |

## 📁 Project Structure

```text
Music_Streaming_project/
│
├── BACKEND/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── song.js
│   ├── routes/
│   │   └── songRoutes.js
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── DATABASE/
│   ├── .gitignore
│   ├── README.md
│   └── seed.js
│
├── FRONTED/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
└── README.md
```

> Note: The frontend directory is currently named `FRONTED`. Its name can be changed to `FRONTEND` later if desired, with any related paths updated accordingly.

### Folder Responsibilities

- **`BACKEND/`** — Express server, database connection, song model, and API routes.
- **`BACKEND/config/`** — Database connection configuration.
- **`BACKEND/models/`** — Structure and validation for song documents.
- **`BACKEND/routes/`** — API route definitions.
- **`DATABASE/`** — Database setup notes and seed data scripts.
- **`FRONTED/`** — Browser interface, styling, and client-side logic.
- **`.gitignore`** — Excludes sensitive files and generated dependencies from Git.

## 🚀 Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Install the following tools before starting:

- [Node.js](https://nodejs.org/) — includes npm.
- [Git](https://git-scm.com/).
- [MongoDB](https://www.mongodb.com/) — either a local MongoDB server or a MongoDB Atlas database.
- A modern web browser.
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/).

### 1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/Papiya005/music-streaming-platform.git
```

Move into the project directory:

```bash
cd music-streaming-platform
```

### 2. Install Backend Dependencies

```bash
cd BACKEND
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `BACKEND/` directory.

Add the environment variables expected by your backend. For example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Replace the example database value with your actual MongoDB connection string.

**Security:** Never commit your `.env` file or publish database passwords, API keys, or other secrets.

Make sure the variable names match those referenced in your backend code.

### 4. Start the Backend Server

From the `BACKEND/` directory, run:

```bash
npm run dev
```

If your `package.json` defines the `dev` script, the Express server should start and attempt to connect to MongoDB.

The API is expected to be available at:

```text
http://localhost:5000
```

### 5. Open the Frontend

Open `FRONTED/index.html` in your browser to view the interface.

If browser restrictions prevent requests from reaching the backend, serve the frontend through a local development server and configure the backend's CORS settings as necessary.

### 6. Verify the Songs API

With the backend running, visit:

```text
http://localhost:5000/api/songs
```

The endpoint should return the available song data in JSON format.

## 🔐 Environment Variables

The backend uses environment variables for configuration.

| Variable | Description |
|---|---|
| `PORT` | Port used by the backend server |
| `MONGODB_URI` | MongoDB connection string |

The names above are examples of the expected configuration. Check `BACKEND/server.js` and `BACKEND/config/db.js` to confirm the exact names used by your implementation.

Never include real credentials in documentation or source control.

## 🔌 API Documentation

The backend exposes a REST API for song-related operations.

### Get All Songs

**Endpoint**

```http
GET /api/songs
```

**Local URL**

```text
http://localhost:5000/api/songs
```

**Description:** Retrieves the song data available through the backend.

**Successful response:** `200 OK`

Example response format:

```json
[
  {
    "_id": "example-song-id",
    "title": "My First Song",
    "artist": "Test Artist",
    "audioUrl": "https://example.com/song.mp3"
  }
]
```

*This is an illustrative response. Actual field names and values depend on the song model and API implementation.*

### API Roadmap

The following endpoints could be added as the application grows:

| Method | Endpoint | Planned purpose |
|---|---|---|
| GET | `/api/songs` | Retrieve songs |
| GET | `/api/songs/:id` | Retrieve a song by ID |
| POST | `/api/songs` | Add a song |
| PUT | `/api/songs/:id` | Update a song |
| DELETE | `/api/songs/:id` | Delete a song |

Only the endpoints implemented in the backend should be considered available. The remaining routes are suggestions for future development.

## 🗄️ Database

MongoDB is used to store song-related metadata.

A song record may contain fields such as:

- Song title.
- Artist name.
- Audio URL.
- Optional cover image URL.
- Additional metadata as the schema evolves.

The exact fields depend on the current song model.

Audio files are not necessarily stored in MongoDB. In this project, the audio player can use an accessible audio URL.

The `DATABASE/seed.js` script can be used to manage sample data if it is configured for that purpose.

## 🖼️ Screenshots

Screenshots will be added here as the interface develops.

Suggested screenshots:

1. Main music page.
2. Song list.
3. Music player in action.
4. Mobile-responsive layout.

To add screenshots, create a folder such as `screenshots/` in the project root and reference your image files:

```markdown
![Music streaming homepage](screenshots/homepage.png)
```

Use actual screenshots of your application rather than placeholder images.

## 🗺️ Future Improvements

- [ ] Improve the overall UI and responsive layout.
- [ ] Add search and filtering for songs.
- [ ] Implement a playback progress bar and seek controls.
- [ ] Add next and previous track functionality.
- [ ] Create and manage playlists.
- [ ] Add favourites and liked songs.
- [ ] Implement user authentication.
- [ ] Add loading, empty, and error states.
- [ ] Add backend validation and improved error handling.
- [ ] Write automated tests for the API.
- [ ] Deploy the frontend and backend.
- [ ] Add a live demo link.

## 🎓 Learning Outcomes

This project provides practical experience with:

- Building a frontend using HTML, CSS, and JavaScript.
- Developing a REST API with Node.js and Express.js.
- Connecting an application to MongoDB.
- Sending HTTP requests from the frontend to the backend.
- Managing application configuration with environment variables.
- Using Git and GitHub for version control.
- Organising a full-stack project into separate components.
- Debugging API requests and browser audio playback.

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes locally.
5. Submit a pull request describing the improvement.

For example:

```bash
git checkout -b feature/song-search
```

## 📄 License

No license has been selected yet.

If you intend to allow others to reuse, modify, and distribute this project, consider adding an open-source license such as the MIT License. Add the corresponding `LICENSE` file before claiming that the project is licensed.

## 👩‍💻 Author

**Papiya**

- GitHub: [@Papiya005](https://github.com/Papiya005)
- Project Repository: [Music Streaming Platform](https://github.com/Papiya005/music-streaming-platform)

---

⭐ If you find this project interesting, consider starring the repository.

*Built as a full-stack web development learning project.*
