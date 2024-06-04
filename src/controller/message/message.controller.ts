import { Request, Response } from "express";
import prisma from "../../service/prisma";



const userMessage = async(req: Request, res: Response) => {
    try {
        const findUserMessages = await prisma.message.findMany()


        return res.status(200).json({ result: findUserMessages })
    } catch (error: any) {
        return res.status(500).json({ message: error.message })
    }
}


export { userMessage };