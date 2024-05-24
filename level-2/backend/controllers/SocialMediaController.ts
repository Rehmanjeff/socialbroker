import { Request, Response } from 'express'
import { getAvailability } from '../services/SocialMediaService'
import { validationResult } from 'express-validator'

export const checkAvailability = async (req: Request, res: Response): Promise<void> => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
    }

    const { id, url, username, retry } = req.body

    try {
        const isAvailable = await getAvailability(id, url, username, retry)
        res.json({ isAvailable })
    } catch (error) {
        console.error('Error in checkAvailability:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
