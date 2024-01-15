import React from 'react'
import ReactDOM from 'react-dom/client'
import UploadPage from './pages/UploadPage';
import DocumentationPage from './pages/DocumentationPage';
import '../app/globals.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UploadPage />, // <UploadPage /> is the temporary home page
  },
  {
    path: "docs/:docsId",
    element: <DocumentationPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
