# 🧠 Architecture Decision Records (ADR)

## ADR 001: Use of Vite over CRA

- **Decision**: Vite was chosen over Create React App (CRA).
- **Reasoning**: 
  - **Faster build times**: Vite offers much quicker hot module replacement and overall faster builds compared to CRA.
  - **Better Developer Experience (DX)**: Vite’s modern configuration and faster refresh cycles significantly improve development speed.
  - **Future-ready**: Vite is becoming the modern standard for React projects, making it easier to keep up with new features and optimizations.

---

## ADR 002: Use of Supabase

- **Decision**: Supabase was chosen for backend services.
- **Reasoning**:
  - **Easy-to-use**: Supabase provides Postgres, Authentication, and API setups out-of-the-box, reducing development time.
  - **Fits well with micro SaaS**: Supabase is ideal for small-scale, rapidly deployable micro SaaS projects.
  - **Scalable**: As the project grows, Supabase offers a scalable database solution without complex configuration.

---

## ADR 003: Deploy via Lovable

- **Decision**: Lovable was chosen for deployment.
- **Reasoning**:
  - **GitHub integration**: Lovable integrates seamlessly with GitHub, enabling easy deployments directly from the repository.
  - **One-click deployment**: Optimized for Vite projects, it simplifies the deployment process.
  - **Cost-effective**: As a micro SaaS, Lovable offers a simple and affordable solution for deploying small-scale apps.

