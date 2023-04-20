import { useState } from 'react'

type Props = {
	user: User
	team: Team
	firstName: string
	lastName: string
	speed: Speed
	token: number
	id: number
	remove: Function
}

export default function Runner({ firstName, lastName, speed, team, user, token, id, remove }: Props): JSX.Element {
	const [inputs, setInputs] = useState<Omit<Props, 'token' | 'team' | 'user' | 'id' | 'remove'>>({ firstName, lastName, speed });
	const actions = {
		update: async() => {
			if(!/\d\d:\d\d/.test(inputs.speed)) return
			const res: Awaited<Promise<{ success: boolean }>> = await (await fetch('http://localhost/teams/' + team.id + '/runners/' + id, {
				method: 'PUT',
				headers: new Headers({
					Authorization: user.token.toString(),
					"Content-Type": 'application/json'
				}),
				body: JSON.stringify(inputs)
			})).json()
			if(res.success) remove()
		},

		copy: () => {
			navigator.clipboard.writeText(token.toString())
		},

		delete: async() => {
			const res = await (await fetch('http://localhost/teams/' + team.id + '/runners/' + id, {
				method: 'DELETE',
				headers: new Headers({
					Authorization: user.token.toString()
				})
			})).json()
			console.log(res)
			remove()
		}
	}

	return <>
		<div className='flex justify-evenly items-center h-8'>
			<input placeholder='First Name' value={inputs.firstName} onChange={e => setInputs(prev => ({ ...prev, firstName: e.target.value }))} className='border-r-2 border-r-black w-[22.5%] h-full text-center flex justify-center items-center' />
			<input placeholder='Last Name' value={inputs.lastName} onChange={e => setInputs(prev => ({ ...prev, lastName: e.target.value }))} className='border-r-2 border-r-black w-[22.5%] h-full text-center flex justify-center items-center' />
			<input placeholder='Last Name' value={inputs.speed} onChange={(e: any) => setInputs(prev => ({ ...prev, speed: e.target.value }))} className='border-r-2 border-r-black w-[22.5%] h-full text-center flex justify-center items-center' />
			<span className='border-r-2 border-r-black w-[22.5%] h-full text-center flex justify-center items-center'>{token}</span>
			<div className='w-[10%] h-full text-center flex justify-evenly items-center'>
				<button onClick={actions.copy}>C</button>
				<button onClick={actions.update}>S</button>
				<button onClick={actions.delete}>D</button>
			</div>
		</div>
	</>
}