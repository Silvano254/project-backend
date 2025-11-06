# Contributing to Jirani Mwema Backend

Thank you for considering contributing to the Jirani Mwema project! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Follow professional communication standards
- Focus on constructive feedback
- Help create a welcoming environment for all contributors

## Getting Started

1. **Fork the repository**
   ```bash
   git fork <repository-url>
   ```

2. **Clone your fork**
   ```bash
   git clone <your-fork-url>
   cd jirani_mwema_backend
   ```

3. **Set up the development environment**
   ```bash
   cd functions
   npm install
   cp .env.example .env
   # Configure your .env file
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Making Changes

1. **Write clean, readable code**
   - Follow existing code style and conventions
   - Use meaningful variable and function names
   - Add comments for complex logic
   - Keep functions small and focused

2. **Follow the project structure**
   ```
   controllers/  - Handle HTTP requests and responses
   models/       - Define Mongoose schemas
   routes/       - Define API endpoints
   services/     - Business logic and external integrations
   middleware/   - Custom Express middleware
   utils/        - Helper functions
   ```

3. **Test your changes**
   - Write unit tests for new functions
   - Test API endpoints manually
   - Ensure existing tests still pass

### Code Style Guidelines

#### JavaScript/Node.js
- Use ES6+ features (const, let, arrow functions, async/await)
- Use semicolons
- Use single quotes for strings
- Indent with 2 spaces
- Use camelCase for variables and functions
- Use PascalCase for classes and constructors

#### Example:
```javascript
// Good
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

// Avoid
function getUser(id) {
  User.findById(id, function(err, user) {
    if (err) throw err;
    return user;
  });
}
```

### API Endpoint Guidelines

1. **Use RESTful conventions**
   - GET - Retrieve resources
   - POST - Create resources
   - PUT - Update resources (full update)
   - PATCH - Partial updates
   - DELETE - Remove resources

2. **Use consistent response formats**
   ```javascript
   // Success response
   res.status(200).json({
     success: true,
     data: result
   });

   // Error response
   res.status(400).json({
     success: false,
     error: 'Error message'
   });
   ```

3. **Validate input data**
   ```javascript
   if (!req.body.amount || req.body.amount <= 0) {
     return res.status(400).json({
       success: false,
       error: 'Invalid amount'
     });
   }
   ```

### Database Guidelines

1. **Define clear schemas**
   ```javascript
   const loanSchema = new mongoose.Schema({
     amount: {
       type: Number,
       required: true,
       min: 0
     },
     status: {
       type: String,
       enum: ['pending', 'approved', 'rejected'],
       default: 'pending'
     }
   }, { timestamps: true });
   ```

2. **Use indexes for frequently queried fields**
   ```javascript
   loanSchema.index({ userId: 1, status: 1 });
   ```

3. **Handle errors properly**
   ```javascript
   try {
     await loan.save();
   } catch (error) {
     if (error.code === 11000) {
       return res.status(409).json({
         success: false,
         error: 'Duplicate entry'
       });
     }
     throw error;
   }
   ```

### Testing

1. **Write unit tests for services**
   ```javascript
   describe('LoanService', () => {
     it('should calculate interest correctly', () => {
       const loan = { amount: 1000, rate: 0.05 };
       const interest = calculateInterest(loan);
       expect(interest).toBe(50);
     });
   });
   ```

2. **Test API endpoints**
   ```javascript
   describe('POST /api/loans', () => {
     it('should create a new loan request', async () => {
       const response = await request(app)
         .post('/api/loans')
         .send({ amount: 5000, purpose: 'Business' })
         .expect(201);
       
       expect(response.body.success).toBe(true);
     });
   });
   ```

### Commit Guidelines

Follow conventional commits:

```
feat: Add welfare request approval endpoint
fix: Resolve OTP expiration issue
docs: Update API documentation
style: Format code with prettier
refactor: Simplify loan calculation logic
test: Add tests for contribution service
chore: Update dependencies
```

### Pull Request Process

1. **Update documentation**
   - Update README.md if needed
   - Add/update API documentation
   - Include inline code comments

2. **Ensure all tests pass**
   ```bash
   npm test
   ```

3. **Create a pull request**
   - Use a clear, descriptive title
   - Describe what changes were made and why
   - Reference any related issues
   - Include screenshots for UI changes (if applicable)

4. **Pull request template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## How has this been tested?
   Describe your testing process

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] Tests added/updated
   - [ ] All tests passing
   ```

5. **Wait for review**
   - Address review comments
   - Make requested changes
   - Update the PR

## Reporting Issues

### Bug Reports

Include:
- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (Node version, OS, etc.)
- Error messages/logs
- Screenshots if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use case and benefits
- Proposed implementation (optional)
- Alternative solutions considered

## Security

- **Never commit sensitive data** (.env files, API keys, passwords)
- **Report security vulnerabilities privately** to the maintainers
- **Use environment variables** for configuration
- **Validate and sanitize** all user inputs
- **Follow OWASP** security best practices

## Questions?

- Check existing documentation
- Search closed issues
- Ask in discussions
- Contact maintainers

Thank you for contributing to Jirani Mwema! 🎉
