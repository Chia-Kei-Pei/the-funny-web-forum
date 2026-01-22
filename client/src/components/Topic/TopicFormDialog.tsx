/**
 * Adapted from
 * https://github.com/burakorkmez/react-go-tutorial/blob/master/client/src/components/TodoForm.tsx
 * https://github.com/burakorkmez/react-go-tutorial/blob/master/client/src/components/TodoItem.tsx
 * https://www.chakra-ui.com/docs/components/dialog
 * https://www.chakra-ui.com/docs/components/overlay-manager#programmatic-closing
 */

import { BASE_URL } from "@/App";
import { Button, CloseButton, createOverlay, Dialog, Flex, Input, Portal, Spacer, Spinner, Stack, Text, Textarea } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, type FormEvent } from "react";
import type { Topic } from "./TopicList";

interface TopicFormDialogProps {
    isNew: boolean,
    topic?: Topic
}

const TopicFormDialog = createOverlay<TopicFormDialogProps>((props) => {
    const refInput = useRef<HTMLInputElement | null>(null);
    const { isNew, topic, ...rest } = props;
    const [newTopicName, setTopicName] = useState(topic ? topic.topic_name : "");
    const [newTopicDesc, setTopicDesc] = useState(topic ? topic.description : "");

    const queryClient = useQueryClient();

    const successFn = () => {
        queryClient.invalidateQueries({ queryKey: ["topics"] }); // refresh the list
        props.onOpenChange?.({ open: false }) // Close if topic successfully updated. Programmatic Closing
    };

    const errorFn = (error: any) => {
        alert(error.message);
        // TODO: turn errors into user feedback on the UI.
        // E.g. "A topic of this name already exists."
        // and "Topic name and description cannot be empty."
    }

    // https://stackoverflow.com/questions/57476487/how-to-check-if-a-string-contains-only-white-space-or-is-empty-in-typescript
    const hasWhitespace = function(text: string): boolean {
        return text == null || text.includes(' ');
    };

    const { mutate: createTopic, isPending: isCreating } = useMutation({
        mutationKey: ["createTopic"],
        mutationFn: async (e: FormEvent) => {
            e.preventDefault();
            try {
                if (hasWhitespace(newTopicName)) {
                    throw new Error("Topic name cannot have whitespace");
                }

                const res = await fetch(BASE_URL + `/topics`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        topic_name: newTopicName,
                        description: newTopicDesc,
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

    const { mutate: editTopic, isPending: isEditing } = useMutation({
        mutationKey: ["editTopic"],
        mutationFn: async (e: FormEvent) => {
            e.preventDefault();
            try {
                if (!topic) {
                    throw new Error("topic is None");
                }

                if (hasWhitespace(newTopicName)) {
                    throw new Error("Topic name cannot have whitespace");
                }

                const res = await fetch(BASE_URL + `/topics/${topic.topic_name}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        topic_name: newTopicName,
                        description: newTopicDesc,
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
        <Dialog.Root {...rest} placement={"center"} initialFocusEl={() => refInput.current}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner className="no-aria-hidden-please">
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{isNew ? "Create Topic" : "Edit Topic"}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                        <Dialog.Body>
                            <form onSubmit={isNew ? createTopic : editTopic}>
                                <Stack gap={4}>
                                    <Input
                                        placeholder="Topic Name"
                                        type='text'
                                        value={newTopicName}
                                        onChange={(e) => setTopicName(e.target.value)}
                                        ref={refInput}
                                    />
                                    <Textarea
                                        placeholder="Description"
                                        value={newTopicDesc}
                                        onChange={(e) => setTopicDesc(e.target.value)}
                                    />
                                    <Flex>
                                        <Spacer />
                                        <Button type="submit">
                                            {(isNew && isCreating) || (!isNew && isEditing)
                                                ? <Spinner size={"xs"} />
                                                : <Text>Confirm</Text>}
                                        </Button>
                                    </Flex>
                                </Stack>
                            </form>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});
export default TopicFormDialog;