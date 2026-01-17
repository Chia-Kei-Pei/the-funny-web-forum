/**
 * Adapted from
 * https://github.com/burakorkmez/react-go-tutorial/blob/master/client/src/components/TodoItem.tsx
 */

import { Badge, Box, Flex, Stack, Text } from "@chakra-ui/react";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

const TopicItem = ({ topic }: { topic: any }) => {
	return (
		<Flex gap={2} alignItems={"center"}>
			<Stack
                width={"full"}
				alignItems={"left"}
                backgroundColor={"gray.500"}
				paddingY={4}
                paddingX={10}
				borderRadius={"lg"}
				justifyContent={"space-between"}
            >
                <Text fontSize={"2xl"} fontWeight={"bold"}>
                    {topic.topic_name}
                </Text>
                <Text>
                    {topic.description}
                </Text>
            </Stack>
			<Flex gap={2} alignItems={"center"}>
				<Box color={"blue.500"} cursor={"pointer"}>
					<BiEdit size={50} />
				</Box>
				<Box color={"red.500"} cursor={"pointer"}>
					<MdDelete size={50} />
				</Box>
			</Flex>
		</Flex>
	);
};
export default TopicItem;