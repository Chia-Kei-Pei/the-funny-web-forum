import { Flex, Text } from "@chakra-ui/react";
import { BsEmojiLaughing } from "react-icons/bs";

export default function TitleLogo() {
    return (
        <Flex alignItems={"center"} gap="2">
            <Text textStyle="4xl" fontFamily={"monospace"}>the funny</Text>
            <BsEmojiLaughing size={32}/>
        </Flex>
    )
}