import {CookieOptions} from 'express';

export const getCookieOptions = (maxAgeInMs:number): CookieOptions=>{
    const isProduction = process.env.NODE_ENV === "production";


    return{
        httpOnly:true,
        secure:isProduction,
        sameSite:isProduction? "none" :"lax",
        maxAge:maxAgeInMs
    };
};
