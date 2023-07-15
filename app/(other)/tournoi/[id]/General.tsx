"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import type { ExtendedTournoi } from '@/types/db'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

interface Props {
    tournoi: ExtendedTournoi
}
export default function General({ tournoi }: Props) {
    const [email, setEmail] = useState('')
   
  

    const { mutate: Suscribe, isLoading } = useMutation({
      mutationFn: async () => {
        const payload = {
          email,
          tournoiId: tournoi.id
        }
  
        const { data } = await axios.post('/api/tournoi/suscribe', payload)
        return data as string
      },
      onError: (err: any) => {
  
        toast({
          title: 'There was an error.',
          description: 'Could not create subreddit.',
          variant: 'destructive',
        })
      },
      onSuccess: (data: any) => {
        
        toast({
          description: 'Vous avez ete ajoute avec success',
        })
        
      },
    })
  

    return (
        <>
            <h1 className='font-bold text-3xl md:text-4xl h-14'>
                {tournoi.name}
            </h1>
            <section className='w-full flex flex-col h-fit mt-8 items-start gap-5 justify-center'>
                <div className='aspect-video relative w-[600px]'>
                    <Image
                        fill
                        src={tournoi.cover}
                        alt='profile picture'
                        referrerPolicy='no-referrer'
                        priority
                    />
                </div>
                <div className='w-full'>
                    <h1 className='font-semibold text-lg  my-5'>
                        Description
                    </h1>
                    <p className='text-slate-700 text-md leading-3'>{tournoi.description}</p>
                </div>
                <div className='w-full'>
                    <h1 className='font-semibold text-xl  my-5'>
                        Rester Informer 
                    </h1>
                    <form className=''>
                        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">


                            <Input value={email} onChange={(e) => setEmail(e.target.value)} type='email'placeholder='Email' required className='placeholder:text-slate-900 font-semibold' />
                            <Button disabled={isLoading} className='w-[150px]' type='submit' onClick={(e) => {
                                e.preventDefault()
                                Suscribe()

                            }}>
                                {isLoading? <Loader2 className="h-4 w-4 animate-spin mr-2"/>: null}
                                S'aboner</Button>

                        </div>
                    </form>
                </div>
            </section>
            {/* arbre pour le tournoi */}
        </>
    )
}
