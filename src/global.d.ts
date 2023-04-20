declare global {
	type Speed = `${number}${number}:${number}${number}`
	type User = {
		id: number
		firstName: string
		lastName: string
		token: number
		isAdmin: boolean
		speed: Speed
		teamId: number
	}

	type Team = {
		id: number
		name: string
		contactEmail: string
		location: string
		plannedStartingTime: string
		startingTime: string
	}
}

export {};