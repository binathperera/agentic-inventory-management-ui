# Developer Quick Start Guide

## 5-Minute Setup

### 1. Understanding the Flow (2 min)

When your app loads with a subdomain:

```
http://acme.localhost:5173
         ↓
TenantContext detects "acme"
         ↓
Calls: GET /api/tenant-config/by-subdomain/acme
         ↓
If 200 OK → Store config, render app
If 400/404 → Show marketing page
```

### 2. Using Tenant Config (1 min)

In any component:

```tsx
import { useTenant } from "../contexts/TenantContext";

function MyComponent() {
  const { config } = useTenant();

  return <h1>{config?.brand?.name}</h1>;
}
```

### 3. Testing Locally (2 min)

```bash
# 1. Add to hosts file (Windows: C:\Windows\System32\drivers\etc\hosts)
127.0.0.1 acme.localhost

# 2. Start backend
cd backend
mvn spring-boot:run

# 3. Start frontend
cd frontend
npm run dev

# 4. Visit
http://acme.localhost:5173
```

## Common Tasks

### Show Logo from Config

```tsx
const { config } = useTenant();
return <img src={config?.brand?.logoUrl} alt="Logo" />;
```

### Use Brand Color

```tsx
const { config } = useTenant();
return <button style={{ color: config?.brand?.primaryColor }}>Click me</button>;
```

### Check if Feature is Enabled

```tsx
const { config } = useTenant();
if (!config?.features?.reportingModule) {
  return null;
}
return <ReportingComponent />;
```

### Get Current Subdomain

```tsx
const { subdomain } = useTenant();
console.log("Subdomain:", subdomain); // "acme" or null
```

### Manually Fetch Config

```tsx
const { fetchConfigBySubdomain } = useTenant();

async function refreshConfig() {
  try {
    await fetchConfigBySubdomain("acme");
  } catch (error) {
    console.error("Failed to fetch:", error);
  }
}
```

## File Reference

| File                                    | Purpose        | Edit?                  |
| --------------------------------------- | -------------- | ---------------------- |
| `src/contexts/TenantContext.tsx`        | Core logic     | ❌ Only if needed      |
| `src/components/SubdomainValidator.tsx` | Validation     | ❌ Only if needed      |
| `src/pages/Marketing.tsx`               | Error page     | ✅ Customize messaging |
| `src/styles/Marketing.css`              | Styling        | ✅ Customize colors    |
| `src/App.tsx`                           | Provider setup | ❌ Already done        |

## Configuration Object

Quick reference of what's available:

```typescript
config = {
  id: "123", // Tenant ID
  brand: {
    name: "Company Name", // Display name
    logoUrl: "https://...", // Logo image
    faviconUrl: "https://...", // Tab icon
    bannerUrl: "https://...", // Banner image
    primaryColor: "#667eea", // Main color
    secondaryColor: "#764ba2", // Secondary color
    fontFamily: "Arial, sans-serif", // Font
  },
  uiTheme: {
    mode: "light", // light | dark | auto
    accentColor: "#667eea",
    layoutStyle: "comfortable", // compact | comfortable | spacious
    cornerStyle: "rounded", // rounded | sharp | smooth
  },
  localization: {
    language: "en",
    timezone: "UTC",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
  },
  features: {
    inventoryModule: true,
    reportingModule: true,
    supplierManagement: true,
    advancedPricing: false,
  },
};
```

## Debugging

### Check if Config Loaded

```tsx
const { config, loading, error, subdomain } = useTenant();

console.log("Subdomain:", subdomain); // "acme" or null
console.log("Loading:", loading); // true | false
console.log("Error:", error); // null | error message
console.log("Config:", config); // Full object or null
```

### Browser DevTools

1. Open DevTools (F12)
2. Go to **Application** tab
3. Look for **sessionStorage**
4. Find **tenantConfig** entry
5. Should show the config JSON

### Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Reload page
4. Look for request to `/api/tenant-config/by-subdomain/*`
5. Check response status (should be 200 or 400)

## Troubleshooting

### Problem: Config is null

**Solution:** Check if you have a subdomain in URL

```
✓ http://acme.localhost:5173      → config loads
✗ http://localhost:5173           → config is null (expected)
```

### Problem: Redirects to marketing page

**Solution:** Check backend response

```bash
# Test endpoint
curl http://localhost:8080/api/tenant-config/by-subdomain/acme

# Should return 200 OK + JSON, not 400/404
```

### Problem: "subdomain not found" error

**Solution:** Subdomain doesn't exist in backend

- Create the subdomain in backend
- Or test with existing subdomain

### Problem: Component not rendering

**Solution:** Make sure component is inside TenantProvider

```tsx
// ❌ Wrong - TenantProvider is outer
function Component() {
  const { config } = useTenant(); // Error!
}

// ✅ Right - Inside TenantProvider
<TenantProvider>
  <Component />
</TenantProvider>;
```

## Development Workflow

```
1. Edit component to use config
2. Import useTenant hook
3. Call useTenant() to get config
4. Use config?.field to access values
5. Test with valid subdomain
6. Check DevTools to verify config loads
7. Test with invalid subdomain (should show marketing page)
8. Done!
```

## Code Snippet Library

### Initialize Component with Config

```tsx
import { useTenant } from "../contexts/TenantContext";

export function Header() {
  const { config, loading } = useTenant();

  if (loading) return <div>Loading header...</div>;

  return (
    <header
      style={{
        background: config?.brand?.primaryColor,
      }}
    >
      <img src={config?.brand?.logoUrl} alt="Logo" />
      <h1>{config?.brand?.name}</h1>
    </header>
  );
}
```

### Conditional Rendering Based on Features

```tsx
export function Dashboard() {
  const { config } = useTenant();

  return (
    <div>
      <h1>Dashboard</h1>

      {config?.features?.inventoryModule && <InventorySection />}

      {config?.features?.reportingModule && <ReportingSection />}

      {config?.features?.supplierManagement && <SuppliersSection />}
    </div>
  );
}
```

### Apply Theme Globally

```tsx
export function ThemeProvider({ children }) {
  const { config } = useTenant();

  const style = `
    :root {
      --primary: ${config?.brand?.primaryColor};
      --secondary: ${config?.brand?.secondaryColor};
      --accent: ${config?.uiTheme?.accentColor};
      --font: ${config?.brand?.fontFamily};
    }
  `;

  return (
    <>
      <style>{style}</style>
      {children}
    </>
  );
}
```

### Error Boundary for Config

```tsx
export function ConfigAware({ children }) {
  const { config, error } = useTenant();

  if (error) {
    return <div>Configuration error: {error}</div>;
  }

  return config ? children : null;
}
```

## API Integration

Your backend must provide:

```java
@GetMapping("/by-subdomain/{subDomain}")
public ResponseEntity<TenantConfig> getConfigBySubDomain(
    @PathVariable String subDomain
) {
    // Find tenant by subdomain
    TenantConfig config = service.getBySubdomain(subDomain);

    // Return 200 OK if found
    // Return 400 Bad Request if not found
    return ResponseEntity.ok(config);
}
```

## Performance Tips

✅ **Good:** Use config values directly

```tsx
const { config } = useTenant();
return <div style={{ color: config?.brand?.primaryColor }} />;
```

❌ **Avoid:** Constant re-fetching

```tsx
// Don't do this in useEffect
useEffect(() => {
  fetchConfigBySubdomain("acme"); // Called every render!
}, []);
```

✅ **Good:** Memoize computed values

```tsx
const themeColor = useMemo(
  () => config?.brand?.primaryColor,
  [config?.brand?.primaryColor]
);
```

## Testing Subdomains

### Add test subdomains to hosts file

**Windows:** `C:\Windows\System32\drivers\etc\hosts`

```
127.0.0.1 acme.localhost
127.0.0.1 test.localhost
127.0.0.1 demo.localhost
```

**Mac:** `/etc/hosts`

```bash
sudo nano /etc/hosts
# Add:
127.0.0.1 acme.localhost
127.0.0.1 test.localhost
```

**Linux:** `/etc/hosts`

```bash
sudo nano /etc/hosts
# Add:
127.0.0.1 acme.localhost
127.0.0.1 test.localhost
```

### Test URLs

- `http://acme.localhost:5173` - Test acme tenant
- `http://test.localhost:5173` - Test test tenant
- `http://demo.localhost:5173` - Test demo tenant
- `http://localhost:5173` - Test default (no tenant)

## Documentation

- 📖 [Full Implementation Guide](SUBDOMAIN_IMPLEMENTATION.md)
- 📋 [Quick Reference](TENANT_CONFIG_QUICK_REF.md)
- 📐 [Architecture Diagram](ARCHITECTURE_DIAGRAM.md)
- ✅ [Testing Checklist](IMPLEMENTATION_CHECKLIST.md)
- 📝 [Implementation Summary](IMPLEMENTATION_SUMMARY.md)

## Getting Help

1. **Check docs first** - Most questions answered there
2. **Review code** - Look at components using useTenant()
3. **Debug in browser** - Check DevTools > Application
4. **Test backend** - Verify endpoint returns correct response
5. **Check console** - Look for error messages

## Next Steps

1. ✅ Understand the flow (done)
2. ✅ Learn the API (done)
3. → Start using `useTenant()` in your components
4. → Test with your backend
5. → Deploy to staging

---

**You're ready to go! Start integrating tenant config into your components.** 🚀
