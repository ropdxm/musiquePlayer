"use client"

import BottomPlayer from "../components/BottomPlayer"
import ScrollAreas from "../components/ScrollAreas"
import Topbar from "../components/Topbar"
import { ScrollArea } from "../components/ui/ScrollArea"
import { useSelector } from "react-redux"
import { useEffect } from "react"
export default function MusicApp() {

   const GobleSongPlay = useSelector((state)=>state.FavSongSlice.NowPlay)

  return (
    (<div className="flex h-screen bg-black text-white">
    
      <div className="flex-1 flex flex-col overflow-hidden ">
        {/* Top Bar */}
        <Topbar/>

        <ScrollArea className="flex-1 ">
         <ScrollAreas fav={true} />
        </ScrollArea>
       
      </div>
  
   
      {/* Bottom Player */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 p-4">
        <BottomPlayer/>
    
      </div>
    </div>)
  );
}