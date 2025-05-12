import React, { useEffect, useState } from 'react'
import { Button } from "./ui/Button"
import { ScrollArea , ScrollBar } from "./ui/ScrollArea"
import SongsList from '../app/Data/SongsList'

import {
  Heart,
  MoreHorizontal,
} from "lucide-react"
import Image from "next/image"

import { useDispatch, useSelector } from 'react-redux'
import { setcurrentsoungslice, setIsPlay, setIsPlayTrueFalse } from '../app/Redux/CurrentSongSlice'
import { addsong, GoableSongPlay, removesong, fetchFavorites, addFavorite, removeFavorite } from '../app/Redux/FavSongSlice'
import { setReOrder, fetchSongs } from '../app/Redux/SongListSlice'

const ScrollAreas = ({fav=false}) => {
  
    const [favsongslist,setfavsonglist] = useState()
    const [isfav,SetIsfav]= useState(false)

    
  //readux store call
  const dispath = useDispatch() // use for the set user seleceted song add to play

  const { SongsLists, status, error } = useSelector((state) => state.SongListSlice);

  useEffect(() => {
    dispath(fetchSongs());
    dispath(fetchFavorites());
  }, [dispath]);


  console.log(SongsLists);

  const favsong = useSelector((state)=>state.FavSongSlice.name)
  const currentsoung = useSelector((state)=>state.CurrentSongSlice.currentsoung)  // get current play song id
  const NowPlaySong = useSelector((state)=>state.CurrentSongSlice.songname) 
  const Rdx_IsPlay = useSelector((state)=>state.CurrentSongSlice.IsPlay)  //main veriable contral  Contral Song play

  //after render redux pass Favsong List and call this useEffeact and set values to favsongslist state
  useEffect(()=>{
    const favlist = SongsLists.filter((ele)=> favsong.includes(ele.id))
    setfavsonglist(favlist)
  },[favsong])
if(status!="succeeded"){
    return;
  }
  

  const userSelectSong = (id) =>{ //this funtion use for this use select song control
    dispath(GoableSongPlay(true))
    dispath(setcurrentsoungslice(id))
    dispath(setIsPlayTrueFalse(true))

     //use this favsonglist re-order current play come up 1st
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
        console.log(currentsoung)

      }
    
  }

const toggleFavorite = (songg) => {
  console.log("toggleFavourite", songg);
  if (favsong.includes(songg.id)) {
    // Optimistically update UI first
    dispath(removesong(songg.id));
    dispath(removeFavorite(songg.id)).catch(() => {
      // Revert if failed
      dispath(addsong(songg.id));
    });
  } else {
    dispath(addsong(songg.id));
    dispath(addFavorite(songg.id)).catch(() => {
      dispath(removesong(songg.id));
    });
  }
};

  return (
    <div className="p-8 relative">
      
            <div className="mb-8  ">
            
              <ScrollArea className="w-full">
                
              <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{!fav ? "Popular Songs" : "Favourite Songs"}</h2>
              </div>
              <div className="space-y-2 h-full pb-20">
                {SongsLists.map((song,index)=>{
                  
                  if(fav && favsong.filter((s) => s==song.id).length===0 ){
                    return;
                  }
                      return <div
                      key={index}
                      onClick={()=>userSelectSong(song.id)}
                      className={`flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 ${NowPlaySong == index ? "bg-gradient-to-r from-blue-600/55  to-black-600 border-2 border-r-emerald-100" : null}`}>
                      <div className="w-6 text-center text-zinc-400">{index + 1}</div>
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
                      
                         
                          <Button onClick={(e)=>{
                                               
                            toggleFavorite(song)}}
                            variant={favsong.includes(song.id) ? "ploop" : "ghost"} size="icon"
                          >
  
                            <Heart className="w-4 h-4" />
                          </Button> 
                      
                    
                   
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
})}
                
               
              </div>
            </div>
         
          </div>
  )
}

export default ScrollAreas