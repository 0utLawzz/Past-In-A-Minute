// index.ts
// Remotion ka standard entry point — bas Root ko register karta hai.
// Ise haath lagane ki zaroorat nahi.

import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
