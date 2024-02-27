import React from 'react'
import ReactDOM from 'react-dom/client'
import { initializeApp } from 'firebase/app';
import ProtectedRoute from './utils/ProtectedRoute';
import LandingPage from './pages/LandingPage';
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
import { DocumentationProvider } from './utils/Context';
import DashboardPage from './pages/DashboardPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute component={DashboardPage} />,
  },
  {
    path: "/repos/:repoId",
    element: <DocumentationProvider><ProtectedRoute component={DocumentationPage} /></DocumentationProvider>,
  },
  // {
  //   path: "/repos/:repoId/:fileId",
  //   element: <DocumentationProvider><ProtectedRoute component={DocumentationPage} /></DocumentationProvider>,
  // },
  {
    path: "/file-docs/:fileId",
    element: <DocumentationProvider><ProtectedRoute component={DocumentationPage} /></DocumentationProvider>,
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


const firebaseConfig = {
  apiKey: "AIzaSyAeui52KEjzjKtx5k19hrt2GY0pYNYBGkI",
  authDomain: "rocket-docs-66adc.firebaseapp.com",
  projectId: "rocket-docs-66adc",
  storageBucket: "rocket-docs-66adc.appspot.com",
  messagingSenderId: "34092373207",
  appId: "1:34092373207:web:6acf707f0ce95dc8f88c92"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
