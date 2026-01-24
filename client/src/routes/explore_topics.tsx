import { createFileRoute } from '@tanstack/react-router'
import { Button, Container, Flex, Spacer, Spinner, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import TopicFormDialog from '@/components/Topic/TopicFormDialog';
import TopicItem from '@/components/Topic/TopicItem';
import { BASE_URL } from '@/App';

export type Topic = {
    title: string;
    description: string;
};

export const Route = createFileRoute('/explore_topics')({
    component: TopicListComponent,
})

function TopicListComponent() {
    const { data: topics, isLoading } = useQuery<Topic[]>({
        queryKey: ["topics"],
        queryFn: async () => {
            try {
                const res = await fetch(BASE_URL + `/topics`);
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
            <Flex alignItems={"center"}>
                <Text fontSize={"4xl"} textTransform={"uppercase"} fontWeight={"bold"} my={2}>
                    Explore Topics
                </Text>
                <Spacer />
                <Button
                    onClick={() => {
                        TopicFormDialog.open("form", { isNew: true })
                    }}
                >
                    Create Topic
                </Button>
                <TopicFormDialog.Viewport />
            </Flex>

            {isLoading && (
                <Flex justifyContent={"center"} my={4}>
                    <Spinner size={"xl"} />
                </Flex>
            )}
            {!isLoading && topics?.length === 0 && (
                <Stack alignItems={"center"} gap='3'>
                    <Text fontSize={"xl"} textAlign={"center"} color={"gray.500"}>
                        No topics found 😔
                    </Text>
                </Stack>
            )}
            <Stack gap={4}>
                {topics?.map((topic) => (
                    <TopicItem key={topic.title} topic={topic} />
                ))}
            </Stack>
        </Container>
    );
}
