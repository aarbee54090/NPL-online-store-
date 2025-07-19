import React from "react"
import Navbar from "./Navbar"
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import TodayLive from "./pages/game/TodayLive";
import UpComing from "./pages/game/UpComing";
import GameHistory from "./pages/game/G-History";
import Shop from "./pages/shop/Shop";
import User from "./pages/profile/User";

const router = createBrowserRouter([
  {
    path:'/user-profile',
    element:
    <div>
      <Navbar/>
      <User/>
    </div>
  },{
    path:'/shop',
    element:
    <div>
      <Navbar />
      <Shop/>
    </div>
  }
  ,{
    path:'/game-history',
    element:
    <div>
      <Navbar />
      <GameHistory/>
    </div>
  },
  {
    path:'/',
    element:
    <div>
        <Navbar />
      <Home />
    </div>
  },
  {
    path:'/today-live',
    element:
    <div>
      <Navbar />
      <TodayLive/>
    </div>
  },
  {
    path:'/upcoming-event',
    element:
    <div>
      <Navbar/>
      <UpComing/>
    </div>
  },{},
])


export default function App(){
  return(
    <div>
    
      <RouterProvider router={router}></RouterProvider>
    </div>
  )
}