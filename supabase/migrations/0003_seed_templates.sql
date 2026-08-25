-- ============================================
-- AI APP BUILDER — Seed Templates
-- Run this in Supabase SQL Editor after RLS migration
-- ============================================

INSERT INTO templates (id, name, description, category, files) VALUES
(
  'blank-react',
  'Blank React App',
  'Start from scratch with a minimal React + TypeScript + Tailwind setup.',
  'general',
  '{
    "src/App.tsx": {
      "content": "export default function App() {\n  return (\n    <div className=\"flex min-h-screen items-center justify-center bg-gray-50\">\n      <h1 className=\"text-4xl font-bold text-gray-900\">Hello World</h1>\n    </div>\n  );\n}",
      "visible": true
    },
    "src/main.tsx": {
      "content": "import React from \"react\";\nimport ReactDOM from \"react-dom/client\";\nimport App from \"./App\";\n\nReactDOM.createRoot(document.getElementById(\"root\")!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);",
      "visible": true
    },
    "src/index.css": {
      "content": "@tailwind base;\n@tailwind components;\n@tailwind utilities;",
      "visible": true
    }
  }'
),
(
  'landing-page',
  'Landing Page',
  'A modern, responsive landing page with hero, features, and CTA sections.',
  'marketing',
  '{
    "src/App.tsx": {
      "content": "import { Hero } from \"./components/Hero\";\nimport { Features } from \"./components/Features\";\nimport { CTA } from \"./components/CTA\";\n\nexport default function App() {\n  return (\n    <div className=\"min-h-screen bg-white\">\n      <Hero />\n      <Features />\n      <CTA />\n    </div>\n  );\n}",
      "visible": true
    },
    "src/components/Hero.tsx": {
      "content": "export function Hero() {\n  return (\n    <section className=\"relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white py-24\">\n      <div className=\"mx-auto max-w-4xl px-4 text-center\">\n        <h1 className=\"text-5xl font-bold tracking-tight text-gray-900\">\n          Build Something Amazing\n        </h1>\n        <p className=\"mt-6 text-lg text-gray-600\">\n          Start building your next great idea today with our powerful platform.\n        </p>\n        <button className=\"mt-8 rounded-lg bg-indigo-600 px-8 py-3 text-white hover:bg-indigo-700\">\n          Get Started\n        </button>\n      </div>\n    </section>\n  );\n}",
      "visible": true
    },
    "src/components/Features.tsx": {
      "content": "const features = [\n  { title: \"Fast\", desc: \"Lightning quick performance\" },\n  { title: \"Secure\", desc: \"Enterprise-grade security\" },\n  { title: \"Scalable\", desc: \"Grows with your business\" },\n];\n\nexport function Features() {\n  return (\n    <section className=\"py-20\">\n      <div className=\"mx-auto grid max-w-5xl gap-8 px-4 md:grid-cols-3\">\n        {features.map((f) => (\n          <div key={f.title} className=\"rounded-xl border p-6 text-center\">\n            <h3 className=\"text-xl font-semibold\">{f.title}</h3>\n            <p className=\"mt-2 text-gray-600\">{f.desc}</p>\n          </div>\n        ))}\n      </div>\n    </section>\n  );\n}",
      "visible": true
    },
    "src/components/CTA.tsx": {
      "content": "export function CTA() {\n  return (\n    <section className=\"bg-gray-900 py-20 text-center text-white\">\n      <h2 className=\"text-3xl font-bold\">Ready to start?</h2>\n      <button className=\"mt-6 rounded-lg bg-white px-8 py-3 text-gray-900 hover:bg-gray-100\">\n        Sign Up Free\n      </button>\n    </section>\n  );\n}",
      "visible": true
    },
    "src/main.tsx": {
      "content": "import React from \"react\";\nimport ReactDOM from \"react-dom/client\";\nimport App from \"./App\";\n\nReactDOM.createRoot(document.getElementById(\"root\")!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);",
      "visible": true
    },
    "src/index.css": {
      "content": "@tailwind base;\n@tailwind components;\n@tailwind utilities;",
      "visible": true
    }
  }'
),
(
  'todo-app',
  'Todo App',
  'A classic todo app with add, complete, delete, and filter functionality.',
  'app',
  '{
    "src/App.tsx": {
      "content": "import { useState } from \"react\";\n\ntype Todo = { id: number; text: string; done: boolean };\n\nexport default function App() {\n  const [todos, setTodos] = useState<Todo[]>([]);\n  const [input, setInput] = useState(\"\");\n\n  const addTodo = () => {\n    if (!input.trim()) return;\n    setTodos([...todos, { id: Date.now(), text: input, done: false }]);\n    setInput(\"\");\n  };\n\n  const toggle = (id: number) =>\n    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));\n\n  const remove = (id: number) => setTodos(todos.filter((t) => t.id !== id));\n\n  return (\n    <div className=\"mx-auto max-w-md py-10\">\n      <h1 className=\"mb-6 text-3xl font-bold\">Todo App</h1>\n      <div className=\"mb-4 flex gap-2\">\n        <input\n          value={input}\n          onChange={(e) => setInput(e.target.value)}\n          onKeyDown={(e) => e.key === \"Enter\" && addTodo()}\n          placeholder=\"Add a todo...\"\n          className=\"flex-1 rounded-lg border px-4 py-2\"\n        />\n        <button onClick={addTodo} className=\"rounded-lg bg-indigo-600 px-4 text-white\">\n          Add\n        </button>\n      </div>\n      <ul className=\"space-y-2\">\n        {todos.map((t) => (\n          <li key={t.id} className=\"flex items-center gap-3 rounded-lg border p-3\">\n            <input type=\"checkbox\" checked={t.done} onChange={() => toggle(t.id)} />\n            <span className={t.done ? \"line-through text-gray-400\" : \"\"}>{t.text}</span>\n            <button onClick={() => remove(t.id)} className=\"ml-auto text-red-500\">\n              Delete\n            </button>\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}",
      "visible": true
    },
    "src/main.tsx": {
      "content": "import React from \"react\";\nimport ReactDOM from \"react-dom/client\";\nimport App from \"./App\";\n\nReactDOM.createRoot(document.getElementById(\"root\")!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);",
      "visible": true
    },
    "src/index.css": {
      "content": "@tailwind base;\n@tailwind components;\n@tailwind utilities;",
      "visible": true
    }
  }'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-assets', 'project-assets', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('deployments', 'deployments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: user-avatars
DROP POLICY IF EXISTS "Avatars: own upload" ON storage.objects;
CREATE POLICY "Avatars: own upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'user-avatars' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Avatars: public read" ON storage.objects;
CREATE POLICY "Avatars: public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

DROP POLICY IF EXISTS "Avatars: own update" ON storage.objects;
CREATE POLICY "Avatars: own update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'user-avatars' AND auth.uid() = owner);

-- Storage policies: project-assets
DROP POLICY IF EXISTS "Assets: own upload" ON storage.objects;
CREATE POLICY "Assets: own upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-assets' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Assets: own read" ON storage.objects;
CREATE POLICY "Assets: own read" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-assets' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Assets: own delete" ON storage.objects;
CREATE POLICY "Assets: own delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'project-assets' AND auth.uid() = owner);

-- Storage policies: deployments (public read, auth write)
DROP POLICY IF EXISTS "Deployments: own upload" ON storage.objects;
CREATE POLICY "Deployments: own upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'deployments' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Deployments: public read" ON storage.objects;
CREATE POLICY "Deployments: public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'deployments');

DROP POLICY IF EXISTS "Deployments: own update" ON storage.objects;
CREATE POLICY "Deployments: own update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'deployments' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Deployments: own delete" ON storage.objects;
CREATE POLICY "Deployments: own delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'deployments' AND auth.uid() = owner);
