import React, { useEffect, useState } from 'react'
import {
    Bell,
    ChevronLeft,
    ChevronRight,
    Search,
  } from "lucide-react"
import { Button } from "./ui/Button"
import SongsList from '../app/Data/SongsList'
import { useDispatch, useSelector } from 'react-redux'
import {
  Heart,
  MoreHorizontal,
} from "lucide-react"
import Image from 'next/image'
import { GoableSongPlay } from '../app/Redux/FavSongSlice'
import { setcurrentsoungslice, setIsPlayTrueFalse } from '../app/Redux/CurrentSongSlice'
import { setReOrder } from '../app/Redux/SongListSlice'


const Topbar = () => {
  let RealsongLsit = SongsList()
  const [SongsLists,setSongsLists] = useState()
  const [userinput,setuserinput] = useState("")

useEffect(()=>{
  let userinputs = userinput.toLocaleLowerCase()
  if(userinput !== "" ){
    let filterarry = RealsongLsit.filter((ele)=>  ((ele.name).toLowerCase()).match(userinputs) )
    setSongsLists(filterarry)
  }else{
    setSongsLists()
  }


 
},[userinput])


  //redux
  const dispath = useDispatch()
  const NowPlaySong = useSelector((state)=>state.CurrentSongSlice.songname) 
  const [favsongslist,setfavsonglist] = useState()
  const favsong = useSelector((state)=>state.FavSongSlice.name)
   
  const userSelectSong = (id) =>{ //this funtion use for this use select song control
      dispath(GoableSongPlay(true))
      dispath(setcurrentsoungslice(id))
      dispath(setIsPlayTrueFalse (true))
             let currentplayindex = favsongslist.findIndex((value)=> value.id === id)
             let down_currentplayindex = SongsLists.findIndex((value)=> value.id === id)
      
           
          
             if(currentplayindex !== -1){
               let currentplayvalues = favsongslist.find((value)=> value.id === id)
               let temparry = [...favsongslist]
               temparry.splice(currentplayindex,1)
               temparry.unshift(currentplayvalues)
               setfavsonglist(temparry)
              
             }
      
      
             if(down_currentplayindex !== -1){
              let down_currentplayindexvalues = SongsLists.find((value)=> value.id === id)
              let temparry_Song = [...SongsLists]
             
              temparry_Song.splice(down_currentplayindex,1)
             
              temparry_Song.unshift(down_currentplayindexvalues)
              dispath(setReOrder(temparry_Song))
              dispath(setcurrentsoungslice(0))
      
            }
      setuserinput("")
    }
    useEffect(()=>{
      const temlist = SongsList()
      const favlist = temlist.filter((ele)=> favsong.includes(ele.id))
      console.log("favlist",favlist)
      setfavsonglist(favlist)
    },[favsong])
  //end redex part

  return (
    <div className="flex items-center gap-4 p-4">
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm text-zinc-400 pl-6">
        <a href="/">
          <span>Home</span>
        </a>
      </div>
    </div>
    <div className="flex-1 relative">
      <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
      <input
        type="text"
        placeholder="Search music, artist, albums..."
        value={userinput}
        onChange={(e)=>setuserinput(e.target.value)}
        
        className="w-full bg-zinc-900 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none peer"  />
    
    <div onClick={(e) => {e.stopPropagation();}} className='opacity-0 peer-focus:opacity-100 peer-focus:visible transition-opacity duration-300 absolute left-0 right-0 bg-gradient-to-r  from-blue-800 to-black z-50 rounded-xl'>
     {SongsLists && SongsLists.map((song,index)=>(
                      <div
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("KASMKFMAS", song.id)
                        userSelectSong(song.id);
                      }}
                      className={`flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 ${NowPlaySong == song.id ? "bg-gradient-to-r from-blue-600/55  to-black-600 border-2 border-r-emerald-100" : null}`}>
                    
                      <div className="w-12 h-12 bg-zinc-800 rounded">
                        <Image
                          src={song.cover}
                          alt={song.name}
                          width={48}
                          height={48}
                          className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{song.name}</div>
                        <div className="text-sm text-zinc-400">{song.plays || "Song name"}</div>
                      </div>
                      
                      <div className="text-zinc-400">{song.duration || "4:00"}</div>
                      
                         
                          {/* <Button variant={favsongslist && favsongslist.some((ele)=> ele.id === song.id)? "ploop" : "ghost"} size="icon">
  
                            <Heart className="w-4 h-4" />
                          </Button>  */}
                      
                    
                   
                      {/* <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button> */}
                    </div>
                ))}
     
    </div>

    </div>
  
    <a href="/favourites"><Button variant="ghost" size="icon" className="text-zinc-400" >
      <Heart className="w-5 h-5" />
    </Button></a>
    <div className="flex items-center gap-2">
    </div>
  </div>
  )
}

export default Topbar