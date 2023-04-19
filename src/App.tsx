import React, { useState, useEffect } from 'react'

const saveToLs: boolean = true

function App(): JSX.Element {
  const [user, setUser] = useState<User>();
  const [team, setTeam] = useState<Team>();
  const [token, setToken] = useState<string>('')
  const [teamInput, setTeamInput] = useState<{ name: string, location: string, contactEmail: string }>({name: '', location: '', contactEmail: ''});

  const login = async(token: string): Promise<void> => {
    let data: Awaited<Promise<{ status: string, user: User, team: Team }>> = await (await fetch('http://localhost/login', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ token })
    })).json()
    setUser(data.user)
    if(saveToLs) localStorage.setItem('token', data.user.token.toString())
    data.team = await (await fetch('http://localhost/teams/' + data.user.teamId, { headers: new Headers({ Authorization: data.user.token.toString() }) })).json()
    console.log(data)
    
  }

  useEffect(() => {
    const fetchData = async(): Promise<void> => {
      const token = localStorage.getItem('token')
      if(!token) return
      await login(token)
    }

    fetchData()
  }, [])

  return <>
    <div className='w-screen h-screen relative'>
      {!user ? <>
        <div className='w-[25rem] h-[14rem] border-2 rounded-md absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col'>
          <div className='w-full h-1/2 flex flex-col justify-center items-center gap-2'>
            <h2 className='text-3xl font-semibold'>Login</h2>
            <span>Login using your token</span>
          </div>
          <div className='w-full h-1/2 flex flex-col justify-center items-center gap-2'>
            <input className='w-[80%] h-8 border-2 border-black' placeholder='Token' type="text" onChange={e => setToken(e.target.value)}/>
            <button onClick={() => login(token)} type='button' className='w-16 h-8 bg-gray-600 border-2 border-black'>Login</button>
          </div>
        </div>
      </> : <>
        <div className='w-5/6 h-5/6 border-2 border-black rounded-md absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center'>
          <div className='w-[95%] h-1/2 border-b-2 border-b-black'>
            <div className='w-1/3 h-full flex flex-col'>
              {/** input for teamName contactEmail location */}
              <h1>Manage your team</h1>
              <input type="text" />
              <input type="text" />
              <input type="text" />
            </div>
          </div>
          <div className='w-[95%] h-1/2'>

          </div>
        </div>
      </>}

    </div>
  </>
}

export default App