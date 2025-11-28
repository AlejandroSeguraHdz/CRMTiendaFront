import { useForm } from "react-hook-form"
import { useTask } from "../context/Task.context"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);


function TaskFormPage() {

    const { register, setValue, handleSubmit } = useForm()
    const { updateTask, getOnlyOneTask, createTask } = useTask()
    const navigate = useNavigate()
    const params = useParams()

    const onSubmit = handleSubmit((data) => {
        if (params.id) {
            updateTask(params.id,
                {
                    ...data,
                    date: dayjs.utc(data.data).format()
                })
            navigate("/task")
        }
        else {
            createTask(
                {
                    ...data,
                    date: dayjs.utc(data.date).format()
                }
            )
            navigate("/task")
        }
    })



    useEffect(() => {
        const loadTask = async () => {
            if (params.id) {
                const task = await getOnlyOneTask(params.id)
                setValue('title', task.title)
                setValue('description', task.description)
            }
        }
        loadTask()

    }, [])
    return (

        <div className=" flex h-[calc(100vh-100px)] items-center justify-center" >
            <div className=" bg-zinc-800 max-w-md  w-full p-10 rounded-md">
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        placeholder="Title"
                        {...register("title")}
                        autoFocus
                        className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />

                    <label htmlFor="description"> Description</label>
                    <textarea
                        rows="3"
                        placeholder="Description"
                        {...register("description")}
                        className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2">
                    </textarea>

                    <label
                        htmlFor="date">
                        Date
                    </label>
                    <input
                        type="date"
                        className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        {...register('date')} />
                    <button
                        className="bg-indigo-500 px-3 py-2 rounded-md">
                        Save
                    </button>
                </form>
            </div>
        </div>
    )

}

export default TaskFormPage