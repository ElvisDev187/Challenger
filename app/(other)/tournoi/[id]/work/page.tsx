import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";
import MatchCard from "./MatchCard";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function page({ params }: PageProps) {
  const session = await getAuthSession();
  const tournoi = await db.tournoi.findFirst({
    where: {
      id: params.id
    }
  })
  const arbitre = await db.arbitre.findFirst({
    where: {
      tournoiId: params.id,
      email: session?.user.email || "",
    },
    include: {
      matchs: {
        include: {
          equipeIn: true,
          equipeOut: true,
          Assistant: true,
          arbitre: true,
          infoMatchs: true
        }
      }
    }
  });
  const assistant = await db.assistant.findFirst({
    where: {
      tournoiId: params.id,
      email: session?.user.email || "",
    },
    include: {
      matchs: {
        include: {
          equipeIn: true,
          equipeOut: true,
          Assistant: true,
          arbitre: true,
          infoMatchs: true
        }
      }
    }
  });


  return (
    <div>
      {arbitre ? (
        <>
          <h1 className="font-bold text-xl md:text-2xl h-14">
            Vous etes arbitre au tournoi : {tournoi?.name}
          </h1>

          <h1 className="font-bold text-md md:text-lg h-10">
            Vos matchs
          </h1>
          <div className='mt-1 grid grid-cols-3 p-7 w-full gap-5' >
            {arbitre.matchs.filter((match) => match.status == "ATTENTE").map((match) => (<MatchCard match={match} key={match.id} />))}
          </div>
          <h1 className="font-bold text-md md:text-lg h-10">
            Vos matchs En cours
          </h1>
          <div className='mt-1 grid grid-cols-3 p-7 w-full gap-5' >
            {arbitre.matchs.filter((match) => match.status == "EN_COURS").map((match) => {
              
                const butIn = match.infoMatchs.filter((info)=> info.equipeId === match.equipeInId).reduce((acc, info)=>{
                    if(info.type == "BUT") acc+=1
                  return acc
                }, 0)
                const butOut = match.infoMatchs.filter((info)=> info.equipeId === match.equipeOutId).reduce((acc, info)=>{
                  if(info.type == "BUT") acc+=1
                return acc
              }, 0)
              return (
                <div key={match.id} className="bg-white p-3 relative rounded-sm flex flex-col gap-2  justify-start shadow-md text-sm font-medium text-slate-900 ">
                  <div className='flex gap-2 items-center justify-center'>
                  <p> {match.equipeIn.name}</p>    <p className="font-semibold text-blue-500 animate-pulse ml-2">{butIn}</p>:<p className=" text-blue-500 font-semibold mr-2">{butOut}</p>  <p> {match.equipeOut.name}</p>
                  </div>
                </div>
              )
            })}
          </div>

        </>
      ) : (
        <>
          <h1 className="font-bold text-xl md:text-2xl h-14">
            Vous etes assistant au tournoi : {tournoi?.name}
          </h1>
          <h1 className="font-bold text-md md:text-lg h-10">
            Vos matchs
          </h1>
          <div className='mt-1 grid grid-cols-3 p-7 w-full gap-5' >
            {assistant?.matchs.filter((match) => match.status == "ATTENTE").map((match) => (<MatchCard match={match} key={match.id} />))}
          </div>
          <h1 className="font-bold text-md md:text-lg h-10">
            Vos matchs En cours
          </h1>
          <div className='mt-1 grid grid-cols-3 p-7 w-full gap-5' >
            {assistant?.matchs.filter((match) => match.status == "EN_COURS").map((match) => {
              
                const butIn = match.infoMatchs.filter((info)=> info.equipeId === match.equipeInId).reduce((acc, info)=>{
                    if(info.type == "BUT") acc+=1
                  return acc
                }, 0)
                const butOut = match.infoMatchs.filter((info)=> info.equipeId === match.equipeOutId).reduce((acc, info)=>{
                  if(info.type == "BUT") acc+=1
                return acc
              }, 0)
              return (
                <div key={match.id} className="bg-white p-3 relative rounded-sm flex flex-col gap-2  justify-start shadow-md text-sm font-medium text-slate-900 ">
                  <div className='flex gap-2 items-center justify-center'>
                    <p> {match.equipeIn.name}</p>    <p className="font-semibold text-blue-500 animate-pulse ml-2">{butIn}</p>:<p className=" text-blue-500 font-semibold mr-2">{butOut}</p>  <p> {match.equipeOut.name}</p>
                  </div>
                  <Button>Update</Button>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  );
}
