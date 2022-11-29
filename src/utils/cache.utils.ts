import NodeCache from "node-cache";

const caches = new NodeCache({
    deleteOnExpire: true,
    checkperiod: 6000,
});

const duration:number = 300;

export const cache = (err: any, req: any, res: any, next: any) => {

    if (req.method != "Get") {
        console.log("Cannot cache get methods");
        return next();
    }

    const key = req.originalUrl;
    const cachedResponse = caches.get(key);

    if (cachedResponse) {
        console.log(`Cached ${key}`);
        return res.send(cachedResponse)
    } else {
        console.log(`Cahe missed ${key}`);
        res.originalSend = res.send;
        res.send = (body: any) => {
            res.originalSend(body);
            caches.set(key, body, duration);
        };
        next();
    }
}