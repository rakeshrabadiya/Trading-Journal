const { contextBridge } = require("electron");

// Expose a minimal, safe API surface for renderer if needed later.
contextBridge.exposeInMainWorld("electronAPI", {});

