# GitHub Actions Workflows

This directory contains automated workflows for continuous integration and deployment.

## Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)

Runs on every push and pull request to validate code quality and deploy changes.

**Jobs:**
- **Lint and Type Check**: Runs ESLint and TypeScript type checking
- **Test**: Runs Jest tests with coverage reporting
- **Build**: Builds the Next.js application
- **Security Audit**: Checks for dependency vulnerabilities
- **Deploy Production**: Deploys to Vercel production (main branch only)
- **Deploy Preview**: Creates preview deployments (PRs and non-main branches)
- **Docker Build**: Tests Docker image builds
- **Notify on Failure**: Creates GitHub issues when workflows fail

## Required GitHub Secrets

To enable automatic deployments to Vercel, add these secrets to your GitHub repository:

### How to Add Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each of the following secrets:

### Required Secrets

#### `VERCEL_TOKEN`
Your Vercel authentication token.

**How to get it:**
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click **Create Token**
3. Name it "GitHub Actions"
4. Copy the token and add it as a secret

#### `VERCEL_ORG_ID`
Your Vercel organization/team ID.

**How to get it:**
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel link` in your project directory
3. Follow the prompts to link your project
4. Find your Org ID in `.vercel/project.json` under `"orgId"`

Alternatively, you can find it in your Vercel dashboard URL:
- URL: `https://vercel.com/<org-id>/settings`

#### `VERCEL_PROJECT_ID`
Your Vercel project ID.

**How to get it:**
1. After running `vercel link`, find it in `.vercel/project.json` under `"projectId"`
2. Or go to your project settings in Vercel dashboard
3. The project ID is in the URL: `https://vercel.com/<org-id>/<project-id>/settings`

### Optional Secrets

These are optional but recommended for enhanced functionality:

#### `GITHUB_TOKEN`
Automatically provided by GitHub Actions. No need to add manually.

Used for:
- Commenting on PRs with preview URLs
- Creating issues on workflow failures
- Posting commit comments

## Workflow Triggers

### Automatic Triggers

- **Push to `main`**: Runs full CI/CD and deploys to production
- **Push to `develop`**: Runs full CI/CD and creates preview deployment
- **Push to `claude/**` branches**: Runs CI/CD for Claude Code branches
- **Pull Requests**: Runs CI/CD and creates preview deployment

### Manual Triggers

You can manually trigger workflows from the GitHub Actions tab:
1. Go to **Actions** tab in your repository
2. Select the workflow
3. Click **Run workflow**
4. Choose the branch

## Environment Configuration

### Production Environment

Create a `production` environment in GitHub:
1. Go to **Settings** → **Environments**
2. Click **New environment**
3. Name it `production`
4. Add protection rules (optional):
   - Required reviewers
   - Wait timer
   - Deployment branches (main only)

### Preview Environment

Create a `preview` environment (optional):
1. Same steps as production
2. Name it `preview`
3. Less restrictive rules for faster previews

## Customization

### Change Node.js Version

Edit the `NODE_VERSION` environment variable in `ci-cd.yml`:

```yaml
env:
  NODE_VERSION: '20'  # Change to your preferred version
```

### Disable Specific Jobs

Comment out jobs you don't need:

```yaml
# Comment out the entire job
# docker-build:
#   name: Docker Build Test
#   runs-on: ubuntu-latest
#   steps:
#     - ...
```

### Add Environment Variables

Add build-time environment variables in the build job:

```yaml
- name: Create env file for build
  run: |
    echo "NEXT_PUBLIC_APP_URL=https://trivector.ai" >> .env.production
    echo "NEXT_PUBLIC_CUSTOM_VAR=value" >> .env.production
```

### Modify Deployment Conditions

Change when deployments happen:

```yaml
# Deploy to production only on main branch
if: github.ref == 'refs/heads/main' && github.event_name == 'push'

# Deploy on any push to main or develop
if: (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop') && github.event_name == 'push'
```

## Monitoring Workflows

### View Workflow Runs

1. Go to **Actions** tab in your repository
2. Click on a workflow run to see details
3. Click on individual jobs to see logs

### Troubleshooting Failed Workflows

1. Check the job logs for error messages
2. Verify all required secrets are set correctly
3. Ensure the Vercel project is properly configured
4. Check that environment variables are correct

### Common Issues

#### "Invalid Vercel token"
- Regenerate your `VERCEL_TOKEN` in Vercel dashboard
- Update the secret in GitHub

#### "Project not found"
- Verify `VERCEL_PROJECT_ID` is correct
- Run `vercel link` locally and check `.vercel/project.json`

#### "Build failed"
- Check build logs for specific errors
- Ensure all required environment variables are set in Vercel
- Verify dependencies are correctly listed in package.json

#### "Tests failed"
- Review test logs for failing tests
- Run tests locally: `npm test`
- Fix failing tests before pushing

## Best Practices

1. **Always test locally first**: Run `npm run lint`, `npm test`, and `npm run build` before pushing
2. **Keep secrets secure**: Never commit secrets or tokens to the repository
3. **Use preview deployments**: Review changes in preview before merging to main
4. **Monitor workflow runs**: Check Actions tab regularly for failures
5. **Update dependencies**: Keep actions and dependencies up to date
6. **Use environment protection**: Add required reviewers for production deployments

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/concepts/git/vercel-for-github)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Creating encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## Support

If you encounter issues with workflows:
1. Check workflow logs in the Actions tab
2. Review this documentation
3. Check Vercel deployment logs
4. Create an issue in the repository with workflow run details
