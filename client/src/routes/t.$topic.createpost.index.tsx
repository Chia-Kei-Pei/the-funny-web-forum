import { BASE_URL } from '@/App'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import type { Post } from './t.$topic.index';
import { Box, Button, Container, Field, Flex, Input, Spacer, Spinner, Stack, Text, Textarea } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState, type FormEvent } from 'react';
import idRegex from '@/utils';

export const Route = createFileRoute('/t/$topic/createpost/')({
    component: RouteComponent,
    loader: async ({ params: { topic: topic_title } }) => {
        return { topic_title };
    }
})

function RouteComponent() {
    const { topic_title } = Route.useLoaderData();
    const refInput = useRef<HTMLInputElement | null>(null);
    const [newPostTitle, setPostTitle] = useState("");
    const [newPostBody, setPostBody] = useState("");
    const navigate = useNavigate();

    const errorFn = (error: any) => {
        alert(error.message);
        // TODO: turn errors into user feedback on the UI.
        // E.g. "A topic of this name already exists."
        // and "Topic name and description cannot be empty."
    }

    const { mutate: createPost, isPending: isCreating } = useMutation({
        mutationKey: ["createPost"],
        mutationFn: async (e: FormEvent) => {
            e.preventDefault();
            try {
                const res = await fetch(BASE_URL + `/topics/${topic_title}/posts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        topic: topic_title,
                        title: newPostTitle,
                        user_id: "thelegend27",
                        body: newPostBody,
                    })
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }

                return data;
            } catch (error: any) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            // https://borstch.com/snippet/navigating-programmatically-with-tanstack-router-while-preserving-type-safety
            navigate({
                to: '/t/$topic',
                params: {topic: topic_title}
            });
        },
        onError: errorFn
    });

    return (
        <Container maxWidth={1000}>
            <Link to="/t/$topic" params={{ topic: topic_title }}>
                <Button>
                    ⬅️ Back to {topic_title}
                </Button>
            </Link>
            <Text textStyle="4x1">
                Create New Post on {topic_title}
            </Text>
            <form onSubmit={createPost}>
                <Stack>
                    <Field.Root required>
                        <Input
                            placeholder="Title"
                            type='text'
                            value={newPostTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            ref={refInput}
                        />
                    </Field.Root>
                    <Textarea
                        placeholder="Description"
                        value={newPostBody}
                        onChange={(e) => setPostBody(e.target.value)}
                    />
                    <Flex>
                        <Spacer />
                        <Button type="submit">
                            {isCreating
                                ? <Spinner size={"xs"} />
                                : <Text>Confirm</Text>}
                        </Button>
                    </Flex>
                </Stack>
            </form>
        </Container>
    )
}
