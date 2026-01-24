import { BASE_URL } from '@/App'
import { createFileRoute, Link } from '@tanstack/react-router'
import type { Post } from './t.$topic.index';
import { Box, Button, Container, Stack, Text } from '@chakra-ui/react';

export const Route = createFileRoute('/t/$topic/p/$post/')({
    component: RouteComponent,
    loader: async ({ params: { topic: topic_title, post: post_title } }) => {
        const res = await fetch(BASE_URL + `/topics/${topic_title}/posts/${post_title}`);
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || "Something went wrong");
        }
        const post: Post = data
        return { post };
    },
})

function RouteComponent() {
    const { post } = Route.useLoaderData();
    return (
        <Container maxWidth={1000}>
            <Stack>
                <Link to="/t/$topic" params={{topic: post.topic}}>
                    <Button>
                        ⬅️ From {post.topic}
                    </Button>
                </Link>
                <Text textStyle="4xl">
                    {post.title}
                </Text>
                <Text textStyle="sm">
                    {post.user_id}
                </Text>
                <Text>
                    {post.body}
                </Text>
            </Stack>
        </Container>
    )
}
