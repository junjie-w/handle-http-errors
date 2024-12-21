# handle-http-errors Examples

Examples of using [handle-http-errors](https://www.npmjs.com/package/handle-http-errors) package.

## 🚂 Run Examples

```bash
npm install

npm run dev:handler                 # Error handler usage
npm run dev:middleware              # Express middleware usage
npm run dev:custom-middleware       # Creating custom error-throwing middlewares
```

### 🔧 Error Handler Example

```bash
npm run dev:handler
```

#### 🌱 Test endpoints:

```bash
# Test NotFoundError
curl http://localhost:3001/with-handler

# Test ValidationError with invalid product ID
curl http://localhost:3001/products/abc

# Test NotFoundError with valid product ID
curl http://localhost:3001/products/123

# Test ValidationError with invalid product data
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"","price":-10}' \
  http://localhost:3001/products

# Test InternalServerError with valid product data
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":10}' \
  http://localhost:3001/products
```

### 🌐 Express Middleware Example

```bash
npm run dev:middleware
```

#### 🌱 Test endpoints:

```bash
# Test NotFoundError
curl http://localhost:3002/with-middleware

# Test ValidationError with invalid user ID
curl http://localhost:3002/users/abc

# Test NotFoundError with valid user ID
curl http://localhost:3002/users/123

# Test ValidationError with missing data
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{}' \
  http://localhost:3002/users/register

# Test ValidationError with invalid email
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","username":"test"}' \
  http://localhost:3002/users/register

# Test ValidationError with invalid username
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"a"}' \
  http://localhost:3002/users/register

# Test InternalServerError with valid data
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser"}' \
  http://localhost:3002/users/register
```

### 🛠️ Creating custom error-throwing middlewares

```bash
npm run dev:custom-middleware
```

#### 🌱 Test endpoints:

```bash
# Test UnauthorizedError without token
curl http://localhost:3003/users/123

# Test UnauthorizedError with invalid token
curl -H "Authorization: invalid-token" \
  http://localhost:3003/users/123

# Test ValidationError with valid token but invalid ID
curl -H "Authorization: valid-token" \
  http://localhost:3003/users/abc

# Test NotFoundError with valid token and valid ID
curl -H "Authorization: valid-token" \
  http://localhost:3003/users/123

# Test UnauthorizedError in registration
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"test"}' \
  http://localhost:3003/users/register

# Test ValidationError in registration
curl -X POST \
  -H "Authorization: valid-token" \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","username":"a"}' \
  http://localhost:3003/users/register

# Test ForbiddenError when creating admin users
curl -X POST \
  -H "Authorization: valid-token" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","username":"admin"}' \
  "http://localhost:3003/users/register?role=admin"

# Test successful registration
curl -X POST \
  -H "Authorization: valid-token" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser"}' \
  http://localhost:3003/users/register
```
