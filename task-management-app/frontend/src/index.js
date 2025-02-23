import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
var container = document.getElementById('root');
var root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
