/**
 * Adapted from
 * https://github.com/burakorkmez/react-go-tutorial/blob/master/client/src/components/TodoItem.tsx
 */

import { Stack, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import type { Post } from "@/routes/t.$topic.index";

const PostItem = ({ post }: { post: Post }) => {

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
            <Link to="/t/$topic/p/$post" params={{topic: post.topic_title, post: post.ID.toString()}}>
                <Text fontSize={"2xl"} fontWeight={"bold"}>
                    {post.title}
                </Text>
            </Link>
            <Text textStyle={"sm"}>
                By {post.user_name}
            </Text>
            <Text>
                {post.body}
            </Text>
        </Stack>
    );
};
export default PostItem;