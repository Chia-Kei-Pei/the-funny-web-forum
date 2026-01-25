import { BASE_URL } from "@/App";
import PostItem from "@/components/Post/PostItem";
import { Button, Container, Flex, Spacer, Spinner, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { Topic } from "./explore_topics";

export type Post = {
    ID: number;
    topic_title: string;
    title: string;
    user_name: string;
    body: string;
};

export const Route = createFileRoute('/t/$topic/')({
    component: TopicPageComponent,
    loader: async ({ params: { topic: title } }) => {
        const res = await fetch(BASE_URL + `/topics/${title}`);
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || "Something went wrong");
        }
        const topic : Topic = data
        return { topic };
    },
});

function TopicPageComponent() {
    const { topic } = Route.useLoaderData();
    const { data: posts, isLoading } = useQuery<Post[]>({
        queryKey: ["posts"],
        queryFn: async () => {
            try {
                const res = await fetch(BASE_URL + `/topics/${topic.title}/posts`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data || [];
            } catch (error) {
                console.log(error);
            }
        },
    });

    return (
        <Container maxWidth={1000}>
            <Link to="/explore_topics">
                <Button>
                    ⬅️ Back to Explore Topics
                </Button>
            </Link>
            <Text textStyle="4xl" paddingY={4}>
                topic: {topic.title}
            </Text>
            <Text>
                {topic.description}
            </Text>
            
            <Flex alignItems={"center"}>
                <Text fontSize={"2xl"} textTransform={"uppercase"} fontWeight={"bold"} my={2}>
                    Explore Posts
                </Text>
                <Spacer />
                <Link to="/t/$topic/createpost" params={{topic: topic.title}}>
                    <Button>
                        Create Post
                    </Button>
                </Link>
                {/* <TopicFormDialog.Viewport /> // TODO: Create a Post Form */}
            </Flex>

            {isLoading && (
                <Flex justifyContent={"center"} my={4}>
                    <Spinner size={"xl"} />
                </Flex>
            )}
            {!isLoading && posts?.length === 0 && (
                <Stack alignItems={"center"} gap='3'>
                    <Text fontSize={"xl"} textAlign={"center"} color={"gray.500"}>
                        No posts found 😔
                    </Text>
                </Stack>
            )}
            <Stack gap={4}>
                {posts?.map((post) => (
                    <PostItem key={post.ID} post={post} />
                ))}
            </Stack>
        </Container>
    );
}
