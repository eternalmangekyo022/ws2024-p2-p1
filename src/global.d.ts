declare global {
	type User = {
		id: number
		firstName: string
		lastName: string
		token: number
		isAdmin: boolean
		speed: string
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