# Pharmacy Management System

## Overview

A **FastAPI‑based backend** that provides core services for a pharmacy application, including user authentication, user management, and CRUD operations. It is designed to be a solid foundation for building additional pharmacy features such as inventory, prescription handling, and reporting.

## Features

- **JWT authentication** with secure password hashing.
- **User CRUD** (create, read, update, delete) with role support.
- **Pydantic validation** for request/response models.
- **Modular architecture** – routers, services, and schemas are cleanly separated.
- **Ready for extension** – easy to add new domains (e.g., medicines, orders).

## Tech Stack

- **Python 3.11**
- **FastAPI** – high‑performance API framework
- **Uvicorn** – ASGI server
- **Pydantic** – data validation
- **PyJWT** – token handling
- **SQLAlchemy** (optional) – for future database integration

## Project Structure

```
/pharmacy_mangement_system/
├─ backend/
│  ├─ routers/
│  │  └─ user.py            # User‑related endpoints
│  ├─ service/
│  │  ├─ auth_service.py    # Login, token generation, validation
│  │  └─ user_service.py    # Business logic for user CRUD
│  └─ schemas/
│     └─ user_schema.py     # Pydantic models
├─ README.md                # Project documentation (this file)
└─ ... (other files such as requirements.txt, main entry point, etc.)
```

## Getting Started

### Prerequisites

- Python 3.11+ installed
- `git` (to clone the repo)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd pharmacy_mangement_system

# Create a virtual environment
python -m venv venv
source venv/bin/activate   # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt
```

### Configuration

Create a `.env` file in the project root (or set environment variables) with the following keys:

```
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
# DATABASE_URL=postgresql://user:password@localhost/dbname   # optional for future DB integration
```

These variables are used by `auth_service.py` for JWT handling.

### Running the API

```bash
uvicorn backend.main:app --reload
```

The service will be available at `http://127.0.0.1:8000`. Swagger UI can be accessed at `http://127.0.0.1:8000/docs`.

## API Overview

| Method   | Endpoint      | Description                                 |
| -------- | ------------- | ------------------------------------------- |
| `POST`   | `/login`      | Authenticate a user and receive a JWT.      |
| `GET`    | `/users`      | Retrieve a list of all users (protected).   |
| `POST`   | `/users`      | Create a new user (protected).              |
| `GET`    | `/users/{id}` | Get details of a specific user (protected). |
| `PUT`    | `/users/{id}` | Update a user's information (protected).    |
| `DELETE` | `/users/{id}` | Delete a user (protected).                  |

All routes under `/users` require a valid `Authorization: Bearer <token>` header.

## Testing

The project includes unit tests using **pytest**. To run the test suite:

```bash
pip install -r requirements-dev.txt   # dev dependencies include pytest
pytest
```

Make sure the virtual environment is active before running tests.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Make your changes and ensure tests pass.
4. Submit a pull request with a clear description of your changes.

Please adhere to PEP‑8 style guidelines and include appropriate docstrings.

## License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

## Contact

For questions or suggestions, open an issue on the repository or contact the maintainer.
