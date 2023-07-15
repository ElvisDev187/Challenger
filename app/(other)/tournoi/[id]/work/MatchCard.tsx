"use client"
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { ExtendedMatch2 } from '@/types/db'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { startTransition } from 'react'
interface Props {
    match: ExtendedMatch2
}
export default function MatchCard({ match}: Props) {
    const router = useRouter()
    const isday = new Date(match.date!).getDate() == new Date( Date.now()).getDate()
    const {mutate, isLoading}= useMutation({
        mutationFn:async () => {
            const payload =   {id: match.id}
            const res = await axios.post('/api/tournoi/match/start',payload)
            return res.data as string
        },
        onError(error, variables, context) {
            console.log(error);
            
            toast({
                description: "Essayer plus tard",
                variant: "destructive",
                title: "Erreur"
               })
        },
        onSuccess(){
            startTransition(()=>{
                router.refresh()
            })
           toast({
            description: "Match lance"
           })
        }
    })
    
    return (
        <div className='bg-white p-3 relative rounded-sm flex flex-col gap-2  justify-start shadow-md text-sm font-medium text-slate-900 ' key={match.id}>
            <div className='flex gap-2 items-center justify-center'>
                <p> {match.equipeIn.name}</p> <p className='text-lg'>vs</p> <p>{match.equipeOut.name}</p>
            </div>
            <div className='flex gap-2 justify-center items-center'>
                <p> {match.date}</p> <p className='text-lg'>{match.heure}</p> <p>{match.terrain}</p>
            </div>
            <Button disabled={!isday || isLoading} onClick={(e)=>{
                e.preventDefault()
                mutate()
            }}>
                 {isLoading? <Loader2 className="h-4 w-4 animate-spin mr-2"/>: null}
                Lancer</Button>   
        </div>
                                                     

  )
}
