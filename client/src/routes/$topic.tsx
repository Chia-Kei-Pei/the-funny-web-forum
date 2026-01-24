import { BASE_URL } from "@/App";
import { Container, Text } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/$topic')({
    component: TopicPageComponent,
    loader: async ({ params: { topic: title } }) => {
        const res = await fetch(BASE_URL + `/topics/${title}`);
        const topic = await res.json();
        if (!res.ok) {
            throw new Error(topic.error || "Something went wrong");
        }
        return { topic };
    },
});

function TopicPageComponent() {
    const { topic } = Route.useLoaderData();
    return (
        <Container maxWidth={1000}>
            <Text textStyle="4xl">
                topic: {topic.title}
            </Text>
            <Text>
                {topic.description}
            </Text>
            
        </Container>
    );
}
