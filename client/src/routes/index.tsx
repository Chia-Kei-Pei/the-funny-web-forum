import { Button, Center, Stack, Text } from '@chakra-ui/react'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <Center h="80vh">
            <Stack alignItems="center">
                <Text fontSize={100} fontWeight="bold" fontFamily="mono">
                    the funny🤣
                </Text>
                <Link to="/explore_topics">
                    <Button>
                        Explore Topics
                    </Button>
                </Link>
            </Stack>
            <Outlet />
        </Center>
    )
}
