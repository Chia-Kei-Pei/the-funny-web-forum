import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const BASE_URL = "http://localhost:5000/api";

const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultStaleTime: 5000,
    scrollRestoration: true,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

function App() {
    return <RouterProvider router={router} />;

//   return (
//     <Stack h="100vh" padding="10">
//       <NavBar />
//       <Container spaceY="4">
//         <TopicList />
//       </Container>
//     </Stack>
//   )
}

export default App
