<div align=center id=pocketcats>

# PocketCats 🐱

</div>

<div align=center>
    <a href="https://img.shields.io/github/license/Pauwul/PocketCats">
        <img src="https://img.shields.io/github/license/Pauwul/PocketCats" alt="License">
    </a>
    <a href="https://img.shields.io/badge/stack-Spring%20Boot%20%7C%20Next.js%20%7C%20Flask%20%7C%20Postgres-blue">
        <img src="https://img.shields.io/badge/stack-Spring%20Boot%20%7C%20Next.js%20%7C%20Flask%20%7C%20Postgres-blue" alt="Stack">
    </a>
</div>

## What is this repo?

PocketCats is a self‑contained full‑stack demo you can run locally. It lets users collect their friends’ cats, upload photos, and use a small ML service to detect whether an image contains a cat. Think Pokémon, but more wholesome.

This repository contains everything needed to run locally with minimal setup:

- Database: PostgreSQL via Docker (exposed at localhost:80)
- Backend API: Java Spring Boot (runs on localhost:5432)
- Frontend: Next.js React app (runs on localhost:3000)
- ML Service: Python Flask + TensorFlow (runs on localhost:8000) for cat detection
- Javadocs: Prebuilt docs for the backend under `javadoc/`

### Purpose

- Showcase a simple full‑stack architecture with a clear separation of concerns.
- Demonstrate basic OAuth login (GitHub), REST APIs, and a tiny ML inference service.
- Offer a ready‑to‑run local environment on macOS, Windows, and Linux.

## Repo layout

- `docker-compose.yml` – starts PostgreSQL (port 80 -> container 5432)
- `backend/` – Spring Boot API (Java 17, port 5432)
- `frontend/` – Next.js UI (port 3000)
- `cat-classificator/` – Flask API + TensorFlow model (port 8000)
- `javadoc/` – Static Java API documentation
- `start.sh` – convenience script to launch everything (macOS/Linux), best after first‑time setup

## Tech stack

- Frontend: Next.js (React 18), axios, react‑toastify
- Backend: Spring Boot 2.7.x, Spring Security (OAuth2), JPA/Hibernate, Flyway, PostgreSQL
- ML: Flask, TensorFlow/Keras (VGG16), Flasgger (Swagger UI)
- Infra/Dev: Docker, Maven Wrapper (mvnw), Node.js/npm, Python venv

## Ports and URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5432
  - Swagger UI: http://localhost:5432/swagger-ui/index.html
- ML Service (Flask): http://127.0.0.1:8000
  - API Docs: http://127.0.0.1:8000/apidocs
- Postgres DB: localhost:80 (mapped to container 5432)

### What is local vs external?

- Everything in this repo runs locally: DB (Docker), Backend (Spring Boot), Frontend (Next.js), and ML (Flask).
- OAuth login uses GitHub OAuth (an external third‑party). The app redirects to GitHub for login; the rest of the stack is local.

### Seeded data

- The backend includes Flyway migrations that create a simple `todos` table and add a `completed` column:
  - `backend/src/main/resources/db/migration/V1__create_todos_table.sql`
  - `backend/src/main/resources/db/migration/V2__add_completed_to_todos.sql`
- No other seed data is inserted by default. You can create todos from the UI (todo list page after login) or via the API.
- Cat records are created via the UI interactions when uploading images (and optionally using the local ML service).

## Run it locally (step‑by‑step, macOS/Windows/Linux)

Follow these steps in order. If you just cloned the repo, this is all you need.

### Copy‑paste quickstart (macOS/Linux)

Run each block in a separate terminal so all services run at once.

1) Database (Docker):
```bash
cd /Users/$(whoami)/Documents/PocketCats-self-contained
docker compose up -d
```

Expected: container "java_db" up, port 80->5432 shown in `docker ps`.

2) Backend (Java 17):
```bash
cd /Users/$(whoami)/Documents/PocketCats-self-contained/backend
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"
java -version
./mvnw -Dmaven.test.skip=true spring-boot:run
```

Expected: Spring Boot up on http://localhost:5432 with Swagger at /swagger-ui/index.html

3) ML service (Flask/TensorFlow):
```bash
cd /Users/$(whoami)/Documents/PocketCats-self-contained/cat-classificator
python3 -m venv .venv && source .venv/bin/activate
pip install --upgrade pip wheel setuptools
pip install flask flasgger pillow flask-cors tensorflow keras
python3 catdetector.py
```

Expected: Flask up on http://127.0.0.1:8000 with docs at /apidocs

4) Frontend (Next.js):
```bash
cd /Users/$(whoami)/Documents/PocketCats-self-contained/frontend
printf "NEXT_PUBLIC_API_URL=http://localhost:5432\n" > .env
npm install
npm run dev
```

Expected: Next.js up on http://localhost:3000

Navigation notes:
- “Sign In” sends you to `/login_page` where you can select “Login with Github” (OAuth flow).
- “Register” shows a local page explaining that registration happens on first OAuth login.
- “FAQ” links to `/how-it-works`.

### Copy‑paste quickstart (Windows PowerShell)

Run each block in a separate PowerShell window so all services run at once.

1) Database (Docker):
```powershell
cd $HOME\Documents\PocketCats-self-contained
docker compose up -d
```

Expected: container "java_db" up, port 80->5432 shown in `docker ps`.

2) Backend (Java 17):
```powershell
cd $HOME\Documents\PocketCats-self-contained\backend
$env:JAVA_HOME = "C:\\Program Files\\Java\\jdk-17"
$env:Path = "$env:JAVA_HOME\\bin;$env:Path"
java -version
./mvnw.cmd -Dmaven.test.skip=true spring-boot:run
```

Expected: Spring Boot up on http://localhost:5432 with Swagger at /swagger-ui/index.html

3) ML service (Flask/TensorFlow):
```powershell
cd $HOME\Documents\PocketCats-self-contained\cat-classificator
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip wheel setuptools
pip install flask flasgger pillow flask-cors tensorflow keras
python catdetector.py
```

Expected: Flask up on http://127.0.0.1:8000 with docs at /apidocs

4) Frontend (Next.js):
```powershell
cd $HOME\Documents\PocketCats-self-contained\frontend
Set-Content -Path .env -Value "NEXT_PUBLIC_API_URL=http://localhost:5432"
npm install
npm run dev
```

Expected: Next.js up on http://localhost:3000

### 0) Prerequisites

- Docker Desktop (macOS/Windows) or Docker Engine (Linux)
- Java 17 JDK
- Node.js 16/18+ and npm
- Python 3.9–3.11 (with venv)

Tips to install Java 17 if you don’t have it:

- macOS:
  - Recommended: `brew install openjdk@17`
  - Temporary switch in a terminal session:
    ```zsh
    export JAVA_HOME="$(`/usr/libexec/java_home -v 17`)"
    export PATH="$JAVA_HOME/bin:$PATH"
    java -version   # should show 17.x
    ```
- Windows (PowerShell):
  - Install JDK 17 (Adoptium/Temurin) and then set for the current session:
    ```powershell
    $env:JAVA_HOME = "C:\\Program Files\\Java\\jdk-17"
    $env:Path = "$env:JAVA_HOME\\bin;$env:Path"
    java -version   # should show 17.x
    ```
- Linux (Debian/Ubuntu):
  ```bash
  sudo apt update && sudo apt install -y openjdk-17-jdk
  export JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
  export PATH="$JAVA_HOME/bin:$PATH"
  java -version
  ```

If Docker port 80 is busy on your machine, see the Troubleshooting section to change the Postgres port.

### 1) Start the database (Docker)

From the repository root in a terminal:

```bash
docker compose up -d
```

Expected:
- A container named `java_db` starts.
- `docker ps` shows port mapping `0.0.0.0:80->5432/tcp`.

### 2) Start the backend (Spring Boot)

Use Java 17 in this terminal (see prerequisites). Then:

macOS/Linux:
```bash
cd backend
export JAVA_HOME="$(`/usr/libexec/java_home -v 17)`" && export PATH="$JAVA_HOME/bin:$PATH"
java -version  # Expected: 17.x
./mvnw -Dmaven.test.skip=true spring-boot:run
```

Windows (PowerShell):
```powershell
cd backend
$env:JAVA_HOME = "C:\\Program Files\\Java\\jdk-17"
$env:Path = "$env:JAVA_HOME\\bin;$env:Path"
java -version  # Expected: 17.x
./mvnw.cmd -Dmaven.test.skip=true spring-boot:run
```

Expected:
- Spring Boot banner appears.
- Tomcat started on port 5432.
- DB migrations execute automatically.
- Swagger UI at http://localhost:5432/swagger-ui/index.html

### 3) Start the ML service (Flask + TensorFlow)

Open a new terminal window/tab:

macOS/Linux:
```bash
cd cat-classificator
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip wheel setuptools
pip install flask flasgger pillow flask-cors tensorflow keras
python3 catdetector.py
```

Windows (PowerShell):
```powershell
cd cat-classificator
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip wheel setuptools
pip install flask flasgger pillow flask-cors tensorflow keras
python catdetector.py
```

Apple Silicon note: if `tensorflow` fails to install, use `tensorflow-macos` instead of `tensorflow`.

Expected:
- First run downloads VGG16 weights and prints a model summary.
- Flask runs on http://127.0.0.1:8000 (docs at /apidocs).

### 4) Start the frontend (Next.js)

Open another terminal window/tab:

```bash
cd frontend
printf "NEXT_PUBLIC_API_URL=http://localhost:5432\n" > .env
npm install
npm run dev
```

Windows (PowerShell):
```powershell
cd frontend
Set-Content -Path .env -Value "NEXT_PUBLIC_API_URL=http://localhost:5432"
npm install
npm run dev
```

Expected:
- Next.js dev server on http://localhost:3000
- “Sign In” uses the backend OAuth route at http://localhost:5432/oauth2/authorization/github (works if your GitHub OAuth app is configured).

## Quick verification

- Frontend loads: http://localhost:3000
- Backend Swagger: http://localhost:5432/swagger-ui/index.html
- ML docs: http://127.0.0.1:8000/apidocs
- Optional: test ML endpoint from another terminal:
  ```bash
  curl -F "image=@cat-classificator/cat3.jpeg" http://127.0.0.1:8000/predict
  ```

## One‑liner helper (optional)

There is a convenience script you can try after the first‑time setup:

```bash
./start.sh
```

Notes:
- It doesn’t create a Python venv or install Python packages; complete step 3 once before relying on this script.

## Troubleshooting

- Port 80 in use (Postgres):
  - Edit `docker-compose.yml` to use another host port, e.g. `5433:5432`.
  - Start Docker, then run the backend with an override:
    ```bash
    cd backend
    DB_URL=jdbc:postgresql://localhost:5433/postgres ./mvnw spring-boot:run
    ```
- Java version errors (e.g., `TypeTag :: UNKNOWN`):
  - Ensure you’re using Java 17 (see prerequisites to switch JAVA_HOME for your shell).
- Apple Silicon TensorFlow install issues:
  - Use `tensorflow-macos` instead of `tensorflow`.
- OAuth login failing:
  - The backend ships with example GitHub client settings. You may need to configure your own OAuth app or test non‑OAuth endpoints.
- Getting `dquote>` prompt in terminal:
  - This means there’s an unmatched quote from copy/paste. Press Ctrl+C to cancel the line, then paste and run the commands line‑by‑line without inline comments. The quickstart blocks above have comments moved outside the code blocks to avoid this.

## Shutdown / close everything

Follow these to stop all services cleanly:

1) Frontend terminal: press Ctrl+C
2) ML Flask terminal: press Ctrl+C (then `deactivate` if using venv)
3) Backend terminal: press Ctrl+C
4) Docker containers:
   ```bash
   docker compose down
   ```

## Contributors

<a href="https://github.com/Pauwul/PocketCats/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Pauwul/PocketCats"/>
</a>
