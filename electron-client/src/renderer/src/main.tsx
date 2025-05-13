import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import LandingPage from '@/pages/LandingPage'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import { QueryClient, QueryClientProvider } from 'react-query'
import Layout from '@/layouts/layout'
import ProtectedRoute from '@/layouts/ProtectedRoute'
import RegistrationPage from '@/pages/RegistrationPage'
import SidebarLayout from '@/layouts/sidebar-layout'
import FriendsPage from '@/pages/FriendsPage'
import MessagePage from '@/pages/MessagePage'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegistrationPage />} />
                    </Route>
                    <Route element={<ProtectedRoute />}>
                        <Route element={<SidebarLayout />}>
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/home/friends" element={<FriendsPage />} />
                            <Route path="/home/message/:id" element={<MessagePage />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
)
