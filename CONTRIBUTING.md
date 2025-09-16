# Contributing to Flag Football Play Designer

Thank you for your interest in contributing to the Flag Football Play Designer! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - Browser and version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features

1. **Open a feature request** issue
2. **Describe the use case** and why it would be valuable
3. **Provide mockups or examples** if possible
4. **Consider implementation complexity**

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Follow coding standards** (see below)
4. **Write tests** for new functionality
5. **Update documentation** as needed
6. **Submit a pull request**

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+
- Git
- Modern web browser

### Local Development
```bash
# Clone your fork
git clone https://github.com/yourusername/flagfootballdesigner.git
cd flagfootballdesigner

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests (when available)
npm test
```

## 📝 Coding Standards

### JavaScript/React
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Use TypeScript types where beneficial

### CSS/Styling
- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain print stylesheet compatibility
- Use semantic class names for custom CSS

### File Organization
- Keep components in `/src/components/`
- One component per file
- Use PascalCase for component files
- Group related functionality

### Git Workflow
- Use descriptive commit messages
- Follow conventional commits format
- Keep commits focused and atomic
- Rebase feature branches before merging

## 🧪 Testing Guidelines

### Component Testing
- Test user interactions
- Verify state changes
- Check prop handling
- Test error conditions

### Integration Testing
- Test component interactions
- Verify data flow
- Test localStorage functionality
- Check print/export features

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex algorithms
- Explain business logic
- Include usage examples

### User Documentation
- Update README for new features
- Add screenshots for UI changes
- Document configuration options
- Provide troubleshooting guides

## 🎨 Design Guidelines

### UI/UX Principles
- Maintain consistency with existing design
- Follow accessibility best practices
- Ensure mobile responsiveness
- Keep interfaces intuitive

### Visual Design
- Use consistent color scheme
- Maintain proper contrast ratios
- Follow spacing guidelines
- Use appropriate typography

## 🔍 Code Review Process

### Pull Request Requirements
- Clear description of changes
- Reference related issues
- Include screenshots for UI changes
- Pass all automated checks

### Review Criteria
- Code quality and style
- Functionality and testing
- Documentation updates
- Performance considerations

## 🚀 Release Process

### Version Management
- Follow semantic versioning
- Update CHANGELOG.md
- Tag releases appropriately
- Document breaking changes

### Deployment
- Test in multiple browsers
- Verify print functionality
- Check mobile responsiveness
- Validate accessibility

## 📋 Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📞 Getting Help

- Open a discussion for questions
- Join our community chat (if available)
- Review existing documentation
- Check the FAQ section

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Flag Football Play Designer better! 🏈
