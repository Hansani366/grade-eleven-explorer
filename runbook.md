# ⚙️ Operations Runbook

## 💥 Incident Response

- **Monitor GitHub Action build failures**: Regularly check the status of builds in GitHub Actions to identify failures.
- **Revert to previous commit** if the live deployment is broken: If an issue arises in production, revert to the last working commit.
- **Maintain changelog via Conventional Commits**: Follow conventional commit guidelines to ensure changes are properly tracked and documented.

---

## 🔐 Backup Strategy

- **Supabase**: Automatic daily backups of the PostgreSQL database are handled by Supabase.
- **GitHub repo**: The repository is backed up through Git, and commits are stored in version control.

---

## 📊 Monitoring

- **Use Sentry or LogRocket** (optional) to monitor and report runtime errors.
- **Manually verify core features** after each deployment to ensure the application is functioning as expected.

---

## 🛠 Deployment Steps

1. **Push to the main branch**: Ensure all code is pushed to the `main` branch for production deployment.
2. **GitHub Actions**: The build process is automated through GitHub Actions, which will handle testing, building, and deploying to Lovable.
