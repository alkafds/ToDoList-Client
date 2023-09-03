import instance from "../lib/axios.jsx";

async function getAllTodos() {
    try {
        const response = await instance.get("/todo/");
        return response.data;
    } catch (error) {
        console.error("Error fetching all todos:", error);
        throw error; // Re-throw the error for handling in the component.
    }
}

async function getTodosByID(id) {
    try {
        const response = await instance.get(`/todo/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching todo by ID ${id}:`, error);
        throw error;
    }
}

async function updateTodo(id, params) {
    try {
        const { status } = params;
        const response = await instance ({
            method: "PUT",
            url: `/todo/${id}`,
            data: { status }})
        return response.data;
    } catch (error) {
        console.error(`Error updating todo with ID ${id}:`, error);
        throw error;
    }
}

async function createTodo(params) {
    try {
        const { title, description, duedate, priority, status } = params;
        const response = await instance ({
            method: "post",
            url: "/todo/",
            data: { title, description, duedate, priority, status }})
        return response.data;
    } catch (error) {
        console.error("Error creating todo:", error);
        throw error;
    }
}

async function deleteTodo(id) {
    try {
        const response = await instance.delete(`/todo/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting todo with ID ${id}:`, error);
        throw error;
    }
}

export {
    getAllTodos,
    getTodosByID,
    updateTodo,
    createTodo,
    deleteTodo
};
