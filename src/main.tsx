
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  // @ts-ignore - allow side-effect CSS import when no type declarations are present
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(<App />);
  