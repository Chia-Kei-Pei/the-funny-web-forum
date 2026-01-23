import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import NavBar from '@/components/Title/Navbar'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <React.Fragment>
            <NavBar />
            <Outlet />
            <TanStackRouterDevtools/>
        </React.Fragment>
    )
}
