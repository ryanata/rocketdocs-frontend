import React from 'react'
import ReactDOM from 'react-dom/client'
import UploadPage from './pages/UploadPage';
import DocumentationPage from './pages/DocumentationPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
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
  {
    path: "login",
    element: <LoginPage/>
  },
  {
    path:"signup",
    element: <SignUpPage/>
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
