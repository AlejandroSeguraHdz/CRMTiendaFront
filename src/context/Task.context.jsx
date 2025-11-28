import { createContext, useContext, useState } from "react";
import { createTaskRequest, deleteTaskRequest, getTaskRequest, getTasksRequest, updateTaskRequest } from "../api/task";
const TaskContext = createContext();

export const useTask = () => {
    const context = useContext(TaskContext);

    if (!context) {
        throw new Error("useTask must be used widthin a TaskProvider")
    }
    return context;
}

export function TaskProvider({ children }) {
    const [tasks, setTask] = useState([]);

    const createTask = async (task) => {
    {
            try {
                const res = await createTaskRequest(task)
            } catch (error) {
                console.log(error)

            }
    }
}

    const getTask = async () => {
        try {
            const res = await getTasksRequest()
            setTask(res.data)
        } catch (error) {
            console.log(error)
        }
    }


    const deleteTask = async (id) => {

        try {
            const res = await deleteTaskRequest(id)
            if (res.status == 204) setTask(tasks.filter(task => task._id != id))
        } catch (error) {
            console.log(error)
        }

    }

    const getOnlyOneTask = async (id) => {
        try {
            const res = await getTaskRequest(id)
            return res.data

        } catch (error) {
            console.log(error)

        }
    }
    const updateTask = async (id, task) => {
        try {
            await updateTaskRequest(id, task);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                createTask,
                getTask,
                deleteTask,
                getOnlyOneTask,
                updateTask
            }}
        >
            {children}
        </TaskContext.Provider>
    )
}