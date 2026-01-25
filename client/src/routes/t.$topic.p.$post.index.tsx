import { BASE_URL } from '@/App'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import type { Post } from './t.$topic.index';
import { Box, Button, Container, Field, Flex, Input, Spacer, Spinner, Stack, Text, Textarea } from '@chakra-ui/react';
import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PostDeleteDialog from '@/components/Post/PostDeleteDialog';
import CommentItem from '@/components/Comment/CommentItem';

export type Comment = {
    ID: number;
    post_id: string;
    user_name: string;
    body: string;
};

export const Route = createFileRoute('/t/$topic/p/$post/')({
    component: RouteComponent,
    loader: async ({ params: { topic: topic_title, post: post_id } }) => {
        const res = await fetch(BASE_URL + `/posts/${post_id}`);
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
    const [newPostTitle, setPostTitle] = useState(post.title);
    const [newPostBody, setPostBody] = useState(post.body);
    const [isEditMode, setIsEditMode] = useState(false);

    const queryClient = useQueryClient();

    const { data: comments, isLoading } = useQuery<Comment[]>({
        queryKey: ["comments"],
        queryFn: async () => {
            try {
                const res = await fetch(BASE_URL + `/posts/${post.ID}/comments`);
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

    const successFn = () => {
        setIsEditMode(false);
        queryClient.invalidateQueries({ queryKey: ["posts"] }); // refresh the list
    };

    const errorFn = (error: any) => {
        alert(error.message);
        // TODO: turn errors into user feedback on the UI.
        // E.g. "A topic of this name already exists."
        // and "Topic name and description cannot be empty."
    };

    const { mutate: editPost, isPending } = useMutation({
        mutationKey: ["editPost"],
        mutationFn: async (e: FormEvent) => {
            // e.preventDefault(); // need to refresh page to see changes so this is commented out
            try {
                const res = await fetch(BASE_URL + `/posts/${post.ID}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ID: post.ID,
                        topic_title: post.topic_title,
                        title: newPostTitle,
                        user_name: "thelegend27",
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
        onSuccess: successFn,
        onError: errorFn,
    });

    return (
        <Container maxWidth={1000}>
            <Link to="/t/$topic" params={{ topic: post.topic_title }}>
                <Button>
                    ⬅️ Back to {post.topic_title}
                </Button>
            </Link>
            {!isEditMode && (
                <Stack>
                    <Text textStyle="4xl">
                        {newPostTitle}
                    </Text>
                    <Text textStyle="sm">
                        {post.user_name}
                    </Text>
                    <Text>
                        {newPostBody}
                    </Text>
                </Stack>
            )}
            {isEditMode && (
                <form onSubmit={editPost}>
                    <Stack>
                        <Field.Root required>
                            <Input
                                placeholder="Title"
                                type='text'
                                value={newPostTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
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
                                {isPending
                                    ? <Spinner size={"xs"} />
                                    : <Text>Confirm</Text>}
                            </Button>
                        </Flex>
                    </Stack>
                </form>
            )}
            {!isEditMode && (
                <Flex>
                    <Spacer />
                    <Button onClick={() => setIsEditMode(true)}>
                        Edit
                    </Button>
                    <Button onClick={() => PostDeleteDialog.open("alert", { post: post })} >
                        Delete
                    </Button>
                    <PostDeleteDialog.Viewport />
                </Flex>
            )}
            {isLoading && (
                <Flex justifyContent={"center"} my={4}>
                    <Spinner size={"xl"} />
                </Flex>
            )}
            {!isLoading && comments?.length === 0 && (
                <Stack alignItems={"center"} gap='3'>
                    <Text fontSize={"xl"} textAlign={"center"} color={"gray.500"}>
                        No posts found 😔
                    </Text>
                </Stack>
            )}
            <Stack gap={4}>
                {comments?.map((comment) => (
                    <CommentItem key={comment.ID} comment={comment} />
                ))}
            </Stack>
        </Container>
    )
}
