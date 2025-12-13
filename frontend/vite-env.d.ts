interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // otras variables que necesites
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
