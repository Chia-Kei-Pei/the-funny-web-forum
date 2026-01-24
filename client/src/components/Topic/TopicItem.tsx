/**
 * Adapted from
 * https://github.com/burakorkmez/react-go-tutorial/blob/master/client/src/components/TodoItem.tsx
 */

import { Button, Flex, Spacer, Stack, Text } from "@chakra-ui/react";
import TopicFormDialog from "./TopicFormDialog";
import TopicDeleteDialog from "./TopicDeleteDialog";
import type { Topic } from "@/routes/explore_topics";
import { Link } from "@tanstack/react-router";

const TopicItem = ({ topic }: { topic: Topic }) => {

    return (
        <Stack
            width={"full"}
            alignItems={"left"}
            backgroundColor={"gray.500"}
            paddingY={4}
            paddingX={10}
            borderRadius={"lg"}
            justifyContent={"space-between"}
        >
            <Link to="/t/$topic" params={{topic: topic.title}}>
                <Text fontSize={"2xl"} fontWeight={"bold"}>
                    {topic.title}
                </Text>
            </Link>
            <Text>
                {topic.description}
            </Text>
            <Flex gap={2} alignItems={"center"}>
                <Spacer />
                <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => {
                        TopicFormDialog.open("form", { isNew: false, topic: topic })
                    }}
                >
                    Edit
                </Button>
                <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => {
                        TopicDeleteDialog.open("alert", { topic: topic })
                    }}
                >
                    Delete
                </Button>
                <TopicDeleteDialog.Viewport />
            </Flex>
        </Stack>
    );
};
export default TopicItem;