import { useSelector } from "react-redux";
import useChat from "../hooks/useChat.js";
import {  useEffect } from "react";
import React from 'react'

const Dashboard = () => {
  const chat = useChat()  
    const user = useSelector((state)=> state.auth)
    console.log(user)

     useEffect(() => {
      chat.initializeSocket()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard