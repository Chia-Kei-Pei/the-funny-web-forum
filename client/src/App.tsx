import { Button, Container, IconButton, Stack, Text } from "@chakra-ui/react"
import { CgAdd } from "react-icons/cg"
import NavBar from "./components/Title/Navbar"
import TopicList from "./components/Topic/TopicList"

export const BASE_URL = "http://localhost:5000/api";

function App() {

  return (
    <Stack h="100vh" padding="10">
      <NavBar />
      <Container spaceY="4">
        <TopicList />
      </Container>
    </Stack>
  )
}

export default App
