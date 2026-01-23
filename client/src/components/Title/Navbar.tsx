import { Button, Container, Flex, Spacer } from "@chakra-ui/react";
import { useColorMode } from "../ui/color-mode";
import { LuSun } from "react-icons/lu";
import { IoMoon } from "react-icons/io5";
import Logo from "./Logo";
import { Link } from "@tanstack/react-router";

export default function NavBar() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Container maxW={"900px"}>
            <Flex h={18} alignItems={"center"} minHeight={24} >
                <Link to="/">
                    <Logo />
                </Link>
                <Spacer />
                <Button onClick={toggleColorMode}>
                    {colorMode === "light" ? <LuSun /> : <IoMoon />}
                </Button>
            </Flex>
        </Container>
    )
}