import React from 'react'
import ReactDOM from 'react-dom/client'
import UploadPage from './pages/UploadPage';
import DocumentationPage from './pages/DocumentationPage';
import '../app/globals.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

const router = createBrowserRouter([
  {
    path: "/",
    element: <UploadPage />, // <UploadPage /> is the temporary home page
  },
  {
    path: "docs/:id",
    element: <DocumentationPage />,
  },
]);

const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
