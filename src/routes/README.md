# Folder `structure` and example `writing`
    .
    ├── ...
    ├── routes
    │   ├── v1
    │   └── └── users.ts
    └── ...

```typescript
// users.ts
export const example: RouteTree = {
  path: 'example',
  children: [
    {
      path: '/',
      module: ExampleModule
    }
  ]
}
```
