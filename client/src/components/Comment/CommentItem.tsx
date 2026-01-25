/**
 * Adapted from
 * https://github.com/burakorkmez/react-go-tutorial/blob/master/client/src/components/TodoItem.tsx
 */

import { Button, Container, Field, Flex, Input, Spacer, Spinner, Stack, Text, Textarea } from "@chakra-ui/react";
import type { Comment } from "@/routes/t.$topic.p.$post.index";
import CommentDeleteDialog from "./CommentDeleteDialog";
import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/App";

const CommentItem = ({ comment }: { comment: Comment }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [newCommentBody, setCommentBody] = useState(comment.body);

    const queryClient = useQueryClient();

    const successFn = () => {
        setIsEditMode(false);
        queryClient.invalidateQueries({ queryKey: ["comments"] }); // refresh the list
    };

    const errorFn = (error: any) => {
        alert(error.message);
        // TODO: turn errors into user feedback on the UI.
        // E.g. "A topic of this name already exists."
        // and "Topic name and description cannot be empty."
    }

    const { mutate: editComment, isPending } = useMutation({
        mutationKey: ["editComment"],
        mutationFn: async (e: FormEvent) => {
            e.preventDefault();
            try {
                const res = await fetch(BASE_URL + `/comments/${comment.ID}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ID: comment.ID,
                        post_id: comment.post_id,
                        user_name: "thelegend27",
                        body: newCommentBody,
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
        <Container
            width={"full"}
            alignItems={"left"}
            backgroundColor={"gray.500"}
            paddingY={4}
            paddingX={10}
            borderRadius={"lg"}
            justifyContent={"space-between"}
        >
            <Text>
                ID: {comment.ID}
            </Text>
            <Text fontWeight={"bold"}>
                By {comment.user_name}
            </Text>
            {isEditMode && (
                <Stack>
                    <form onSubmit={editComment}>
                        <Field.Root required>
                            <Textarea
                                placeholder="Comment Body"
                                value={newCommentBody}
                                onChange={(e) => setCommentBody(e.target.value)}
                            />
                        </Field.Root>
                        <Flex>
                            <Spacer />
                            <Button type="submit">
                                {isPending
                                    ? <Spinner size={"xs"} />
                                    : <Text>Save Edits</Text>}
                            </Button>
                        </Flex>
                    </form>
                </Stack>
            )}
            {!isEditMode && (
                <Stack>
                    <Text>{comment.body}</Text>
                    <Flex>
                        <Spacer />
                        <Button
                            size={"sm"}
                            variant={"ghost"}
                            onClick={() => setIsEditMode(true)}
                        >
                            Edit
                        </Button>
                        <Button
                            size={"sm"}
                            variant={"ghost"}
                            onClick={() => {
                                CommentDeleteDialog.open("alert", { comment: comment })
                            }}
                        >
                            Delete
                        </Button>
                        <CommentDeleteDialog.Viewport />
                    </Flex>
                </Stack>
            )}
        </Container>
    );
};
export default CommentItem;