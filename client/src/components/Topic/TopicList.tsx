/**
 * Adapted from
 * https://github.com/burakorkmez/react-go-tutorial/blob/master/client/src/components/TodoList.tsx
 */

import { Center, Container, Flex, Spacer, Spinner, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import CreateTopicDialog from "./CreateTopicDialog"
import TopicItem from "./TopicItem";

const TopicList = () => {
	const [isLoading, setIsLoading] = useState(true);
	const topics = [
		{
			topic_name: "Programming",
			description: "Coding on the computer",
		},
        {
			topic_name: "Cooking",
			description: "How to make breakfast, lunch, and dinner yourself.",
		},
        {
			topic_name: "Fashion",
			description: "Lay waste to the envionment to play dress-up.",
		},
	];
	return (
		<Container maxWidth={1000}>
			<Flex alignItems={"center"}>
                <Text fontSize={"4xl"} textTransform={"uppercase"} fontWeight={"bold"} my={2}>
                    Explore Topics
                </Text>
                <Spacer />
                <CreateTopicDialog />
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
			<Stack gap={3}>
				{topics?.map((topic) => (
					<TopicItem key={topic.topic_name} topic={topic} />
				))}
			</Stack>
		</Container>
	);
};
export default TopicList;