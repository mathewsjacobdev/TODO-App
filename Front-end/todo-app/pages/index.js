import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import { IoMdDoneAll } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { backendURL } from "./api/backendUrl";
import axios  from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [needRenter,setNeedRenter] = useState(false)
  const [editId, setEditId] = useState(0); // storing editing data id

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // Page renter to get items
  useEffect(()=>{
      fetchToDoList()
  },[])

 // Fetch item fn
  async function fetchToDoList(){
    try {
      const response = await axios.get(`${backendURL}/todo`)
      console.log(response)
      if(response.status === 200){
        setTodos(response?.data?.list)
        setNeedRenter(false)
      }
    } catch (error) {
      alert(error.message)
    }
  }

  // Edit to reload fetch items
  useEffect(()=>{
    if(needRenter){
      fetchToDoList()
    }
   
  },[needRenter])


  // Add new todo items
  const addTodo = async() => {
          const bodyData= {
          list:todo,
          status:false
        }
    if (todo !== "" && editId === '') {
      try {
        const bodyData= {
          list:todo,
          status:false
        }
        const response = await axios.post(`${backendURL}/create`,bodyData)
        console.log(response)
        if(response.status === 200){
          alert("New item added successfully")
          setTodos((prev)=>[...prev,response?.data])
        }else{
          alert("Something went wrong please try again later.")
        }
      } catch (error) {
        alert(error.message)
      }
    }
    if (editId) {
      console.log("working")
      const editResponse = await axios.put(`${backendURL}/todo/${editId}`,bodyData)
      console.log(editResponse)
      if(editResponse?.status === 204){
        alert("Item edited successfully")
        setNeedRenter(true)
        setEditId('');
        setTodo("");
      }
     
    }
  };

  const inputRef = useRef("null");

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Delete item
  const onDelete = async(id) => {
   try {
    const deleteResponse = await axios.delete(`${backendURL}/todo/${id}`)
    if(deleteResponse.status === 204){
      setTodos(todos.filter((to) => to._id !== id));
      alert("Item deleted successfully")
    }
   } catch (error) {
    alert(error.message)
   }
  };
  


// Edit item 
  const onEdit = async(id) => {
      const editTodo = todos.find((to) => to._id === id);
      setTodo(editTodo?.list);
      setEditId(editTodo?._id);
  
    
  };


  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Todo-list" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
      <div className={`${styles.container}`}>
      <h2 className={`${styles.h2}`}>TODO APP</h2>
      <form className={`${styles.formGroup}`} onSubmit={handleSubmit}>
        <input
          type="text"
          value={todo}
          ref={inputRef}
          placeholder="Enter Your Todo"
          className={`${styles.input}`}
          onChange={(event) => setTodo(event.target.value)}
        />
        <button className={`${styles.button}`} onClick={addTodo}>{editId ? "Edit" : "ADD"}</button>
      </form>
      <div className={`${styles.list}`}>
        <ul style={{padding:0}}>
          {todos.map((to) => (
            <li className={`${styles.listItems}`}>
              <div className={`${styles.listItemList}`} id={to.status ? `${styles.listItemItem}` : ""}>
                {" "}
                {to.list}
              </div>

              <span>
                <FiEdit
                  className={`${styles.listItemIcon}`}
                  id="edit"
                  title="Edit"
                  onClick={() => onEdit(to._id)}
                />
                <MdDelete
                  className={`${styles.listItemIcon}`}
                  id="delete"
                  title="Delete"
                  onClick={() => onDelete(to._id)}
                />

                
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
       
      </main>
    </>
  );
}
