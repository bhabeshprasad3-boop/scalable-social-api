# Scalable Social Media API 🚀

A production-ready backend engine for a social media platform, built with Node.js, Express, TypeScript, and MongoDB. Designed with clean architecture, robust security, and scalable data relations.

## ⚙️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** MongoDB & Mongoose
* **Storage:** Cloudinary & Multer (for media uploads)
* **Security:** JWT (JSON Web Tokens), bcrypt (Password Hashing)

## 🔥 Core Features
* **Authentication & Authorization:** Secure JWT-based login/register flow.
* **Media Uploads:** Middleware-level file handling with Multer and direct Cloudinary integration.
* **Advanced Aggregations:** Complex MongoDB pipelines (`$lookup`, `$project`) for optimized data retrieval and relations.
* **Pagination:** Server-side pagination for scalable feeds.
* **Interactive Relations:** Toggle Like/Unlike system with atomic database updates (`$inc`).
* **Security:** Ownership checks for deleting and updating resources (IDOR prevention).

## 🛠️ Local Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=your_access_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_secret
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   ### Step 3: Create the Repo on GitHub
1. Apne GitHub account pe jaa.
2. Top right corner mein **"+"** icon pe click kar aur **"New repository"** chun.
3. Naam daal (e.g., `scalable-social-api`).
4. **Public** select kar.
5. 🚨 **IMPORTANT:** "Add a README file" ya "Add .gitignore" par **TICK MAT KARNA**. Repo ekdum khali honi chahiye.
6. "Create repository" pe click kar. Tujhe ek URL milega (kuch aisa: `https://github.com/tera-username/scalable-social-api.git`). Usko copy kar le.

### Step 4: Terminal Commands (The Final Push)
Apne VS Code ke terminal mein jaa (ensure kar ki tu apne project ke root folder mein hai) aur line-by-line yeh commands chala:

```bash
# 1. Git ko initialize karo
git init

# 2. Saara code add karo (.gitignore wale ko chhod kar)
git add .

# 3. Pehla commit message likho
git commit -m "feat: complete social media backend engine with typescript and aggregations"

# 4. Branch ka naam 'main' set karo
git branch -M main

# 5. Apne GitHub repo ka URL link karo (Neeche wale URL ko apne copy kiye hue URL se replace kar)
git remote add origin https://github.com/tera-username/scalable-social-api.git

# 6. Code ko internet pe push maar do
git push -u origin main
