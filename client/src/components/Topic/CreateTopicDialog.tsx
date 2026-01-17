/**
 * Adapted from
 * https://github.com/burakorkmez/react-go-tutorial/blob/master/client/src/components/TodoForm.tsx
 * https://www.chakra-ui.com/docs/components/dialog
 */

import { Button, CloseButton, Dialog, Flex, Input, Portal, Spacer, Spinner, Stack, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";

const TopicForm = () => {
	const [newTopicName, setNewTopicName] = useState("");
	const [newTopicDesc, setNewTopicDesc] = useState("");
	const [isPending, setIsPending] = useState(false);

	const createTopic = async (e: React.FormEvent) => {
		e.preventDefault();
		alert("Topic added!");
	};

	return (
		<Dialog.Root placement={"center"}>
			<Dialog.Trigger asChild>
				<Button>Create Topic</Button>
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
						<Dialog.Title>Create Topic</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body spaceY={4}>
							<Input
								placeholder="Topic Name"
								type='text'
								value={newTopicName}
								onChange={(e) => setNewTopicName(e.target.value)}
							/>
							<Textarea
								placeholder="Description"
								value={newTopicDesc}
								onChange={(e) => setNewTopicDesc(e.target.value)}
							/>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button variant="outline">Cancel</Button>
							</Dialog.ActionTrigger>
							<Dialog.ActionTrigger asChild>
								<Button onClick={createTopic}>
									{isPending ? <Spinner size={"xs"} /> : <Text>Create</Text>}
								</Button>
							</Dialog.ActionTrigger>
						</Dialog.Footer>
						<Dialog.CloseTrigger asChild>
							<CloseButton size="sm" />
						</Dialog.CloseTrigger>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};
export default TopicForm;