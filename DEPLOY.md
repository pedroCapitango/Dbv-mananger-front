# 🚀 Guia de Deploy

## Opções de Deploy

### 1. 🔷 Vercel (Recomendado)

#### Vantagens
- Deploy automático via Git
- HTTPS grátis
- CDN global
- Preview de PRs
- Zero configuração

#### Deploy via CLI
```bash
# Instalar Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

#### Deploy via GitHub
1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Clique em "Import"
4. Configure:
   - Framework: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`
5. Adicione variáveis de ambiente
6. Deploy!

---

### 2. 🟢 Netlify

#### Deploy via CLI
```bash
# Instalar Netlify CLI
pnpm add -g netlify-cli

# Login
netlify login

# Inicializar
netlify init

# Deploy
netlify deploy

# Deploy para produção
netlify deploy --prod
```

#### Deploy via Drag & Drop
1. Build local: `pnpm build`
2. Acesse [app.netlify.com](https://app.netlify.com)
3. Arraste a pasta `dist`
4. Pronto!

#### netlify.toml
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. ☁️ AWS S3 + CloudFront

#### Passo 1: Build
```bash
pnpm build
```

#### Passo 2: Criar Bucket S3
```bash
aws s3 mb s3://desbravadores-app
aws s3 website s3://desbravadores-app --index-document index.html
```

#### Passo 3: Upload
```bash
aws s3 sync dist/ s3://desbravadores-app --acl public-read
```

#### Passo 4: CloudFront (Opcional)
- Criar distribuição
- Apontar para bucket S3
- Configurar certificado SSL

---

### 4. 🐳 Docker

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copiar package files
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm
RUN npm install -g pnpm

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copiar build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Build e Run
```bash
# Build image
docker build -t desbravadores-app .

# Run container
docker run -p 8080:80 desbravadores-app

# Acesse: http://localhost:8080
```

#### Docker Compose
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

---

### 5. 🌊 Digital Ocean

#### App Platform
1. Conecte seu repositório
2. Configure:
   ```yaml
   name: desbravadores-app
   region: nyc
   services:
   - name: web
     github:
       repo: pedroCapitango/Dbv-mananger-front
       branch: main
     build_command: pnpm build
     run_command: pnpm preview
     environment_slug: node-js
   ```

#### Droplet + Nginx
```bash
# SSH no droplet
ssh root@your-ip

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Instalar pnpm
npm install -g pnpm

# Clonar repositório
git clone https://github.com/pedroCapitango/Dbv-mananger-front.git
cd Dbv-mananger-front

# Build
pnpm install
pnpm build

# Instalar Nginx
apt install nginx

# Configurar Nginx
nano /etc/nginx/sites-available/desbravadores

# Copiar build para Nginx
cp -r dist/* /var/www/html/

# Restart Nginx
systemctl restart nginx
```

---

## 🔒 Variáveis de Ambiente

### Desenvolvimento (.env.local)
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Sistema Desbravadores (Dev)
```

### Produção (.env.production)
```env
VITE_API_BASE_URL=https://api.desbravadores.com/api/v1
VITE_APP_NAME=Sistema Desbravadores
VITE_ENV=production
```

### No Vercel/Netlify
1. Acesse Dashboard
2. Settings → Environment Variables
3. Adicione:
   - `VITE_API_BASE_URL`
   - `VITE_APP_NAME`

---

## ✅ Checklist de Deploy

### Antes do Deploy
- [ ] Remover console.logs desnecessários
- [ ] Testar build local (`pnpm build`)
- [ ] Verificar variáveis de ambiente
- [ ] Testar preview (`pnpm preview`)
- [ ] Verificar links e rotas
- [ ] Otimizar imagens
- [ ] Minificar assets

### Após o Deploy
- [ ] Testar no mobile
- [ ] Testar em diferentes navegadores
- [ ] Verificar performance (Lighthouse)
- [ ] Configurar analytics
- [ ] Configurar error tracking
- [ ] Configurar monitoramento

---

## 📊 Otimizações

### 1. Lighthouse Score

```bash
# Instalar
npm install -g lighthouse

# Rodar
lighthouse http://seu-site.com --view
```

**Metas:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### 2. Bundle Size

```bash
# Analisar bundle
pnpm add -D rollup-plugin-visualizer

# Adicionar ao vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({ open: true })
  ]
});
```

### 3. Code Splitting

```typescript
// Lazy load components
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Members = lazy(() => import('./pages/Members'));
```

---

## 🔍 Monitoramento

### Sentry (Error Tracking)

```bash
pnpm add @sentry/react
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-dsn",
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
});
```

### Google Analytics

```bash
pnpm add react-ga4
```

```typescript
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
ReactGA.send({ hitType: "pageview", page: window.location.pathname });
```

---

## 🚨 Troubleshooting

### Build falha no CI/CD

```bash
# Aumentar memória Node.js
NODE_OPTIONS=--max-old-space-size=4096 pnpm build
```

### Rotas não funcionam

**Vercel:** Criar `vercel.json`
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**Netlify:** Criar `_redirects` na pasta `public`
```
/*    /index.html   200
```

### Assets não carregam

Verificar `base` no `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/', // ou '/subpath/' se hospedar em subdiretório
});
```

---

## 📈 Performance Tips

1. **Lazy Load Images**
```typescript
<img loading="lazy" src="image.jpg" alt="..." />
```

2. **Preload Critical Assets**
```html
<link rel="preload" href="/fonts/font.woff2" as="font" />
```

3. **Use CDN para Assets**
```typescript
const imageUrl = 'https://cdn.example.com/image.jpg';
```

4. **Enable Compression**
```typescript
// No servidor/nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

---

## 🎯 Recomendações Finais

### Para Projetos Pequenos
✅ **Vercel** ou **Netlify** (Grátis, fácil, rápido)

### Para Projetos Médios
✅ **Digital Ocean** ou **AWS** (Mais controle, preço justo)

### Para Projetos Enterprise
✅ **AWS** com CloudFront (Escalável, global, robusto)

### Para Aprender
✅ **Docker** + **VPS** (Experiência completa)

---

## 📞 Próximos Passos

1. Escolha plataforma de deploy
2. Configure variáveis de ambiente
3. Faça deploy de teste
4. Configure domínio customizado
5. Configure HTTPS
6. Configure monitoramento
7. Configure backups

---

**Bom deploy! 🚀**
