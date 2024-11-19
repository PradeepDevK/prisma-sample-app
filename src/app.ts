import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";


const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());

app.post("/users", async(req: Request, res: Response) => {
    const { name, email } = req.body;

    try {
        const user = await prisma.user.create({
            data: { name, email },
        });
        res.json(user);
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/posts", async(req: Request, res: Response) => {
    const { title, userId } = req.body;
    
    try {
        const post = await prisma.post.create({
            data: { title, userId }
        });
        res.json(post);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/tags", async (req: Request, res: Response) => {
    try {
        const { name } =  req.body;

        const tag = await prisma.tag.create({
            data: { name }
        });
        res.json(tag);
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/posts/:postId/tags", async(req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { tagId } = req.body;

        const post = await prisma.post.update({
            where: { id: parseInt(postId, 10) },
            data: {
                tags: {
                    connect: { id: tagId }
                }
            }
        });
        res.json(post);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/users", async(req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            include: { posts: true }
        });
        res.json(users);
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/posts", async(req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            include: { tags: true }
        });
        res.json(posts);
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 9000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});