"use client"
import React from 'react'
import { Button } from './ui/button'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useToast } from './ui/use-toast'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { Loader2 } from 'lucide-react'
import { X } from 'lucide-react'
import { DelStaffPayload, Role } from '@/lib/validators/staff'

interface Props {
    id: string,
    name: string,
    email: string,
    tournoiId: string,
    role: Role
}
export default function StaffCard({ id, name, email , tournoiId, role}: Props) {
    const { toast } = useToast()
    const { loginToast } = useCustomToasts()
    const { mutate: DeleteStaff, isLoading } = useMutation({
        mutationFn: async () => {
            const payload: DelStaffPayload = {
                id,
                tournoiId,
                role
            }

            const { data } = await axios.post('/api/tournoi/staff/delete', payload)
            return data as string
        },
        onError: (err: any) => {
            if (err instanceof AxiosError) {

                if (err.response?.status === 401) {
                    return loginToast()
                }
            }

            toast({
                title: 'There was an error.',
                description: 'Could not delete.',
                variant: 'destructive',
            })
        },
        onSuccess: (data: any) => {

            toast({
                description: `Le staff ${name} a ete supprimer avec succes`,
            })

        },
    })

    return (
        <div className='bg-white p-3 relative rounded-sm flex flex-col gap-2 shadow-md text-sm font-medium text-slate-900 '>
            <p> {name}</p>
            <p> {email}</p>
            <button className='rounded-full absolute top-1 right-1 p-2 disabled:bg-gray-500 disabled:text-slate-300 flex items-center justify-center bg-slate-950 text-white'  disabled={isLoading} onClick={(e)=>{
                e.preventDefault()
                DeleteStaff()
            }}>
                {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <X className='h-4 w-4' />}
            </button>
        </div>
    )
}
