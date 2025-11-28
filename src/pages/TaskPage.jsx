import { useEffect } from "react"
import { useAuth } from "../context/Auth.context"
import { useTask } from "../context/Task.context"
import TaskCard from "../components/TaskCard"


function TaskPage() {
  
        const {getTask,tasks} = useTask()
        useEffect (()=>{
          getTask()
        },[])
        

          if(tasks.length ==0) return (<h1 > No task</h1>)
      return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {tasks.map((task) =>(
              <TaskCard task={task} key={task._id}/>
            ))}
        </div>
        )
    
   
    
}

export default TaskPage