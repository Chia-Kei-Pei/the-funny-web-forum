/**
 * Adapted from
 * https://github.com/burakorkmez/react-go-tutorial/blob/master/client/src/components/TodoItem.tsx
 * https://www.chakra-ui.com/docs/components/dialog
 * https://www.chakra-ui.com/docs/components/overlay-manager#programmatic-closing
 */

import { BASE_URL } from "@/App";
import { Button, CloseButton, createOverlay, Dialog, DialogFooter, Portal, Spinner, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import type { Topic } from "./TopicList";

interface TopicDeleteDialogProps {
    topic: Topic
}

const TopicDeleteDialog = createOverlay<TopicDeleteDialogProps>((props) => {
    const refBtn = useRef<HTMLButtonElement | null>(null);
    const { topic, ...rest } = props;

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

    const { mutate: deleteTopic, isPending: isDeleting } = useMutation({
        mutationKey: ["deleteTopic"],        
        mutationFn: async () => {
            try {
                const res = await fetch(BASE_URL + `/topics/${topic.topic_name}`, {
                    method: "DELETE",
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
        <Dialog.Root {...rest} placement={"center"} initialFocusEl={() => refBtn.current} role="alertdialog">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner className="no-aria-hidden-please">
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Are you sure?</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                        <Dialog.Body>
                            Do you really want to delete the topic, {topic.topic_name}?
                        </Dialog.Body>
                        <DialogFooter>
                            <Dialog.ActionTrigger asChild>
                                <Button>
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button
                                colorPalette={"red"}
                                ref={refBtn}
                                onClick={() => deleteTopic()}
                            >
                                {isDeleting ? <Spinner size={"sm"} /> : <Text>Delete</Text>}
                            </Button>
                        </DialogFooter>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});
export default TopicDeleteDialog;