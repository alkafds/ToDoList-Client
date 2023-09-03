import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Text,
  HStack,
  Divider,
  ChakraProvider,
} from "@chakra-ui/react";
import {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./fetching/fetchTodo";
import Swal from "sweetalert2";

const initialFormData = {
  title: "",
  description: "",
  duedate: new Date().toISOString().split("T")[0], // Set default to today's date
  priority: "low",
  status: "",
};

function App() {
  const [formData, setFormData] = useState(initialFormData);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getAllTodos();
        setTodos(data);
      } catch (error) {
        console.log("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let updatedValue = value;

    if (type === "date") {
      // If the input is of type 'date', parse the date to a string
      updatedValue = new Date(value).toISOString().split("T")[0];
    }
    if (name === "priority" && !["low", "medium", "high"].includes(updatedValue)) {
      updatedValue = "low";
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set the default status for new todos
    const newTodo = { ...formData, status: false, priority: formData.priority };

    try {
      const data = await createTodo(newTodo);
      console.log("Todo created:", data);
      Swal.fire({
        icon: "success",
        title: "Todo created",
        text: "A new todo has been created successfully.",
        showConfirmButton: false,
        timer: 3000,
      });
      setFormData(initialFormData);
      const updatedTodos = [...todos, data];
      setTodos(updatedTodos);
      window.location.reload();
    } catch (error) {
      console.log("Error creating Todo:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while creating a new Todo.",
        confirmButtonText: "OK",
        timer: 3000,
      });
    }
  };

  const handleUpdate = async (id, status) => {
    try {
      const updatedStatus = status === "finished" ? false : true;

      const updatedData = await updateTodo(id, {
        status: updatedStatus,
      });
      console.log("Todo updated:", updatedData);
      Swal.fire({
        icon: "success",
        title: "Todo updated",
        text: "The todo status has been updated successfully.",
        showConfirmButton: false,
        timer: 3000,
      });

      const updatedTodo = todos.map((todo) =>
        todo.id === id
          ? { ...todo, status: updatedStatus ? "finished" : "not finished" }
          : todo
      );
      setTodos(updatedTodo);
    } catch (error) {
      console.log("Error updating Todo:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating the Todo status.",
        confirmButtonText: "OK",
        timer: 3000,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      console.log("Todo deleted:", id);
      Swal.fire({
        icon: "success",
        title: "Todo deleted",
        text: "The todo has been deleted successfully.",
        showConfirmButton: false,
        timer: 3000,
      });

      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.log("Error deleting Todo:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while deleting the Todo.",
        confirmButtonText: "OK",
        timer: 3000,
      });
    }
  };

  return (
    <ChakraProvider>
    <Box pb={10} maxW="100%">
      <Heading as="h1" size="xl" textAlign="center" color="black" ml={20} mb={5} mt={5}>
        Create New Todo
      </Heading>

      <Box
        maxW="sm"
        mx={450}
        py={5}
        px={5}
        bg="white"
        stroke="blue"
        borderWidth='2px'
        borderRadius='lg'
        boxShadow='xl'
        width="100%" // Make the box full-width
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="title" isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                focusBorderColor="navy"
              />
            </FormControl>

            <FormControl id="description" isRequired>
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                focusBorderColor="blue.500"
              />
            </FormControl>

            <FormControl id="duedate" isRequired>
              <FormLabel>Due Date</FormLabel>
              <Input
                type="date"
                name="duedate"
                value={
                  formData.duedate
                    ? new Date(formData.duedate).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
                focusBorderColor="blue.500"
              />
            </FormControl>

            <FormControl id="priority" isRequired>
              <FormLabel>Priority</FormLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                focusBorderColor="blue.500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </FormControl>

            <Button type="submit" color="white" bg="black" w="100%">
              Create Todo
            </Button>
          </VStack>
        </form>
      </Box>

      <Heading as="h2" size="lg" textAlign="center" color="Black" mt={8} ml={20} maxW="100%">
        Your To-Dos
      </Heading>

      {todos.length === 0 ? (
        <Text textAlign="center" color="black" mt={4} ml={120}>
         It's empty.
        </Text>
      ) : (
        
        <HStack spacing={4} mt={4} mx={10}>
          {todos.map((todo) => (
            <Box
              key={todo.id}
              p={4}
              pr={4}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="xl"
              maxHeight="100%"
              maxWidth="100%"
              transition="transform 0.2s" // Add a transition for hover effect
              _hover={{ transform: "scale(1.08)" }} // Hover effect
            >
              
              <Heading size="md" as='b'>{todo.title}</Heading>
              <Divider my={1}/>
              <Text fontSize="md" as='b'>Description</Text>
              <Text fontSize="sm">{todo.description}</Text>
              <Text fontSize="md" as='b'>Due Date</Text>
              <Text>{new Date(todo.duedate).toLocaleDateString()}</Text>
              <Text fontSize="md" as='b'>Priority:</Text>
              <Text> {todo.priority === "low" ? (
                    "⭐ low"
                  ) : todo.priority === "medium" ? (
                    "⭐⭐ medium"
                  ) : (
                    "⭐⭐⭐ high"
                  )}</Text>
              <Text fontSize="md" as='b'>Status:</Text>
              <Text>
                 
                  <span
                    style={{
                      color: todo.status === "finished" ? "green" : "red",
                    }}
                  >
                    {todo.status === "finished" ? "Finished" : "Not Finished"}
                  </span>
                </Text>
              <Button
                onClick={() => handleUpdate(todo.id, todo.status)}
                colorScheme="green"
                size="sm"
                isDisabled={todo.status === "finished"}
                mt={2}
                mr={2}
              >
                Finished
              </Button>

              <Button
                onClick={() => handleDelete(todo.id)}
                colorScheme="red"
                size="sm"
                mt={2}
              >
                Delete
              </Button>
            </Box>
          ))}
        </HStack>
      )}
    </Box>
    </ChakraProvider>
  );
}

export default App;
