"use client"

import BottomPlayer from "../../components/BottomPlayer";
import ScrollAreas from "../../components/ScrollAreas";
import Topbar from "../../components/Topbar"
import { ScrollArea } from "../../components/ui/scroll-area";
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { Button } from "../../components/ui/button"
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Heart,
  Pause,
  Repeat,
  Shuffle,
  Volume2,
  Play,
  VolumeX,
  
} from "lucide-react"
import { Slider } from "../../components/ui/slider"
import Image from "next/image"
import ReactHowler from "react-howler";
import { useDispatch, useSelector } from 'react-redux'
import { addsong, GoableSongPlay, removesong } from '../Redux/FavSongSlice'
import { addcurrentsoung, NowPlaying, removecurrentsoung, resetcurrentsoung, setcurrentsoungslice, setIsPlay, setIsPlayTrueFalse } from '../Redux/CurrentSongSlice'
import Kendrick from "../../public/Songimage/download.png";
import { fetchSongs } from "../Redux/SongListSlice";

export default function MusicApp() {

  const [play,setplay] = useState(false)
  const [ploop,setPloop] = useState(false)
  const [prandom , setPrandom] = useState(false)
  const Refsong = useRef()
  const RefVolums = useRef()
  const [duration,setduration] = useState(0)
  const [fulltimeducation , setfulltimeducation] = useState()
  const [remmeingtime , setremmeingtime] = useState(0)

    const [volums,setVolums] = useState(0.5)
  const [ProcessBarvolums,setrocessBarVolums] = useState(0)
  const [mute , setMute] = useState(false)
  const [isfav,SetIsfav]= useState(false)

  //redux
  const { SongsLists, status, error } = useSelector((state) => state.SongListSlice);
  
  const favsong = useSelector((state)=>state.FavSongSlice.name)
  const Rdx_IsPlay = useSelector((state)=>state.CurrentSongSlice.IsPlay)  //main veriable contral  Contral Song play
  const currentsoung = useSelector((state)=>state.CurrentSongSlice.currentsoung)
  const dispath = useDispatch()
  
  const isfavsong = () => {
   
    const temp = favsong.includes(SongsLists[currentsoung]?.id)
    
    temp ? SetIsfav(true) : SetIsfav(false)
  }

  const dragsong_prograssbar = (val) =>{
    if (!Refsong.current) return; 
    const dragduration =  Refsong.current.duration()
    const dragtime =  (val/100)* dragduration
    Refsong.current.seek(dragtime)
    setduration(val)
   
  }

  const dragVloums_prograssbar = (val) =>{
    if (!Refsong.current) return;
    const NewVloums =  val/100
    setrocessBarVolums(val)
    setVolums(NewVloums)
  }


  useEffect(() => {
    dispath(fetchSongs());
  }, [dispath]);
  
    useEffect(()=>{

    let valums = (volums / 1) * 100
    setrocessBarVolums(valums)
    isfavsong()
    const time = setInterval(() => {
      if (!Refsong.current) return;
      const seek = Refsong.current.seek() || 0; // Get current time
      const durations = Refsong.current.duration() || 0; // Get current time
      const progressbar = (seek / durations ) * 100
      setduration(progressbar)
      setfulltimeducation(timecovnate(durations))
      setremmeingtime(timecovnate(seek))
     
    }, 500);

    return () => clearInterval(time)
  
  },[Rdx_IsPlay])

  useEffect(() => {
    isfavsong();
  }, [currentsoung]); // Runs every time currentsoung changes
  

  const timecovnate = (time) => {
    const minutes = Math.floor(time / 60); // Get the minutes
    const seconds = Math.floor(time % 60); // Get the seconds
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; // Format to mm:ss
  }
  

  const NowPlay = () => {
    dispath(setIsPlay())
  }
  //run every time reander
  useEffect(()=>{
    console.log("currentsoung",currentsoung)
    dispath(NowPlaying(currentsoung))
    Rdx_IsPlay ? dispath(GoableSongPlay(true)) : dispath(GoableSongPlay(false)) 
    isfavsong()
  })

  const nextSong = () =>{
    let SongCount = SongsLists.length
    SongCount = SongCount - 1
    if ( currentsoung < SongCount){
      dispath(addcurrentsoung())
    }else{
      dispath(resetcurrentsoung()) }
      dispath(setIsPlayTrueFalse(true)) 
}

  const nextRandomSong = () =>{
    let SongCount = SongsLists.length
    let randomvalues = Math.random() * (SongCount - 1)
     randomvalues = randomvalues.toFixed(0)
    while (randomvalues == currentsoung){
      randomvalues = Math.random() * (SongCount - 1)
      randomvalues = randomvalues.toFixed(0)
    }
    dispath(setcurrentsoungslice(randomvalues))
    dispath(setIsPlayTrueFalse(true))
  }


  return (
(<div className="flex h-screen bg-black text-white flex-col">

      <div className="flex-1 flex flex-col overflow-hidden ">
        {/* Top Bar */}
        <Topbar/>

        <ScrollArea className="flex-1">
          <div className={"max-w-screen-2xl mx-auto flex items-center gap-4 flex-col mt-[10%]"}>
      <a href="current">
      <div className="flex flex-col items-center gap-4 w-72">
        <Image
          src={SongsLists[currentsoung]?.cover || Kendrick}
          alt="Now playing"
          width={500}
          height={500}
          className="object-cover" />
      <div>
        <div className="font-medium">{SongsLists[currentsoung]?.name}</div>
        <div className="text-sm text-zinc-400">Alisha Joe</div>
      </div>
    </div>
        </a>

    <div className="flex-1 flex flex-col items-center gap-2">
      <div className="flex items-center gap-6">

        <Button variant={prandom ? "ploop" : "ghost"} size="icon" onClick={()=> setPrandom(!prandom)}>
          <Shuffle className="w-4 h-4" />
        </Button>

        {/* back song */}
        <Button variant="ghost" onClick={()=>backSong()} size="icon">
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* play button */}
       <div className="relative inline-block">
          {/* Button */}
          <Button
            size="icon"
            className="rounded-full  bg-white text-black hover:bg-white/90 hover:border-2 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-600"
            onClick={() => NowPlay()}
          >
            {Rdx_IsPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          
          {Rdx_IsPlay ? [] : <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Wave Circles */}
            <div className="absolute w-12 h-12 border-2 border-blue-500 rounded-full animate-ping opacity-75"></div>
            <div className="absolute w-16 h-16 border-2 border-blue-500 rounded-full animate-ping opacity-75 delay-200"></div>
          </div> }

        </div>

        {/* next song */}
       <Button variant="ghost" size="icon" onClick={()=>nextSong()}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        
        {/* loop logo */}
        <Button variant={ploop ? "ploop" : "ghost"} size="icon" onClick={()=>setPloop(!ploop)} >
          <Repeat className="w-4 h-4" />
        </Button>

            {/* progress bar */}
      </div>
      <div className="flex items-center gap-2 w-full max-w-xl">
        <div className="text-xs text-zinc-400">{remmeingtime}</div>
        <Slider value={[duration]} isplay={Rdx_IsPlay} max={100} step={4} className="w-full" onValueChange={(val) => dragsong_prograssbar(val)} />
        <div className="text-xs text-zinc-400">{fulltimeducation}</div>
      </div>
    </div>

    <div className="w-72 flex items-center justify-end gap-2">
        <button onClick={() => setMute(!mute)}>
           {true ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

      <Slider value={[ProcessBarvolums]} max={100}  step={1} isplay={Rdx_IsPlay} className="w-32" onValueChange={(val) => dragVloums_prograssbar(val)}  />
    </div>

    <ReactHowler 
    
        src={SongsLists[currentsoung]?.url || Kendrick}
        playing={Rdx_IsPlay}
        loop={ploop}
        onEnd={prandom ? nextRandomSong : nextSong}
        volume={volums}
        ref={Refsong}
        mute={mute}
      />

  </div>    
        </ScrollArea>



      </div>
  
   
      {/* Bottom Player */}
      
    </div>)  );
}