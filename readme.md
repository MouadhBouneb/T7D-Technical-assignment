# T7D Voucher Management API

```bash
# 1. Clone repository
git clone https://github.com/MouadhBouneb/T7D-Technical-assignment.git
cd T7D-Technical-assignment 

# 2. Install dependencies
npm install

# 3. Configure environment
# Edit .env with your MongoDB URI and JWT secret

# 4. Seed database (creates admin user)
npm run seed

# 5. Run application
npm run dev  # Development mode
````
## 🏗️ System Architecture
[Client]
→ [API Layer]
├── Routes
└── Controllers
→ [Business Logic]
└── Services
→ [Data Access Layer]
└── Repositories
→ [MongoDB Database]
