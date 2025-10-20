import { aj } from "../config/arcjet.js";

export const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested : 1,
        })

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({
                    error : "Too many Requests",
                    message : "Rate Limit Exceeded"
                });
            }
            else if(decision.reason.isBot()){
                return res.status(403).json({
                    error : "Bot access denied",
                    message : "Automated requests are prohibited"
                })
            }
            else{
                return res.status(403).json({
                    error : "Forbidden",
                    message : "Access denied by security policy"
                })
            }
        }
        if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())){
            return res.status(403).json({
                error : "Spoof bot detected",
                message : "Malicious activity detected"
            })
        }
        next();
    } catch (error) {
        console.error("Arcjet middleware error:", error);
        next();
    }
}